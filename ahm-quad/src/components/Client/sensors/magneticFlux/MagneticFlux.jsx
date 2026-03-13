import React, { useEffect, useState } from 'react';
import Monitor from '../monitor/Monitor';
import { useClientContext } from '../../../../context/ClientStateContext';
import Lottie from 'react-lottie';
import sensorLoaderNew from "../../../../Lottie/sensorLoaderNew.json";
import Connecting from "../../../../Lottie/Connecting.json"

function MagneticFlux({ DataReceivedFromSensor }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);


  const [minValueForMagneticFlux_X, setMinValueForMagneticFlux_X] = useState();
  const [maxValueForMagneticFlux_X, setMaxValueForMagneticFlux_X] = useState();
  const [healthyValueForMagneticFlux_X, setHealthyValueForMagneticFlux_X] = useState();
  const [warningValueForMagneticFlux_X, setWarningValueForMagneticFlux_X] = useState();

  const [minValueForMagneticFlux_Y, setMinValueForMagneticFlux_Y] = useState();
  const [maxValueForMagneticFlux_Y, setMaxValueForMagneticFlux_Y] = useState();
  const [healthyValueForMagneticFlux_Y, setHealthyValueForMagneticFlux_Y] = useState();
  const [warningValueForMagneticFlux_Y, setWarningValueForMagneticFlux_Y] = useState();

  const [minValueForMagneticFlux_Z, setMinValueForMagneticFlux_Z] = useState();
  const [maxValueForMagneticFlux_Z, setMaxValueForMagneticFlux_Z] = useState();
  const [healthyValueForMagneticFlux_Z, setHealthyValueForMagneticFlux_Z] = useState();
  const [warningValueForMagneticFlux_Z, setWarningValueForMagneticFlux_Z] = useState();

  const valueX = Math.abs(DataReceivedFromSensor?.magnetic_flux_x) || 0;
  const valueY = Math.abs(DataReceivedFromSensor?.magnetic_flux_y) || 0;
  const valueZ = Math.abs(DataReceivedFromSensor?.magnetic_flux_z) || 0;
  const valuePeek = Math.abs(Math.max(valueX, valueY, valueZ));

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      sensorThresholdData.threshold_data?.forEach((data) => {
        // console.log(data)
        if (data.type === "magnetic_flux_X") {
          setHealthyValueForMagneticFlux_X(data.healthy);
          setWarningValueForMagneticFlux_X(data.warning);
          setMinValueForMagneticFlux_X(data.min || 0);
          setMaxValueForMagneticFlux_X(data.max || 100);
        }
        else if (data.type === "magnetic_flux_Y") {
          setHealthyValueForMagneticFlux_Y(data.healthy);
          setWarningValueForMagneticFlux_Y(data.warning);
          setMinValueForMagneticFlux_Y(data.min || 0);
          setMaxValueForMagneticFlux_Y(data.max || 100);
        }
        else if (data.type === "magnetic_flux_Z") {
          setHealthyValueForMagneticFlux_Z(data.healthy);
          setWarningValueForMagneticFlux_Z(data.warning);
          setMinValueForMagneticFlux_Z(data.min || 0);
          setMaxValueForMagneticFlux_Z(data.max || 100);
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
    <div className="bg-[#FFFFFF] mb-2 w-full lg:min-w-[400px] md:min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex flex-col">
        <div className="flex md:flex-row lg:flex-row flex-col">
          <div className="flex flex-col justify-center items-center">
            <Monitor value={valueX} name="X Axis" minValue={minValueForMagneticFlux_X} maxValue={maxValueForMagneticFlux_X} healthy={healthyValueForMagneticFlux_X} warning={warningValueForMagneticFlux_X} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Monitor value={valueY} name="Y Axis" minValue={minValueForMagneticFlux_Y} maxValue={maxValueForMagneticFlux_Y} healthy={healthyValueForMagneticFlux_Y} warning={warningValueForMagneticFlux_Y} />
          </div>
        </div>
        <div className="flex md:flex-row lg:flex-row flex-col">
          <div className="flex flex-col justify-center items-center">
            <Monitor value={valueZ} name="Z Axis" minValue={minValueForMagneticFlux_Z} maxValue={maxValueForMagneticFlux_Z} healthy={healthyValueForMagneticFlux_Z} warning={warningValueForMagneticFlux_Z} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Monitor value={valuePeek} name="Peak" minValue={Math.min(minValueForMagneticFlux_X, minValueForMagneticFlux_Y, minValueForMagneticFlux_Z)} maxValue={Math.max(maxValueForMagneticFlux_X, maxValueForMagneticFlux_Y, maxValueForMagneticFlux_Z)} healthy={Math.max(healthyValueForMagneticFlux_X, healthyValueForMagneticFlux_Y, healthyValueForMagneticFlux_Z)} warning={Math.max(warningValueForMagneticFlux_X, warningValueForMagneticFlux_Y, warningValueForMagneticFlux_Z)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-5">
        <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">Magnetic Flux (μT)</div>
      </div>
    </div>
  );

  const renderInactiveState = () => (
    <div className="bg-[#FFFFFF] mb-2 w-auto min-w-[400px] flex flex-col rounded-md items-center justify-center pb-10">
      <div className="flex flex-col justify-center items-center">
        <Lottie options={sensorLoaderAnimation} height={300} width={420} />
      </div>
      <p className="flex font-bold">INACTIVE</p>
      <div className="flex flex-col justify-center items-center mt-12">
        <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">Magnetic Flux (μT)</div>
      </div>
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
        <Lottie options={ConnectingAnimation} height={50} width={50} />
        <p className="flex font-bold h-full items-center">Connecting...</p>
      </div>

      <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md ">Magnetic Flux (μT)</div>
    </div>
  );

  return (
    <>
      {DataReceivedFromSensor ? DataReceivedFromSensor.overall_health
        ? ThresholdData ? maxValueForMagneticFlux_X
          ? renderMonitorSection()
          : renderConnectingState()
          : renderInactiveState()
        : renderInactiveState() :
        renderConnectingState()
      }
    </>
  );
}

export default MagneticFlux;
