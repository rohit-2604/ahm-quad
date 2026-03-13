import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset } from './dataset/weather';


  
  const valueFormatter = (value) => `${value/100}hr`;
  
  const chartSetting = {
    yAxis: [
      {
        label: 'Time(Hour)',
        valueFormatter,
      
      },
    ],
    series: [{ dataKey: 'seoul', valueFormatter }],
    height:280,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

function SensorRunTimeGraph() {
  
  return (
    <div style={{ width: '100%' }}>
     
      <BarChart
        dataset={dataset}
        xAxis={[
          { scaleType: 'band', dataKey: 'month' },
        ]}
        {...chartSetting}
      />
    </div>
  )
}

export default SensorRunTimeGraph

