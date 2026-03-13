import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const DiagnosisAlert = ({ GraphData, limit,axisname="" }) => {
  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        id: "diagnosis-chart",
        type: "area",
        height: 350,
        stacked: false,
        zoom: {
          enabled: true,
          type: "xy",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
        toolbar: {
          autoSelected: "zoom",
          show: true,
          offsetX: -100, // Move toolbar left
          offsetY: 1,  // Move toolbar down
        },
        pan: {
          enabled: true,
          type: "xy",
          offsetX: 0,
          offsetY: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "monotoneCubic",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      legend: {
        tooltipHoverFormatter: (val, opts) => {
          const seriesIndex = opts.seriesIndex;
          const dataPointIndex = opts.dataPointIndex;
          const value =
            opts.w.globals.series[seriesIndex] &&
            opts.w.globals.series[seriesIndex][dataPointIndex] !== undefined
              ? opts.w.globals.series[seriesIndex][dataPointIndex]
              : "N/A";
          return `${val} - <strong>${value}</strong>`;
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "dd MMM HH:mm",
        },
        title: {
          text: "Timestamp",
        },
      },
      yaxis: {
  title: {
    text: axisname ,
    style: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#333",
    },
  },
},

      tooltip: {
        x: {
          format: "dd MMM yyyy HH:mm:ss",
        },
        y: {
          formatter: (val) =>
            val !== null && val !== undefined ? val.toFixed(2) : "N/A",
        },
      },
      grid: {
        borderColor: "#f1f1f1",
      },
      annotations: {
        yaxis: [],
      },
    },
  });

  // Add limit zones as colored background annotations
  useEffect(() => {
    if (limit) {
      const min = parseFloat(limit.min);
      const healthy = parseFloat(limit.healthy);
      const warning = parseFloat(limit.warning);
      const max = parseFloat(limit.max);

      const yAnnotations = [
        {
          y: healthy,
          y2: min,
          borderColor: "transparent",
          fillColor: "#FFF176", // yellow
          opacity: 0.2,
          label: {
            text: "Min-Healthy",
            style: {
              color: "#000",
              background: "#FFF176",
            },
          },
        },
        {
          y: warning,
          y2: healthy,
          borderColor: "transparent",
          fillColor: "#81C784", // green
          opacity: 0.2,
          label: {
            text: "Healthy-Warning",
            style: {
              color: "#000",
              background: "#81C784",
            },
          },
        },
        {
          y: max,
          y2: warning,
          borderColor: "transparent",
          fillColor: "#E57373", // red
          opacity: 0.2,
          label: {
            text: "Warning-Max",
            style: {
              color: "#000",
              background: "#E57373",
            },
          },
        },
      ];

      setChartOptions((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          annotations: {
            ...prev.options.annotations,
            yaxis: yAnnotations,
          },
        },
      }));
    } else {
      setChartOptions((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          annotations: {
            ...prev.options.annotations,
            yaxis: [],
          },
        },
      }));
    }
  }, [limit]);

  // Load data into series and optionally add dummy min/max values
  useEffect(() => {
    if (!GraphData || !GraphData.timestamp || GraphData.timestamp.length === 0) {
      return;
    }

    const { timestamp, ...dataSeries } = GraphData;

    const seriesData = Object.keys(dataSeries)
      .filter((key) => Array.isArray(dataSeries[key]) && dataSeries[key].length > 0)
      .map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        data: dataSeries[key].map((value, index) => ({
          x: timestamp[index],
          y: value,
        })),
      }));

    // Inject dummy points to stretch y-axis
    if (limit) {
      const min = parseFloat(limit.min);
      const max = parseFloat(limit.max);
      const firstTs = timestamp[0];

      seriesData.push({
        name: "",
        data: [
          { x: firstTs, y: min },
          { x: firstTs, y: max },
        ],
        color: "transparent"
      });
    }

    setChartOptions((prev) => ({
      ...prev,
      series: seriesData,
    }));
  }, [GraphData, limit]);

  // Enable scroll zoom for Y-axis
  useEffect(() => {
    const chart = document.querySelector("#chart .apexcharts-canvas");

    if (!chart) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return; // avoid interfering with browser zoom
      e.preventDefault();
      const direction = e.deltaY > 0 ? "out" : "in";

      window.ApexCharts?.exec("diagnosis-chart", "zoom", {
        axis: "y",
        direction,
      });
    };

    chart.addEventListener("wheel", onWheel, { passive: false });
    return () => chart.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div>
      <div id="chart" className="overflow-y-hidden overflow-x-hidden">
        {chartOptions.series.length > 0 ? (
          <ReactApexChart
            options={chartOptions.options}
            series={chartOptions.series}
            type="area"
            height={350}
          />
        ) : (
          <p>Loading graph data...</p>
        )}
      </div>
    </div>
  );
};

export default DiagnosisAlert;
