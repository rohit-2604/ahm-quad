import React, { useState } from "react"
import { TbCheckupList } from "react-icons/tb";
import OverallHealthPopup from "./OverallHealthPopup";
import medicine from "../../../../assets/medicine.gif"

const OverallHealth = ({sensors,assetId,asset}) => {
    const [PopupOpen, setPopupOpen] = useState(false)
    if(sensors.length > 0) {
      return (
        <>
        <div className="  bg-blue-500  px-1 rounded-full py-1 mt-3 cursor-pointer flex justify-center items-center text-white" onClick={() => setPopupOpen(true)}>
     <img src={medicine} alt="Quick Analysis" width={30} className="rounded-full"/><p className="mx-2 text-[12px]">Quick Analysis</p>
        </div>
         {PopupOpen && <OverallHealthPopup asset={asset} setPopupOpen={setPopupOpen} sensors={sensors} assetId={assetId}/>}
        
        </>
       )
    }
    return (
      
     <></>
    )
 
}
export default OverallHealth