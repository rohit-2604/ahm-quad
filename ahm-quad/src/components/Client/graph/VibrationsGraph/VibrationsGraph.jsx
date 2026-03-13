import React, { useEffect, useState } from 'react'
import Graph from '../Graph'
import { useClientContext } from '../../../../context/ClientStateContext'
import { usePost } from '../../../../hooks/usehttp';
import { useParams } from 'react-router-dom';

function VibrationsGraph({ DataReceivedFromSensor }) {
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);


  const [minValueForvibration_X, setMinValueForvibration_X] = useState(null);

  const [maxValueForvibration_X, setMaxValueForvibration_X] = useState(null);
  const [healthyValueForvibration_X, setHealthyValueForvibration_X] = useState();
  const [warningValueForvibration_X, setWarningValueForvibration_X] = useState();

  const [minValueForvibration_Y, setMinValueForvibration_Y] = useState(null);

  const [maxValueForvibration_Y, setMaxValueForvibration_Y] = useState(null);
  const [healthyValueForvibration_Y, setHealthyValueForvibration_Y] = useState();
  const [warningValueForvibration_Y, setWarningValueForvibration_Y] = useState();

  const [minValueForvibration_Z, setMinValueForvibration_Z] = useState(null);
  const [sensorData, setsensorData] = useState(null);
  const [maxValueForvibration_Z, setMaxValueForvibration_Z] = useState(null);
  const [healthyValueForvibration_Z, setHealthyValueForvibration_Z] = useState();
  const [warningValueForvibration_Z, setWarningValueForvibration_Z] = useState();
  const accesToken = localStorage.getItem("token");
  const { postRequest } = usePost();
  const { sensor_id } = useParams();
  const [Timestamp, setTimestamp] = useState([])
  const [GraphDataForVibrationX, setGraphDataForVibrationX] = useState([])
  const [GraphDataForVibrationY, setGraphDataForVibrationY] = useState([])
  const [GraphDataForVibrationZ, setGraphDataForVibrationZ] = useState([])
  const [GraphDataForPeak, setGraphDataForPeak] = useState([])

  const calculateVibration = (k) => {
    const f = 50;
    const result = (k / (2 * Math.PI * sensorData?.sensor_frequency)) * 1000;
    return Math.abs(parseFloat(result.toFixed(3)));
  };
  useEffect(() => {
    const fetshsensorDetails = async () => {
      try {
        const response = await postRequest(`/company/fetchonesensor/${sensor_id}`, {}, accesToken);
        if (response) {
          console.log(response)
          setsensorData(response.data);
        }
      } catch (error) {
        console.error("Error fetching sensor details:", error);
      }
    }
    fetshsensorDetails();
  }, [])
  useEffect(() => {
    if (DataReceivedFromSensor && sensorData) {
      setGraphDataForVibrationX(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: calculateVibration(DataReceivedFromSensor.
              vibration_x)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: calculateVibration(DataReceivedFromSensor.
            vibration_x)

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      setGraphDataForVibrationY(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: calculateVibration(DataReceivedFromSensor.
              vibration_y)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: calculateVibration(DataReceivedFromSensor.
            vibration_y)

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      setGraphDataForVibrationZ(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: calculateVibration(DataReceivedFromSensor.
              vibration_z)

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: DataReceivedFromSensor.
            vibration_z

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      const latestX = GraphDataForVibrationX.length > 0 ? GraphDataForVibrationX[GraphDataForVibrationX.length - 1].y : 0;
      const latestY = GraphDataForVibrationY.length > 0 ? GraphDataForVibrationY[GraphDataForVibrationY.length - 1].y : 0;
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



    //   const temperatureOne = DataReceivedFromSensor?.temperature_one

    ;
  //   const temperatureTwo = DataReceivedFromSensor?.temperature_two;
  const timeStamp = DataReceivedFromSensor?.timestamp;

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      sensorThresholdData.threshold_data?.forEach((data) => {
        if (data.type === "vibration_X") {
          setHealthyValueForvibration_X(data.healthy);
          setWarningValueForvibration_X(data.warning);
          setMinValueForvibration_X(data.min || 0);
          setMaxValueForvibration_X(data.max || 100);
        }
        else if (data.type === "vibration_Y") {
          setHealthyValueForvibration_Y(data.healthy);
          setWarningValueForvibration_Y(data.warning);
          setMinValueForvibration_Y(data.min || 0);
          setMaxValueForvibration_Y(data.max || 100);
        }
        else if (data.type === "vibration_Z") {
          setHealthyValueForvibration_Z(data.healthy);
          setWarningValueForvibration_Z(data.warning);
          setMinValueForvibration_Z(data.min || 0);
          setMaxValueForvibration_Z(data.max || 100);
        }

      });
    }
  }, [sensorThresholdData]);
  return (
    <div className='bg-[#FFFFFF] mb-2 w-full min-w-[400px] flex flex-col rounded-md items-center justify-center px-2 pb-12 pt-5'>
      <div className='flex flex-wrap'>
        <div className='flex flex-col justify-center items-center '>
          <Graph healthyValue={healthyValueForvibration_X} warningValue={warningValueForvibration_X} title={"Radial"} minValue={minValueForvibration_X} maxValue={maxValueForvibration_X} data={GraphDataForVibrationX
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph healthyValue={healthyValueForvibration_Y} warningValue={warningValueForvibration_Y} title={"Axial"} minValue={minValueForvibration_Y} maxValue={maxValueForvibration_Y} data={GraphDataForVibrationY
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph healthyValue={healthyValueForvibration_Z} warningValue={warningValueForvibration_Z} title={"Tangential"} minValue={minValueForvibration_Z} maxValue={maxValueForvibration_Z} data={GraphDataForVibrationZ
          } timestamp={Timestamp} />
        </div>
        <div className='flex flex-col justify-center items-center '>
          <Graph healthyValue={Math.max(healthyValueForvibration_X, healthyValueForvibration_Y, healthyValueForvibration_Z)} warningValue={Math.max(warningValueForvibration_X, warningValueForvibration_Y, warningValueForvibration_Z)} title={"Peak"} minValue={Math.max(minValueForvibration_X, minValueForvibration_Y, minValueForvibration_Z)} maxValue={Math.max(maxValueForvibration_X, maxValueForvibration_Y, maxValueForvibration_Z)} data={GraphDataForPeak
          } timestamp={Timestamp} />
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-2'>
        <div className='px-5 py-1 font-bold bg-[#EBEBEB] rounded-md'>Vibrations (mm/s)</div>
      </div>
    </div>
  )
}

export default VibrationsGraph
