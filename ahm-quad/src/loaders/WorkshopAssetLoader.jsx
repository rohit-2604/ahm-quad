import Skeleton from "react-loading-skeleton";
import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

function WorkshopAssetLoader() {
  return (
    <div className="flex overflow-hidden flex-wrap relative">
      <div className="relative ">
        <Skeleton
          className=" mr-5 mb-10 mt-8 w-[28%] min-w-[500px] max-w-[500px] h-[370px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />

        <Skeleton
          className="absolute bg-[#EBEBEB] top-12 right-8  w-[112px] h-[29px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-28 bg-[#EBEBEB] right-40  w-[208px] h-[180px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-[205px] bg-[#EBEBEB] left-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bg-[#EBEBEB] top-[190px] right-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bottom-[180px] bg-[#EBEBEB] right-[19%]  w-[322px] h-[39px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
      </div>
      <div className="relative ml-10">
        <Skeleton
          className=" mr-5 mb-10 mt-8 w-[28%] min-w-[500px] max-w-[500px] h-[370px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />

        <Skeleton
          className="absolute bg-[#EBEBEB] top-12 right-8  w-[112px] h-[29px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-28 bg-[#EBEBEB] right-40  w-[208px] h-[180px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-[205px] bg-[#EBEBEB] left-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bg-[#EBEBEB] top-[190px] right-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bottom-[180px] bg-[#EBEBEB] right-[19%]  w-[322px] h-[39px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
      </div>
      <div className="relative ml-10">
        <Skeleton
          className=" mr-5 mb-10 mt-8 w-[28%] min-w-[500px] max-w-[500px] h-[370px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />

        <Skeleton
          className="absolute bg-[#EBEBEB] top-12 right-8  w-[112px] h-[29px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-28 bg-[#EBEBEB] right-40  w-[208px] h-[180px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute top-[205px] bg-[#EBEBEB] left-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bg-[#EBEBEB] top-[190px] right-8  w-[69px] h-[28px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
        <Skeleton
          className="absolute bottom-[180px] bg-[#EBEBEB] right-[19%]  w-[322px] h-[39px] rounded-[9px]"
          highlightColor="#d1e6f9"
        />
      </div>
      
    </div>
  );
}

export default WorkshopAssetLoader;
