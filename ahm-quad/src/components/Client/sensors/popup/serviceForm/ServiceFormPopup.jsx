import React, { useState } from 'react'
import { IoMdCloseCircle } from 'react-icons/io'
import { GoPlus } from "react-icons/go";
function ServiceFormPopup({ onClose }) {
    const [openOption, setOpenOption] = useState(false)
    const hnadleOpenOption = () => {
        setOpenOption(!openOption)

    }

    return (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40">
            <div className="bg-white py-20 px-14 rounded-[14px] flex flex-col  alertcontent gap-4 relative min-w-[1200px] h-[90vh]">
                <div className='flex justify-between'>
                    <div className='flex items-start justify-start w-full '>
                        <div className='flex justify-between'>
                            <span className='text-[#000000] text-[24px] font-[500] '>Create Service Form</span>

                        </div>

                    </div>
                    <IoMdCloseCircle color='red' className='cursor-pointer' onClick={onClose} />
                </div>
                <div className='flex w-full bg-[#E2EDFF] rounded-[4px] px-4 py-1'>
                    <span className='text-[24px] font-[500] text-black'>
                        FORM-1
                    </span>
                </div>


                {/* Option and suboption */}
                <div className='flex bg-[#F5F9FF] w-full  rounded-[6px] h-[200px]'>

                    <div className="flex flex-col w-full h-full">
                        <span className='text-black text-[24px] font-[500] flex items-start ml-6 mt-3'>
                            Field - 1
                        </span>

                        <div className='flex gap-16 w-full justify-center items-center h-full'>

                            <div className={`bg-[#000000] py-2 px-10 rounded-[9px] text-white text-[20px] font-[400] ${openOption ? "invisible":"visible"} flex justify-center items-center gap-2 cursor-pointer`}
                                onClick={hnadleOpenOption}>
                                <GoPlus />
                                Option                       
                                </div>
                            <div className={`bg-[#000000] py-2 px-10 rounded-[9px] text-white text-[20px] ${openOption ? "invisible":"visible"} flex justify-center items-center gap-2 font-[400] cursor-pointer`}>
                                <GoPlus />
                                Subfield
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className='flex justify-center items-center rounded-[6px] bg-[#2D81FF] w-[150px] text-white text-[20px] font-[400] py-2 cursor-pointer'>
                    <GoPlus />
                    Field
                </div>
            </div>
        </div>
    )
}

export default ServiceFormPopup
