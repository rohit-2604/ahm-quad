import React, { useEffect, useState } from 'react';
import Monitor from '../monitor/Monitor';
import { useClientContext } from '../../../../context/ClientStateContext';
import Lottie from 'react-lottie';
import sensorLoaderNew from "../../../../Lottie/sensorLoaderNew.json";
import Connecting from "../../../../Lottie/Connecting.json"

function Temperature({ DataReceivedFromSensor }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);
  const [minValueForSkin, setMinValueForSkin] = useState(null);
  const [maxValueForSkin, setMaxValueForSkin] = useState();
  const [healthyValueForSkin, setHealthyValueForSkin] = useState();
  const [warningValueForSkin, setWarningValueForSkin] = useState();

  const [minValueForBearing, setMinValueForBearing] = useState(null);
  const [maxValueForBearing, setMaxValueForBearing] = useState();
  const [healthyValueForBearing, setHealthyValueForBearing] = useState();
  const [warningValueForBearing, setWarningValueForBearing] = useState();

  const temperatureOne = DataReceivedFromSensor?.temperature_one;
  const temperatureTwo = DataReceivedFromSensor?.temperature_two;
console.log("Temperature Sensor Data:", DataReceivedFromSensor);
  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      // console.log("Change in temperature sensor threshold");

      sensorThresholdData.threshold_data?.forEach((data) => {
        if (data.type === "temperature_skin") {
          setHealthyValueForSkin(data.healthy);
          setWarningValueForSkin(data.warning);
          setMinValueForSkin(data.min || 0); 
          setMaxValueForSkin(data.max || 100); 
        }
        else if(data.type === "temperature_bearing") {
          setHealthyValueForBearing(data.healthy);
          setWarningValueForBearing(data.warning);
          setMinValueForBearing(data.min || 0); 
          setMaxValueForBearing(data.max || 100); 
        }
      });
    }
  }, [sensorThresholdData]);

  const sensorLoaderAnimation = {
    loop: true,
    autoplay: true,
    animationData: sensorLoaderNew,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const renderMonitorSection = () => (
    <div className='bg-[#FFFFFF] mb-2  lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10 w-full'>
      <div className='flex flex-col md:flex-row lg:flex-row'>
        <div className='flex flex-col justify-center items-center'>
          <Monitor  name={"Bearing"} value={temperatureOne} minValue={minValueForSkin} maxValue={maxValueForSkin} warning={warningValueForSkin} healthy={healthyValueForSkin} tooltipMsg={" These thresholds are as per IEEE841 standards or customer defined thresholds as per the requirement"}  />
        </div>
        <div className='flex flex-col justify-center items-center'>
          <Monitor  name={"Skin"} value={temperatureTwo} minValue={minValueForBearing} maxValue={maxValueForBearing} warning={warningValueForBearing} healthy={healthyValueForBearing} tooltipMsg={" These thresholds are as per IEEE841 standards or customer defined thresholds as per the requirement"} />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-5'>
        <div className='px-5 py-1 font-bold bg-[#EBEBEB] rounded-md'>Temperature (°C)</div>
      </div>
    </div>
  );

  const renderInactiveState = () => (
    <div className='bg-[#FFFFFF] mb-2  lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10 w-full'>
      <div className="flex flex-col justify-center items-center">
        <Lottie options={sensorLoaderAnimation} height={200} width={200} />
      </div>
      <p className="flex font-bold">INACTIVE</p>
      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md mt-10">Temperature (°C)</div>
    </div>
  );
  
  const ConnectingAnimation = {
    loop: true,
    autoplay: true,
    animationData: Connecting,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }
  const renderConnectingState = () => (
    <div className="bg-[#FFFFFF] mb-2  lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10 w-full">
      <div className="flex h-full min-h-[250px] items-center justify-center">
        <Lottie options={ConnectingAnimation} height={50} width={50}/>
        <p className="flex font-bold h-full items-center">Connecting...</p>
      </div>
      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">Temperature (°C)</div>
    </div>
  );

  return (
    <>
      {DataReceivedFromSensor?DataReceivedFromSensor.overall_health 
        ? ThresholdData ?maxValueForSkin
          ? renderMonitorSection()
          : renderConnectingState() 
        : renderInactiveState()
        : renderInactiveState():
        renderConnectingState()
      }
    </>
  );
}

export default Temperature;
