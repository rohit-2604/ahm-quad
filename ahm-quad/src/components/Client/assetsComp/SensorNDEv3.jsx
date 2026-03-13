// import React, { useEffect, useState } from "react";
// import { IoIosArrowBack } from "react-icons/io";
// import useSocket from "../../../hooks/useSocket";

// function SensorNDEv3({ sensorId }) {
//   // // console.log(sensorId);
//   const socket = useSocket();
//   const [sensorData, setSensorData] = useState(null);

//   useEffect(() => {
//     if (socket) {
//       socket.on(sensorId, (data) => {
//         // // console.log("Data received from topic NDE:", data);
//         if (data.deviceID) {
//           setSensorData(data);
//         } else {
//           setSensorData(null);
//         }
//       });

//       return () => socket.off(sensorId);
//     }
//   }, [socket]);
//   return (
//     <div className="flex ">
//       <div className="relative mr-3 items-center ">
//         <IoIosArrowBack color="blue" />
//       </div>
//       <div>
//         <div className=" absolute text-[10px] left-6 top-[6.5px] font-semibold ">
//           NDE
//         </div>
//       </div>
//       <div className="relative flex items-center font-semibold text-[10px] pr-4 ml-1">
//         <div className="relative w-[25px]">
//           <div
//             className={`${
//               sensorData
//                 ? sensorData.overall_health
//                   ? sensorData.overall_health === "Healthy"
//                     ? "bg-[#24FF00]"
//                     : "bg-[#FFB800]"
//                   : "bg-[#ff0000]"
//                 : "bg-[#a3a3a3]"
//             } h-2 w-2 -top-[5px] rounded-full absolute blur-[5px] glowbtn left-6`}
//           ></div>
//           <div
//             className={`${
//               sensorData
//                 ? sensorData.overall_health
//                   ? sensorData.overall_health === "Healthy"
//                     ? "bg-[#24FF00]"
//                     : "bg-[#FFB800]"
//                   : "bg-[#ff0000]"
//                 : "bg-[#a3a3a3]"
//             } h-2 w-2 -top-[4.5px] rounded-full absolute left-6`}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SensorNDEv3;



import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import useSocket from "../../../hooks/useSocket";

function SensorNDEv3({ sensorId }) {
  const socket = useSocket();
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on(sensorId, (data) => {
        // // console.log("Data received from topic NDE:", data);
        if (data.deviceID) {
          setSensorData(data);
        } else {
          setSensorData(null);
        }
      });

      return () => socket.off(sensorId);
    }
  }, [socket]);

  const getHealthStatus = () => {
    if (sensorData) {
      if (sensorData.sensorstatus === "Active") {
        return { color: "bg-[#009DFF]", title: "Online" };
      } else if (sensorData.sensorstatus === "Inactive") {
        return { color: "bg-[#FFB800]", title: "Offline" };
      }
      else {
        return { color: "bg-[#868686]", title: "Offline" };
      }
    }
    return { color: "bg-[#4F9BFF]", title: "Connecting..." };
  };
  const { color, title } = getHealthStatus();

  return (
    <div className="flex group">
      <div className="relative mr-3 items-center">
        <IoIosArrowBack color="blue" />
      </div>
      <div>
        <div className="absolute text-[10px] left-6 top-[6.5px] font-semibold">
          NDE
        </div>
      </div>
      <div className="relative flex items-center font-semibold text-[10px] pr-4 ml-1">
        <div className="relative group">
          <span className="absolute w-[200px] flex justify-center items-center -right-32  transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-black text-white text-xs font-medium px-2 py-1 rounded shadow-lg -top-4 pointer-events-none">
            {sensorId} - {title}
          </span>
        </div>
        <div className="relative w-[25px]">
          <div
            className={`${color} h-2 w-2 -top-[5px] rounded-full absolute blur-[5px] glowbtn left-6`}
          ></div>
          <div
            className={`${color} h-2 w-2 -top-[4.5px] rounded-full absolute left-6`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SensorNDEv3;
