import React from 'react'
import Skeleton from 'react-loading-skeleton'

const AssetBgPicLoader = () => {
  return (
    <div className="relative">
    <Skeleton 
     className="w-[100%] md:h-[250px] lg:h-[250px] h-[100px] object-cover rounded-[10px] brightness-75  workshop_banner"
     highlightColor="#d1e6f9"
    />

    <Skeleton 
    className="absolute top-[10%] left-[1.75%] flex bg-black w-14 items-center justify-center rounded-[3px] text-white text-xs py-1 overflow-hidden"
    highlightColor="#d1e6f9"
    />
      
    
   

    {/* <Skeleton 
    className="absolute bottom-[10%] right-[2%]"
    highlightColor="#d1e6f9" />
      
 

    <Skeleton className="absolute bottom-[7%] left-[3%] flex items-center" highlightColor="#d1e6f9"/>
      <Skeleton className="text-[#fff] lg:text-[64px] text-[18px] font-semibold" highlightColor="#d1e6f9"/>
       

      <Skeleton className="ml-4 z-[2] flex rounded-md lg:text-xs text-[10px] items-center mt-4 bg-white w-[100%] text-black px-2 py-1 h-[28px] text-center font-bold justify-center "
      highlightColor="#d1e6f9"
      /> */}
       
     
   
  </div>
  )
}

export default AssetBgPicLoader
