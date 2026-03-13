import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import { MdContentCopy } from "react-icons/md";
// import Temperature from "../../../components/Client/sensors/temperature/Temperature";
// import Acoustics from "../../../components/Client/sensors/acoustics/Acoustics";
// import Vibrations from "../../../components/Client/sensors/vibrations/Vibrations";
// import { VscGraph } from "react-icons/vsc";
// import { IoSettings } from "react-icons/io5";
// import { LuSettings2 } from "react-icons/lu";
// import MagneticFlux from "../../../components/Client/sensors/magneticFlux/MagneticFlux";
// import HealthStatusContainer from "../../../components/Client/status/healthStatus/HealthStatusContainer";
// import AlertSummeryContainer from "../../../components/Client/status/alertSummery/AlertSummeryContainer";
// import OperatingParametersContainer from "../../../components/Client/status/operatingParameters/OperatingParametersContainer";
// import MachineStatusContainer from "../../../components/Client/status/machineStatus/MachineStatusContainer";
// import ActivityInsightsContainer from "../../../components/Client/status/activityInsights/ActivityInsightsContainer";
// import ServiceContainer from "../../../components/Client/status/service/ServiceContainer";
import useSocket from "../../../hooks/useSocket";
import SensorLayout from "../../../components/Client/sensors/SensorLayout";
import { usePost } from "../../../hooks/usehttp";
import { useClientContext } from "../../../context/ClientStateContext";
import Header from "../../../components/header/Header";

function SensorMonitor() {
  const { company_id, workshop_id, sensor_id } = useParams();
  const socket = useSocket();
  const { postRequest, isLoading } = usePost();
  const accesToken = localStorage.getItem("token");
  const [first, setfirst] = useState(true);
  const { sensorThresholdData, setsensorThresholdData } = useClientContext();

  useEffect(() => {
    if (socket) {
      const socketData = { sId: sensor_id };
      socket.emit("topicId", socketData);
      // // console.log(`socket emitetd with id ${socketData.sId}`);

      setTimeout(() => {
        setfirst(false);
      }, 2000);
    }
  }, [sensor_id, socket]);

  useEffect(() => {
    const fetchSensorThresholds = async () => {
      try {
        const response = await postRequest(
          `/company/thresolddata`,
          { sensorId: sensor_id },
          
        );
        setsensorThresholdData(response.data);
        console.log(response,"ks")
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      }
    };

    fetchSensorThresholds();

  }, []);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(
      `/`
    );
  };
  return (
    <div className="w-full lg:ml-4 lg:pr-4 md:ml-4 md:pr-4 pr-2 ml-2 overflow-x-hidden">
      <div className="w-full">
            <Header/>
        <div className="flex items-center w-full">
          <div className="mb-2">
            <IoChevronBack
              className="text-xs mt-2 gap-2 text-[#929090]"
              onClick={handleBack}
            />
          </div>
          <p
            className="font-semibold text-[#929090] text-[11px] cursor-pointer"
            onClick={handleBack}
          >
            Back
          </p>
          <div className="ml-3">
            <p
              className="font-semibold text-[#929090] text-[10px] cursor-pointer"
              onClick={handleBack}
            >
             
            </p>
          </div>
        </div>
      </div>
      <SensorLayout />
    </div>
  );
}

export default SensorMonitor;
