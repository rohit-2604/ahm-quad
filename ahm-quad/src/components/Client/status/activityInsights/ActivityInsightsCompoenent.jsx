import React, { useContext, useEffect, useState } from 'react'
import DeviceIndicators from './DeviceIndicators/DeviceIndicators'
import useSocket from '../../../../hooks/useSocket';
import { useParams } from 'react-router-dom';
import { usePost } from '../../../../hooks/usehttp';
import { TbReload } from "react-icons/tb";
import "./style.css"
import DetailedInsightPopup from './DetailedInsightPopup';
import { useClientContext } from '../../../../context/ClientStateContext';

function ActivityInsightsCompoenent({assets}) {
    const [SensorRuntime, setSensorRuntime] = useState()
    const [TotalDownTime, setTotalDownTime] = useState()
    const [refreshCounter, setrefreshCounter] = useState(0)
    const [isloading, setisloading] = useState(false)
    const [DetailedInsightsData, setDetailedInsightsData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const socket = useSocket();
    const uptimeSeconds =
  (SensorRuntime?.total_runtime_seconds ?? 0) -
  (TotalDownTime?.total_downtime_seconds ?? 0);

  useEffect(() => {
  const uptime = (SensorRuntime?.total_runtime_seconds ?? 0) - (TotalDownTime?.total_downtime_seconds ?? 0);
  // Use uptime value or trigger re-render
}, [SensorRuntime, TotalDownTime]);
    const { totalRuntime, settotalRuntime } = useClientContext();
    // useEffect(() => {
    //   if(assets) {
    //     assets.forEach((asset)=>{
    //         if (asset.sensors.length > 0) {
    //       asset.sensors.forEach((sensor) => {
    //         // // console.log(sensor)
    //         let socketData = { sId: sensor.sensor_id };
    //        if(socketData.sId!="IEMA0016AHM") {
    //       socket.emit("topicId", socketData);
    //        }
    //       });
    //     }
    //     })
    //   }
    // }, [assets])

  const {sensor_id}=useParams()
  const {postRequest}= usePost()
 
  const handleFetchDetailedInsights = async () => {
    try {
      setisLoading(true);
      const response = await postRequest(
        `/company/dailyuptime/${sensor_id}`,
        {},
        localStorage.getItem('token') 
      );
      if (response.data) {
        setisLoading(false);
        console.log(response.data, "detailed insights");
        setDetailedInsightsData(response.data);
      }
    } catch (error) {
      console.error(error);
      setisLoading(false);
    }
  };
  const accesToken=localStorage.getItem('token')
    useEffect(() => {
      const fetchDowntime = async () => {
        try {
          const response = await postRequest(
            `/company/totaldowntimes/${sensor_id}`,
            {},
            accesToken
          );
         
          if (response.data) {
            console.log(response.data,"downtime");
            setTotalDownTime(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
        const fetchRuntime = async()=>{
            setisLoading(true)
         
         
          try {
            const response = await postRequest(
              `/company/totalruntimes/${sensor_id}`,
              {},
              accesToken
            );
            console.log(response,"runtime");
            setSensorRuntime(response.data.total_runtime_seconds)
            setisLoading(false)
           
          } catch (error) {
            console.error(error);
            setisLoading(false)
          }
          
        }
        // fetchDowntime()
        fetchRuntime()
       
      }, [refreshCounter])
function convertSecondsToTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0 Hr 0 Min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours} Hr ${minutes} Min`;
}
    useEffect(() => {
      settotalRuntime(SensorRuntime?.total_runtime_seconds - TotalDownTime?.total_downtime_seconds);
      console.log(SensorRuntime?.total_runtime_seconds - TotalDownTime?.total_downtime_seconds)
    }, [SensorRuntime]);


    return (
        <div className='flex flex-col'>
           <TbReload  className={`absolute left-[90%] top-[10%] cursor-pointer ${isLoading?"rotate":""}`} onClick={()=>{
                setrefreshCounter((prev) => prev + 1);

            }}/>
            <div className="flex md:flex-row lg:flex-row flex-col">
            <div className="flex w-full justify-between flex-col">
            <p className='pl-2 p-2 text-xs text-[#363636] font-[400]'>Total Up-time :</p>
           


<div className='bg-[#a1ffc1] w-auto ml-2 flex items-center justify-center rounded-[7px] font-[500] text-xl p-5'>
  {convertSecondsToTime(SensorRuntime)}
</div>
            </div>
            
           </div>
            
          
        </div>
    )
}

export default ActivityInsightsCompoenent
