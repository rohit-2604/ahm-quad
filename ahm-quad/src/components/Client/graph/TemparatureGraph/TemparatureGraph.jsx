import React, { useEffect, useState } from 'react'
import Graph from '../Graph'
import { useClientContext } from '../../../../context/ClientStateContext'
function TemparatureGraph({ DataReceivedFromSensor }) {
  // console.log(DataReceivedFromSensor)
  const { sensorThresholdData } = useClientContext();
  const [ThresholdData, setThresholdData] = useState(1);
  const [minValueForTempSkin, setMinValueForTempSkin] = useState(null);
  const [maxValueForTempSkin, setMaxValueForTempSkin] = useState(null);
  const [healthyValueForTempSkin, setHealthyValueForTempSkin] = useState();
  const [warningValueForTempSkin, setWarningValueForTempSkin] = useState();

  const [minValueForTempBearing, setMinValueForTempBearing] = useState(null);
  const [maxValueForTempBearing, setMaxValueForTempBearing] = useState(null);
  const [healthyValueForTempBearing, setHealthyValueForTempBearing] = useState();
  const [warningValueForTempBearing, setWarningValueForTempBearing] = useState();

  const [Timestamp, setTimestamp] = useState([])
  const [GraphDataForTemperatureOne
    , setGraphDataForTemperatureOne] = useState([])
  const [GraphDataForTemperatureTwo, setGraphDataForTemperatureTwo] = useState([])

// console.log(sensorThresholdData)
  useEffect(() => {
    if (DataReceivedFromSensor) {
      setGraphDataForTemperatureOne(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: DataReceivedFromSensor.
              temperature_one

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: DataReceivedFromSensor.
            temperature_one

          , x: DataReceivedFromSensor.timestamp
        } || { y: 0, x: 0 }]
      })
      setGraphDataForTemperatureTwo(prev => {
        if (prev.length >= 20) {
          return [...prev.slice(1), {
            y: DataReceivedFromSensor.
              temperature_two

            , x: DataReceivedFromSensor.timestamp
          } || { y: 0, x: 0 }];
        }
        return [...prev, {
          y: DataReceivedFromSensor.
            temperature_two

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
    // // console.log(temperatureOneArray)
  }, [Timestamp])



    //   const temperatureOne = DataReceivedFromSensor?.temperature_one

    ;
  //   const temperatureTwo = DataReceivedFromSensor?.temperature_two;
  const timeStamp = DataReceivedFromSensor?.timestamp;

  useEffect(() => {
    if (sensorThresholdData) {
      setThresholdData(prevSensorData => prevSensorData + 1);
      // // console.log("Change in temperature sensor threshold");

      sensorThresholdData.threshold_data?.forEach((data) => {
        if (data.type === "temperature_skin") {
          setHealthyValueForTempSkin(data.healthy);
          setWarningValueForTempSkin(data.warning);
          setMinValueForTempSkin(data.min || 0);
          setMaxValueForTempSkin(data.max || 100);
        }
        else if (data.type === "temperature_bearing") {
          setHealthyValueForTempBearing(data.healthy);
          setWarningValueForTempBearing(data.warning);
          setMinValueForTempBearing(data.min || 0);
          setMaxValueForTempBearing(data.max || 100);

        }
      });
    }
  }, [sensorThresholdData]);
  return (
    <div className="bg-[#FFFFFF] mb-1 w-full min-w-[400px] flex flex-col rounded-md items-center justify-center px-3 py-4">
      <div className="flex gap-24 justify-between items-center">
        <div className="flex flex-col justify-center items-center w-full lg:w-[48%]">
          <Graph
            title={"Bearing"}
            minValue={minValueForTempSkin}
            maxValue={maxValueForTempSkin}
            data={GraphDataForTemperatureOne}
            timestamp={Timestamp}
            healthyValue={healthyValueForTempSkin}
            warningValue={warningValueForTempSkin}
          />
        </div>
        <div className="flex flex-col justify-center items-center ">
          <Graph
            title={"Skin"}
            minValue={minValueForTempBearing}
            maxValue={maxValueForTempBearing}
            data={GraphDataForTemperatureTwo}
            timestamp={Timestamp}
            healthyValue={healthyValueForTempBearing}
            warningValue={warningValueForTempBearing}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-4 ">
        <div className="px-5 py-1 font-bold bg-[#EBEBEB] rounded-md">
          Temperature (°C)
        </div>
      </div>
    </div>
  )
}

export default TemparatureGraph
