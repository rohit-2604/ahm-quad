import React from "react";

const TrendPopupSkeleton = () => {
  return (
    <div className="bg-white rounded-[9px] flex-1 min-w-[300px] max-w-[100%] pb-10 flex flex-col pl-2 pr-2 w-full">
      {/* Title Skeleton */}
      <div className="font-medium pt-3">
        <div className="h-14 w-full bg-gray-300 rounded-md animate-pulse" />
      </div>

      {/* Repeating Skeleton Boxes */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <div key={index} className="w-full pt-3">
          <div className="h-14 w-full bg-gray-300 rounded-md animate-pulse" />
        </div>
      ))}

      <div className="font-medium gap-4 items-center justify-center flex pt-3">
        <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse" />
        <div className="h-8 w-20 bg-gray-300 rounded-md animate-pulse" />
      </div>
    </div>
  );
};

export default TrendPopupSkeleton;
