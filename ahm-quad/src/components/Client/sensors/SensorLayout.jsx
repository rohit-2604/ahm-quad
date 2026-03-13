import React, { useEffect, useState } from "react";
import { IoChevronBack, IoSettings } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { TbCopyCheckFilled } from "react-icons/tb";
import Temperature from "./temperature/Temperature";
import Vibrations from "./vibrations/Vibrations";
import MagneticFlux from "./magneticFlux/MagneticFlux";
// import HealthStatusContainer from "../status/healthStatus/HealthStatusContainer";
// import AlertSummeryContainer from "../status/alertSummery/AlertSummeryContainer";
// import OperatingParametersContainer from "../status/operatingParameters/OperatingParametersContainer";
import MachineStatusContainer from "../status/machineStatus/MachineStatusContainer";
import ActivityInsightsContainer from "../status/activityInsights/ActivityInsightsContainer";
// import ServiceContainer from "../status/service/ServiceContainer";
import Acoustics from "../sensors/acoustics/Acoustics";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import MachineRuntimeContainer from "../status/machineRuntime/MachineRuntimeContainer";
import useSocket from "../../../hooks/useSocket";
import { MdDelete } from "react-icons/md";
import ConfrimationPopup from "../../../utils/Popup/ConfrimationPopup/ConfrimationPopup";
import { useDelete, usePost } from "../../../hooks/usehttp";
import ThresholdPopup from "../../../utils/Popup/ThresholdPopup/ThresholdPopup";
import { useClientContext } from "../../../context/ClientStateContext";
// import Graph from "../graph/Graph";
// import TemparatureGraph from "../graph/TemparatureGraph/TemparatureGraph";
// import AccousticGraph from "../graph/AccousticGraph/AccousticGraph";
// import VibrationsGraph from "../graph/VibrationsGraph/VibrationsGraph";
// import MagneticFluxGraph from "../graph/MagneticFlux/MagneticFluxGraph";
import Diagnosis from "../Diagnosis/Diagnosis";
// import { Border } from "@syncfusion/ej2-react-charts";
import { useMediaQuery } from "react-responsive";
import Range from "../Diagnosis/Range";
import DiagnosisMain from "../Diagnosis/DiagnosisMain";
import { IoMdAdd } from "react-icons/io";
import add from "../../../assets/addsupervisor.png";
import AddSuperVisor from "./popup/AddSuperVisor";
import { GrServices } from "react-icons/gr";
import ServicePopup from "./popup/service/ServicePopup";
// import AlertallPopup from "../status/alertSummery/PopUp/AlertallPopup";
import { GoAlertFill } from "react-icons/go";
import Gyro from "./gyro/Gyro";
import TrendPopup from "./popup/TrendPopup/TrendPopup";
import { FaArrowTrendUp } from "react-icons/fa6";
import Header from "../../header/Header";
// import Scene from "../status/operatingParameters/Scene";
// import ModelViewer from "../status/operatingParameters/ModelViewer";
import assetData from "../../../Assets.json";

function SensorLayout() {
  const [workshopData, setworkshopData] = useState();
  const [sensorType, setsensorType] = useState("loading...");
  const [Anomallypopup, setAnomallypopup] = useState(false);
  const [updateMode, setUpdateMode] = useState(true);
  const [TrendPopupshow, setTrendPopupshow] = useState(false);
  const [isPopupOpenSuperVisor, setIsPopupOpenSuperVisor] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {
    sensorThresholdData,
    setsensorThresholdData,
    totalRuntime,
    settotalRuntime,
  } = useClientContext();
  const [copiedItem, setCopiedItem] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [confirmationPopupShow, setConfirmationPopupShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);

  const { deleteRequest } = useDelete();

  const prevRoute = localStorage.getItem("previousRoute");
  const accesToken = localStorage.getItem("token");
  const [DataReceivedFromSensor, setDataReceivedFromSensor] = useState(null);
  const [DiagnosisOpen, setDiagnosisOpen] = useState(false);
  const [openServicePopup, setOpenServicePopup] = useState(false);
  const screen2 = useMediaQuery({ query: "(max-width: 1624px)" });
  const screen3 = useMediaQuery({ query: "(max-width: 1482px)" });
  const [RangeForDE, setRangeForDE] = useState(false);
  const [RangeForNDE, setRangeForNDE] = useState(false);
  const [showDiagnosisMain, setShowDiagnosis] = useState(false);
  const handleRangeDE = () => {
    setRangeForDE(true);
  };

  const handleRangeNDE = () => {
    setRangeForNDE(true);
  };
  const handleAddSupervisortoAsset = () => {
    setIsPopupOpenSuperVisor(true); // Open the popup
  };

  const handleClosePopupSuperVisor = () => {
    setIsPopupOpenSuperVisor(false);
  };
  const handleContinue = () => {
    setRangeForDE(false);
    setRangeForNDE(false);
    setShowDiagnosis(true);
  };
  useEffect(() => {
    if (sensorThresholdData) {
      // // console.log(sensorThresholdData);
    }
  }, [sensorThresholdData]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {}, [screenWidth]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);

    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };
  const { company_id, workshop_id, asset_id, sensor_id } = useParams();
  const navigate = useNavigate();

  const socket = useSocket();
  const handleConfirm = () => {
    setConfirmationPopupShow(true);
  };
  useEffect(() => {
    if (socket) {
      socket.on(sensor_id, (data) => {
        // console.log("Data received from topic:", data);

        setDataReceivedFromSensor(data);
        // console.log("DataReceivedFromSensor:", data);
      });

      return () => socket.off(sensor_id);
    }
  }, [socket, sensor_id]);

  useEffect(() => {
    if (socket) {
      setInterval(
        () => {
          // // console.log("alertconnect");
          socket.emit("AlertConnect", {
            sensorId: sensor_id,
            token: accesToken,
          });
        },
        10 * 60 * 1000,
      );
    }
  }, [socket]);
  useEffect(() => {
    if (confirmationMessage) {
      if (socket) {
        const DeleteSensor = async () => {
          // // console.log("delete");
          setIsLoading(true);
          const json = await deleteRequest(
            `/company/deletesensor/${sensor_id}`,
            accesToken,
          );
          if (json.success) {
            const socketData = { data: json.data, token: accesToken };
            socket.emit("Sensordeleted", socketData);
            navigate(`/client/workshop/${workshop_id}/assets/all`);
          }
          setIsLoading(false);
        };
        DeleteSensor();
      }
    }
  }, [confirmationMessage, accesToken, socket]);
  const handleGraph = () => {
    setDiagnosisOpen(false);
    setGraphOpen(!graphOpen);
    setShowDiagnosis(false);
  };
  const handleOpenServicePopup = () => {
    setOpenServicePopup(true);
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = "auto";
    window.location.reload();
  };
  const handleCloseServicePopup = () => {
    setOpenServicePopup(false);
  };
  const handleDiagnosis = () => {
    setDiagnosisOpen(!DiagnosisOpen);

    setShowDiagnosis(false);
  };
  const { postRequest } = usePost();
  useEffect(() => {
    const fetchworkshop = async () => {
      try {
        const json = await postRequest(
          `/company/fetchoneworkshop/${workshop_id}`,
          {},
          accesToken,
        );
        setworkshopData(json.data);
        // // console.log(json.data)
      } catch (err) {
        console.error("Error fetching workshop:", err);
      }
    };

    // fetchworkshop();
  }, []);
  // superadmin/getserviceform/:asset_id
  console.log(DataReceivedFromSensor);



  useEffect(() => {
    if (!assetData?.assets) return;

    const sensor = assetData.assets.flatMap((asset) => asset.sensors).find((s) => s.sensor_id === sensor_id);

    if (sensor) {
      setsensorType(sensor.sensor_type);
    } else {
      setsensorType("Unknown");
    }
  }, [sensor_id]);





  return (
    <>
      <div className="sensorLayout">
        <div className="w-full ">
          <div className="mb-2 ml-1 w-full flex flex-col justify-center items-center lg:flex-row lg:justify-between ">
            <p className="text-[24px] text-[#4D4D4D] font-semibold">
              Sensor ({sensorType})
            </p>

            <div className="flex gap-3 flex-col lg:flex-row items-center">
              <div className="flex justify-center items-center bg-black rounded-[7px] px-4 pr-6 min-h-[32px]  md:gap-4 xl:gap-4 gap-2 flex-wrap md:flex-nowrap xl:flex-nowrap">
                {/* Healthy */}
                <div className="flex items-center gap-2 text-white md:text-[12px] xl:text-[12px] text-[9px] font-semibold">
                  <svg width="20" height="20">
                    <path
                      d="M2,10 Q10,0 18,10"
                      strokeLinecap="round"
                      stroke="#24FF00"
                      strokeWidth="5"
                      fill="none"
                    />
                  </svg>
                  <span>Healthy</span>
                </div>

                {/* Out of Service */}
                <div className="flex items-center gap-2 text-white md:text-[12px] xl:text-[12px] text-[9px] font-semibold">
                  <svg width="20" height="20">
                    <path
                      d="M2,10 Q10,0 18,10"
                      strokeLinecap="round"
                      stroke="#FFB800"
                      strokeWidth="5"
                      fill="none"
                    />
                  </svg>
                  <span>Turned off(Vibration Only) / Unhealthy</span>
                </div>

                {/* Critical */}
                <div className="flex items-center gap-2 text-white md:text-[12px] xl:text-[12px] text-[9px] font-semibold">
                  <svg width="20" height="20">
                    <path
                      d="M2,10 Q10,0 18,10"
                      strokeLinecap="round"
                      stroke="#FF4B4B"
                      strokeWidth="5"
                      fill="none"
                    />
                  </svg>
                  <span>Critical</span>
                </div>
              </div>

              <div className=" flex justify-center items-center bg-black rounded-[7px] px-4 pr-6  min-h-[32px] flex-wrap mr-4">
                <div className="flex items-center font-semibold text-[10px] pl-4">
                  <div className="bg-[#24FF00] h-2 w-2 rounded-full blur-[7px]"></div>
                  <div className="absolute bg-[#24FF00] h-2 w-2 rounded-full"></div>
                  <div className="pl-2 text-white lg:text-[12px] md:text-[15px] text-[12px] text-center ">
                    Healthy
                  </div>
                </div>
                <div className="flex items-center font-semibold text-[10px] pl-4">
                  <div className="bg-[#FFB800] h-2 w-2 rounded-full blur-[7px]"></div>
                  <div className="absolute bg-[#FFB800] h-2 w-2 rounded-full"></div>
                  <div className="pl-2 text-white lg:text-[12px] md:text-[15px] text-[12px] text-center ">
                    Unhealthy
                  </div>
                </div>
                <div className="flex items-center font-semibold text-[10px] pl-4">
                  <div className="bg-[#868686] h-2 w-2 rounded-full blur-[7px]"></div>
                  <div className="absolute bg-[#868686] h-2 w-2 rounded-full"></div>
                  <div className="pl-2 text-white lg:text-[12px] md:text-[15px] text-[12px] text-center ">
                    Inactive
                  </div>
                </div>
                <div className="flex items-center font-semibold text-[10px] pl-4">
                  <div className="bg-[#4F9BFF] h-2 w-2 rounded-full blur-[7px] glowbtn"></div>
                  <div className="absolute bg-[#4F9BFF] h-2 w-2 rounded-full glowbtn"></div>
                  <div className="pl-2 text-white lg:text-[12px] md:text-[15px] text-[12px] text-center ">
                    Connecting
                  </div>
                </div>
                <div className="flex items-center font-semibold text-[10px] pl-4">
                  <div className="bg-[#009DFF] h-2 w-2 rounded-full blur-[7px] "></div>
                  <div className="absolute bg-[#009DFF] h-2 w-2 rounded-full "></div>
                  <div className="pl-2 text-white lg:text-[12px] md:text-[15px] text-[12px] text-center ">
                    Online
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center gap-4 ">
                <div className="px-4  h-6 bg-black text-white rounded-md flex items-center justify-center text-[10px] w-full ">
                  {workshopData ? workshopData.workshop_address : ""}
                </div>
              </div> */}
              {/* <div className="px-8 py-1 bg-white rounded-md flex justify-between gap-8">
                <p className="font-bold flex items-center">
                  {workshopData ? workshopData.workshop_name : ""}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{workshop_id}</p>
                  <MdContentCopy className="cursor-pointer" />
                </div>
              </div> */}
              {/* <div
            className="px-4 py-[0.4rem] gap-2 bg-[#f02828] border-2 border-[#f02828] justify-center text-white rounded-md text-[10px] whitespace-wrap flex font-[500] items-center lg:text-[12px] hover:bg-transparent hover:text-[#f02828] duration-200 cursor-pointer"
            onClick={handleConfirm}
          >
            <MdDelete className="h-4 w-4 " />{" "}
            {isLoading ? <p> Deleting...</p> : <p> Delete Sensor</p>}
          </div> */}
            </div>
          </div>
        </div>
        {confirmationPopupShow && (
          <ConfrimationPopup
            setConfirmationPopupShow={setConfirmationPopupShow}
            setConfirmationMessage={setConfirmationMessage}
          />
        )}
        {/* 1275 */}
        <div className="flex  flex-col h-auto w-full overflow-x-hidden lg:w-full bg-[#F5F5F5] rounded-md pb-4 ">
          <div
            className={`flex gap-5 flex-col md:flex-col lg:flex-row text-[10px] lg:text-md sm:items-center 
  ${
    screenWidth > 1590
      ? "justify-between"
      : "justify-center items-center flex-wrap"
  } 
  pt-6 px-4 h-auto w-full md:flex-row`}
          >
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-4 md:mb-0">
              {/* <div
              className="bg-black text-white px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer"
              onClick={handleGraph}
            >
              <VscGraph color="white" size={15} className="mr-2" />
              {graphOpen ? "Dial" : "Graph"}
            </div> */}

              {/* <div
                className={`px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer ${
                  DiagnosisOpen
                    ? "border-2 border-black bg-white text-black"
                    : "bg-black text-white"
                }`}
                onClick={handleDiagnosis}
              >
                <IoSettings
                  color={`${DiagnosisOpen ? "black" : "white"}`}
                  size={15}
                  className="mr-2"
                />
                Diagnosis
              </div> */}

              <div
                className="bg-black text-white px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer"
                onClick={handleOpenPopup}
              >
                <LuSettings2 color="white" size={15} className="mr-2" />
                Threshold
              </div>
              {/* <div
              className="bg-black text-white px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer"
              onClick={handleOpenServicePopup}
            >
              <GrServices color="white" size={15} className="mr-2" />
              Service
            </div> */}
              {/* <div
              className="bg-black text-white px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer text-center justify-center"
              onClick={() => { setAnomallypopup(true) }}
            >
              <GoAlertFill color="white" size={15} className="mr-2" />
              Anomally
            </div> */}
              {/* <div
            className={` ${totalRuntime&&totalRuntime>=36000?"":" opacity-60"} bg-black  text-white px-4 lg:px-8 py-1 rounded-md text-xs flex items-center cursor-pointer text-center justify-center`}
            onClick={() => {totalRuntime&&totalRuntime>=36000 ? setTrendPopupshow(true) : null }}
          >
            <FaArrowTrendUp color="white" size={15} className="mr-2" />
            Forecast
          </div> */}
            </div>
            {/* {Anomallypopup && <AlertallPopup
            onClose={() => { setAnomallypopup(false) }}
            sensorId={sensor_id}

          />} */}
            {TrendPopupshow && (
              <TrendPopup setTrendPopupshow={setTrendPopupshow} />
            )}
            <div className="flex justify-center">
              <div
                className={`border-[1px] ${
                  DataReceivedFromSensor
                    ? DataReceivedFromSensor.sensorstatus === "Active"
                      ? "border-[#009DFF]"
                      : DataReceivedFromSensor.sensorstatus === "Inactive"
                        ? "border-[#757575]"
                        : "border-[#757575]"
                    : "border-[#4F9BFF]"
                } px-5 py-1 rounded-md text-xs flex gap-2 items-center justify-center bg-white mb-4 md:mb-0`}
              >
                <div className="flex gap-2">
                  <div className="flex items-center justify-center">
                    <div
                      className={`${
                        DataReceivedFromSensor
                          ? DataReceivedFromSensor.sensorstatus === "Active"
                            ? "bg-[#009DFF]"
                            : DataReceivedFromSensor.sensorstatus === "Inactive"
                              ? "bg-[#757575]"
                              : "bg-[#757575]"
                          : "bg-[#4F9BFF] glowbtn"
                      } h-2 w-2 rounded-full absolute blur-[5px] glowbtn`}
                    ></div>
                    <div
                      className={`${
                        DataReceivedFromSensor
                          ? DataReceivedFromSensor.sensorstatus === "Active"
                            ? "bg-[#009DFF]"
                            : DataReceivedFromSensor.sensorstatus === "Inactive"
                              ? "bg-[#757575]"
                              : "bg-[#757575]"
                          : "bg-[#4F9BFF] glowbtn"
                      } h-2 w-2 rounded-full`}
                    ></div>
                  </div>
                  <p className="flex items-center justify-center text-center w-full">
                    {!DataReceivedFromSensor
                      ? "Connecting..."
                      : DataReceivedFromSensor.sensorstatus === "Active"
                        ? "Online"
                        : "Offline"}
                    (AHM)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap md:flex-nowrap">
              {/* <div
                className="bg-[#3481FF] px-3 lg:px-5 py-1 flex text-white gap-2 rounded-md items-center cursor-pointer"
                onClick={handleAddSupervisortoAsset}
              >
                <IoMdAdd
                  color="white"
                  className="w-4 h-4 md:w-6 md:h-6 lg:w-6 lg:h-6"
                />
                <img src={add} alt="add" className="bg-transparent" />
              </div> */}

              <div className="bg-[#3481FF] px-4 lg:px-5 py-1 flex text-white gap-2 rounded-md items-center">
                <p className="text-[#E7E7E7]">Sensor Id</p>-
                <p className="font-bold">{sensor_id}</p>
                {copiedItem === "sensor_id" ? (
                  <TbCopyCheckFilled className="cursor-pointer w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  <MdContentCopy
                    className="cursor-pointer w-3 h-3 lg:w-4 lg:h-4"
                    onClick={() => handleCopy(sensor_id, "sensor_id")}
                  />
                )}
              </div>

              <div className="bg-[#3481FF] px-4 md:px-5 py-1 flex text-white gap-2 rounded-md items-center">
                <p className="text-[#E7E7E7]">Asset ID</p>-
                <p className="font-bold">{asset_id}</p>
                {copiedItem === "asset_id" ? (
                  <TbCopyCheckFilled className="cursor-pointer w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  <MdContentCopy
                    className="cursor-pointer w-3 h-3 lg:w-4 lg:h-4"
                    onClick={() => handleCopy(asset_id, "asset_id")}
                  />
                )}
              </div>
            </div>
          </div>

          {!DiagnosisOpen && (
            <div className="flex lg:w-full  gap-2 px-4">
              <div
                className={`sensors flex-col mt-5 ${
                  screenWidth <= 1624 && screenWidth >= 1400
                    ? "min-w-[850px]"
                    : screenWidth < 1400
                      ? "w-full overflow-x-scroll"
                      : screenWidth < 400
                        ? "w-full overflow-x-scroll"
                        : "min-w-[850px]"
                } overflow-y-auto h-[100vh] overflow-x-hidden`}
              >
                {screenWidth <= 1624 && screenWidth >= 1400 ? (
                  <>
                    <div className="flex gap-2 w-full flex-row ">
                      {graphOpen ? (
                        <TemparatureGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Temperature
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <AccousticGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Acoustics
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                    <div className="flex gap-2 w-full flex-row">
                      {graphOpen ? (
                        <VibrationsGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Vibrations
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <MagneticFluxGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <MagneticFlux
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                  </>
                ) : screenWidth <= 1400 ? (
                  <>
                    <div className="flex gap-2 w-full flex-col">
                      {graphOpen ? (
                        <TemparatureGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Temperature
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <AccousticGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Acoustics
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                    <div className="flex gap-2 w-full flex-col">
                      {graphOpen ? (
                        <VibrationsGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Vibrations
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <MagneticFluxGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <MagneticFlux
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex  gap-2 w-full">
                      {graphOpen ? (
                        <TemparatureGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Temperature
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <AccousticGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Acoustics
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      {graphOpen ? (
                        <VibrationsGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <Vibrations
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                      {graphOpen ? (
                        <MagneticFluxGraph
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      ) : (
                        <MagneticFlux
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* right part sensor layout */}
              {screenWidth <= 1057 && !DiagnosisOpen ? (
                <></>
              ) : (
                <>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col lg:flex-row gap-2 ">
                      <div className="w-full lg:w-1/2 flex flex-col">
                        {/* <OperatingParametersContainer /> */}
                      </div>
                      <div className="w-full lg:w-1/2 flex flex-col ]">
                        {/* <ModelViewer /> */}
                      </div>
                    </div>

                    {screenWidth <= 1613 ? (
                      <div className="flex flex-row w-full h-1/2  gap-2">
                        <MachineStatusContainer
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                        <ActivityInsightsContainer />
                      </div>
                    ) : (
                      <div className="flex flex-col w-full  gap-2">
                        <MachineStatusContainer
                          DataReceivedFromSensor={DataReceivedFromSensor}
                        />
                        <ActivityInsightsContainer />
                      </div>
                    )}

                    {/* <AlertSummeryContainer /> */}

                    {/* <HealthStatusContainer /> */}
                    {/* <ServiceContainer /> */}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Dignosis Part */}

          <div className="flex justify-center items-center">
            {DiagnosisOpen && !showDiagnosisMain && <Diagnosis />}
            {/* {showDiagnosisMain && DiagnosisOpen && <DiagnosisMain />} */}

            {/* right part sensor layout */}
          </div>
          {screenWidth <= 1057 && !DiagnosisOpen ? (
            <>
              <div className="flex flex-col gap-2 h-full w-full">
                {/* <HealthStatusContainer /> */}
                {screenWidth <= 1613 ? (
                  <div className="flex flex-col w-full h-full gap-2">
                    <MachineStatusContainer
                      DataReceivedFromSensor={DataReceivedFromSensor}
                    />
                    <ActivityInsightsContainer />
                  </div>
                ) : (
                  <div className="flex flex-col w-full h-full gap-2">
                    <MachineStatusContainer
                      DataReceivedFromSensor={DataReceivedFromSensor}
                    />
                    <ActivityInsightsContainer />
                  </div>
                )}

                {/* <AlertSummeryContainer /> */}

                {/* <OperatingParametersContainer /> */}
                {/* <ModelViewer /> */}
                {/* <ServiceContainer /> */}
              </div>
            </>
          ) : null}
        </div>

        {isPopupOpen && (
          <ThresholdPopup
            onClose={handleClosePopup}
            sensorThresholdData={sensorThresholdData}
            role={"company"}
            updateMode={updateMode}
          />
        )}
        {openServicePopup && <ServicePopup onClose={handleCloseServicePopup} />}

        {isPopupOpenSuperVisor && (
          <AddSuperVisor
            onClose={handleClosePopupSuperVisor}
            company_id={company_id}
            asset_id={asset_id}
          />
        )}
      </div>
    </>
  );
}

export default SensorLayout;
