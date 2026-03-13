import React from "react";
import { IoClose } from "react-icons/io5";
import ServiceUpdateComp from "../../../components/Client/dashboard/ServiceUpdate/ServiceUpdateComp";

function ServicePopup({ formData, onClose }) {
  return (
    <div className="fixed top-0 left-0 h-[100vh] w-[100vw] z-[400] flex justify-center items-center bg-[#1414145e] backdrop-blur-md">
      <div className="bg-white rounded-md max-h-[90vh] w-[35vw] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-black"
        >
          <IoClose />
        </button>
        <h2 className="text-lg font-semibold mb-4">All Service Updates</h2>
        <div className="flex flex-col gap-4">
          {formData.map((data, index) => (
            <ServiceUpdateComp key={index} formData={data} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicePopup;
