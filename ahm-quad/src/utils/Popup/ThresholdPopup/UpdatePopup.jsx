// import React, { useState } from "react";
// import { RxCross2 } from "react-icons/rx";

// function UpdatePopup({
//   onClose,
//   initialMin,
//   initialMax,
//   onUpdateValues,
//   type,
// }) {
//   const [minValue, setMinValue] = useState(initialMin);
//   const [maxValue, setMaxValue] = useState(initialMax);

//   const handleConfirm = () => {
//     if (minValue < maxValue) {
//       onUpdateValues(minValue, maxValue);
//       onClose();
//     } else {
//       alert("Minimum value should be less than the maximum value.");
//     }
//   };

//   return (
//     <div className=" fixed top-0 left-0 h-[100vh] w-[100vw] z-[400] flex justify-center items-center bg-[#1414145e] backdrop-blur-md alertcontainer">
//       <div className="alertcontent bg-[#ffffff] rounded-md flex  justify-start items-start px-[2%] py-10 flex-col gap-1">
//         <div className="flex justify-between items-center mb-5 w-full">
//           <div className="text-[#7B7B7B] font-medium text-[32px] flex">
//             {type}
//           </div>
//           <button
//             className="bg-red-500 text-white hover:bg-red-600 rounded-full p-1 flex"
//             onClick={onClose}
//           >
//             <RxCross2 size={10} />
//           </button>
//         </div>

//         <div className="mb-6">
//           <label className="font-medium text-[18px]">Minimum</label>
//           <input
//             type="number"
//             className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter minimum value"
//             value={minValue}
//             onChange={(e) => setMinValue(Number(e.target.value))}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="font-medium text-[18px]">Maximum</label>
//           <input
//             type="number"
//             className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter maximum value"
//             value={maxValue}
//             onChange={(e) => setMaxValue(Number(e.target.value))}
//           />
//         </div>

//         <div className="w-full flex justify-end">
//           <button
//             className="px-6 py-2 bg-[#3C85FF] flex justify-end text-white rounded hover:bg-blue-600"
//             onClick={handleConfirm}
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UpdatePopup;

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { usePost } from "../../../hooks/usehttp";
import { useParams } from "react-router-dom";
import { useClientContext } from "../../../context/ClientStateContext";

function UpdatePopup({ onClose, currentMin, currentMax, onUpdate, sensor, role, fixedLimits, setFixedLimits, setValues }) {
  const { sensor_id } = useParams();
  const { sensorThresholdData, setsensorThresholdData } = useClientContext();
  const [minValue, setMinValue] = useState(currentMin);
  const [maxValue, setMaxValue] = useState(currentMax);
  const [validationError, setValidationError] = useState(null);
  const accessToken = localStorage.getItem("token");
  const [Error, setError] = useState()

  const { postRequest, isLoading, error } = usePost();

  const healthy = sensor.healthy;
  const type = sensor.type;
  const warning = sensor.warning;

  const handleConfirm = async () => {
    if (minValue < maxValue) {


      try {
        const data = {
          type,
          healthy: minValue + 1,
          warning: maxValue - 1,
          min: minValue,
          max: maxValue,
        };

        const response = await postRequest(
          `/${role}/updatethresold/${sensor_id}`,
          data,
          accessToken
        );

        if (response) {
          onUpdate(minValue, maxValue);
          setValues([minValue + 1, maxValue - 1])
          let newThresholdData = {
            ...sensorThresholdData,
            threshold_data: sensorThresholdData.threshold_data.map((data) => {
              if (data.type === type) {
                return {
                  ...data,
                  min: minValue,
                  max: maxValue,
                  warning: maxValue - 1,
                  healthy: minValue + 1,
                };
              }
              return data;
            }),
          };

          setsensorThresholdData(newThresholdData);

          onClose();
        } else {
          setError("Failed to update sensor thresholds.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    } else {
      setError("Minimum value should be less than the maximum value.");
    }
  };

  const handleMinChange = (e) => {
    const value = parseFloat(e.target.value);
    console.log(value)
    setMinValue(value);
    // if (value >= 0 && value <= maxValue - 5) {
    //   setMinValue(value);
    //   setValidationError(null);
    // } else {
    //   setValidationError(
    //     "Minimum value must be at least 5 units less than the maximum value."
    //   );
    // }
  };

  const handleMaxChange = (e) => {
    const value = parseFloat(e.target.value);
    setMaxValue(value);
    // if (value >= 0 && value >= minValue + 5) {
    //   setMaxValue(value);
    //   setValidationError(null);
    // } else {
    //   setValidationError(
    //     "Maximum value must be at least 5 units greater than the minimum value."
    //   );
    // }
  };

  return (
    <div className="fixed top-0 left-0 h-[100vh] w-[100vw] z-[400] flex justify-center items-center bg-[#1414145e] backdrop-blur-md alertcontainer">
      <div className="alertcontent bg-white rounded-md flex flex-col px-6 py-8 gap-4 w-full max-w-[400px] mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 w-full ">
          <div className="text-[#7B7B7B] font-medium text-[24px] sm:text-[32px]">{type}</div>
          <button
            className="bg-red-500 text-white hover:bg-red-600 rounded-full p-1 flex items-center"
            onClick={onClose}
          >
            <RxCross2 size={13} />
          </button>
        </div>

        {/* Minimum Input */}
        <div className="mb-4">
          <label className="font-medium text-[16px] sm:text-[18px]">Minimum</label>
          <input
            type="number"
            className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            placeholder="Enter minimum value"
            value={minValue}
            onChange={handleMinChange}
          />
        </div>

        {/* Maximum Input */}
        <div className="mb-4">
          <label className="font-medium text-[16px] sm:text-[18px]">Maximum</label>
          <input
            type="number"
            className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            placeholder="Enter maximum value"
            value={maxValue}
            onChange={handleMaxChange}
          />
        </div>

        {/* Validation/Error Messages */}
        {validationError && (
          <div className="text-red-500 text-sm mb-2">{validationError}</div>
        )}
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {Error && <div className="text-red-500 text-sm mb-2">{Error}</div>}

        {/* Confirm Button */}
        <div className="w-full flex justify-end">
          <button
            className={`px-5 py-2 text-white rounded text-sm sm:text-base ${validationError
                ? "cursor-not-allowed bg-[#3c83ffb4]"
                : "bg-[#3C85FF] hover:bg-blue-600"
              } ${isLoading ? "bg-gray-400" : ""}`}
            onClick={handleConfirm}
            disabled={isLoading || validationError}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>

  );
}

export default UpdatePopup;
