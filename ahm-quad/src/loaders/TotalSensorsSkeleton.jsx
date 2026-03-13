import React from "react";

const TotalSensorsSkeleton = () => {
  return (
    <div className="bg-white rounded-[9px] flex-1 min-w-[300px] max-w-[100%] pb-10 flex flex-col pl-5 pr-5 pt-2.5 w-full">
      {/* Title Skeleton */}
      <div className="font-medium pt-3">
        <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse" />
      </div>

      {/* Count Box Skeleton */}
      <div className="w-full pt-3">
        <div className="p-4 bg-gray-200 rounded-[9px] flex gap-3 justify-center items-center animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
          <div className="h-6 w-12 bg-gray-300 rounded-md pt-1" />
        </div>
      </div>

      {/* Sensor Boxes Skeleton */}
      <div className="flex gap-2 mt-4">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[60px] bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default TotalSensorsSkeleton;
