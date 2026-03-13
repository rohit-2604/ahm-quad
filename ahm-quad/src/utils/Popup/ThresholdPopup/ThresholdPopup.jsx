import React, { useState } from "react";
import ThresholdManipulate from "./ThresholdManipulate";
import { MdCancel } from "react-icons/md";
import { useClientContext } from "../../../context/ClientStateContext";

function ThresholdPopup({
  onClose,
  sensorThresholdData = {},
  role,
  updateMode,
}) {
  // const { sensorThresholdData } = useClientContext();

  // // console.log(role,"threshold role");
  // // console.log(sensorThresholdData);
  const thresholds = sensorThresholdData.threshold_data || [];
  return (
    <div className=" fixed top-0 left-0 h-[100vh] w-[100vw] z-[400] flex justify-center items-center bg-[#1414145e] backdrop-blur-md alertcontainer overflow-y-auto p-[20px]">
      <div className="alertcontent bg-[#ffffff] rounded-md lg:min-w-[800px] flex h-[90vh] justify-start items-start px-[2%] py-10 flex-col gap-1 overflow-y-auto">
        <div className="flex justify-between w-full">
          <div className="text-[#696969] font-medium text-[32px]">
            Sensor Threshold
          </div>
          <div onClick={onClose}>
            <MdCancel color="red" className="cursor-pointer" size={21} />
          </div>
        </div>
        {thresholds.map((sensor, index) => (
          <ThresholdManipulate
            key={index}
            sensor={sensor}
            role={role}
            updateMode={updateMode}
          />
        ))}
      </div>
    </div>
  );
}

export default ThresholdPopup;
