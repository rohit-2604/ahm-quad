import React, { useEffect, useState } from 'react'
import Graph from '../Graph'
import { useClientContext } from '../../../../context/ClientStateContext'

function AccousticGraph({DataReceivedFromSensor}) {
    const { sensorThresholdData } = useClientContext();
       const [ThresholdData, setThresholdData] = useState(1);

    const [minValueForUltrasoundOne, setMinValueForUltrasoundOne] = useState(null);
    const [maxValueForUltrasoundOne, setMaxValueForUltrasoundOne] = useState(null);
    const [healthyValueForUltrasoundOne, setHealthyValueForUltrasoundOne] = useState();
    const [warningValueForUltrasoundOne, setWarningValueForUltrasoundOne] = useState();
    const [minValueForUltrasoundTwo, setMinValueForUltrasoundTwo] = useState(null);
    const [maxValueForUltrasoundTwo, setMaxValueForUltrasoundTwo] = useState(null);
    const [healthyValueForUltrasoundTwo, setHealthyValueForUltrasoundTwo] = useState();
    const [warningValueForUltrasoundTwo, setWarningValueForUltrasoundTwo] = useState();
  
    const [Timestamp, setTimestamp] = useState([])
    const [GraphDataForUltraSound
, setGraphDataForUltraSound] = useState([])
    const [GraphDataForAudibleSound, setGraphDataForAudibleSound] = useState([])
  
  
    useEffect(() => {
      if (DataReceivedFromSensor) {
        setGraphDataForUltraSound(prev => {
          if (prev.length >= 20) {
            return [...prev.slice(1), {
              y: DataReceivedFromSensor.
              microphone_one
  
              , x: DataReceivedFromSensor.timestamp
            } || { y: 0, x: 0 }];
          }
          return [...prev, {
            y: DataReceivedFromSensor.
            microphone_one
  
            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }]
        })
        setGraphDataForAudibleSound(prev => {
          if (prev.length >= 20) {
            return [...prev.slice(1), {
              y: DataReceivedFromSensor.
              microphone_two
  
              , x: DataReceivedFromSensor.timestamp
            } || { y: 0, x: 0 }];
          }
          return [...prev, {
            y: DataReceivedFromSensor.
            microphone_two
  
            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }]
        })
  
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
  //  console.log(GraphDataForAudibleSound)
    }, [GraphDataForAudibleSound])
  
  
  
      //   const temperatureOne = DataReceivedFromSensor?.temperature_one
  
      ;
    //   const temperatureTwo = DataReceivedFromSensor?.temperature_two;
    const timeStamp = DataReceivedFromSensor?.timestamp;
  
    useEffect(() => {
        if (sensorThresholdData) {
          setThresholdData(prevSensorData => prevSensorData + 1);
          sensorThresholdData.threshold_data?.forEach((data) => {
            if (data.type === "microphone_one") {
              setHealthyValueForUltrasoundOne(data.healthy);
              setWarningValueForUltrasoundOne(data.warning);
              setMinValueForUltrasoundOne(data.min || 0);
              setMaxValueForUltrasoundOne(data.max || 100);
            }
            else if (data.type === "microphone_two") {
              setHealthyValueForUltrasoundTwo(data.healthy);
              setWarningValueForUltrasoundTwo(data.warning);
              setMinValueForUltrasoundTwo(data.min || 0);
              setMaxValueForUltrasoundTwo(data.max || 100);
            }
          });
        }
      }, [sensorThresholdData]);
    return (
      <div className='bg-[#FFFFFF] mb-2 w-auto min-w-[400px] flex flex-col rounded-md items-center justify-center px-2 pb-10 pt-5'>
        <div className='flex'>
          <div className='flex flex-col justify-center items-center '>
            <Graph warningValue={warningValueForUltrasoundOne} healthyValue={healthyValueForUltrasoundOne} title={"Mic 1"} minValue={minValueForUltrasoundOne} maxValue={maxValueForUltrasoundOne} data={GraphDataForUltraSound
            } timestamp={Timestamp} />
          </div>
          <div className='flex flex-col justify-center items-center '>
            <Graph warningValue={warningValueForUltrasoundTwo} healthyValue={healthyValueForUltrasoundTwo} title={"Mic 2"} minValue={minValueForUltrasoundTwo} maxValue={maxValueForUltrasoundTwo} data={GraphDataForAudibleSound
            } timestamp={Timestamp} />
          </div>
        </div>
        <div className='flex flex-col justify-center items-center mt-4'>
          <div className='px-5 py-1 font-bold bg-[#EBEBEB] rounded-md'>Acoustics (Hz)</div>
        </div>
      </div>
    )
  }

export default AccousticGraph
