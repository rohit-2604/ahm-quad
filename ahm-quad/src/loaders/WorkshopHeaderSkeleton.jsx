import React from 'react'
import Skeleton from 'react-loading-skeleton'

const WorkshopHeaderSkeleton = () => {
    return (
        <div className='flex justify-between mr-8'>
            <Skeleton className="flex flex-col px-8 lg:px-10 py-2 lg:mx-10 md:mx-10 mx-4 lg:mt-0 md:mt-0 mt-4 justify-between bg-gray-300" highlightColor="#d1e6f9"  />
            {/* <Skeleton className="flex justify-between items-center " highlightColor="#d1e6f9" /> */}
            {/* <Skeleton className="font-semibold text-[#4D4D4D] md:text-2xl lg:text-2xl text-lg" highlightColor="#d1e6f9" /> */}

            {/* <Skeleton className="align-middle" highlightColor="#d1e6f9" /> */}
            

            <Skeleton
                className="ml-auto mt-4 lg:mt-0 px-8 lg:px-12 py-2 custom-bg text-white font-bold rounded-md cursor-pointer flex items-center justify-center"
                highlightColor="#d1e6f9"
            />

        </div>
    )
}

export default WorkshopHeaderSkeleton
