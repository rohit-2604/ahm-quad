import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin,
  Filler
);

const ReportGraph = ({ graphData, axisname = 'Values', limit = {} }) => {
  const { timestamp, ...dataPoints } = graphData;

  const colorPalette = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
  ];

  const datasets = Object.keys(dataPoints).map((key, index) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    data: dataPoints[key],
    borderColor: colorPalette[index % colorPalette.length],
    backgroundColor: `${colorPalette[index % colorPalette.length]}33`,
    borderWidth: 2.5,
    pointRadius: 4,
    fill: false,
  }));

  const data = {
    labels: timestamp.map((t) => new Date(t).toLocaleTimeString()),
    datasets,
  };

  const parsedLimits = Object.fromEntries(
    Object.entries(limit).map(([key, value]) => [key, parseFloat(value)])
  );

  const { min, healthy, warning, max } = parsedLimits;

  const annotations = {};

  // Shaded zones only (no horizontal lines)
  if (!isNaN(min) && !isNaN(healthy)) {
  annotations['box_pre_healthy'] = {
    type: 'box',
    yMin: min,
    yMax: healthy,
    backgroundColor: 'rgba(255, 255, 0, 0.1)', // 🟡 Yellow
  };
}

if (!isNaN(healthy) && !isNaN(warning)) {
  annotations['box_healthy'] = {
    type: 'box',
    yMin: healthy,
    yMax: warning,
    backgroundColor: 'rgba(0, 255, 0, 0.1)', // 🟢 Green
  };
}

if (!isNaN(warning) && !isNaN(max)) {
  annotations['box_danger'] = {
    type: 'box',
    yMin: warning,
    yMax: max,
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // 🔴 Red
  };
}


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
      annotation: {
        annotations,
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        title: {
          display: true,
          text: axisname,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

ReportGraph.propTypes = {
  graphData: PropTypes.shape({
    timestamp: PropTypes.arrayOf(PropTypes.string).isRequired,
    [PropTypes.string]: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  axisname: PropTypes.string,
  limit: PropTypes.shape({
    min: PropTypes.string,
    healthy: PropTypes.string,
    warning: PropTypes.string,
    max: PropTypes.string,
  }),
};

export default ReportGraph;
