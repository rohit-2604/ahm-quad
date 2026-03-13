import React from "react";

const SupervisorSkeleton = () => {
  return (
    <div className="bg-white rounded-[9px] pl-8 pr-8 pt-8 flex-1 min-w-[300px] max-w-[100%]">
      {/* Header */}
      <div className="flex justify-between gap-2 mb-3">
        <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse" />
        <div className="h-6 w-[87px] bg-gray-400 rounded-[3px] animate-pulse" />
      </div>

      {/* Skeleton List */}
      <div className="overflow-y-auto mb-2 h-[150px] flex flex-col gap-3">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorSkeleton;
