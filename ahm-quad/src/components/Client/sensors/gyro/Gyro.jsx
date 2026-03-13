import React, { useEffect, useState } from 'react';
import Monitor from '../monitor/Monitor';
import { useClientContext } from '../../../../context/ClientStateContext';
import sensorLoaderNew from "../../../../Lottie/sensorLoaderNew.json";
import Lottie from 'react-lottie';
import Connecting from "../../../../Lottie/Connecting.json"

function Gyro({ DataReceivedFromSensor }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);
  const [minValueForUltrasoundOne, setMinValueForUltrasoundOne] = useState(null);
  const [maxValueForUltrasoundOne, setMaxValueForUltrasoundOne] = useState();
  const [healthyValueForUltrasoundOne, setHealthyValueForUltrasoundOne] = useState();
  const [warningValueForUltrasoundOne, setWarningValueForUltrasoundOne] = useState();

    const [minValueForUltrasoundTwo, setMinValueForUltrasoundTwo] = useState(null);
  const [maxValueForUltrasoundTwo, setMaxValueForUltrasoundTwo] = useState();
  const [healthyValueForUltrasoundTwo, setHealthyValueForUltrasoundTwo] = useState();
  const [warningValueForUltrasoundTwo, setWarningValueForUltrasoundTwo] = useState();

  const ultraSoundOne = DataReceivedFromSensor?.ultrasound_one || 0;
  const ultrasoundTwo = DataReceivedFromSensor?.ultrasound_two || 0;

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      sensorThresholdData.threshold_data?.forEach((data) => {
        if (data.type === "ultrasound_one") {
          // console.log(data)
          setHealthyValueForUltrasoundOne(data.healthy);
          setWarningValueForUltrasoundOne(data.warning);
          setMinValueForUltrasoundOne(data.min || 0);
          setMaxValueForUltrasoundOne(data.max || 100);
        }
        else if (data.type === "ultrasound_two") {
          // console.log(data)
          setHealthyValueForUltrasoundTwo(data.healthy);
          setWarningValueForUltrasoundTwo(data.warning);
          setMinValueForUltrasoundTwo(data.min || 0);
          setMaxValueForUltrasoundTwo(data.max || 100);
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
    <div className='bg-[#FFFFFF]   lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10 w-full mt-5'>
      <div className='flex flex-col md:flex-row lg:flex-row'>
        {/* Ultra Sound Monitor */}
        <div className='flex flex-col justify-center items-center'>
          <Monitor value={ultraSoundOne} name={"Ultra Sound"} minValue={minValueForUltrasoundOne} maxValue={maxValueForUltrasoundOne} warning={warningValueForUltrasoundOne} healthy={healthyValueForUltrasoundOne} />
        </div>

        {/* Noise Monitor */}
        <div className='flex flex-col justify-center items-center'>
          <Monitor value={ultrasoundTwo} name={"Noise"} minValue={minValueForUltrasoundTwo} maxValue={maxValueForUltrasoundTwo} warning={warningValueForUltrasoundTwo} healthy={healthyValueForUltrasoundTwo} />
        </div>
      </div>

      {/* Acoustics Section */}
      <div className='flex flex-col justify-center items-center mt-5'>
        <div className='px-5 py-1 font-bold bg-[#EBEBEB] rounded-md'>Gyro</div>
      </div>
    </div>
  );

  const renderInactiveState = () => (
    <div className="bg-[#FFFFFF] mb-2 w-auto min-w-[425px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex flex-col justify-center items-center">
        <Lottie options={sensorLoaderAnimation} height={200} width={200} />
      </div>
      <p className="flex font-bold">INACTIVE</p>
      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md mt-10">Acoustics (dB)</div>
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
    <div className="bg-[#FFFFFF] mb-2 w-auto min-w-[425px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex h-full min-h-[250px] items-center ">
      <Lottie options={ConnectingAnimation} height={50} width={50}/>
      <p className="flex font-bold h-full items-center">Connecting</p>
      </div>
    
      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md ">Acoustics (dB)</div>
    </div>
  );

  return (
    <>
      {DataReceivedFromSensor?DataReceivedFromSensor.overall_health 
        ? ThresholdData ?maxValueForUltrasoundOne
          ? renderMonitorSection()
          : renderConnectingState() 
        : renderInactiveState()
        : renderInactiveState():
        renderConnectingState()
      }
    </>
  );
}

export default Gyro;
