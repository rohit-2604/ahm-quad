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
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const COLORS = [
  "#FF5733", "#33A1FF", "#F3FF33", "#33FF57", "#A133FF",
  "#FF33A1", "#33FFA1", "#A1FF33", "#FF33FF", "#33FF33",
  "#33FFF3", "#FFA533", "#8D33FF", "#FF3333", "#33FFB2"
];

const DiagnosisAlert = ({ timeStamp = [], sensorData = {}, axisname = "" }) => {
  const chartRef = useRef();

  // Prepare X values as real Date objects
  const timeValues = useMemo(() => {
    return timeStamp.map(ts => new Date(ts));
  }, [timeStamp]);

  // Build datasets (X: time, Y: value)
  const chartData = useMemo(() => {
    const datasets = Object.entries(sensorData).map(([label, data], idx) => ({
      label: label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      data: data.map((y, i) => ({ x: timeValues[i], y })),
      borderColor: COLORS[idx % COLORS.length],
      backgroundColor: `${COLORS[idx % COLORS.length]}33`,
      borderWidth: 1.5,
      fill: false, // No area fill (improves performance)
      pointRadius: 0, // Hide individual points for performance
      tension: 0.2, // Slight curve
    }));

    return { datasets };
  }, [sensorData, timeValues]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: true, // Disable animations to boost performance
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
      decimation: {
        enabled: true,
        algorithm: "min-max", // Keeps high/low for accuracy
        samples: 100, // Adjust for balance between performance/detail
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
          text: axisname || "Forecast",
        },
      },
    },
  }), [axisname]);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div style={{ height: "450px", width: "100%" }}>
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

export default DiagnosisAlert;
