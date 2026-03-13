import React, { useEffect } from 'react'
import ServicePopupComponent from './ServicePopupComponent'
import { FaPlus } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from 'react';
import ServiceFormPopup from '../serviceForm/ServiceFormPopup';
import { usePost } from '../../../../../hooks/usehttp';
import { useParams } from 'react-router-dom';
import { TbReload } from 'react-icons/tb';

function ServicePopup({ onClose }) {
    const [openServiceForm, setOpenServiceForm] = useState(false)
    const [formData, setFormData] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const { asset_id } = useParams();
      const [refreshCounter, setrefreshCounter] = useState(0)
    const { postRequest } = usePost();
    const accesToken = localStorage.getItem("token");
    const handleServiceFormPopup = () => {
        setOpenServiceForm(true);
    }
    const HandlecloseServiceFrom = () => {
        setOpenServiceForm(false)
    }

    useEffect(() => {
        const fetchForData = async () => {
            try {
                setIsLoading(true)
                const json = await postRequest(`/company/getserviceform/${asset_id}`, {}, accesToken
                )
                if (json.success) {
                    // console.log("Form Data fetched successfully!");
                    // console.log(json.data)
                    setFormData(json.data)

                } else {
                    console.error("API Error:", json.message || "Unknown error");
                }
            } catch (error) {
                setIsLoading(false)
                console.error("Error fetching formData:", error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchForData()
    }, [refreshCounter])

    return (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40">
            <div className="bg-white py-10 px-6 sm:py-20 sm:px-14 rounded-[14px] flex flex-col alertcontent gap-4 relative w-full max-w-[1200px] h-[90vh] min-h-[300px] max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center w-full">
                        <span className="text-[#000000] text-[28px] sm:text-[48px] font-[500]">Service</span>
                        <div className="flex justify-end items-end h-full">
                            <span className="bg-[#000000] rounded-[3px] flex text-[8px] sm:text-[10px] px-3 sm:px-4 text-white mb-1 sm:mb-4 ml-2 py-[1px]">
                                FORM
                            </span>
                        </div>
                    </div>
                    <IoMdCloseCircle color="red" className="cursor-pointer text-[24px] sm:text-[32px]" onClick={onClose} />
                </div>
                <div className="flex w-full justify-end items-center">
                    <TbReload className={`cursor-pointer ${isLoading ? "animate-spin" : ""}`} onClick={() => setrefreshCounter(prev => prev + 1)} />
                </div>
                {/* Content */}
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : formData?.length > 0 ? (
                        formData?.map((item, index) => (
                            <ServicePopupComponent key={index} data={item} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No Service Forms Found</p>
                    )}
                </div>

                {/* Optional Add Button */}
                {/* <div className='flex w-full justify-center items-center mt-5'>
      <span className='bg-[#000000] rounded-[9px] px-8 sm:px-[135px] text-white py-3 cursor-pointer' onClick={handleServiceFormPopup}>
        <FaPlus className='text-[12px]' />
      </span>
    </div> */}
            </div>

            {/* Optional Service Form Popup */}
            {/* {openServiceForm && (
    <ServiceFormPopup onClose={HandlecloseServiceFrom} />
  )} */}
        </div>

    )
}

export default ServicePopup
