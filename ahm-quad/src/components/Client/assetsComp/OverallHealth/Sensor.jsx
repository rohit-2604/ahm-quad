import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";
const Sensor = ({ sensor }) => {
  const [copiedItem, setCopiedItem] = useState(null);
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };
  return (
    <div>
      <div
        key={sensor.sensor_id}
        className="rounded-[5px]  border-blue-400 min-w-[300px] px-5 border-[2px] p-2"
      >
        <div className="font-semibold text-[14px] mb-3">
          {sensor.sensor_type}
        </div>
        <div className="flex items-start justify-start w-full">
          <div className="text-[#737373] font-normal text-[9px]">
            Sensor Id
          </div>
          <div className="text-[8px] font-normal ml-1 flex items-center">
            - {sensor.sensor_id}
            <div
              className="ml-2 text-gray-500 cursor-pointer"
              onClick={() => handleCopy(sensor.sensor_id, sensor.sensor_id)}
            >
              <MdContentCopy />
            </div>
            {copiedItem === sensor.sensor_id && (
              <span className="ml-2 text-green-500 text-[9px]">Copied!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sensor;
