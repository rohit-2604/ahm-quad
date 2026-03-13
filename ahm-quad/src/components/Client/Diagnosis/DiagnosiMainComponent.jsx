import React from 'react'
import graphWave from "../../../assets/assetsImg/graphWave.png"
function DiagnosiMainComponent({frequency}) {
    // console.log("Frequency:" + frequency)
    return (
        <div>
            <div className='bg-[#E5EFFF] flex w-full rounded-md pl-5 pr-14 py-2 justify-between
                        '>
                <div className='flex gap-10'>
                    <img src={graphWave} />
                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-[#595959] font-semibold'>Frequency</p>
                        <p className='text-black font-bold'>{frequency.frequency}</p>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-[#595959] font-semibold'>Radial</p>
                    <p className='text-black font-bold'>{frequency.radial.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-[#595959] font-semibold'>Tangential</p>
                    <p className='text-black font-bold'>{frequency.tangential.toFixed(2)}</p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-[#595959] font-semibold'>Axial</p>
                    <p className='text-black font-bold'>{frequency.axial.toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}

export default DiagnosiMainComponent
