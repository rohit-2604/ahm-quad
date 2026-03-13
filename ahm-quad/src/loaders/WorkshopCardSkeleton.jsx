import React from 'react'
import Skeleton from 'react-loading-skeleton'

const WorkshopCardSkeleton = () => {
  return (
    <div className="lg:ml-10 md:ml-10 mb-10 mt-2 flex md:px-0 lg:px-0 px-2">
      <div className="bg-white rounded-md w-full pb-[20px] clientCard flex flex-col p-3">
        <div className="flex flex-row relative select-none cardconimg">
          <Skeleton height={128} width={445} className="rounded-t-3xl px-4 pt-4 mb-1" highlightColor="#d1e6f9" />
          <div className="flex gap-[0.1rem] absolute top-[26px] right-[26px]">
            <Skeleton circle width={10} height={10} highlightColor="#d1e6f9" />
            <Skeleton circle width={10} height={10} highlightColor="#d1e6f9" />
            <Skeleton circle width={10} height={10} highlightColor="#d1e6f9" />
          </div>
        </div>

        <div className="flex flex-col ml-7 justify-center items-start">
          <div className="flex lg:flex-row flex-row md:flex-row mt-2 justify-between w-full">
            <Skeleton width={128} height={24} highlightColor="#d1e6f9" />
            <Skeleton width={96} height={24} highlightColor="#d1e6f9" />
          </div>

          <div className="flex w-full justify-start gap-5 mt-2">
            <Skeleton width={64} height={16} highlightColor="#d1e6f9" />
            <Skeleton width={64} height={16} highlightColor="#d1e6f9" />
          </div>

          <div className="flex md:flex-row flex-col justify-between w-full md:pr-[20px] pr-[15px] mt-4">
            <Skeleton width={128} height={16} highlightColor="#d1e6f9" />
            <Skeleton width={96} height={32} highlightColor="#d1e6f9" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkshopCardSkeleton
