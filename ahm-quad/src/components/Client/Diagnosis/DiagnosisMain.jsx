import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DiagnosiMainComponent from "./DiagnosiMainComponent";
import DiagnosisGraph from "../../../components/Client/graph/DiagnosisGraph";
import FrequencyGraph from "../graph/FrequencyGraph";
import DiagnosisReportPopUp from "./popup/DiagnosisReportPopUp";
import SensorRunTimeGraph from "../graph/SensorRunTimeGraph";
// import FFT from "fft.js";
import { MdAccessTimeFilled, MdHealthAndSafety } from "react-icons/md";
import unHealthyAnimation from "../../../Lottie/inactive.json";
import error from "../../../Lottie/error.json";
import greenTick from "../../../Lottie/greentick.json";
import { AiFillDatabase } from "react-icons/ai";
import Lottie from "react-lottie";
import { RiHealthBookFill } from "react-icons/ri";
import { useClientContext } from "../../../context/ClientStateContext";
import { IoMdTrendingUp } from "react-icons/io";
import { IoMdTrendingDown } from "react-icons/io";

function DiagnosisMain({ RangeData }) {
  console.log(RangeData, "rangedata");
  const [selectedSensor, setSelectedSensor] = useState("Vibration");
  const { sensorThresholdData, setsensorThresholdData } = useClientContext();
  const [showReport, setShowreport] = useState(false);
  const [PredominantFrequencyData, setPredominantFrequencyData] =
    useState(null);
  const [VibrationGraphData, setVibrationGraphData] = useState({
    radial: [],
    axial: [],
    tengential: [],
    timestamp: [],
  });
  const [AccelerationGraphData, setAccelerationGraphData] = useState({
    radial: [],
    axial: [],
    tangential: [],
    timestamp: [],
  });
  const [TemperatureTimeGraphData, setTemperatureTimeGraphData] = useState({
    timestamp: [],
    skin: [],
    bearing: [],
  });
  const [UltrasoundGraphData, setUltrasoundGraphData] = useState({
    timestamp: [],
    microphone_one: [],
    microphone_two: [],
  });
  const [MagneticfluxGraphData, setMagneticfluxGraphData] = useState({
    timestamp: [],
    magnetic_flux_x: [],
    magnetic_flux_y: [],
    magnetic_flux_z: [],
  });
  const [AccelerationVelocityGraphData, setAccelerationVelocityGraphData] =
    useState({
      radial: [],
      axial: [],
      tangential: [],
      timestamp: [],
    });

  const unhealthyAnimation = {
    loop: false,
    autoplay: true,
    animationData: unHealthyAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const errorAnimation = {
    loop: false,
    autoplay: true,
    animationData: error,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const healthyAnimation = {
    loop: false,
    autoplay: true,
    animationData: greenTick,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  console.log(sensorThresholdData);

  const [FrequencyGraphData, setFrequencyGraphData] = useState({
    frequencies: [],
    amplitudes: [],
    timestamp: [],
  });
  useEffect(() => {
    if (RangeData) {
      // // console.log(RangeData);

      const {
        vibration_x,
        vibration_y,
        vibration_z,

        timestamp,
        temperature_one,
        temperature_two,
        microphone_one,
        microphone_two,
        magnetic_flux_x,
        magnetic_flux_y,
        magnetic_flux_z,
      } = RangeData;

      const generateFrequencyData = (vibration_x, vibration_y, vibration_z) => {
        // Ensure all arrays have the same length
        const length = Math.min(
          vibration_x.length,
          vibration_y.length,
          vibration_z.length
        );

        // Normalize the data (divide by the max value in the array)
        const normalize = (values) => {
          const max = Math.max(...values);
          return values.map((val) => (max > 0 ? val / max : 0));
        };

        const normalizedX = normalize(vibration_x);
        const normalizedY = normalize(vibration_y);
        const normalizedZ = normalize(vibration_z);

        // Generate frequency data
        const frequencies = ["1X", "2X", "3X", "4X"];
        const result = frequencies.map((freq, index) => ({
          frequency: freq,
          radial: normalizedX[index] || 0,
          tangential: normalizedY[index] || 0,
          axial: normalizedZ[index] || 0,
        }));

        return result;
      };

      setPredominantFrequencyData(
        generateFrequencyData(vibration_x, vibration_y, vibration_z)
      );

      const vibrationData = vibration_x.map((x, i) => ({
        radial: vibration_y[i],
        tangential: x,
        axial: vibration_z[i],
        timestamp: timestamp[i],
      }));

      setVibrationGraphData({
        radial: vibrationData.map((data) => data.radial),
        tangential: vibrationData.map((data) => data.tangential),
        axial: vibrationData.map((data) => data.axial),
        timestamp: vibrationData.map((data) => data.timestamp),
      });

      // Constants for acceleration calculation
      const CHARGE = 1; // Normalized charge
      const MASS = 1; // Normalized mass
      const VELOCITY = 1; // Normalized velocity

      setAccelerationGraphData({
        radial: vibrationData.map((data) => data.radial),
        tangential: vibrationData.map((data) => data.tangential),
        axial: vibrationData.map((data) => data.axial),
        timestamp: vibrationData.map((data) => data.timestamp),
      });

      setTemperatureTimeGraphData({
        timestamp: timestamp,
        bearing: temperature_one,
        skin: temperature_two,
      });
      setUltrasoundGraphData({
        timestamp: timestamp,
        microphone_one: microphone_one,
        microphone_two: microphone_two,
      });
      setMagneticfluxGraphData({
        timestamp: timestamp,
        magnetic_flux_x: magnetic_flux_x,
        magnetic_flux_y: magnetic_flux_y,
        magnetic_flux_z: magnetic_flux_z,
      });

      let velocityRadial = VELOCITY;
      let velocityTangential = VELOCITY;
      let velocityAxial = VELOCITY;

      const combinedGraphData = {
        radial: [],
        tangential: [],
        axial: [],
        timestamp: [],
      };

      vibration_x.forEach((Bx, i) => {
        const By = vibration_y[i];
        const Bz = vibration_z[i];

        const accelerationRadial = (CHARGE * velocityTangential * Bz) / MASS;
        const accelerationTangential = (CHARGE * velocityAxial * By) / MASS;
        const accelerationAxial = (CHARGE * velocityRadial * Bx) / MASS;

        velocityRadial += accelerationRadial;
        velocityTangential += accelerationTangential;
        velocityAxial += accelerationAxial;

        combinedGraphData.radial.push(accelerationRadial + velocityRadial);
        combinedGraphData.tangential.push(
          accelerationTangential + velocityTangential
        );
        combinedGraphData.axial.push(accelerationAxial + velocityAxial);
        combinedGraphData.timestamp.push(timestamp[i]);
      });

      setAccelerationVelocityGraphData({
        radial: combinedGraphData.radial,
        tangential: combinedGraphData.tangential,
        axial: combinedGraphData.axial,
        timestamp: combinedGraphData.timestamp,
      });

      if (vibration_x && timestamp) {
        // Step 1: Clean Data
        const cleanedData = vibration_x.map((val) =>
          isNaN(val) || !isFinite(val) ? 0 : val
        );

        // Step 2: Pad to Power of 2
        const nextPowerOf2 = (n) => 2 ** Math.ceil(Math.log2(n));
        const paddedLength = nextPowerOf2(cleanedData.length);
        const paddedData = [
          ...cleanedData,
          ...Array(paddedLength - cleanedData.length).fill(0),
        ];

        // Step 3: FFT Implementation
        const fft = (data) => {
          const N = data.length;
          if (N === 1) {
            return [{ re: data[0], im: 0 }];
          }

          // if (N % 2 !== 0) {
          //   throw new Error("FFT requires input length to be a power of 2.");
          // }

          const even = fft(data.filter((_, i) => i % 2 === 0));
          const odd = fft(data.filter((_, i) => i % 2 !== 0));

          const T = Array.from({ length: N / 2 }, (_, k) => {
            const exp = (-2 * Math.PI * k) / N;
            const twiddleFactor = { re: Math.cos(exp), im: Math.sin(exp) };
            return {
              re: twiddleFactor.re * odd[k].re - twiddleFactor.im * odd[k].im,
              im: twiddleFactor.re * odd[k].im + twiddleFactor.im * odd[k].re,
            };
          });

          return Array.from({ length: N }, (_, k) => {
            if (k < N / 2) {
              return {
                re: even[k].re + T[k].re,
                im: even[k].im + T[k].im,
              };
            } else {
              const idx = k - N / 2;
              return {
                re: even[idx].re - T[idx].re,
                im: even[idx].im - T[idx].im,
              };
            }
          });
        };

        // Step 4: Perform FFT
        const fftResult = fft(paddedData.map((val) => ({ re: val, im: 0 })));

        // Step 5: Calculate Magnitudes
        const amplitudes = fftResult.map(({ re, im }) => {
          if (isNaN(re) || isNaN(im)) {
            console.error("Invalid FFT Component: ", { re, im });
          }
          return Math.sqrt(re ** 2 + im ** 2);
        });

        // Step 6: Calculate Frequencies
        const avgSamplingRate = 1; // Adjust with proper rate if timestamp is available
        const frequencies = Array.from(
          { length: amplitudes.length },
          (_, i) => (i * avgSamplingRate) / amplitudes.length
        );

        // Step 7: Update State
        setFrequencyGraphData({
          frequencies: frequencies.slice(0, amplitudes.length / 2),

          timestamp,
        });
      }
    }
  }, [RangeData]);

  // const reportRef = useRef();
  // // console.log(RangeData)
  const getLeftPosition = () => {
    switch (selectedSensor) {
      case "Vibration":
        return "left-[10px]";
      case "Ultrasonic":
        return "left-[138px]";
      case "Magnetic Flux":
        return "left-[285px]";
      default:
        return "left-[10px]";
    }
  };
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      <div className="flex justify-center items-end">
        <p className="text-3xl font-semibold">{hrs}</p>hr :{" "}
        <p className="text-3xl font-semibold">{mins}</p>min :{" "}
        <p className="text-3xl font-semibold">{secs}</p>sec
      </div>
    );
  };
  const handleShowReport = () => {
    setShowreport(!showReport);
  };

  // const handleDownloadReport = () => {
  //     if (reportRef.current) {
  //         html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
  //             const imgData = canvas.toDataURL('image/png');
  //             const pdf = new jsPDF('p', 'mm', 'a4');
  //             const pdfWidth = pdf.internal.pageSize.getWidth();
  //             const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //             pdf.save('Diagnosis_Report.pdf');
  //         });
  //     }
  // };

  return (
    <div className="flex flex-col mt-10 p-4 w-full">
      <div className="flex justify-end items-center">
        <div className="flex justify-center items-center ">
          {/* <div className='bg-white flex px-10 py-4 rounded-3xl gap-14 relative'>
                        <div
                            className={`bg-black rounded-3xl px-16 py-4 absolute bottom-3 transition-all duration-300 ${getLeftPosition()}`}
                        ></div>
                        <p
                            className={`${!showReport && "z-50"} cursor-pointer ${selectedSensor === 'Vibration' ? 'text-white' : ''}`}
                            onClick={() => setSelectedSensor('Vibration')}
                        >
                            Vibration
                        </p>
                        <p
                            className={`${!showReport && "z-50"} cursor-pointer ${selectedSensor === 'Ultrasonic' ? 'text-white' : ''}`}
                            onClick={() => setSelectedSensor('Ultrasonic')}
                        >
                            Ultrasonic
                        </p>
                        <p
                            className={`${!showReport && "z-50"} cursor-pointer ${selectedSensor === 'Magnetic Flux' ? 'text-white' : ''}`}
                            onClick={() => setSelectedSensor('Magnetic Flux')}
                        >
                            Magnetic Flux
                        </p>
                    </div> */}
        </div>
        <div
          className="px-10 py-2  bg-black text-white rounded-md cursor-pointer"
          onClick={handleShowReport}
        >
          Show Report
        </div>
      </div>
      <div className="flex bg-white mt-4 justify-center items-center py-4 rounded-md font-semibold">
        {RangeData.startdate} <p className="text-gray-600 px-5">to</p>{" "}
        {RangeData.enddate}
      </div>
      <div className="flex mt-3 gap-3 justify-center items-center flex-col md:flex-row lg:flex-row">
        <div className="flex bg-white w-full min-h-[50px] rounded-md gap-3 py-3 pt-6 px-5 flex-col">
          <div className="flex justify-start items-center  gap-2">
            <IoMdTrendingUp size={30} />
            <p className="text-2xl font-semibold"> Total Up Time</p>
          </div>
          <div className="flex w-full justify-center items-center bg-[#EBF2FF] py-6 rounded-md">
            {formatTime(RangeData.totalRuntime-RangeData.totalDowntime)}
          </div>
        </div>
        <div className="flex bg-white w-full min-h-[50px] rounded-md gap-3 py-3 pt-6 px-5 flex-col">
          <div className="flex justify-start items-center  gap-2">
            <IoMdTrendingDown size={30} />
            <p className="text-2xl font-semibold"> Total Down Time</p>
          </div>
          <div className="flex w-full justify-center items-center bg-[#EBF2FF] py-6 rounded-md">
            {formatTime(RangeData.totalDowntime)}
          </div>
        </div>
        <div className="flex bg-white w-full min-h-[50px] rounded-md gap-3 py-3 pt-6 px-5 flex-col">
          <div className="flex justify-start items-center  gap-2">
            <AiFillDatabase size={28} />
            <p className="text-2xl font-semibold"> Total Data Points</p>
          </div>
          <div className="flex w-full justify-center items-center bg-[#EBF2FF] py-6 rounded-md text-3xl font-semibold">
            {RangeData.totalPoints}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10 mt-3">
        <div className="flex flex-col rounded-lg w-full bg-white py-3 pt-5 px-5 overflow-hidden justify-center items-center">
          {/* Header */}
          <div className="flex self-start pb-3 gap-2">
            <MdHealthAndSafety size={30} />
            <p className="text-2xl font-semibold">Overall Health</p>
          </div>

          {/* Health Status Box */}
          <div
            className={`flex flex-col gap-3 ${
              RangeData.overall_health === "Healthy"
                ? "bg-[#EDFFEE]"
                : RangeData.overall_health === "Unhealthy"
                ? "bg-[#FFF7DB]"
                : ""
            } justify-center items-center text-center py-8 px-10 w-full rounded-md`}
          >
            <div>
              {RangeData.overall_health === "Healthy" ? (
                <Lottie options={healthyAnimation} height={40} width={40} />
              ) : RangeData.overall_health === "Unhealthy" ? (
                <Lottie options={unhealthyAnimation} height={40} width={40} />
              ) : (
                ""
              )}
            </div>

            <div
              className={`${
                RangeData.overall_health === "Healthy"
                  ? "text-[#4BAE4F]"
                  : RangeData.overall_health === "Unhealthy"
                  ? "text-[#F1BC00]"
                  : ""
              } flex text-xl font-[500]`}
            >
              {RangeData.overall_health}
            </div>
          </div>

          {/* Possible Cause Box (only for Unhealthy) */}
          {RangeData.overall_health === "Unhealthy" &&
            RangeData.possible_cause && (
              <div className="w-full mt-4 p-4 bg-[#FFE5E5] border border-[#FFCCCC] rounded-md flex gap-3 items-center justify-start">
                <div className="">
                  <Lottie options={errorAnimation} height={40} width={40} />
                </div>

                <div className="text-left">
                  <p className="text-red-600 font-semibold">Possible Cause</p>
                  <p className="text-sm text-gray-700">
                    {RangeData.possible_cause}
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-col rounded-lg w-full bg-white py-3 pt-5 px-5 pb-6 overflow-hidden justify-center items-center mt-3">
        {/* Header */}
        <div className="flex self-start pb-3 gap-2">
          <RiHealthBookFill size={30} />
          <p className="text-2xl font-semibold">Detailed Health Factor</p>
        </div>

        {/* Detailed Factors Section */}
        <div className="detailedfactors w-full flex flex-col gap-4">
          {Object.entries(RangeData.details_every_factor).map(
            ([key, { status, average, high, low }]) => {
              const label = key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              const statusColor =
                status === "NEEDS MAINTENANCE"
                  ? "text-[#F97316]" // orange
                  : status === "UNKNOWN"
                  ? "text-gray-500"
                  : "text-green-600";

              return (
                <div
                  key={key}
                  className="bg-white w-full rounded-lg  border border-gray-200 px-5 py-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-medium text-gray-800">
                      {label === "Temperature One"
                        ? "Bearing"
                        : label === "Temperature Two"
                        ? "Skin"
                        : label}
                    </p>
                    <span className={`text-sm font-semibold ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="flex gap-3">
                      <p className="font-medium">Average</p>
                      <p>{average !== null ? average.toFixed(2) : "N/A"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="font-medium">High</p>
                      <p>{high !== null ? high.toFixed(2) : "N/A"}</p>
                    </div>
                    <div className="flex gap-3">
                      <p className="font-medium">Low</p>
                      <p>{low !== null ? low.toFixed(2) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="flex w-full">
        {showReport && (
          <DiagnosisReportPopUp
            onClose={handleShowReport}
            AccelerationGraphData={AccelerationGraphData}
            TemperatureTimeGraphData={TemperatureTimeGraphData}
            VibrationGraphData={VibrationGraphData}
            AccelerationVelocityGraphData={AccelerationVelocityGraphData}
            RangeData={RangeData}
            UltrasoundGraphData={UltrasoundGraphData}
            MagneticfluxGraphData={MagneticfluxGraphData}
          />
        )}
      </div>
      <div className="w-full">
        <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Vibration Time</p>
          <div className="w-full h-auto rounded-md">
            {VibrationGraphData ? (
              <DiagnosisGraph
                GraphData={VibrationGraphData}
                axisname="Vibration"
                limit={{
                  min: sensorThresholdData?.threshold_data[2].min,
                  healthy: sensorThresholdData?.threshold_data[2].healthy,
                  warning: sensorThresholdData?.threshold_data[2].warning,
                  max: sensorThresholdData?.threshold_data[2].max,
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Acceleration-Time</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph
              GraphData={AccelerationGraphData}
              axisname="Acceleration"
              limit={{
                min: sensorThresholdData?.threshold_data[2].min,
                healthy: sensorThresholdData?.threshold_data[2].healthy,
                warning: sensorThresholdData?.threshold_data[2].warning,
                max: sensorThresholdData?.threshold_data[2].max,
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-3 lg:flex-row flex-col md:flex-row">
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Skin Temperature-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: TemperatureTimeGraphData.timestamp,
                  skin: TemperatureTimeGraphData.skin,
                }}
                axisname="Skin Temperature"
                limit={{
                  min: sensorThresholdData?.threshold_data[0].min,
                  healthy: sensorThresholdData?.threshold_data[0].healthy,
                  warning: sensorThresholdData?.threshold_data[0].warning,
                  max: sensorThresholdData?.threshold_data[0].max,
                }}
              />
            </div>
          </div>
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Bearing Temperature-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: TemperatureTimeGraphData.timestamp,
                  Bearing: TemperatureTimeGraphData.bearing,
                }}
                axisname="Bearing Temperature"
                limit={{
                  min: sensorThresholdData?.threshold_data[1].min,
                  healthy: sensorThresholdData?.threshold_data[1].healthy,
                  warning: sensorThresholdData?.threshold_data[1].warning,
                  max: sensorThresholdData?.threshold_data[1].max,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3 lg:flex-row flex-col md:flex-row">
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Microphone_one-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: UltrasoundGraphData.timestamp,
                  microphone_one: UltrasoundGraphData.microphone_one,
                }}
                limit={{
                  min: sensorThresholdData?.threshold_data[8].min,
                  healthy: sensorThresholdData?.threshold_data[8].healthy,
                  warning: sensorThresholdData?.threshold_data[8].warning,
                  max: sensorThresholdData?.threshold_data[8].max,
                }}
                axisname="Microphone One"
              />
            </div>
          </div>
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Microphone_two-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: UltrasoundGraphData.timestamp,
                  microphone_two: UltrasoundGraphData.microphone_two,
                }}
                limit={{
                  min: sensorThresholdData?.threshold_data[9].min,
                  healthy: sensorThresholdData?.threshold_data[9].healthy,
                  warning: sensorThresholdData?.threshold_data[9].warning,
                  max: sensorThresholdData?.threshold_data[9].max,
                }}
                axisname="Microphone Two"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-grow w-full gap-3 lg:flex-row flex-col md:flex-row">
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Magnetic flux_X-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_X: MagneticfluxGraphData.magnetic_flux_x,
                }}
                limit={{
                  min: sensorThresholdData?.threshold_data[5].min,
                  healthy: sensorThresholdData?.threshold_data[5].healthy,
                  warning: sensorThresholdData?.threshold_data[5].warning,
                  max: sensorThresholdData?.threshold_data[5].max,
                }}
                axisname="Magnetic flux_X"
              />
            </div>
          </div>
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Magnetic flux_Y-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_Y: MagneticfluxGraphData.magnetic_flux_y,
                }}
                limit={{
                  min: sensorThresholdData?.threshold_data[6].min,
                  healthy: sensorThresholdData?.threshold_data[6].healthy,
                  warning: sensorThresholdData?.threshold_data[6].warning,
                  max: sensorThresholdData?.threshold_data[6].max,
                }}
                axisname="Magnetic flux_Y"
              />
            </div>
          </div>
          <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
            <p className="p-5 font-semibold">Magnetic flux_Z-Time</p>
            <div className="w-full h-auto rounded-md">
              <DiagnosisGraph
                GraphData={{
                  timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_Z: MagneticfluxGraphData.magnetic_flux_z,
                }}
                limit={{
                  min: sensorThresholdData?.threshold_data[7].min,
                  healthy: sensorThresholdData?.threshold_data[7].healthy,
                  warning: sensorThresholdData?.threshold_data[7].warning,
                  max: sensorThresholdData?.threshold_data[7].max,
                }}
                axisname="Magnetic flux_Z"
              />
            </div>
          </div>
        </div>
        <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Acceleration-Velocity</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph GraphData={AccelerationVelocityGraphData} />
          </div>
        </div>
        <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Frequency</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph GraphData={FrequencyGraphData}  limit={{
                  min: sensorThresholdData?.threshold_data[2].min,
                  healthy: sensorThresholdData?.threshold_data[2].healthy,
                  warning: sensorThresholdData?.threshold_data[2].warning,
                  max: sensorThresholdData?.threshold_data[2].max,
                }}
                axisname="Frequency" />
          </div>
        </div>
        {/* <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Velocity</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph GraphData={VelocityGraphData} />
          </div>
        </div> */}
        {/* <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Magnetic Field</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph GraphData={MagneticFieldGraphData} />
          </div>
        </div> */}
        {/* <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Ultrasonic</p>
          <div className="w-full h-auto rounded-md">
            <DiagnosisGraph GraphData={SoundGraphData} />
          </div>
        </div> */}
        {/* <div className="bg-white w-full h-[500px] mt-4 p-5 rounded-md">
          <p className="p-5 font-semibold">Frequency</p>
          <div className="w-full h-auto rounded-md">
            <FrequencyGraph />
          </div>
        </div> */}
      </div>

      <div className="w-full flex mt-8 gap-5">
        {/* <div className="w-2/3 bg-white rounded-md px-8 py-6 flex flex-col">
          <p className="font-semibold">Predominant Frequency</p>
          <div className="flex flex-col mt-8 gap-5">
            {PredominantFrequencyData ? PredominantFrequencyData.length > 0 ? PredominantFrequencyData.map((frequency, key) => {
              return <DiagnosiMainComponent frequency={frequency} key={key} />
            }) : "no freqency found" : "loading..."}


          </div>
        </div> */}
        {/* <div className="w-1/3 bg-white rounded-md p-8 flex flex-col">
          <p className="font-semibold">Sensor Run time</p>
          <div className="w-full rounded-md mt-10">
            <SensorRunTimeGraph />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default DiagnosisMain;
