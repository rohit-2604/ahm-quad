import React, { useEffect, useState } from 'react';
import ServiceDetailsPopup from './ServiceDetailsPopup';


function ServicePopupComponent({ data }) {

    const [ServicePopup, setServicePopup] = useState(false)
    const handleOpen = () => {
        setServicePopup(true);
    }
   

    useEffect(() => {
       
        // console.log(ServicePopup)
        //   // console.log(data)
    }, [ServicePopup])


    const formattedDate = new Date(data.date_of_maintainance).toLocaleDateString("en-IN");
    const formattedNextDate = new Date(data?.next_maintainance).toLocaleDateString("en-IN");
    // Runs when `openPopup` changes

    return (

        <div
            className='bg-[#E7F0FF] w-full rounded-[8px] py-[20px] px-8 flex justify-between cursor-pointer'
            onClick={handleOpen}
        >
            <span className='text-[24px] font-[500] text-black flex items-center'>FORM {data.service_id}</span>
            <div className='flex flex-col'>
                <span className='font-[500] text-[#525252] text-[15px] flex items-center justify-center'>{data.Type}</span>
                <span className='font-[500] text-[#525252] text-[15px] flex items-center justify-center'>{formattedDate}</span>
            </div>
            <div className='flex justify-center items-center'>
                <div className='flex flex-col'>
                    <span className='font-[500] text-[#525252] text-[15px] flex items-center justify-center'>Next Service Date</span>
                    <span className='font-[500] text-[#525252] text-[15px] flex items-center justify-center'>{formattedNextDate}</span>
                </div>
            </div>
            {ServicePopup && (
                <ServiceDetailsPopup setServicePopup={setServicePopup} formData={data} />
            )}
        </div>
    );
}

export default ServicePopupComponent;
