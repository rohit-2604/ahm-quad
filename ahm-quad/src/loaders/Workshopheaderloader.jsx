import Skeleton from "react-loading-skeleton";
import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

function Workshopheaderloader() {
  return (
    <div className="relative w-[100%] h-[18%] bg-[#F5F5F5] rounded-[9px] mb-4 pt-1 pl-2 pr-1">
      <div className="w-full mt-2">
        <Skeleton
          height={225}
          width={1750}
          className="w-full rounded-xl object-cover"
        />
      </div>

      <div className="absolute top-[20%] left-[3%]">
        <Skeleton width={56} height={20} className="rounded-[3px]" />
      </div>

      <div className="absolute top-[15%] right-[3%] flex gap-0.5 cursor-pointer">
        <Skeleton circle width={8} height={8} />
        <Skeleton circle width={8} height={8} />
        <Skeleton circle width={8} height={8} />
      </div>

      <div className="absolute bottom-[15%] right-[3%]">
        <Skeleton circle width={20} height={20} />
      </div>

      <div className="absolute top-[60%] left-[5%] flex items-center">
        <Skeleton width={150} height={64} className="mr-4" />

        {/* Workshop ID */}
        <Skeleton width={80} height={28} className="rounded-md" />
      </div>
    </div>
  );
}

export default Workshopheaderloader;
