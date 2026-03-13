import React, { useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";
import { useClientContext } from "../../../context/ClientStateContext";

const MachineStatusIndicator = ({ sensors, setAssetCardBgColor, assetId }) => {
  const socket = useSocket();
  const [MachineStatus, setMachineStatus] = useState(false);
   const { AssetStatus, setAssetStatus } = useClientContext();
  const [sensorStatusArray, setsensorStatusArray] = useState([]);
  const calculateStatus = (data, sensor_frequency) => {
    const {
      vibration_x = 0,
      vibration_y = 0,
      vibration_z = 0,
      overall_health,
    } = data;

    // Calculate m (magnitude)
    const m = Math.sqrt(
      Math.pow(vibration_x, 2) +
        Math.pow(vibration_y, 2) +
        Math.pow(vibration_z, 2)
    );

 
  
    const n = (m / (2 * Math.PI * sensor_frequency)) * 1000;

    return n < 0.01 ? "Inactive" : overall_health || "Inactive";
  };
  useEffect(() => {
    if (sensors.length > 0 && socket) {
      sensors.forEach((sensor) => {
        // console.log(sensor);
        socket.on(sensor.sensor_id, (data) => {
          // console.log("Data received", data);

          setsensorStatusArray((prev) => {
            const updatedArray = prev.filter(
              (item) => item.id !== data.deviceID
            );

            const newEntry = {
              id: data.deviceID,
              status: calculateStatus(data, sensor.sensor_frequency),
            };

            if (updatedArray.length >= 2) {
              return [...updatedArray.slice(1), newEntry];
            }
            return [...updatedArray, newEntry];
          });
        });
      });

      return () => {
        sensors.forEach((sensor) => {
          socket.off(sensor.sensor_id);
        });
      };
    }
  }, [sensors, socket]);

  useEffect(() => {
    // // console.log(sensorStatusArray)
    if (sensorStatusArray?.length > 0) {
      const statusCount = sensorStatusArray.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        {
          Inactive: 0,
          Healthy: 0,
          Unhealthy: 0,
        }
      );

      // // console.log(statusCount);
      if (statusCount.Unhealthy > statusCount.Healthy) {
        setMachineStatus("Unhealthy");
      } else if (
        statusCount.Unhealthy === statusCount.Healthy &&
        statusCount.Healthy > 0
      ) {
        setMachineStatus("Probably Unhealthy");
      } else if (statusCount.Healthy > statusCount.Unhealthy) {
        setMachineStatus("Healthy");
      } else {
        setMachineStatus("Inactive");
      }
    }
  }, [sensorStatusArray]);

  useEffect(() => {
    if (MachineStatus === "Healthy") {
      setAssetCardBgColor("bg-[#e4ffe0]");
    } else if (
      MachineStatus === "Unhealthy" ||
      MachineStatus === "Probably Unhealthy"
    ) {
      setAssetCardBgColor("bg-[#fff7e4]");
    } else if (MachineStatus === "Inactive") {
      setAssetCardBgColor("bg-[#ffff]");
    } else {
      setAssetCardBgColor("bg-[#ffff]");
    }

  
   setAssetStatus((prevStatus) => {
  const index = prevStatus.findIndex(item => item.assetId === assetId);

  if (index !== -1) {
    // Asset found → update MachineStatus
    const updated = [...prevStatus];
    updated[index] = { ...updated[index], MachineStatus };
    return updated;
  } else {
    // Asset not found or array is empty → add new entry
    return [...prevStatus, { assetId, MachineStatus }];
  }
});


  }, [MachineStatus]);

  useEffect(() => {
    // console.log(AssetStatus)
  }, [AssetStatus])
  

  if (sensors.length > 0) {
    return (
      <div className="relative flex items-center font-semibold text-[10px] pl-4 w-[100px]">
        <div className="relative">
          <div
            className={`${
              MachineStatus
                ? MachineStatus === "Healthy"
                  ? "bg-[#24FF00] glowbtn"
                  : MachineStatus === "Unhealthy" ||
                    MachineStatus === "Probably Unhealthy"
                  ? "bg-[#FFB800] glowbtn"
                  : "bg-[#868686]"
                : "bg-[#4F9BFF]"
            } h-2 w-2 rounded-full absolute blur-[5px] `}
          ></div>

          <div
            className={`${
              MachineStatus
                ? MachineStatus === "Healthy"
                  ? "bg-[#24FF00]"
                  : MachineStatus === "Unhealthy" ||
                    MachineStatus === "Probably Unhealthy"
                  ? "bg-[#FFB800]"
                  : "bg-[#868686]"
                : "bg-[#4F9BFF] glowbtn"
            } h-2 w-2 rounded-full`}
          ></div>
        </div>
        <div className="pl-2">
          {MachineStatus ? MachineStatus : "Connecting..."}
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex items-center font-semibold text-[10px] pl-6">
        No sensors added
      </div>
    );
  }
};
export default MachineStatusIndicator;
