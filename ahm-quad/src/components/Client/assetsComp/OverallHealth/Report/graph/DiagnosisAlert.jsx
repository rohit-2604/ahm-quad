import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// Register necessary chart components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const COLORS = [
  "#FF5733",
  "#33A1FF",
  "#F3FF33",
  "#33FF57",
  "#A133FF",
  "#FF33A8",
  "#33FFF5",
  "#FFC733",
  "#8E44AD",
  "#2ECC71",
];

const DiagnosisAlert = (props) => {
  const chartRef = useRef(null);

  const { timeStamp = [] } = props;

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formattedTimestamps = timeStamp.map((ts) => formatTime(ts));

  // Dynamically build datasets from props
  const dataKeys = Object.keys(props).filter((key) => key !== "timeStamp");

  const datasets = dataKeys.map((key, index) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    data: props[key],
    borderColor: COLORS[index % COLORS.length],
    backgroundColor: `${COLORS[index % COLORS.length]}44`, // Light fill
    borderWidth: 1.5,
    fill: true,
    pointRadius: 0, // Hide individual points for performance
      tension: 0.2, // Slight curve
  
  }));

  const chartData = {
    labels: formattedTimestamps,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Timestamp" } },
      y: { title: { display: true, text: "Status Value" } },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default DiagnosisAlert;
