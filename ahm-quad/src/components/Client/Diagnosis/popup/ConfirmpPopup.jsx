import React from 'react'


function ConfirmpPopup({ setIsOpenPopup,reportId,deleteReport }) {
    const handleCancel = (e)=>{
        e.stopPropagation();
        setIsOpenPopup(false)
        // // console.log("cancel is clicked!!")
    }
    const handleDelete = (e)=>{
        e.stopPropagation();
        deleteReport(reportId)
        setIsOpenPopup(false)
    }
    return (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-[100%] h-[100%] top-0 left-0 z-40">
            <div className="bg-white py-10 px-14 rounded-[14px] flex flex-col justify-center items-center alertcontent gap-4 relative min-w-[800px]">
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-col justify-center items-center'>
                        <span className='text-2xl font-bold '>
                            Are You sure?
                        </span>
                        <span className='text-sm text-gray-500'>
                            Are you sure you want to delete this? This action is cannot be undone.
                        </span>
                       
                    </div>
                    <div className='flex justify-center items-center gap-10 mt-[30px] mb-[20px] '>
                        <div className='px-10 py-2 cursor-pointer border-solid border-2 border-black rounded-md text-Black font-semibold' onClick={handleCancel}>Cancel</div>
                        <div className='px-10 py-2 cursor-pointer bg-red-500 rounded-md text-white font-semibold' onClick={handleDelete}>Delete</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmpPopup
