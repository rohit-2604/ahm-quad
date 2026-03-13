import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { ImInfo, ImBin } from "react-icons/im";
import sensorImage from "../../../assets/sensor.png";
import { useDelete, usePost } from "../../../hooks/usehttp";
import useSocket from "../../../hooks/useSocket";
import { useNavigate, useParams } from "react-router-dom";
// import SensorAddPopup from "./popups/SensorAddPopup";
// import AssetDeletePopup from "./popups/AssetDeletePopup";
import Lottie from "react-lottie";
import sensorloader from "../../../Lottie/sensorloader.json";
import Sensor from "./SensorNDE";
import SensorNDE from "./SensorNDE";
import SensorDE from "./SensorDE";
// import ParameterAddPopup from "./popups/ParameterAddPopup";
// import InfoPopup from "./popups/InfoPopup";
import { MdEditSquare } from "react-icons/md";
import MachineStatusIndicator from "./MachineStatusIndicator";
import OverallHealth from "./OverallHealth/OverallHealth";
// import AssetEditPopup from "./AssetEditPopup";
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsPinAngle } from "react-icons/bs";
import { useClientContext } from "../../../context/ClientStateContext";
import assetData from "../../../Assets.json";

function AssetCard({ asset, onDelete }) {
  const { company_id, workshop_id } = useParams();
  const accesToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [AssetCardBgColor, setAssetCardBgColor] = useState("bg-white");
  const assetId = asset.asset_id;
  const { deleteRequest } = useDelete();
  const { postRequest, isLoading } = usePost();
  const socket = useSocket();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [InfoPopupp, setInfoPopupp] = useState(false);
  const [isParamPopupOpen, setIsparamPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [sensors, setSensors] = useState([
    ]);
console.log(asset,"sdgdsfr")

  const [newSensor, setnewSensor] = useState();
  const deviceId = localStorage.getItem("deviceId");
  const accessToken = localStorage.getItem("token");

useEffect(() => {
  if (!assetData?.assets) return;

  const matchedAsset = assetData.assets.find(
    (assetItem) => assetItem.asset_id === assetId
  );

  setSensors(matchedAsset?.sensors || []);
}, [assetId]);










    const { pinnedAsset, setpinnedAsset } =
    useClientContext();

  useEffect(() => {
    if (socket) {
      // console.log(sensors)
      if (sensors.length > 0) {
        sensors.map((sensor) => {
          // console.log(sensor.sensor_id);
          let socketData = { sId: sensor.sensor_id };
          socket.emit("topicId", socketData, (response) => {
            // console.log("Acknowledgement from server:", response);
          });
          console.log(`socket emitetd with id ${socketData.sId}`);
        });
      }
    }
  }, [sensors, socket]);
  console.log(AssetCardBgColor);

  const handleSensorPopup = () => {
    setIsPopupOpen(true);
  };
  const handleOpenInfoPopupp = () => {
    setInfoPopupp(true);
  };
  const handleCloseInfoPopupp = () => {
    setInfoPopupp(false);
  };
  const handleParamsOpen = () => {
    setIsparamPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCloseParamsOpen = () => {
    setIsparamPopupOpen(false);
  };

  const handleDelete = async () => {
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
  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
  };


  const handlePin = async () => {
    const newasset = {...asset};
    newasset.asset_pin = !asset.asset_pin;
    setpinnedAsset(newasset)
 try {
  
      const json = await postRequest(
        `/company/pinnedassets/${assetId}`,
       
        {
    "pin": !asset.asset_pin
},
 accesToken,
      );

      if (json.success) {
      console.log(json)
      // setpinnedAsset(json.data);
       
        
      }
    } catch (error) {
      console.error("Failed to delete asset:", error);
      
    }
  }

//   useEffect(() => {
//     const fetchSensors = async () => {
//       try {
//         const response = await postRequest(
//           `/company/fetchsensor/${assetId}`,
//           {},
//           accesToken
//         );
//         setSensors(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Failed to fetch sensors:", error);
//       }
//     };

//     fetchSensors();
//   }, [assetId]);

  useEffect(() => {
    if (newSensor) {
      if (socket) {
        const socketData = { data: newSensor, token: accessToken, deviceId };

        socket.emit("SensoraddedByClient", socketData);
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
    if (newSensor) {
      if (sensors.length > 0) {
        setSensors([...sensors, newSensor]);
        setnewSensor(null);
      } else {
        setSensors([newSensor]);
        setnewSensor(null);
      }
    }
  }, [newSensor]);
  useEffect(() => {
    if (socket) {
      socket.on(`Sensoraddedby_${assetId}`, (data) => {
        if (data.deviceId != deviceId) {
          setSensors((prevSensors) => {
            console.log(data.asset_id_fk, assetId);

            if (data.asset_id_fk === assetId) {
              if (Array.isArray(prevSensors)) {
                return [...prevSensors, data];
              }
              return [data];
            }

            return prevSensors;
          });
        }
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
//    const baseUrl = window.location.origin;
// const fullUrl = `${baseUrl}/client/workshop/${workshop_id}/assets/${assetId}/sensors/${sensorId}`;

// window.open(fullUrl, "_blank");
navigate(`/assets/${assetId}/sensors/${sensorId}`)

  };

  return (
    <div className="lg:ml-4 md:ml-4 p-2">
      <div
        className={` ${AssetCardBgColor} lg:mr-10 lg:ml-1 md:mr-10 md:ml-1 mb-10 mt-8 w-full lg:w-[28%] md:w-[28%] min-w-[300px] lg:min-w-[500px] md:min-w-[500px] max-w-[500px]  rounded-[9px] clientCard `}
      >
        <div className="flex justify-between w-full items-center pt-4">
          <MachineStatusIndicator
            sensors={sensors}
            setAssetCardBgColor={setAssetCardBgColor}
            assetId={assetId}
          />
          {/* <OverallHealth sensors={sensors} assetId={assetId} /> */}
          <div className="flex  justify-center items-center">
            {" "}
           
            {/* <div
              className="bg-[#3481FF] w-[72px] h-[25px] mt-3 mr-3 rounded-[6px] flex items-center justify-center text-white cursor-pointer"
              onClick={handleOpenInfoPopupp}
            >
              <div className="text-[10px]">BOF_15438</div>
              <div className="mr-1">
                <ImInfo size={10} />
              </div>
              <span className="text-center text-[10px]">info</span>
            </div> */}
           <div
  className={`pin cursor-pointer rounded-full p-2 mt-3 mr-3
             opacity-0 scale-0 pointer-events-none
             
             group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:block group-hover/pin:pointer-events-auto
             transition-all duration-300 ease-out
             hover:bg-red-500 hover:text-white ${asset.asset_pin?'bg-red-500 text-white block opacity-100 scale-100':'hidden opacity-0'}`} onClick={handlePin}

>
  <BsPinAngle />
</div>

            {/* <div
              className="bg-[#0d2c09] w-[72px] h-[25px] mr-3 mt-2 rounded-[6px] flex items-center justify-center text-white cursor-pointer"
              onClick={()=>{}}
            >
           
              <div className="mr-1">
                <FaArrowTrendUp size={10} />
              </div>
              <span className="text-center text-[10px]">Trend</span>
            </div> */}
          </div>
        </div>

        <div className="flex justify-center items-center m-3 relative">
          {Array.isArray(sensors) &&
            sensors.some((sensor) => sensor.sensor_type === "DE") &&
            sensors
              .filter((sensor) => sensor.sensor_type === "DE")
              .map((sensor) => (
                <div
                  key={sensor.sensor_id}
                  className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-2 md:top-auto lg:top-auto top-[50px] cursor-pointer absolute md:left-4 lg:left-4 left-0"
                  onClick={() => handleSensorClick(sensor.sensor_id)}
                >
                  <div className="absolute -right-[30px] lg:-right-[75px] md:-right-[75px] -top-[8%] lg:-top-[17%] md:-top-[17%] z-10">
                    <img src={sensorImage} alt="Sensor" className="" />
                  </div>
                  <SensorDE sensorId={sensor.sensor_id} assetId={assetId} />
                </div>
              ))}

          <div className="items-center  flex flex-col justify-center relative cardconimg">
            {/* {isLoading ? (
              <div className="relative">
                <div className="absolute -bottom-9 -left-[50%]">
                  <Lottie options={loadingSensor} height={20} width={20} />
                </div>
              </div>
            ) : sensors.length >= 2 ? null : (
              <div
                className="absolute bg-[#6FFF89] border-[1px] border-[#181818] rounded-[4px] font-semibold text-[10px] flex items-center w-[83px] h-[24px] lg:top-5 md:top-5 top-[10px] cursor-pointer justify-center left-[32%] hover:bg-[#23f84a] transition-colors duration-200"
                onClick={handleSensorPopup}
              >
                <div className="text-center font-extrabold text-[#181818]">
                  Add Sensor
                </div>
              </div>
            )} */}
            <img
              src={asset.asset_image}
              alt="Motor"
              className=" lg:mt-0 md:mt-0 mt-4 w-[50%] lg:w-auto md:w-auto"
            />

            {/* <div
              className="absolute bg-transparent border-[1px] border-[#184dfdbe] rounded-[4px] font-semibold justify-center text-[10px] flex items-center w-[50%] h-[24px] bottom-2 cursor-pointer left-[28%] hover:bg-[#184dfdbe] lg:top-auto md:top-auto top-[104px] transition-colors  ease-in-out hover:text-white text-[#181818]"
              onClick={handleParamsOpen}
            >
              <div className="flex items-centers justify-center w-full">
                <span className="text-center font-extrabold">
                  Add Parameters
                </span>
              </div>
            </div> */}
          </div>

          {Array.isArray(sensors) &&
            sensors.some((sensor) => sensor.sensor_type === "NDE") &&
            sensors
              .filter((sensor) => sensor.sensor_type === "NDE")
              .map((sensor) => (
                <div
                  key={sensor.sensor_id}
                  className="flex justify-between items-center gap-1.5 h-[28px] rounded-[6px] border-[#3482ff75] border-[0.4px] bg-[#E2EDFF] hover:bg-[#1c5fcc] hover:text-white duration-200 mb-3 cursor-pointer absolute md:top-[85px] lg:top-[85px] top-[52px] left-[73%] lg:left-[385px] md:left-[385px]"
                  onClick={() => handleSensorClick(sensor.sensor_id)}
                >
                  <div className="absolute flex lg:-left-[90%] md:-left-[90%] -left-[40%] lg:-top-[10%]  md:-top-[10%] -top-[4px]">
                    <img src={sensorImage} alt="Sensor" />
                  </div>
                  <SensorNDE sensorId={sensor.sensor_id} />
                </div>
              ))}
        </div>

        <div className="flex flex-col items-center justify-center px-2">
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
            className="mb-4 flex items-center justify-center bg-[#FF4545] duration-300 rounded-[7px] w-full h-[39px] cursor-pointer hover:bg-transparent text-white hover:text-red-400"
            onClick={handleDelete}
          >
            <ImBin size={20} className="" />
          </div> */}
          {/* <div
            className="mb-4 flex items-center justify-center border-[2px] border-[#4570ff] bg-[#4570ff] duration-300 rounded-[7px] w-full h-[39px] cursor-pointer hover:bg-transparent text-white hover:text-[#4570ff]"
            onClick={handleEdit}
          >
            <MdEditSquare size={20} className="" />
          </div> */}
        </div>
      </div>
      {/* {isPopupOpen && (
        <SensorAddPopup
          onClose={handleClosePopup}
          assetId={assetId}
          setnewSensor={setnewSensor}
        />
      )} */}
      {/* {isParamPopupOpen && (
        <ParameterAddPopup onClose={handleCloseParamsOpen} assetId={assetId} />
      )} */}
      {/* {isDeletePopupOpen && (
        <AssetDeletePopup onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      {isEditPopupOpen && (
        <AssetEditPopup
          assetId={assetId}
          asset={asset}
          onClose={() => setIsEditPopupOpen(false)}
        />
      )} */}
      {/* {InfoPopupp && (
        <InfoPopup
          onClose={handleCloseInfoPopupp}
          assetId={assetId}
          sensors={sensors}
        />
      )} */}
    </div>
  );
}

export default AssetCard;
