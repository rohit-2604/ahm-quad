import React, { useEffect, useState } from "react"
import useSocket from "../../../../../hooks/useSocket";
const DeviceIndicators = ({assets}) => {
    const [overallAssetHealths, setoverallAssetHealths] = useState([]);
  const socket = useSocket();
  const [AllMachineStatus, setAllMachineStatus] = useState({healthy:0,unhealthy:0,inactive:0})
  const [allassets, setallassets] = useState(assets);
const calculateStatus = (data,sensor_frequency) => {
  const { vibration_x = 0, vibration_y = 0, vibration_z = 0, overall_health } = data;

  // Calculate m (magnitude)
  const m = Math.sqrt(
    Math.pow(vibration_x, 2) +
    Math.pow(vibration_y, 2) +
    Math.pow(vibration_z, 2)
  );

  // Calculate n
  const n = (m / (2 * Math.PI * sensor_frequency)) * 1000;

  // Set status based on n
  // console.log(sensor_frequency)
  // console.log(sensor_frequency)
  return n < 0.01 ? "Inactive" : overall_health || "Inactive";

};
  useEffect(() => {
   if (socket) {
      if (allassets?.length > 0) {
        console.log(allassets)
        allassets.forEach((asset) => {
          if (asset.sensors.length > 0) {
            asset.sensors.forEach((sensor) => {
              console.log(sensor)
              socket.on(sensor.sensor_id, (data) => {
                // // console.log("Data received from topic NDE:", data);

                setoverallAssetHealths((prev) => {
                  const existingAsset = prev.find(
                    (entry) => entry.assetId === asset.asset_id
                  );

                  if (existingAsset) {
            
                    const updatedSensors = existingAsset.sensors.map((sensorexist) =>
                      sensorexist.sensorId === data.deviceID
                        ? {
                            ...sensorexist,
                            status: calculateStatus(data,sensor.sensor_frequency),
                          }
                        : sensorexist
                    );
                    const sensorExists = existingAsset.sensors.some(
                      (s) => s.sensorId === data.deviceID
                    );

                    return prev.map((entry) =>
                      entry.assetId === asset.asset_id
                        ? {
                            ...entry,
                            sensors: sensorExists
                              ? updatedSensors
                              : [
                                  ...updatedSensors,
                                  {
                                    sensorId: data.deviceID,
                                    status: calculateStatus(data,sensor.sensor_frequency),
                                  },
                                ],
                          }
                        : entry
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        assetId: asset.asset_id,
                        sensors: [
                          {
                            sensorId: data.deviceID,
                            status: calculateStatus(data,sensor.sensor_frequency),
                          },
                        ],
                      },
                    ];
                  }
                });
              });
            });
          }
        });
      }
    }
  }, [allassets, socket]);

  useEffect(() => {
    // // console.log(overallAssetHealths);
    if (overallAssetHealths) {
      let healthyAssets = 0;
      let unhealthyAssets = 0;
      let inactiveAssets = 0;
  
      overallAssetHealths.forEach((overallAssetHealth) => {
        if (overallAssetHealth.sensors) {
          const hasUnhealthy = overallAssetHealth.sensors.some(
            (s) => s.status === "Unhealthy"
          );
          const hasHealthy = overallAssetHealth.sensors.some(
            (s) => s.status === "Healthy"
          );
  
          // Prioritize according to the hierarchy: Unhealthy > Healthy > Inactive
          if (hasUnhealthy) {
            unhealthyAssets++;
          } else if (hasHealthy) {
            healthyAssets++;
          } else {
            inactiveAssets++;
          }
        }
      });
  
      setAllMachineStatus({
        healthy: healthyAssets,
        unhealthy: unhealthyAssets,
        inactive: inactiveAssets,
      });
    }
  }, [overallAssetHealths]);
  
  
  useEffect(() => {
  //  // console.log(AllMachineStatus)
  }, [AllMachineStatus])

  return (
    <div className='flex justify-between bg-black rounded-[4px] px-12 py-[0.2rem]'>
    <div className=" px-5 py-1   text-xs flex gap-2 items-center ">
        <div className="relative">
            <div className="bg-[#24FF00] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
            <div className="bg-[#24FF00] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
            <div className="bg-[#24FF00] h-2 w-2 rounded-full"></div>
        </div>
        <p className='text-white flex items-center justify-center'>{AllMachineStatus.healthy}</p>
    </div>
    <div className=" px-5 py-1  text-xs flex gap-2 items-center ">
        <div className="relative">
            <div className="bg-[#FFB800] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
            <div className="bg-[#FFB800] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
            <div className="bg-[#FFB800] h-2 w-2 rounded-full"></div>
        </div>
        <p className='text-white flex items-center justify-center'>{AllMachineStatus.unhealthy}</p>
    </div>
        <div className=" px-5 py-1  text-xs flex gap-2 items-center ">
            <div className="relative">
                <div className="bg-[#FF0000] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
                <div className="bg-[#FF0000] h-2 w-2 rounded-full absolute blur-[5px] glowbtn"></div>
                <div className="bg-[#FF0000]  h-2 w-2 rounded-full"></div>
            </div>
            <p className='text-white flex items-center justify-center'>{AllMachineStatus.inactive}</p>
        </div>
</div>
  )
}
export default DeviceIndicators