import React, { useState, useEffect } from "react";
import Slider from "react-slider";
import { useClientContext } from "../../../context/ClientStateContext";
import { useParams } from "react-router-dom";
import { usePost } from "../../../hooks/usehttp";
import UpdatePopup from "./UpdatePopup";

function ThresholdManipulate({ sensor, role, updateMode }) {
  // // console.log(sensor);
  const { sensor_id } = useParams();
  // // console.log(role);
  const { type, min, healthy, warning, max } = sensor;
  const [values, setValues] = useState([healthy, warning]);
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [fixedLimits, setFixedLimits] = useState({ min, max });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
useEffect(() => {
//  // console.log(fixedLimits)
}, [fixedLimits])

  // Use the context
  const { sensorThresholdData, setsensorThresholdData } = useClientContext();

  // Custom hook for API request
  const { postRequest, isLoading, error, setError } = usePost();

  // const handleSliderChange = (newValues) => {
  //   const validatedValues = [
  //     Math.max(fixedLimits.min, newValues[0]),
  //     Math.min(fixedLimits.max, newValues[1]),
  //   ];
  //   setValues(validatedValues);

  //   // Show "Update" button when values change
  //   if (validatedValues[0] !== healthy || validatedValues[1] !== warning) {
  //     setIsUpdateVisible(true);
  //   } else {
  //     setIsUpdateVisible(false);
  //   }
  // };

  const handleSliderChange = (newValues) => {
    // Ensure that healthy (newValues[0]) is less than or equal to warning (newValues[1])
    if (newValues[0] > newValues[1]) {
      // If the healthy value is greater than warning, set both to the same value
      newValues[0] = newValues[1];
    }

    const validatedValues = [
      Math.max(fixedLimits.min, newValues[0]),
      Math.min(fixedLimits.max, newValues[1]),
    ];

    setValues(validatedValues);

    // Show "Update" button when values change
    if (validatedValues[0] !== healthy || validatedValues[1] !== warning) {
      setIsUpdateVisible(true);
    } else {
      setIsUpdateVisible(false);
    }
  };

  const handleSliderUpdate = async () => {
    const [newHealthy, newWarning] = values;
    const accessToken = localStorage.getItem("token");
    const data = {
      type,
      healthy: newHealthy,
      warning: newWarning,
      min: fixedLimits.min,
      max: fixedLimits.max,
    };

    try {
      const response = await postRequest(
        `/${role}/updatethresold/${sensor_id}`,
        data,
        accessToken
      );

      if (response) {
        let updatedThresholdData = {
          ...sensorThresholdData,
          threshold_data: sensorThresholdData.threshold_data.map((data) => {
            if (data.type === type) {
              return {
                ...data,
                healthy: newHealthy,
                warning: newWarning,
              };
            }
            return data;
          }),
        };

        setsensorThresholdData(updatedThresholdData);

        setIsUpdateVisible(false);
      } else {
        setError("Failed to update sensor thresholds.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleLimitsUpdate = (newMin, newMax) => {
    setFixedLimits({ min: newMin, max: newMax });
    handlePopupClose();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 30);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isMounted && (
  <div className="bg-[#EFF5FF] rounded-[9px] w-full max-w-[800px] mb-5 mx-auto">
    <div className="p-2">
      <div className="rounded-[9px] flex justify-between items-center flex-wrap">
        <div className="rounded-[7px] px-2 py-1 bg-[#fff]">
          <div className="text-[11px] font-medium">{type}</div>
        </div>
        {updateMode && (
          <div className="rounded-[7px] py-1 bg-[#fff] mt-2 sm:mt-0">
            <div className="flex justify-between items-center gap-x-4 sm:gap-x-7 flex-wrap">
              <div className="items-center flex gap-0.5 justify-center">
                <span className="font-normal pl-3 text-[10px]">Minimum:</span>
                <span className="font-bold text-[10px] w-5">{fixedLimits.min}</span>
              </div>
              <div className="items-center flex gap-0.5 justify-center">
                <span className="font-normal text-[10px]">Maximum:</span>
                <span className="font-bold text-[10px] w-5">{fixedLimits.max}</span>
              </div>
              <div
                className="items-center flex gap-0.5 justify-center bg-[#3C85FF] text-white px-2 py-0.5 rounded-[3px] text-[12px] cursor-pointer mt-2 sm:mt-0"
                onClick={handlePopupOpen}
              >
                Update Limits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="w-full px-4 sm:px-7 py-6 sm:py-10 relative">
      <Slider
        className="relative h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-[#EA4228] rounded-full cursor-pointer"
        thumbClassName="relative -top-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full focus:outline-none cursor-pointer"
        value={values}
        onChange={handleSliderChange}
        disabled={!updateMode}
        min={fixedLimits.min + 1}
        max={fixedLimits.max - 1}
        minDistance={0.01}
        pearling={true}
        step={0.01}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-white p-1 text-xs font-bold rounded-md shadow-md cursor-pointer">
              {state.valueNow}
            </div>
            <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-white p-1 text-xs font-bold rounded-md shadow-md cursor-pointer">
              {state.index === 0 ? "Healthy" : "Warning"}
            </div>
          </div>
        )}
      />
      <div className="bottom-16 sm:bottom-24 text-xs left-4 sm:left-7 absolute font-semibold">
        Minimum
      </div>
      <div className="bottom-16 sm:bottom-24 text-xs right-4 sm:right-7 font-semibold absolute">
        Maximum
      </div>
      <div className="flex justify-between pt-3 text-sm text-gray-600">
        <div className="flex flex-col items-center font-semibold">
          <span>{fixedLimits.min}</span>
        </div>
        <div className="flex flex-col items-center font-semibold">
          <span>{fixedLimits.max}</span>
        </div>
      </div>
    </div>

    {isUpdateVisible && (
      <div className="flex justify-end px-4 sm:px-6 py-2 text-xs relative">
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md absolute bottom-2 sm:bottom-6 right-2 ${
            isLoading ? "opacity-50" : ""
          }`}
          onClick={handleSliderUpdate}
          disabled={isLoading || !updateMode}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    )}

    {error && (
      <div className="text-red-500 text-xs text-center mt-2">{error}</div>
    )}
  </div>
)}

{isPopupOpen && (
  <UpdatePopup
    currentMin={fixedLimits.min}
    currentMax={fixedLimits.max}
    fixedLimits={fixedLimits}
    setFixedLimits={setFixedLimits}
    onClose={handlePopupClose}
    onUpdate={handleLimitsUpdate}
    sensor={sensor}
    setValues={setValues}
    role={role}
  />
)}

    </>
  );
}

export default ThresholdManipulate;
