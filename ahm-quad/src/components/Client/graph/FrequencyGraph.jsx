import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const FrequencyGraph = ({ title }) => {
  // Assume data is an array of objects with x and y values for each data point, e.g.:
 const data = [{ x: '2024-01-01', y: 120 }, { x: '2024-02-01', y: 89 },]

  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: 'XYZ MOTORS',
        data: data 
      }
    ],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: title || 'Hertz  ',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: 'Price'
        },
      },
      xaxis: {
        type: 'datetime', // Works with x values formatted as datetime
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          }
        }
      }
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="area" height={350} />
      </div>
    </div>
  );
};

export default FrequencyGraph;
