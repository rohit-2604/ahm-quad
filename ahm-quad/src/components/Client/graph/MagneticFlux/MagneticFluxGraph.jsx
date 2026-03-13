import React, { useEffect, useState } from 'react'
import Graph from '../Graph'
import { useClientContext } from '../../../../context/ClientStateContext'

function MagneticFluxGraph({ DataReceivedFromSensor }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);

  const [minValueForMagneticFlux_X, setMinValueForMagneticFlux_X] = useState(null);
  const [maxValueForMagneticFlux_X, setMaxValueForMagneticFlux_X] = useState(null);
  const [healthyValueForMagneticFlux_X, setHealthyValueForMagneticFlux_X] = useState();
  const [warningValueForMagneticFlux_X, setWarningValueForMagneticFlux_X] = useState();

  const [minValueForMagneticFlux_Y, setMinValueForMagneticFlux_Y] = useState(null);
  const [maxValueForMagneticFlux_Y, setMaxValueForMagneticFlux_Y] = useState(null);
  const [healthyValueForMagneticFlux_Y, setHealthyValueForMagneticFlux_Y] = useState();
  const [warningValueForMagneticFlux_Y, setWarningValueForMagneticFlux_Y] = useState();

  const [minValueForMagneticFlux_Z, setMinValueForMagneticFlux_Z] = useState(null);
  const [maxValueForMagneticFlux_Z, setMaxValueForMagneticFlux_Z] = useState(null);
  const [healthyValueForMagneticFlux_Z, setHealthyValueForMagneticFlux_Z] = useState();
  const [warningValueForMagneticFlux_Z, setWarningValueForMagneticFlux_Z] = useState();

  const [Timestamp, setTimestamp] = useState([])
  const [GraphDataForMagneticFluxX, setGraphDataForMagneticFluxX] = useState([])
  const [GraphDataForMagneticFluxY, setGraphDataForMagneticFluxY] = useState([])
  const [GraphDataForVibrationZ, setGraphDataForVibrationZ] = useState([])
  const [GraphDataForPeak, setGraphDataForPeak] = useState([])



  useEffect(() => {
    if (DataReceivedFromSensor) {
      setGraphDataForMagneticFluxX(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: Math.abs(DataReceivedFromSensor.
              magnetic_flux_x)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: Math.abs(DataReceivedFromSensor.
            magnetic_flux_x)

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      setGraphDataForMagneticFluxY(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: Math.abs(DataReceivedFromSensor.
              magnetic_flux_y)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: Math.abs(DataReceivedFromSensor.
            magnetic_flux_y)

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      setGraphDataForVibrationZ(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: Math.abs(DataReceivedFromSensor.
              magnetic_flux_z)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: Math.abs(DataReceivedFromSensor.
            magnetic_flux_z)

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      const latestX = GraphDataForMagneticFluxX.length > 0 ? GraphDataForMagneticFluxX[GraphDataForMagneticFluxX.length - 1].y : 0;
      const latestY = GraphDataForMagneticFluxY.length > 0 ? GraphDataForMagneticFluxY[GraphDataForMagneticFluxY.length - 1].y : 0;
      const latestZ = GraphDataForVibrationZ.length > 0 ? GraphDataForVibrationZ[GraphDataForVibrationZ.length - 1].y : 0;
      const peakMagneticFlux = Math.max(latestX, latestY, latestZ);

      setGraphDataForPeak(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: peakMagneticFlux,
            x: DataReceivedFromSensor.timestamp || 0
          }];
        }
        return [...prev, {
          y: peakMagneticFlux,
          x: DataReceivedFromSensor.timestamp || 0
        }];
      });


      setTimestamp(prev => {
        // Same logic as temperatureOneArray, remove the first element if length is 50
        if (prev.length >= 20) {
          return [...prev.slice(1), DataReceivedFromSensor.timestamp];
        }
        return [...prev, DataReceivedFromSensor.timestamp];
      });
    }
  }, [DataReceivedFromSensor]);


  useEffect(() => {
    // // console.log(Timestamp)
    // // console.log(temperatureOneArray)
  }, [Timestamp])



  //   const temperatureOne = DataReceivedFromSensor?.temperature_one;
  //   const temperatureTwo = DataReceivedFromSensor?.temperature_two;
  const timeStamp = DataReceivedFromSensor?.timestamp;

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      sensorThresholdData.threshold_data?.forEach((data) => {

        if (data.type === "magnetic_flux_X") {
          setHealthyValueForMagneticFlux_X(data.healthy);
          setWarningValueForMagneticFlux_X(data.warning);
          setMinValueForMagneticFlux_X(data.min || 0);
          setMaxValueForMagneticFlux_X(data.max || 100);
        }
        if (data.type === "magnetic_flux_Y") {
          setHealthyValueForMagneticFlux_Y(data.healthy);
          setWarningValueForMagneticFlux_Y(data.warning);
          setMinValueForMagneticFlux_Y(data.min || 0);
          setMaxValueForMagneticFlux_Y(data.max || 100);
        }
        if (data.type === "magnetic_flux_Z") {
          setHealthyValueForMagneticFlux_Z(data.healthy);
          setWarningValueForMagneticFlux_Z(data.warning);
          setMinValueForMagneticFlux_Z(data.min || 0);
          setMaxValueForMagneticFlux_Z(data.max || 100);
        }
      });
    }
  }, [sensorThresholdData]);
  return (
    <div className='bg-[#FFFFFF] mb-2 w-auto min-w-[400px] flex flex-col rounded-md items-center justify-center px-2 pb-12 pt-5'>
      <div className='flex flex-wrap'>
        <div className='flex flex-col justify-center items-center '>
          <Graph warningValue={warningValueForMagneticFlux_X} healthyValue={healthyValueForMagneticFlux_X} title={"X Axis"} minValue={minValueForMagneticFlux_X} maxValue={maxValueForMagneticFlux_X} data={GraphDataForMagneticFluxX
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph warningValue={warningValueForMagneticFlux_Y} healthyValue={healthyValueForMagneticFlux_Y} title={"Y Axis"} minValue={minValueForMagneticFlux_Y} maxValue={maxValueForMagneticFlux_Y} data={GraphDataForMagneticFluxY
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph warningValue={warningValueForMagneticFlux_Z} healthyValue={healthyValueForMagneticFlux_Z} title={"Z Axis"} minValue={minValueForMagneticFlux_Z} maxValue={maxValueForMagneticFlux_Z} data={GraphDataForVibrationZ
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph warningValue={Math.max(warningValueForMagneticFlux_X, warningValueForMagneticFlux_Y, warningValueForMagneticFlux_Z)} healthyValue={Math.max(healthyValueForMagneticFlux_X, healthyValueForMagneticFlux_Y, healthyValueForMagneticFlux_Z)} title={"Peak"} minValue={Math.min(minValueForMagneticFlux_X, minValueForMagneticFlux_Y, minValueForMagneticFlux_Z)} maxValue={Math.max(maxValueForMagneticFlux_X, maxValueForMagneticFlux_Y, maxValueForMagneticFlux_Z)} data={GraphDataForPeak
          } timestamp={Timestamp} />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-2'>
        <div className='px-5 py-1 font-bold bg-[#EBEBEB] rounded-md'>Magnetic Flux (μT)</div>
      </div>
    </div>
  )
}

export default MagneticFluxGraph
