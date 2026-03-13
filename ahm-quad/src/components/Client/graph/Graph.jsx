import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const Graph = ({ data, minValue, maxValue, title,warningValue,healthyValue }) => {
  const XAXISRANGE = 10000; 
  const [MinValueContainer, setMinValueContainer] = useState(minValue)
  const [MaxValueContainer, setMaxValueContainer] = useState(maxValue)
  const [GraphColor, setGraphColor] = useState("#FF5733")
  useEffect(() => {
    if(maxValue){
   setMaxValueContainer(maxValue)
    }
    if(minValue!=null){
   setMinValueContainer(minValue)
    }
  }, [maxValue,minValue])
  

  
  const [series, setSeries] = useState([
    {
      name: title, 
      data: [], 
    },
  ]);

  useEffect(() => {
  //  // console.log(data)
  }, [data, minValue, maxValue])
  

  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  useEffect(() => {
    if (MaxValueContainer) {
      setOptions({
        chart: {
          id: 'realtime',
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
             dynamicAnimation: { speed: 500 },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false, 
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          
        },
        colors: [GraphColor],
        title: {
          text: title || 'Dynamic Updating Chart',
          align: 'left',
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: 'datetime',
          range: XAXISRANGE,
          labels: {
            formatter: function (value) {
              const date = new Date(value);
              // 24-hour format
              return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, 
              });
            },
            style: {
              fontSize: '10px', 
            },
          },
        },
        yaxis: {
          max: MaxValueContainer, 
          min: MinValueContainer, 
          labels: {
            formatter: function (value) {
              return Math.floor(value); 
            },
            style: {
              fontSize: '10px', 
            },
          }
        },
        legend: {
          show: false,
        },
      });
      data.forEach((e) => {
        if(e.y>=healthyValue && e.y<=warningValue) {
          setGraphColor("#2ECC71")
        }
        // else if(e.y<=warningValue && e.y>=healthyValue) {
        //   setGraphColor("#FAAF0C")
        // }
        else if(e.y>=warningValue) {
          setGraphColor("#FF5733")
        }
        setMinValueContainer(e.y - 100);
        setMaxValueContainer(e.y + 100);

      });
    }
  }, [MaxValueContainer, title, XAXISRANGE, MinValueContainer,data]);

  const [options, setOptions] = useState(null);

  const addNewData = () => {
    const nextDataPoint = {
      x: new Date().getTime(), 
      y: data[currentDataIndex].y, 
    };

  
    setSeries((prevSeries) => [
      {
        name: title,
        data: [...prevSeries[0].data, nextDataPoint], 
      },
    ]);

   
    setCurrentDataIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      addNewData(); 
    }, 500);

    return () => clearInterval(interval);
  }, [data, currentDataIndex]);

  return (
    <div>
      <div id="chart">
        {options ? (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={200}
            width={180}
          />
        ) : (
          ''
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Graph;
