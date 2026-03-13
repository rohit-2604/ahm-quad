import React from 'react'
import Skeleton from 'react-loading-skeleton'

const AssetPageLoader = () => {
    return (
        <div className='flex justify-between gap-2'>
<div className="pl-4 flex justify-start">
<Skeleton className="lg:w-full flex justify-end mb-5 gap-3 " highlightColor="#ffff" />
            <Skeleton
                className="flex bg-blue-100 px-5 w-[150px] lg:w-[300px] items-center space-x-2 py-2 border rounded-md p-1"
                highlightColor="#ffff"
            />
</div>
<div className="w-full flex gap-4 justify-end">
            <Skeleton className="lg:w-full flex justify-end mb-5 gap-3 " highlightColor="#d1e6f9" />
            <Skeleton
                className="flex bg-white px-5 w-[150px] lg:w-[200px] items-center space-x-2 py-2 border rounded-md p-1"
                highlightColor="#d1e6f9"
            />
            {/* <Skeleton

                className="bg-white text-black w-[100px] lg:w-full"
                highlightColor="#d1e6f9"
            /> */}


            <Skeleton
                className="flex items-center bg-[#3481FF] text-white rounded-md cursor-pointer pl-3 pr-4 w-[100px] lg:w-[125px] lg:text-[16px] font-semibold h-[32px] mr-4 gap-3"
                highlightColor="#d1e6f9"
            />
            <Skeleton className="flex text-[12px] lg:text-[16px] flex-wrap " highlightColor="#d1e6f9" />
            {/* <Skeleton className="bg-white w-[19px] h-[19px] lg:w-[23px] lg:h-[23px] flex items-center justify-center rounded-[3px] ml-2" /> */}
            </div>
        </div>




    )
}

export default AssetPageLoader
