import React, { useState } from 'react'
import { FaCheckCircle } from "react-icons/fa";
import greenTick from "../../../../Lottie/greentick.json"
import loadingAnimationLottie from "../../../../Lottie/loading_machine_status.json"
import inactive from "../../../../Lottie/error.json"
import unHealthyAnimation from "../../../../Lottie/inactive.json"
import Lottie from 'react-lottie';
function MachineStatusComponent({ DataReceivedFromSensor }) {
  // // console.log(DataReceivedFromSensor)
  const loadingAnimation = {
    loop: false,
    autoplay: false,
    animationData: loadingAnimationLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }
  const unhealthyAnimation = {
    loop: false,
    autoplay: false,
    animationData: unHealthyAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }
  const inactiveAnimation = {
    loop: false,
    autoplay: false,
    animationData: inactive,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }
  const healthyAnimation = {
    loop: false,
    autoplay: false,
    animationData: greenTick,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [MachineOverallHealth, setMachineOverallHealth] = useState(DataReceivedFromSensor ? DataReceivedFromSensor.overall_health : null)
  return (
    <div
      className={`rounded-[4px] w-full  flex gap-2 py-8 justify-center items-center h-[50%] text-2xl font-[500]
    ${DataReceivedFromSensor
          ? DataReceivedFromSensor.overall_health === "Healthy"
            ? "bg-[#DFFFE2] text-[#3CAA46]" // Light green background and darker green text for healthy
            : DataReceivedFromSensor.overall_health === "Unhealthy"
              ? "bg-[#FFF3C2] text-[#D9A741]" // Light red background and darker red text for unhealthy
              : "bg-[#e7e7e7] text-[#A0A0A0]" // Grey background and text for inactive
          : "bg-[#eaefff] text-[#4570ff]" // Yellow background and text for loading
        }`}
    >
      <div className="flex items-center justify-center">
        <Lottie options={
          DataReceivedFromSensor
            ? DataReceivedFromSensor.overall_health === "Healthy"
              ? healthyAnimation // Healthy animation
              : DataReceivedFromSensor.overall_health === "Unhealthy"
                ? unhealthyAnimation // Unhealthy animation
                : inactiveAnimation // Inactive animation
            : loadingAnimation // Loading animation
        } height={60} width={60} />
      </div>

      {DataReceivedFromSensor
        ? DataReceivedFromSensor.overall_health
          ? DataReceivedFromSensor.overall_health==="Inactive"?
          "Turned off":DataReceivedFromSensor.overall_health:"Turned off"
        : "Connecting..."}
    </div>
  )
}

export default MachineStatusComponent
