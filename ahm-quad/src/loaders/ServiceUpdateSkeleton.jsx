import React from "react";
import { FaGreaterThan } from "react-icons/fa";

const ServiceUpdateSkeleton = () => {
  return (
    <div className="bg-white rounded-[9px] pl-4 pt-7 w-full min-w-[300px] pb-10 pr-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="h-6 w-36 bg-gray-300 rounded-md animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
          <FaGreaterThan size={10} className="text-gray-400 animate-pulse" />
        </div>
      </div>

      {/* Skeleton Items */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="h-[1px] w-full bg-gray-100 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceUpdateSkeleton;
