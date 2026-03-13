// import React, { useEffect, useState } from "react";
// import { IoIosArrowForward } from "react-icons/io";
// import useSocket from "../../../hooks/useSocket";

// function SensorDEv3({ sensorId }) {
//   const socket = useSocket();
//   const [sensorData, setSensorData] = useState(null);

//   useEffect(() => {
//     if (socket) {
//       socket.on(sensorId, (data) => {
//         // // console.log("Data received from topic: DE", data);
//         if (data.deviceID) {
//           setSensorData(data);
//         } else {
//           setSensorData(null);
//         }
//       });

//       return () => socket.off(sensorId);
//     }
//   }, [socket]);

//   // // console.log(sensorId);
//   return (
//     <div className="flex">
//       <div className="relative flex items-center font-semibold text-[10px] pl-4 z-20 w-[40px]">
//         <div className="relative  flex  justify-center items-center">
//           <div
//             className={`${
//               sensorData
//                 ? sensorData.overall_health
//                   ? sensorData.overall_health === "Healthy"
//                     ? "bg-[#24FF00]"
//                     : "bg-[#FFB800]"
//                   : "bg-[#ff0000]"
//                 : "bg-[#a3a3a3]"
//             } h-2 w-2 rounded-full  -left-1 -bottom-[4px]  absolute blur-[5px] glowbtn`}
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
//             } h-2 w-2 -left-1 -bottom-[4px] absolute rounded-full`}
//           ></div>
//         </div>
//       </div>
//       <div className="text-[10px] font-semibold z-30 absolute right-6 top-[6.5px] ">
//         DE
//       </div>
//       {/* <div className="">
//         <IoIosArrowForward color="blue" />
//       </div> */}
//       <div className="relative ml-3 items-center ">
//         <IoIosArrowForward color="blue" />
//       </div>
//     </div>
//   );
// }

// export default SensorDEv3;










import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import useSocket from "../../../hooks/useSocket";

function SensorDEv3({ sensorId }) {
  const socket = useSocket();
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on(sensorId, (data) => {
        // // console.log("Data received from topic: DE", data);
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
      <div className="relative flex items-center font-semibold text-[10px] pl-4 z-20 w-[40px]">
        <div className="relative flex justify-center items-center">
          <div
            className={`${color} h-2 w-2 rounded-full -left-1 -bottom-[4px] absolute blur-sm`}
          ></div>
          <div
            className={`${color} h-2 w-2 -left-1 -bottom-[4px] absolute rounded-full`}
          ></div>
          <span className="absolute w-[200px] flex justify-center items-center -right-32  transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 bg-black text-white text-xs font-medium px-2 py-1 rounded shadow-lg -top-4 pointer-events-none">
            {sensorId} - {title}
          </span>
        </div>
      </div>
      <div className="text-[10px] font-semibold z-30 absolute right-6 top-[6.5px]">
        DE
      </div>
      <div className="relative ml-3 items-center">
        <IoIosArrowForward color="blue" />
      </div>
    </div>
  );
}

export default SensorDEv3;
