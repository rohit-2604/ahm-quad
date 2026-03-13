import React from "react";
import GaugeComponent from "react-gauge-component";
function Monitor({ value, name, minValue, maxValue, healthy, warning,tooltipMsg=null }) {
  return (
   <main className="flex items-center justify-center rounded-md relative px-4 group">
  {/* Tooltip */}
  {
    tooltipMsg && (
     <div className="absolute top-[90%] w-full left-[50%] -translate-x-1/2 bg-black text-white text-xs px-5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[10]">
      <p>{tooltipMsg}</p>
  </div>)
  }
 

  <div className="flex flex-col">
    <GaugeComponent
      type="radial"
      value={parseFloat(value)}
      minValue={parseFloat(minValue)}
      maxValue={parseFloat(maxValue)}
      className="pt-[0.7rem]"
      style={{
        width: "180px",
        overflow: "auto",
      }}
      arc={{
        colorArray: ["#FFC742", "#44BF36", "#EA4228"],
        subArcs: [
          { limit: parseFloat(healthy), color: "#FFC742" },
          { limit: parseFloat(warning), color: "#44BF36" },
          { limit: parseFloat(maxValue), color: "#EA4228" },
        ],
      }}
      labels={{
        tickLabels: {
          type: "outer",
          defaultTickLineConfig: "",
          ticks: [
            { value: parseFloat(minValue) },
            { value: parseFloat(healthy) },
            { value: parseFloat(warning) },
            { value: parseFloat(maxValue) },
          ],
          defaultTickValueConfig: {
                formatTextValue: (value) => value.toString(), // Remove % sign
              },
        },
        showValue: false,
        valueLabel: {
          style: {
            fontSize: "0px",
            fill: "#fff",
          },
        },
      }}
      pointer={{
        elastic: true,
        animationDelay: 0,
        color: "green",
      }}
    />
    <div className="absolute bg-[#1D7D1D] border-[2px] border-white h-[1rem] w-[1rem] rounded-full top-[5.4rem] left-[6.12rem]"></div>
    <div className="flex flex-col items-center">
      <p className="text-[#3481FF] font-semibold">{value}</p>
      <p className="text-[#686868] font-semibold text-xl">{name}</p>
    </div>
  </div>
</main>

  );
}

export default Monitor;
