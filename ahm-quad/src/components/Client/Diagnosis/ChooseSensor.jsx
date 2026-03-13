import React from 'react'

function ChooseSensor({ handleRangeDE, handleRangeNDE }) {
    return (
        <div className='flex flex-col items-center justify-center w-full h-[80vh]'>
            <div className='flex items-center justify-center w-full px-[500px] h-[80vh]'>
                <div className='flex flex-col items-center justify-center bg-white rounded-[0.7rem]  pb-16 pt-8  w-full'>
                    {/* Choose the Sensor text at the top-left */}
                    <div className='flex items-start justify-start w-full'>
                        <p className='flex whitespace-nowrap text-xl pl-10 font-semibold'>Choose the Sensor</p>
                    </div>

                    {/* Center the DE and NDE buttons */}
                    <div className='flex justify-center items-center w-full mt-10 pb-10'>
                        <div className='flex gap-10'>
                            <div className='bg-black px-12 py-2 text-white rounded-md cursor-pointer' onClick={handleRangeDE}>DE</div>
                            <div className='bg-black px-12 py-2 text-white rounded-md cursor-pointer' onClick={handleRangeNDE}>NDE</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Past reports positioned at the bottom-right */}
            <div className='relative w-full'>
                <div className='bg-black px-10 py-4 text-white rounded-md absolute bottom-4 right-4 cursor-pointer'>
                    Past reposts
                </div>
            </div>
        </div>
    )
}

export default ChooseSensor
