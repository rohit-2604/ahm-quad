import React, { useRef, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
  annotationPlugin
);

const COLORS = [
  "#FF5733", // Deep Orange-Red
  "#33A1FF", // Medium Blue
  "#8E44AD", // Dark Purple
  "#2ECC71", // Emerald Green
  "#34495E", // Slate Gray
  "#1B2631", // Deep Navy
  "#5D6D7E", // Muted Steel Blue
  "#7D3C98", // Rich Violet
  "#922B21", // Dark Red
  "#117864", // Teal Green
  "#273746", // Charcoal Blue
  "#784212", // Brownish Bronze
  "#566573", // Graphite Gray
  "#6C3483", // Deep Amethyst
  "#212F3C"  // Near-Black
];


const TrendDiffGraph = ({
  pasttimestamp = [],
  futuretimestamp = [],
  pasandfururedatapairs = [],
  axisname = ""
}) => {
  const chartRef = useRef();

  const pastDates = useMemo(() => pasttimestamp.map(ts => new Date(ts)), [pasttimestamp]);
  const futureDates = useMemo(() => futuretimestamp.map(ts => new Date(ts)), [futuretimestamp]);
  const transitionTimestamp = futureDates[0];
  const lastPastTimestamp = pastDates[pastDates.length - 1];
  const lastFutureTimestamp = futureDates[futureDates.length - 1];

  const chartData = useMemo(() => {
    const datasets = [];

    pasandfururedatapairs.forEach((pair, pairIndex) => {
      Object.entries(pair).forEach(([key, values]) => {
        const isFuture = key.startsWith("future_");
        const baseKey = isFuture ? key.replace("future_", "") : key;
        const label = `${baseKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} ${isFuture ? "(Future)" : "(Past)"}`;
        const timestamps = isFuture ? futureDates : pastDates;
        const colorIndex = pairIndex % COLORS.length;

        datasets.push({
          label,
          data: values.map((y, i) => ({ x: timestamps[i], y })),
          borderColor: COLORS[colorIndex],
          backgroundColor: `${COLORS[colorIndex]}33`,
          borderDash: !isFuture ? [6, 4] : [],
          fill: false,
          pointRadius: 0.001,
          pointHoverRadius: 6,
pointHoverBorderWidth: 2,
pointHoverBorderColor: COLORS[colorIndex],
          borderWidth: 2,
          tension: 0.2,
        });
      });
    });

    return { datasets };
  }, [pasandfururedatapairs, pastDates, futureDates]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "nearest", intersect: false },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
 annotation: {
  drawTime: 'afterDatasetsDraw', // ✅ ensures labels are drawn on top
  annotations: {
    transitionLine: {
      type: 'line',
      scaleID: 'x',
      borderColor: 'rgba(255, 99, 132, 0.75)',
      borderWidth: 2,
      borderDash: [4, 4],
      value: transitionTimestamp,
      label: {
        content: 'Forecast Start',
        enabled: true,
        position: 'start',
        backgroundColor: '#fff',
        color: '#000',
      }
    },
    pastBox: {
      type: 'box',
      xMin: pastDates[0],
      xMax: transitionTimestamp,
      backgroundColor: 'rgba(173, 216, 230, 0.15)',
      borderWidth: 0,
      label: {
         yAdjust: -40,
        display: true,
        content: 'Past Data',
        enabled: true,
        position: 'center',
        backgroundColor: 'rgba(0,0,0,0)', // transparent
        color: '#0080ff',
        font: {
          size: 22,
          weight: 'bold',
        },
      },
    },
    futureBox: {
      type: 'box',
      xMin: transitionTimestamp,
      xMax: lastFutureTimestamp,
      backgroundColor: 'rgba(144, 238, 144, 0.15)',
      borderWidth: 0,
      label: {
        display: true,
        content: 'Forecasted Data',
        enabled: true,
        position: 'center',
        backgroundColor: 'rgba(0,0,0,0)', // transparent
        color: '#e60000',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    }
  }
}
,
      decimation: {
        enabled: true,
        algorithm: "min-max",
        samples: 200,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'dd MMM yyyy HH:mm',
          displayFormats: {
            minute: 'dd MMM HH:mm',
            hour: 'dd MMM HH:mm',
            day: 'dd MMM',
          },
        },
        title: { display: true, text: "Time" },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 30,
        },
      },
      y: {
        title: {
          display: true,
          text: axisname || "Value",
        },
      },
    },
  }), [axisname, transitionTimestamp, pastDates, lastFutureTimestamp]);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div style={{ height: "460px", width: "100%" }}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
      <div className="mt-2 text-right">
        <button
          onClick={handleResetZoom}
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};

export default TrendDiffGraph;