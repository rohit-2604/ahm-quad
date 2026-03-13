import React from "react";

const SkeletonCard = () => (
  <div className="bg-gray-200 animate-pulse rounded-[4px] h-[111px] w-full md:w-[32%] min-w-[100px]" />
);

const WorkshopSkeleton = () => {
  return (
    <div className="flex-1 w-full">
      <div className="bg-white rounded-[9px] w-full h-full pr-5 pt-4 pb-[38px] pl-6 mr-2 flex flex-col min-w-[300px]">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="font-medium text-[20px] pb-[30px] pt-4">
            Workshops
          </div>
          <div className="bg-gray-300 animate-pulse w-[62px] h-[18px] rounded-[3px]" />
        </div>

        {/* Cards */}
        <div className="flex gap-3 md:flex-nowrap flex-wrap w-full md:flex-row flex-col">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <div className="bg-gray-200 animate-pulse border-[1px] border-gray-300 rounded-[4px] h-[111px] w-full md:w-[32%] flex items-center justify-center flex-col" />
        </div>
      </div>
    </div>
  );
};

export default WorkshopSkeleton;
