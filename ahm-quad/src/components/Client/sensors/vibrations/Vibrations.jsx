import React, { useEffect, useState } from "react";
import Monitor from "../monitor/Monitor";
import { useClientContext } from "../../../../context/ClientStateContext";
import Lottie from "react-lottie";
import sensorLoaderNew from "../../../../Lottie/sensorLoaderNew.json";
import Connecting from "../../../../Lottie/Connecting.json"
import { usePost } from "../../../../hooks/usehttp";
import { useParams } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

function Vibrations({ DataReceivedFromSensor,setsensorType }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);
  const [minValueForvibration_X, setMinValueForvibration_X] = useState(null);
  const [maxValueForvibration_X, setMaxValueForvibration_X] = useState(null);
  const [healthyValueForvibration_X, setHealthyValueForvibration_X] = useState(null);
  const [warningValueForvibration_X, setWarningValueForvibration_X] = useState(null);
  const [isloading, setisloading] = useState(false)
const { postRequest } = usePost();
  const {  sensor_id } = useParams();
  const [minValueForvibration_Y, setMinValueForvibration_Y] = useState(null);
  const [maxValueForvibration_Y, setMaxValueForvibration_Y] = useState(null);
  const [healthyValueForvibration_Y, setHealthyValueForvibration_Y] = useState(null);
  const [warningValueForvibration_Y, setWarningValueForvibration_Y] = useState(null);
const [sensorData, setsensorData] = useState(null);
  const [minValueForvibration_Z, setMinValueForvibration_Z] = useState(null);
  const [maxValueForvibration_Z, setMaxValueForvibration_Z] = useState(null);
  const [healthyValueForvibration_Z, setHealthyValueForvibration_Z] = useState(null);
  const [warningValueForvibration_Z, setWarningValueForvibration_Z] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFrequency, setNewFrequency] = useState("");
  const accesToken = localStorage.getItem("token");
  const calculateVibrationX = (k) => {
  const f = 50;
  const result = (k / (2 * Math.PI * 50)) * 1000;
return Math.abs(parseFloat(result.toFixed(3)));
};
 const handleFrequencyUpdate = async () => {
    try {
      setisloading(true);
      const response = await postRequest(`/company/updatesensorfrequency/${sensor_id}`, { frequency : Number(newFrequency) }, accesToken);
      if (response) {
        setsensorData((prev) => ({ ...prev, 50: Number(newFrequency) }));
        setNewFrequency("");
        setIsModalOpen(false);
        setisloading(false);
      }
    } catch (error) {
      setIsModalOpen(false);
      setisloading(false);
      console.error("Failed to update frequency:", error);
    }
  };
useEffect(() => {
  const fetshsensorDetails = async () => {
    try {
      const response = await postRequest(`/company/fetchonesensor/${sensor_id}`, {}, accesToken);
      if (response) {
        console.log(response)
        setsensorData(response.data);
        setsensorType(response.data.sensor_type);
      }
    } catch (error) {
      console.error("Error fetching sensor details:", error);
    }
  }
  // fetshsensorDetails();
}, [])


  const vibrationX = calculateVibrationX(DataReceivedFromSensor?.vibration_x) || 0;
  const vibrationY = calculateVibrationX(DataReceivedFromSensor?.vibration_y) || 0;
  const vibrationZ = calculateVibrationX(DataReceivedFromSensor?.vibration_z) || 0;
  const peakVibration = Math.max(vibrationX, vibrationY, vibrationZ);

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      sensorThresholdData.threshold_data?.forEach((data) => {
        if (data.type === "vibration_X") {
          setHealthyValueForvibration_X(data.healthy);
          setWarningValueForvibration_X(data.warning);
          setMinValueForvibration_X(data.min || 0);
          setMaxValueForvibration_X(data.max || 100);
        }
        else if (data.type === "vibration_Y") {
          setHealthyValueForvibration_Y(data.healthy);
          setWarningValueForvibration_Y(data.warning);
          setMinValueForvibration_Y(data.min || 0);
          setMaxValueForvibration_Y(data.max || 100);
        }
        else if (data.type === "vibration_Z") {
          setHealthyValueForvibration_Z(data.healthy);
          setWarningValueForvibration_Z(data.warning);
          setMinValueForvibration_Z(data.min || 0);
          setMaxValueForvibration_Z(data.max || 100);
        }
      });
    }
  }, [sensorThresholdData]);

  const sensorLoaderAnimation = {
    loop: true,
    autoplay: true,
    animationData: sensorLoaderNew,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const renderMonitorSection = () => (
    <div className="bg-[#FFFFFF] mb-2 w-full lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10 relative pt-4">
      <div className="flex flex-col">
        <div className="flex md:flex-row lg:flex-row flex-col">
          <div className="flex flex-col justify-center items-center">
            <Monitor value={vibrationX} name="Radial" minValue={minValueForvibration_X} maxValue={maxValueForvibration_X} healthy={healthyValueForvibration_X} warning={warningValueForvibration_X} tooltipMsg={" These thresholds are as per ISO 10816-3 standards or customer defined thresholds as per the requirement"}  />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Monitor value={vibrationY} name="Axial" minValue={minValueForvibration_Y} maxValue={maxValueForvibration_Y} healthy={healthyValueForvibration_Y} warning={warningValueForvibration_Y} tooltipMsg={" These thresholds are as per ISO 10816-3 standards or customer defined thresholds as per the requirement"}  />
          </div>
        </div>
      <div className="flex items-center gap-2 bg-blue-500 text-white absolute left-[70%] px-3 top-[2%] rounded-sm">
          f:50Hz
          {/* <FaPencilAlt
            className="cursor-pointer text-white ml-2"
            onClick={() => {
              setNewFrequency(50);
              setIsModalOpen(true);
            }}
          /> */}
        </div>
        <div className="flex md:flex-row lg:flex-row flex-col">
          <div className="flex flex-col justify-center items-center">
            <Monitor value={vibrationZ} name="Tangential" minValue={minValueForvibration_Z} maxValue={maxValueForvibration_Z} healthy={healthyValueForvibration_Z} warning={warningValueForvibration_Z} tooltipMsg={" These thresholds are as per ISO 10816-3 standards or customer defined thresholds as per the requirement"}  />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Monitor value={peakVibration} name="Peak" minValue={Math.max(minValueForvibration_X,minValueForvibration_Y,minValueForvibration_Z)} maxValue={Math.max(maxValueForvibration_X,maxValueForvibration_Y,maxValueForvibration_Z)} healthy={Math.max(healthyValueForvibration_X,healthyValueForvibration_Y,healthyValueForvibration_Z)} warning={Math.max(warningValueForvibration_X,warningValueForvibration_Y,warningValueForvibration_Z)} tooltipMsg={" These thresholds are as per ISO 10816-3 standards or customer defined thresholds as per the requirement"}  />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-5">
        <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">Vibrations (mm/s)</div>
      </div>
       {isModalOpen && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-[400px]">
            <h2 className="text-lg font-semibold mb-3">Update Frequency</h2>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter new frequency (Hz)"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleFrequencyUpdate} className="px-4 py-1 bg-blue-600 text-white rounded">{isloading ? "Updating..." : "Update"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInactiveState = () => (
    <div className="bg-[#FFFFFF] mb-2 w-full lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex flex-col justify-center items-center">
        <Lottie options={sensorLoaderAnimation} height={300} width={420} />
      </div>
      <p className="flex font-bold">INACTIVE</p>
      <div className="flex flex-col justify-center items-center mt-12">
        <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">Vibrations (mm/s)</div>
      </div>
    </div>
  );
  const ConnectingAnimation = {
    loop: true,
    autoplay: true,
    animationData: Connecting,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }
  const renderConnectingState = () => (
    <div className="bg-[#FFFFFF] mb-2 w-full lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex h-full min-h-[250px] items-center ">
      <Lottie options={ConnectingAnimation} height={50} width={50}/>
      <p className="flex font-bold h-full items-center">Connecting...</p>
      </div>
    
      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md ">Vibrations (mm/s)</div>
    </div>
  );
  return (
    <>
     {DataReceivedFromSensor?DataReceivedFromSensor.overall_health 
        ? ThresholdData ?maxValueForvibration_X
          ? renderMonitorSection() 
          : renderConnectingState() 
        : renderInactiveState()
        : renderInactiveState()
        : renderConnectingState()
      }
    </>
  );
}

export default Vibrations;
