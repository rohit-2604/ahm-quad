// import React, { useEffect, useState } from "react";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import { ImInfo, ImBin } from "react-icons/im";
// import sensorImage from "../../../assets/sensor.png";
// import { useDelete, usePost } from "../../../hooks/usehttp";
// import useSocket from "../../../hooks/useSocket";
// import { useNavigate, useParams } from "react-router-dom";
// import SensorAddPopup from "./popups/SensorAddPopup";
// import AssetDeletePopup from "./popups/AssetDeletePopup";
// import Lottie from "react-lottie";
// import sensorloader from "../../../Lottie/sensorloader.json";
// import Sensor from "./SensorNDE";
// import SensorNDE from "./SensorNDE";
// import SensorDE from "./SensorDE";
// import ParameterAddPopup from "./popups/ParameterAddPopup";
// import InfoPopup from "./popups/InfoPopup";

// import MachineStatusIndicator from "./MachineStatusIndicator";
// import SensorDEv2 from "./SensorDEv2";
// import SensorNDEv2 from "./SensorNDEv2";

// function AssetCardV2({ asset, onDelete, isFromAssetPage }) {
//   const { company_id, workshop_id } = useParams();
//   const accesToken = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const assetId = asset.asset_id;
//   const { deleteRequest } = useDelete();
//   const { postRequest, isLoading } = usePost();
//   const socket = useSocket();

//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [InfoPopupp, setInfoPopupp] = useState(false);
//   const [isParamPopupOpen, setIsparamPopupOpen] = useState(false);
//   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
//   const [sensors, setSensors] = useState([]);
//   const [DEarr, setDEarr] = useState([]);
//   const [NDEarr, setNDEarr] = useState([]);
//   useEffect(() => {
//     // console.log(sensors);
//     let dearray = sensors.filter((sensor) => sensor.sensor_type === "DE");
//     setDEarr(dearray);
//     // console.log(DEarr, "Dearr");
//     let ndearray = sensors.filter((sensor) => sensor.sensor_type === "NDE");
//     setNDEarr(ndearray);
//     // console.log(NDEarr);
//   }, [sensors]);

//   useEffect(() => {
//     if (socket) {
//       if (sensors.length > 0) {
//         sensors.map((sensor) => {
//           let socketData = { sId: sensor.sensor_id };
//           socket.emit("topicId", socketData, (response) => {});
//           // console.log(`socket emitetd with id ${socketData.sId}`);
//         });
//       }
//     }
//   }, [sensors, socket]);

//   const handleSensorPopup = () => {
//     setIsPopupOpen(true);
//   };
//   const handleOpenInfoPopupp = () => {
//     setInfoPopupp(true);
//   };
//   const handleCloseInfoPopupp = () => {
//     setInfoPopupp(false);
//   };
//   const handleParamsOpen = () => {
//     setIsparamPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const handleCloseParamsOpen = () => {
//     setIsparamPopupOpen(false);
//   };

//   const handleDelete = async () => {
//     setIsDeletePopupOpen(true);
//   };
//   const confirmDelete = async () => {
//     try {
//       const json = await deleteRequest(
//         `/superadmin/deleteasset/${assetId}`,
//         accesToken
//       );

//       if (json.success) {
//         const socketData = { data: json.data, token: accesToken };
//         socket.emit("assetDeleted", socketData);

//         onDelete(assetId);
//         setIsDeletePopupOpen(false);
//       }
//     } catch (error) {
//       console.error("Failed to delete asset:", error);
//       setIsDeletePopupOpen(false);
//     }
//   };
//   const loadingSensor = {
//     loop: true,
//     autoplay: true,
//     animationData: sensorloader,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };
//   const cancelDelete = () => {
//     setIsDeletePopupOpen(false);
//   };

//   useEffect(() => {
//     const fetchSensors = async () => {
//       try {
//         const response = await postRequest(
//           `/superadmin/fetchsensor/${assetId}`,
//           {},
//           accesToken
//         );
//         setSensors(response.data);
//         // // console.log(response.data)
//       } catch (error) {
//         console.error("Failed to fetch sensors:", error);
//       }
//     };

//     fetchSensors();
//   }, [assetId]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("SensoraddedbySuperAdmin", (data) => {
//         setSensors((prevSensors) => {
//           // console.log(data.asset_id_fk, assetId);

//           if (data.asset_id_fk === assetId) {
//             if (Array.isArray(prevSensors)) {
//               return [...prevSensors, data];
//             }
//             return [data];
//           }

//           return prevSensors;
//         });
//       });
//     }
//   }, [socket, assetId]);

//   const handleSensorClick = (sensorId) => {
//     navigate(
//       `/superadmin/client/${company_id}/workshop/${workshop_id}/assets/${assetId}/sensors/${sensorId}`
//     );
//   };

//   return (
//     <div>
//       <div className="ml-4 ">
//         <div className="mr-10 ml-1 mb-10 mt-8 w-[28%] min-w-[500px] max-w-[500px] bg-[#fff] rounded-[9px] clientCard ">
//           <div className="flex justify-between w-full items-center">
//             <MachineStatusIndicator sensors={sensors} />
//             <div
//               className="bg-[#3481FF] w-[72px] h-[25px] m-3 rounded-[6px] flex items-center justify-center text-white cursor-pointer"
//               onClick={handleOpenInfoPopupp}
//             >
//               {/* <div className="text-[10px]">BOF_15438</div> */}
//               <div className="mr-1">
//                 <ImInfo size={10} />
//               </div>
//               <span className="text-center text-[10px]">info</span>
//             </div>
//           </div>

//           <div className="flex justify-center items-center m-3 relative">
//             {Array.isArray(sensors) &&
//             sensors.some((sensor) => sensor.sensor_type === "DE")
//               ? sensors
//                   .filter((sensor) => sensor.sensor_type === "DE")
//                   .slice(0, 2)
//                   .map((sensor) => (
//                     <div
//                       key={sensor.sensor_id}
//                       className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 ml-10 cursor-pointer absolute left-[5%] top-[72%]"
//                       onClick={() => handleSensorClick(sensor.sensor_id)}
//                     >
//                       <div className="absolute -right-[96%] -bottom-[10%] z-10">
//                         <img
//                           src={sensorImage}
//                           alt="Sensor"
//                           className="h-[20px]"
//                         />
//                       </div>
//                       <div className="flex items-end justify-end">
//                         <SensorDEv2
//                           sensorId={sensor.sensor_id}
//                           assetId={assetId}
//                         />
//                       </div>
//                     </div>
//                   ))
//               : null}

//             <div className="items-center flex flex-col justify-center relative cardconimg top-5">
//               {isLoading ? (
//                 <div className="relative">
//                   <div className="absolute -bottom-9 -left-[50%]">
//                     <Lottie options={loadingSensor} height={20} width={20} />
//                   </div>
//                 </div>
//               ) : sensors.length >= 4 ? null : (
//                 <div
//                   className="absolute bg-[#6FFF89] border-[1px] border-[#181818] rounded-[4px] font-semibold justify-center text-[10px] flex items-center w-[83px] h-[24px] cursor-pointer hover:bg-[#23f84a] transition-colors duration-200 ease-in-out delay-75 top-[-30px] left-[25%]"
//                   onClick={handleSensorPopup}
//                 >
//                   <div className="text-center font-extrabold text-[#181818]">
//                     Add Sensor
//                   </div>
//                 </div>
//               )}
//               <img
//                 src={asset.asset_image}
//                 alt="Motor"
//                 className="w-[156px] h-[156px] mb-5"
//               />
//               <div
//                 className="absolute bg-transparent border-[1px] border-[#184dfdbe] rounded-[4px] font-semibold justify-center text-[10px] flex items-center w-[70%] h-[24px] bottom-0 cursor-pointer left-[15%] hover:bg-[#184dfdbe] transition-colors  ease-in-out hover:text-white text-[#181818]"
//                 onClick={handleParamsOpen}
//               >
//                 <div className="text-center font-extrabold">Add Parameters</div>
//               </div>
//             </div>

//             {Array.isArray(sensors) &&
//             sensors.some((sensor) => sensor.sensor_type === "NDE")
//               ? sensors
//                   .filter((sensor) => sensor.sensor_type === "NDE")
//                   .slice(0, 2)
//                   .map((sensor) => (
//                     <div
//                       key={sensor.sensor_id}
//                       className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-3 mr-10 cursor-pointer absolute top-[125px] left-[72%] "
//                       onClick={() => handleSensorClick(sensor.sensor_id)}
//                     >
//                       <div className="">
//                         <div className="absolute flex -left-[82%] -bottom-[17%] opacity-1">
//                           <img
//                             src={sensorImage}
//                             alt="Sensor"
//                             className="h-[20px]"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex items-end justify-end ">
//                         <SensorNDEv2 sensorId={sensor.sensor_id} />
//                       </div>
//                     </div>
//                   ))
//               : null}
//           </div>

//           <div className="flex mt-11 flex-col items-center justify-center ml-5 mr-5">
//             <div className="mb-5 items-center justify-center flex bg-black rounded-[7px] w-[322px] h-[39px]">
//               <div className="relative flex items-center font-semibold text-[10px] pl-4">
//                 <div className="relative top-0 left-0 bg-[#24FF00] h-2 w-2 rounded-full blur-[7px]"></div>
//                 <div className="absolute bg-[#24FF00] h-2 w-2 rounded-full"></div>
//                 <div className="pl-2 text-white text-[15px]">Healthy</div>
//               </div>
//               <div className="relative flex items-center font-semibold text-[10px] pl-4">
//                 <div className="relative top-0 left-0 bg-[#FFB800] h-2 w-2 rounded-full blur-[7px]"></div>
//                 <div className="absolute bg-[#FFB800] h-2 w-2 rounded-full"></div>
//                 <div className="pl-2 text-white text-[15px]">Unhealthy</div>
//               </div>
//               <div className="relative flex items-center font-semibold text-[10px] pl-4">
//                 <div className="relative top-0 left-0 bg-[#FF0000] h-2 w-2 rounded-full blur-[7px]"></div>
//                 <div className="absolute bg-[#FF0000] h-2 w-2 rounded-full"></div>
//                 <div className="pl-2 text-white text-[15px]">Inactive</div>
//               </div>
//             </div>
//             <div
//               className="mb-4 items-center flex justify-center bg-[#FF4545] rounded-[7px] w-[100%] h-[39px] cursor-pointer hover:bg-transparent text-white hover:text-red-400 transition-colors duration-300"
//               onClick={handleDelete}
//             >
//               <ImBin size={20} />
//             </div>
//           </div>
//         </div>
//       </div>
//       {isPopupOpen && (
//         <SensorAddPopup
//           onClose={handleClosePopup}
//           assetId={assetId}
//           isFromAssetPage={isFromAssetPage}
//         />
//       )}
//       {isParamPopupOpen && (
//         <ParameterAddPopup onClose={handleCloseParamsOpen} assetId={assetId} />
//       )}
//       {isDeletePopupOpen && (
//         <AssetDeletePopup onConfirm={confirmDelete} onCancel={cancelDelete} />
//       )}
//       {InfoPopupp && (
//         <InfoPopup
//           onClose={handleCloseInfoPopupp}
//           assetId={assetId}
//           sensors={sensors}
//         />
//       )}
//     </div>
//   );
// }

// export default AssetCardV2;

import React, { useEffect, useState } from "react";
import { ImInfo, ImBin } from "react-icons/im";
import sensorImage from "../../../assets/sensor.png";
import { useDelete, usePost } from "../../../hooks/usehttp";
import useSocket from "../../../hooks/useSocket";
import { useNavigate, useParams } from "react-router-dom";
// import SensorAddPopup from "./popups/SensorAddPopup";
// import AssetDeletePopup from "./popups/AssetDeletePopup";
import Lottie from "react-lottie";
import sensorloader from "../../../Lottie/sensorloader.json";
import SensorDEv2 from "./SensorDEv2";
import SensorDEv3 from "./SensorDEv3";
import SensorNDEv2 from "./SensorNDEv2";
import SensorNDEv3 from "./SensorNDEv3";
// import ParameterAddPopup from "./popups/ParameterAddPopup";
// import InfoPopup from "./popups/InfoPopup";
import MachineStatusIndicator from "./MachineStatusIndicator";
import OverallHealth from "./OverallHealth/OverallHealth";
// import AssetEditPopup from "./AssetEditPopup";
import { MdEditSquare } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";

function AssetCardV2({ asset, onDelete, isFromAssetPage }) {
  console.log(asset,"sdfbjhsvfhvsdfgv")
  const { company_id, workshop_id } = useParams();
  const accesToken = localStorage.getItem("token");
  const navigate = useNavigate();
  // console.log(asset)
  const assetId = asset.asset_id;
  const { deleteRequest } = useDelete();
  const { postRequest, isLoading } = usePost();
  const socket = useSocket();
  const [AssetCardBgColor, setAssetCardBgColor] = useState("bg-white");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [InfoPopupp, setInfoPopupp] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isParamPopupOpen, setIsparamPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [DEarr, setDEarr] = useState([]);
  const [NDEarr, setNDEarr] = useState([]);
  const [newSensor, setnewSensor] = useState();
  const deviceId = localStorage.getItem("deviceId");
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const dearray = sensors.filter((sensor) => sensor.sensor_type === "DE");
    setDEarr(dearray);
    const ndearray = sensors.filter((sensor) => sensor.sensor_type === "NDE");
    setNDEarr(ndearray);
  }, [sensors]);

  useEffect(() => {
    if (socket && sensors.length > 0) {
      sensors.forEach((sensor) => {
        const socketData = { sId: sensor.sensor_id };
        socket.emit("topicId", socketData, () => {});
      });
    }
  }, [sensors, socket]);

  const handleSensorPopup = () => {
    setIsPopupOpen(true);
  };

  const handleOpenInfoPopupp = () => {
    setInfoPopupp(true);
  };

  const handleParamsOpen = () => {
    setIsparamPopupOpen(true);
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true);
  };
  const handleEdit = async () => {
    setIsEditPopupOpen(true);
  };
  const confirmDelete = async () => {
    try {
      const json = await deleteRequest(
        `/company/deleteasset/${assetId}`,
        accesToken
      );
      if (json.success) {
        const socketData = { data: json.data, token: accesToken };
        socket.emit("assetDeletedByClient", socketData);
        onDelete(assetId);
        setIsDeletePopupOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete asset:", error);
      setIsDeletePopupOpen(false);
    }
  };

  const loadingSensor = {
    loop: true,
    autoplay: true,
    animationData: sensorloader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await postRequest(
          `/company/fetchsensor/${assetId}`,
          {},
          accesToken
        );

        // Check if response.data is an array before setting the state
        if (Array.isArray(response.data)) {
          setSensors(response.data);
        } else {
          console.error("Expected an array but received:", response.data);
          setSensors([]); // Reset to an empty array if the response is not as expected
        }
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      }
    };

    fetchSensors();
  }, [assetId]);
  useEffect(() => {
    if (newSensor) {
      if (socket) {
        const socketData = { data: newSensor, token: accessToken, deviceId };

        socket.emit("Sensoradded", socketData);
      }
      if (sensors.length > 0) {
        setSensors([...sensors, newSensor]);
        setnewSensor(null);
      } else {
        setSensors([newSensor]);
        setnewSensor(null);
      }
    }
  }, [newSensor, socket]);
  useEffect(() => {
    if (socket) {
      socket.on(`Sensoraddedby_${assetId}`, (data) => {
        setSensors((prevSensors) => {
          // console.log(data.asset_id_fk, assetId);

          if (data.asset_id_fk === assetId) {
            if (Array.isArray(prevSensors)) {
              return [...prevSensors, data];
            }
            return [data];
          }

          return prevSensors;
        });
      });
      socket.on(`Sensordeletedby_${assetId}`, (data) => {
        setSensors((prevSensors) => {
          const index = prevSensors.findIndex(
            (sensor) => sensor.sensor_id === data.sensor_id
          );
          if (index > -1) {
            return [
              ...prevSensors.slice(0, index),
              ...prevSensors.slice(index + 1),
            ];
          }
          return prevSensors;
        });
      });
    }
  }, [socket, assetId]);

  const handleSensorClick = (sensorId) => {
    navigate(
      `/client/workshop/${workshop_id}/assets/${assetId}/sensors/${sensorId}`
    );
  };

  return (
    <div>
      <div className="ml-4">
        <div
          className={` ${AssetCardBgColor} lg:mr-10 lg:ml-1 md:mr-10 md:ml-1 mb-10 mt-8 w-full lg:w-[28%] md:w-[28%] min-w-[300px] lg:min-w-[500px] md:min-w-[500px] max-w-[500px]  rounded-[9px] clientCard`}
        >
          <div className="flex justify-between w-full items-center">
            <MachineStatusIndicator
              sensors={sensors}
              setAssetCardBgColor={setAssetCardBgColor}
            />
            <OverallHealth sensors={sensors} assetId={assetId} />
            <div className="flex flex-col justify-center items-end ">
              {" "}
              <div
                className="bg-[#3481FF] w-[72px] h-[25px] mt-3 mr-3 rounded-[6px] flex items-center justify-center text-white cursor-pointer"
                onClick={handleOpenInfoPopupp}
              >
                {/* <div className="text-[10px]">BOF_15438</div> */}
                <div className="mr-1">
                  <ImInfo size={10} />
                </div>
                <span className="text-center text-[10px]">info</span>
              </div>
              {/* <div
              className="bg-[#0d2c09] w-[72px] h-[25px] mr-3 mt-2 rounded-[6px] flex items-center justify-center text-white cursor-pointer"
              onClick={handleOpenInfoPopupp}
            >
          
              <div className="mr-1">
                <FaArrowTrendUp size={10} />
              </div>
              <span className="text-center text-[10px]">Trend</span>
            </div> */}
            </div>
          </div>

          <div className="flex justify-center items-center m-3 relative">
            {DEarr[0] && (
              <div
                className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 ml-10 cursor-pointer absolute -left-[8%] top-[72%]"
                onClick={() => handleSensorClick(DEarr[0].sensor_id)}
              >
                <div className="absolute -right-[132%] md:-right-[180%] md:-bottom-[35%] bottom-[10%] lg:-right-[180%] lg:-bottom-[30%] z-10">
                  <img
                    src={sensorImage}
                    alt="Sensor"
                    className="h-[20px] md:h-[30px] lg:h-[30px]"
                  />
                </div>
                <div className="flex items-end justify-end ">
                  <SensorDEv2 sensorId={DEarr[0].sensor_id} assetId={assetId} />
                </div>
              </div>
            )}

            {DEarr[1] && (
              <div
                className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 ml-10 cursor-pointer absolute -left-[5%] top-[35%]"
                onClick={() => handleSensorClick(DEarr[1].sensor_id)}
              >
                <div className="absolute md:-right-[185%] md:-top-[0%] -right-[108%] lg:-right-[183%] -top-[0%] lg:-bottom-[10%] z-10">
                  <img
                    src={sensorImage}
                    alt="Sensor"
                    className="h-[20px] md:h-[30px] lg:h-[30px]"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <SensorDEv3 sensorId={DEarr[1].sensor_id} assetId={assetId} />
                </div>
              </div>
            )}

            <div className="items-center flex flex-col justify-center relative cardconimg top-5">
              {isLoading ? (
                <div className="relative">
                  <div className="absolute -bottom-9 -left-[50%]">
                    <Lottie options={loadingSensor} height={20} width={20} />
                  </div>
                </div>
              ) : sensors.length >= 4 ? null : (
                <div
                  className="absolute bg-[#6FFF89] border-[1px] border-[#181818] rounded-[4px] font-semibold justify-center text-[10px] flex items-center w-[83px] h-[24px] cursor-pointer hover:bg-[#23f84a] transition-colors duration-200 ease-in-out delay-75 top-[-30px] lg:left-[23%] md:left-[23%] left-[8%]"
                  onClick={handleSensorPopup}
                >
                  <div className="text-center font-extrabold text-[#181818]">
                    Add Sensor
                  </div>
                </div>
              )}
              <img
                src={asset.asset_image}
                alt="Motor"
                className="lg:w-[156px] md:h-[156px] md:w-[156px]  w-[100px] h-[100px] lg:h-[156px] mb-5"
              />
              <div
                className="absolute w-full bg-transparent border-[1px] border-[#184dfdbe] rounded-[4px] font-semibold justify-center text-[10px] flex items-center lg:w-[70%] h-[24px] -bottom-2 cursor-pointer lg:left-[15%] md:left-[15%] -left-[0%] hover:bg-[#184dfdbe] transition-colors  ease-in-out hover:text-white text-[#181818]"
                onClick={handleParamsOpen}
              >
                <div className="text-center justify-center font-extrabold flex w-full ">
                  Add Parameters
                </div>
              </div>
            </div>

            {NDEarr[0] && (
              <div
                className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 ml-10 cursor-pointer absolute right-[7%] top-[72%] "
                onClick={() => handleSensorClick(NDEarr[0].sensor_id)}
              >
                <div className="absolute -left-[118%] md:-left-[118%] md:-bottom-[30%]  lg:-left-[120%] lg:-bottom-[30%] z-10">
                  <img
                    src={sensorImage}
                    alt="Sensor"
                    className="h-[20px] md:h-[30px] lg:h-[30px]"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <SensorNDEv2
                    sensorId={NDEarr[0].sensor_id}
                    assetId={assetId}
                  />
                </div>
              </div>
            )}

            {NDEarr[1] && (
              <div
                className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 ml-10 cursor-pointer absolute right-[10%] top-[34%]"
                onClick={() => handleSensorClick(NDEarr[1].sensor_id)}
              >
                <div className="absolute -left-[90%] md:-left-[120%] md:-bottom-[30%] lg:-left-[120%] lg:-bottom-[30%] z-10">
                  <img
                    src={sensorImage}
                    alt="Sensor"
                    className="h-[20px] md:h-[30px] lg:h-[30px]"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <SensorNDEv3
                    sensorId={NDEarr[1].sensor_id}
                    assetId={assetId}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex mt-11 flex-col items-center justify-center ml-5 mr-5">
            <div className="mb-5 flex justify-center items-center bg-black rounded-[7px] w-full pr-2 h-[39px]">
            <div className="flex items-center font-semibold text-[10px] pl-4">
              <div className="bg-[#24FF00] h-2 w-2 rounded-full blur-[7px]"></div>
              <div className="absolute bg-[#24FF00] h-2 w-2 rounded-full"></div>
              <div className="pl-2 text-white lg:text-[15px] md:text-[15px] text-[12px] text-center ">
                Healthy
              </div>
            </div>
            <div className="flex items-center font-semibold text-[10px] pl-4">
              <div className="bg-[#FFB800] h-2 w-2 rounded-full blur-[7px]"></div>
              <div className="absolute bg-[#FFB800] h-2 w-2 rounded-full"></div>
              <div className="pl-2 text-white lg:text-[15px] md:text-[15px] text-[12px] text-center ">
                Unhealthy
              </div>
            </div>
            <div className="flex items-center font-semibold text-[10px] pl-4">
              <div className="bg-[#868686] h-2 w-2 rounded-full blur-[7px]"></div>
              <div className="absolute bg-[#868686] h-2 w-2 rounded-full"></div>
              <div className="pl-2 text-white lg:text-[15px] md:text-[15px] text-[12px] text-center ">
                Inactive
              </div>
            </div>
            <div className="flex items-center font-semibold text-[10px] pl-4">
              <div className="bg-[#4F9BFF] h-2 w-2 rounded-full blur-[7px] glowbtn"></div>
              <div className="absolute bg-[#4F9BFF] h-2 w-2 rounded-full glowbtn"></div>
              <div className="pl-2 text-white lg:text-[15px] md:text-[15px] text-[12px] text-center ">
                Connecting
              </div>
            </div>
            <div className="flex items-center font-semibold text-[10px] pl-4">
              <div className="bg-[#009DFF] h-2 w-2 rounded-full blur-[7px]"></div>
              <div className="absolute bg-[#009DFF] h-2 w-2 rounded-full"></div>
              <div className="pl-2 text-white lg:text-[15px] md:text-[15px] text-[12px] text-center ">
                Online
              </div>
            </div>
          </div>
            <div className="text-xs  mb-4 bg-blue-600 text-center text-white px-4 w-full py-2 rounded-lg">
              {asset?.site}
              <br />
              {asset?.application}
            </div>
            {/* <div
              className="mb-4 items-center flex justify-center bg-[#FF4545] rounded-[7px] w-[100%] h-[39px] cursor-pointer hover:bg-transparent text-white hover:text-red-400 transition-colors duration-300"
              onClick={handleDelete}
            >
              <ImBin size={20} />
            </div> */}
            <div
                        className="mb-4 flex items-center justify-center border-[2px] border-[#4570ff] bg-[#4570ff] duration-300 rounded-[7px] w-full h-[39px] cursor-pointer hover:bg-transparent text-white hover:text-[#4570ff]"
                        onClick={handleEdit}
                      >
                        <MdEditSquare size={20} className="" />
                      </div>
          </div>
        </div>
      </div>

      {/* {isPopupOpen && (
        <SensorAddPopup
          assetId={assetId}
          onClose={() => setIsPopupOpen(false)}
          setnewSensor={setnewSensor}
        />
      )}
      {InfoPopupp && (
        <InfoPopup
          assetId={assetId}
          sensors={sensors}
          onClose={() => setInfoPopupp(false)}
        />
      )}
      {isEditPopupOpen && (
        <AssetEditPopup
          assetId={assetId}
          asset={asset}
          onClose={() => setIsEditPopupOpen(false)}
        />
      )}
      {isParamPopupOpen && (
        <ParameterAddPopup
          asset={asset}
          assetId={assetId}
          onClose={() => setIsparamPopupOpen(false)}
        />
      )}
      {isDeletePopupOpen && (
        <AssetDeletePopup
          onConfirm={confirmDelete}
          onCancel={() => setIsDeletePopupOpen(false)}
        />
      )} */}
    </div>
  );
}

export default AssetCardV2;
