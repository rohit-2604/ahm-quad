import React, { useRef, useMemo, useState } from "react";
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
  "#FF5733", // deep orange-red
  "#1976D2", // deep blue
  "#8E44AD", // rich purple
  "#C0392B", // strong red
  "#2E86C1", // steel blue
  "#D35400", // deep orange
  "#1ABC9C", // teal
  "#7D3C98", // violet
  "#2C3E50", // dark navy
  "#27AE60", // emerald green
  "#E67E22", // burnt orange
  "#9B59B6", // amethyst
  "#34495E", // dark gray-blue
  "#16A085", // deep aqua
  "#A93226"  // crimson
];

const AccuracyGraph = ({ prediction = {}, actual = {} }) => {
  const chartRef = useRef();
 
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [showStats, setShowStats] = useState(true);
  const [showErrorBands, setShowErrorBands] = useState(false);

  // Convert timestamps to Date objects
  const predictedDates = useMemo(
    () => (prediction.timestamp || []).map((ts) => new Date(ts)),
    [prediction.timestamp]
  );
  const actualDates = useMemo(
    () => (actual.timestamp || []).map((ts) => new Date(ts)),
    [actual.timestamp]
  );

  const transitionTimestamp = predictedDates[0];
  const lastActualTimestamp = actualDates[actualDates.length - 1];
  const lastPredictedTimestamp = predictedDates[predictedDates.length - 1];

  const metrics = [
    { key: "temperature_skin", label: "Skin Temperature", unit: "°C" },
    { key: "temperature_bearing", label: "Bearing Temperature", unit: "°C" },
    { key: "vibration_x", label: "Vibration X", unit: "m/s²" },
    { key: "vibration_y", label: "Vibration Y", unit: "m/s²" },
    { key: "vibration_z", label: "Vibration Z", unit: "m/s²" },
  ];

  // Calculate detailed statistics
  const calculateStats = (actualData, predictedData) => {
    if (!actualData || !predictedData || actualData.length === 0 || predictedData.length === 0) {
      return null;
    }

    const minLength = Math.min(actualData.length, predictedData.length);
    const errors = [];
    
    for (let i = 0; i < minLength; i++) {
      if (actualData[i] !== undefined && predictedData[i] !== undefined) {
        errors.push(actualData[i] - predictedData[i]);
      }
    }

    if (errors.length === 0) return null;

    const absoluteErrors = errors.map(e => Math.abs(e));
    const squaredErrors = errors.map(e => e * e);
    
    const mae = absoluteErrors.reduce((a, b) => a + b, 0) / absoluteErrors.length;
    const mse = squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length;
    const rmse = Math.sqrt(mse);
    
    // Calculate MAPE safely
    const mapeValues = [];
    for (let i = 0; i < minLength; i++) {
      if (actualData[i] !== 0 && actualData[i] !== undefined && predictedData[i] !== undefined) {
        mapeValues.push(Math.abs((actualData[i] - predictedData[i]) / actualData[i]) * 100);
      }
    }
    const mape = mapeValues.length > 0 ? mapeValues.reduce((a, b) => a + b, 0) / mapeValues.length : 0;
    
    const mean = errors.reduce((a, b) => a + b, 0) / errors.length;
    const variance = errors.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / errors.length;
    const stdDev = Math.sqrt(variance);

    // Calculate R-squared
    const actualMean = actualData.slice(0, minLength).reduce((a, b) => a + b, 0) / minLength;
    const ssRes = squaredErrors.reduce((a, b) => a + b, 0);
    const ssTot = actualData.slice(0, minLength).reduce((acc, val) => acc + Math.pow(val - actualMean, 2), 0);
    const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

    return {
      mae: mae.toFixed(3),
      mse: mse.toFixed(3),
      rmse: rmse.toFixed(3),
      mape: mape.toFixed(2),
      bias: mean.toFixed(3),
      stdDev: stdDev.toFixed(3),
      minError: Math.min(...errors).toFixed(3),
      maxError: Math.max(...errors).toFixed(3),
      rSquared: rSquared.toFixed(3),
      dataPoints: errors.length
    };
  };

  const chartData = useMemo(() => {
    const datasets = [];

    metrics.forEach((metric, index) => {
      if (selectedMetric !== "all" && selectedMetric !== metric.key) return;
      
      const color = COLORS[index % COLORS.length];

      // Actual data
      if (actual[metric.key]) {
        datasets.push({
          label: `${metric.label} (Actual)`,
          data: actual[metric.key].map((y, i) => ({
            x: actualDates[i],
            y,
          })),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderDash: [2, 2],
          fill: false,
          pointRadius: 0.001,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointHoverBorderColor: color,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          tension: 0.3,
        });
      }

      // Predicted data
      if (prediction[`predicted_${metric.key}`]) {
        datasets.push({
          label: `${metric.label} (Predicted)`,
          data: prediction[`predicted_${metric.key}`].map((y, i) => ({
            x: predictedDates[i],
            y,
          })),
          borderColor: color,
          backgroundColor: `${color}15`,
          borderDash: [],
         fill: false,
          pointRadius: 0.001,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: color,
          borderWidth: 2,
          tension: 0.2,
        });
      }

      // Error bands (if enabled)
      if (showErrorBands && actual[metric.key] && prediction[`predicted_${metric.key}`]) {
        const minLength = Math.min(actual[metric.key].length, prediction[`predicted_${metric.key}`].length);
        const errorData = [];
        
        for (let i = 0; i < minLength; i++) {
          if (actualDates[i] && actual[metric.key][i] !== undefined && prediction[`predicted_${metric.key}`][i] !== undefined) {
            errorData.push({
              x: actualDates[i],
              y: Math.abs(actual[metric.key][i] - prediction[`predicted_${metric.key}`][i]),
            });
          }
        }

        if (errorData.length > 0) {
          datasets.push({
            label: `${metric.label} (|Error|)`,
            data: errorData,
            borderColor: `${color}60`,
            backgroundColor: `${color}15`,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 1,
            tension: 0.2,
            yAxisID: 'y1',
          });
        }
      }
    });

    return { datasets };
  }, [metrics, actual, prediction, actualDates, predictedDates, selectedMetric, showErrorBands]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 750 },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      plugins: {
        legend: { 
          position: "top",
          labels: {
            padding: 15,
            usePointStyle: true,
            pointStyle: 'line',
            font: { size: 12 }
          }
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            title: function(context) {
              return new Date(context[0].parsed.x).toLocaleString();
            },
            label: function(context) {
              const value = context.parsed.y.toFixed(3);
              const unit = metrics.find(m => context.dataset.label.includes(m.label))?.unit || '';
              return `${context.dataset.label}: ${value} ${unit}`;
            },
            afterBody: function(context) {
              // Show difference if both actual and predicted are present
              const datasetLabel = context[0].dataset.label;
              const metricName = metrics.find(m => datasetLabel.includes(m.label))?.key;
              
              if (metricName) {
                const xValue = context[0].parsed.x;
                const actualDataset = chartData.datasets.find(d => d.label.includes(`${metrics.find(m => m.key === metricName).label} (Actual)`));
                const predictedDataset = chartData.datasets.find(d => d.label.includes(`${metrics.find(m => m.key === metricName).label} (Predicted)`));
                
                if (actualDataset && predictedDataset) {
                  const actualPoint = actualDataset.data.find(d => Math.abs(d.x - xValue) < 60000); // within 1 minute
                  const predictedPoint = predictedDataset.data.find(d => Math.abs(d.x - xValue) < 60000);
                  
                  if (actualPoint && predictedPoint) {
                    const diff = (actualPoint.y - predictedPoint.y).toFixed(3);
                    const unit = metrics.find(m => m.key === metricName)?.unit || '';
                    return [`Difference: ${diff} ${unit}`];
                  }
                }
              }
              return [];
            }
          }
        },
        zoom: {
  pan: {
    enabled: true,
    mode: "x",
    
  },
  zoom: {
    wheel: { enabled: true },
    pinch: { enabled: true },
    // drag: { enabled: true },
    mode: "x",
  },
},
        annotation: {
          annotations: transitionTimestamp ? {
            transitionLine: {
              type: 'line',
              xMin: transitionTimestamp,
              xMax: transitionTimestamp,
              borderColor: 'rgba(255, 99, 132, 0.8)',
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Prediction Start',
                enabled: true,
                position: 'top',
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                color: 'white',
                padding: 4
              }
            }
          } : {}
        },
        decimation: {
          enabled: true,
          algorithm: "min-max",
          samples: 500,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            tooltipFormat: "dd MMM yyyy HH:mm:ss",
            displayFormats: {
              minute: "HH:mm",
              hour: "dd MMM HH:mm",
              day: "dd MMM",
              week: "dd MMM",
              month: "MMM yyyy",
            },
          },
          title: { 
            display: true, 
            text: "Time",
            font: { size: 14, weight: 'bold' }
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 30,
            font: { size: 11 }
          },
          grid: {
            color: '#e0e0e0',
            lineWidth: 0.5
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: "Sensor Values",
            font: { size: 14, weight: 'bold' }
          },
          ticks: {
            font: { size: 11 }
          },
          grid: {
            color: '#f0f0f0',
            lineWidth: 0.5
          }
        },
        y1: showErrorBands ? {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: "Absolute Error",
            font: { size: 12 }
          },
          grid: {
            drawOnChartArea: false,
          },
        } : undefined,
      },
    }),
    [transitionTimestamp, actualDates, lastPredictedTimestamp, showErrorBands, chartData.datasets]
  );

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Calculate statistics for each metric
  const metricStats = useMemo(() => {
    return metrics.map(metric => {
      const stats = calculateStats(
        actual[metric.key],
        prediction[`predicted_${metric.key}`]
      );
      return { ...metric, stats };
    }).filter(m => m.stats);
  }, [actual, prediction]);

  // Calculate detailed statistics
  

  return (
    <div >
      
      {/* Header Controls */}
      <div style={{ marginBottom: "16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
       
        
        <div className="flex flex-wrap justify-end w-full gap-5">
          {/* <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none"
            }}
          >
            <option value="all">All Metrics</option>
            {metrics.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select> */}
          
          <button
            onClick={() => setShowErrorBands(!showErrorBands)}
            style={{
              padding: "8px 12px",
              backgroundColor: showErrorBands ? "#ef4444" : "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {showErrorBands ? 'Hide' : 'Show'} Error Bands
          </button>
          
          {/* <button
            onClick={() => setShowStats(!showStats)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {showStats ? 'Hide' : 'Show'} Statistics
          </button> */}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "500px", width: "100%" }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
      
      {/* Chart Controls */}
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={handleResetZoom}
          style={{
            padding: "8px 16px",
            backgroundColor: "#374151",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Reset Zoom
        </button>
        
        <div style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "20px", height: "3px", backgroundColor: "#374151", marginRight: "8px" }}></div>
            Solid: Predicted
          </span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "20px", height: "2px", borderTop: "2px dashed #374151", marginRight: "8px" }}></div>
            Dashed: Actual
          </span>
        </div>
      </div>

      {/* Detailed Statistics Panel */}
      {showStats && metricStats.length > 0 && (
        <div style={{ marginTop: "24px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>
            Detailed Prediction Accuracy Analysis
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {metricStats.map((metric, index) => (
              <div key={metric.key} style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div 
                    style={{ 
                      width: "16px", 
                      height: "16px", 
                      borderRadius: "2px", 
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: "8px" 
                    }}
                  ></div>
                  <h4 style={{ fontWeight: "600", color: "#374151", margin: 0 }}>{metric.label}</h4>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>MAE:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.mae} {metric.unit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>RMSE:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.rmse} {metric.unit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>MAPE:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.mape}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>R²:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.rSquared}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>Bias:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.bias} {metric.unit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>Std Dev:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.stdDev} {metric.unit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>Min Error:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.minError} {metric.unit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#6b7280" }}>Max Error:</span>
                      <span style={{ fontWeight: "500" }}>{metric.stats.maxError} {metric.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Accuracy Visual Indicator */}
                {/* <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Accuracy Score:</span>
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>
                      {Math.max(0, 100 - parseFloat(metric.stats.mape)).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                    <div 
                      style={{
                        height: "100%",
                        borderRadius: "3px",
                        transition: "all 0.3s ease",
                        width: `${Math.max(0, Math.min(100, 100 - parseFloat(metric.stats.mape)))}%`,
                        backgroundColor: parseFloat(metric.stats.mape) < 5 ? '#10b981' : 
                                       parseFloat(metric.stats.mape) < 15 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                    {metric.stats.dataPoints} data points compared
                  </div>
                </div> */}
              </div>
            ))}
          </div>

          {/* Overall Summary */}
          {metricStats.length > 1 && (
            <div style={{ marginTop: "20px", backgroundColor: "#dbeafe", borderRadius: "8px", padding: "16px" }}>
              <h4 style={{ fontWeight: "600", color: "#1e40af", marginBottom: "8px", fontSize: "16px" }}>
                Overall Performance Summary
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "14px" }}>
                <div>
                  <span style={{ color: "#1e40af", fontWeight: "500" }}>Best Performing Metric:</span>
                  <div style={{ marginLeft: "8px", color: "#1e40af", fontWeight: "600" }}>
                    {metricStats.reduce((best, current) => 
                      parseFloat(current.stats.mape) < parseFloat(best.stats.mape) ? current : best
                    ).label} ({metricStats.reduce((best, current) => 
                      parseFloat(current.stats.mape) < parseFloat(best.stats.mape) ? current : best
                    ).stats.mape}% MAPE)
                  </div>
                </div>
                
                <div>
                  <span style={{ color: "#1e40af", fontWeight: "500" }}>Average MAPE:</span>
                  <div style={{ marginLeft: "8px", color: "#1e40af", fontWeight: "600" }}>
                    {(metricStats.reduce((sum, m) => sum + parseFloat(m.stats.mape), 0) / metricStats.length).toFixed(2)}%
                  </div>
                </div>
                
                <div>
                  <span style={{ color: "#1e40af", fontWeight: "500" }}>Average R²:</span>
                  <div style={{ marginLeft: "8px", color: "#1e40af", fontWeight: "600" }}>
                    {(metricStats.reduce((sum, m) => sum + parseFloat(m.stats.rSquared), 0) / metricStats.length).toFixed(3)}
                  </div>
                </div>
                
                <div>
                  <span style={{ color: "#1e40af", fontWeight: "500" }}>Total Comparisons:</span>
                  <div style={{ marginLeft: "8px", color: "#1e40af", fontWeight: "600" }}>
                    {metricStats.reduce((sum, m) => sum + parseInt(m.stats.dataPoints), 0)} points
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Legend */}
          <div style={{ marginTop: "16px", fontSize: "11px", color: "#6b7280", backgroundColor: "#f3f4f6", borderRadius: "6px", padding: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
              <div><strong>MAE:</strong> Mean Absolute Error</div>
              <div><strong>RMSE:</strong> Root Mean Square Error</div>
              <div><strong>MAPE:</strong> Mean Absolute Percentage Error</div>
              <div><strong>R²:</strong> Coefficient of Determination</div>
              <div><strong>Bias:</strong> Average prediction error (over/under prediction)</div>
              <div><strong>Std Dev:</strong> Standard deviation of errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Information Panel */}
      <div style={{ marginTop: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "16px" }}>
        <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "16px" }}>
          Dataset Information
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", fontSize: "14px" }}>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <span style={{ color: "#6b7280", display: "block", marginBottom: "4px" }}>Actual Data:</span>
            <div style={{ fontWeight: "600", color: "#374151" }}>{actualDates.length} data points</div>
            {actualDates.length > 0 && (
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                {actualDates[0].toLocaleDateString()} to {actualDates[actualDates.length - 1].toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <span style={{ color: "#6b7280", display: "block", marginBottom: "4px" }}>Predicted Data:</span>
            <div style={{ fontWeight: "600", color: "#374151" }}>{predictedDates.length} data points</div>
            {predictedDates.length > 0 && (
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                {predictedDates[0].toLocaleDateString()} to {predictedDates[predictedDates.length - 1].toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <span style={{ color: "#6b7280", display: "block", marginBottom: "4px" }}>Time Coverage:</span>
            <div style={{ fontWeight: "600", color: "#374151" }}>
              {actualDates.length > 0 && 
                `${Math.ceil((actualDates[actualDates.length - 1] - actualDates[0]) / (1000 * 60 * 60 * 24))} days (Actual)`
              }
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              {predictedDates.length > 0 && 
                `${Math.ceil((predictedDates[predictedDates.length - 1] - predictedDates[0]) / (1000 * 60 * 60 * 24))} days (Predicted)`
              }
            </div>
          </div>
          
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <span style={{ color: "#6b7280", display: "block", marginBottom: "4px" }}>Data Frequency:</span>
            <div style={{ fontWeight: "600", color: "#374151" }}>
              {actualDates.length > 1 && 
                `~${Math.round((actualDates[actualDates.length - 1] - actualDates[0]) / (actualDates.length * 1000 * 60))} min intervals`
              }
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              Average sampling rate
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      {metricStats.length > 0 && (
        <div style={{ marginTop: "16px", backgroundColor: "#fef3c7", borderRadius: "8px", padding: "16px", border: "1px solid #fbbf24" }}>
          <h4 style={{ fontWeight: "600", color: "#92400e", marginBottom: "8px", fontSize: "16px" }}>
            💡 Performance Insights
          </h4>
          <div style={{ fontSize: "14px", color: "#92400e" }}>
            {(() => {
              const avgMape = metricStats.reduce((sum, m) => sum + parseFloat(m.stats.mape), 0) / metricStats.length;
              const avgRSquared = metricStats.reduce((sum, m) => sum + parseFloat(m.stats.rSquared), 0) / metricStats.length;
              const bestMetric = metricStats.reduce((best, current) => 
                parseFloat(current.stats.mape) < parseFloat(best.stats.mape) ? current : best
              );
              const worstMetric = metricStats.reduce((worst, current) => 
                parseFloat(current.stats.mape) > parseFloat(worst.stats.mape) ? current : worst
              );

              return (
                <div>
                  {avgMape < 10 ? (
                    <div style={{ marginBottom: "8px" }}>✅ <strong>Excellent prediction accuracy</strong> - Average MAPE of {avgMape.toFixed(1)}% indicates high-quality predictions.</div>
                  ) : avgMape < 25 ? (
                    <div style={{ marginBottom: "8px" }}>⚠️ <strong>Moderate prediction accuracy</strong> - Average MAPE of {avgMape.toFixed(1)}% suggests room for improvement.</div>
                  ) : (
                    <div style={{ marginBottom: "8px" }}>❌ <strong>Low prediction accuracy</strong> - Average MAPE of {avgMape.toFixed(1)}% indicates significant prediction errors.</div>
                  )}
                  
                  <div style={{ marginBottom: "8px" }}>
                    🎯 <strong>Best predictions:</strong> {bestMetric.label} (MAPE: {bestMetric.stats.mape}%)
                  </div>
                  
                  {metricStats.length > 1 && (
                    <div style={{ marginBottom: "8px" }}>
                      📊 <strong>Most challenging:</strong> {worstMetric.label} (MAPE: {worstMetric.stats.mape}%)
                    </div>
                  )}
                  
                  <div>
                    📈 <strong>Model fit quality:</strong> Average R² of {avgRSquared.toFixed(3)} 
                    {avgRSquared > 0.9 ? " (Excellent fit)" : avgRSquared > 0.7 ? " (Good fit)" : " (Needs improvement)"}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccuracyGraph;