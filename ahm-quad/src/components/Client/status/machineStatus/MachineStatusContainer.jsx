import React from 'react'
import MachineStatusComponent from './MachineStatusComponent'

function MachineStatusContainer({DataReceivedFromSensor}) {
// // console.log(DataReceivedFromSensor)
  return (
    <div className='bg-white mt-3  pt-5 pb-6 px-6 rounded-[7px] w-full '>
      <p className='font-[500] '>Machine Status</p>
      <div className=' flex justify-center items-center h-full'>
        <MachineStatusComponent DataReceivedFromSensor={DataReceivedFromSensor}/>
      </div>
    </div>
  )
}

export default MachineStatusContainer
