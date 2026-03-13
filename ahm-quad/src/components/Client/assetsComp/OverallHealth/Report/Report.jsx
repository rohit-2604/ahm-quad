import React, { useRef } from "react";
import { MdCancel } from "react-icons/md";
import DiagnosisAlert from "./graph/DiagnosisAlert";
import { useClientContext } from "../../../../../context/ClientStateContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import sensorImage from "../../../../../assets/sensor.png";
import ahm_logo from "../../../../../assets/login/ahm_logo.png";
<style>
  {`
    @media print {
      body * {
        visibility: hidden;
      }

      .printable-report, .printable-report * {
        visibility: visible;
      }

      .printable-report {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white;
        padding: 20px;
      }
    }
      .print-only {
  display: none;
}

@media print {
  .print-only {
    display: block !important;
  }
    .cuticon {
      display: none !important; /* Hide the cut icon when printing */
    }
}


    @page {
      size: A4 portrait; /* options: A4, letter, legal + portrait/landscape */
      margin: 0cm;        /* reduce/increase as needed */
    }

    .printable-report {
      transform: scale(0.80); /* adjust scaling */
      transform-origin: top left;
    }
  `}
</style>;

const Report = ({ report }) => {
  const { setFetchedReport } = useClientContext();
  const reportRef = useRef();
  console.log(report);

  const handleDownload = async () => {
    const headings = document.getElementById("print-headings");
  
    if (headings) {
      headings.classList.remove("hidden"); // Show headings
   
    }
  
    // Wait for the DOM to reflect the change
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    window.print();
  
    // Hide the headings again after printing
    if (headings) {
      headings.classList.add("hidden");
   
    }
  };
  

  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40">
      <div
        className="printable-report alertcontent overflow-x-hidden bg-white rounded-md flex justify-start max-h-[95vh] items-center w-full md:min-w-[800px] px-4 md:px-[3%] py-6 md:py-[2.4rem] flex-col gap-1 overflow-y-auto min-h-[70vh] md:max-w-[90vw] max-w-[95vw]"
        ref={reportRef}
      >
        <div className="flex justify-between w-full">
          <div className="text-xl md:text-2xl font-semibold heading">
            Overall Health
          </div>
          <div className="text-xl md:text-2xl font-semibold hidden pheading">
            Quick Diagnosis Report
          </div>
           <div className="px-1 clogo lg:text-xl text-sm sm:px-12 md:px-6 py-2 hidden bg-[#3F73BE] rounded-md text-white  font-extrabold  gap-2 flex-wrap items-center font-goldman justify-center">
                        <img
                          src={ahm_logo}
                          alt="AHM Logo"
                          className="w-5 h-5 lg:w-8 lg:h-8"
                        />
                        <span>AHM-QUAD</span>
                      </div>
          <div
            className="cursor-pointer cuticon"
            onClick={() => setFetchedReport(null)}
          >
            <MdCancel color="red" className="cursor-pointer" size={21} />
          </div>
        </div>

        <div className="text-2xl md:text-3xl mt-4">{report?.assetName}</div>

        <div className="w-full relative">
          <div className="assetimage w-full relative flex justify-center items-center flex-col py-8 md:py-12">
            <div className="flex flex-wrap justify-center w-full gap-2 mb-4 md:hidden">
              {report?.sensors?.map((sensor) => (
                <a
                  key={sensor.sensorId}
                  href={`#${sensor.sensorId}`}
                  className="hover:bg-blue-600 border-[2px] border-blue-600 hover:text-white font-semibold px-3 py-1 text-center rounded-md bg-transparent cursor-pointer duration-150 text-blue-600 text-sm flex items-center gap-1"
                >
                  <img src={sensorImage} alt="" className="w-5 h-5" />
                  {sensor.sensorType === "DE" ? "Driver End" : "Non Driver End"}
                </a>
              ))}
            </div>

            {/* Desktop sensor positioning - original layout */}
            <div className="hidden md:block">
              {report.assetType === "Pump" ||
              report.assetType === "Motor" ||
              report.assetType === "Blower" ? (
                <>
                  {report?.sensors?.map((sensor) =>
                    sensor.sensorType === "DE" ? (
                      <div className="relative w-[450px]" key={sensor.sensorId}>
                        <div className="absolute lg:top-[117px] lg:-left-[80px] top-[117px] -left-[80px] flex justify-center items-center gap-2 mb-6">
                          <a
                            href={`#${sensor.sensorId}`}
                            className="hover:bg-blue-600 border-[2px] border-blue-600 hover:text-white font-semibold px-8 py-1 text-center rounded-md bg-transparent cursor-pointer duration-150 text-blue-600 text-base"
                          >
                            Driver End
                          </a>
                          <img src={sensorImage} alt="" className="w-8" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="absolute pointer-events-none top-[165px] left-[290px] lg:top-[160px] lg:left-[300px] md:-right-[160px] flex flex-row justify-center items-center gap-10"
                        key={sensor.sensorId}
                      >
                        <img src={sensorImage} alt="" className="w-8 order-1" />
                        <a
                          href={`#${sensor.sensorId}`}
                          className="hover:bg-blue-600 border-[2px] !cursor-pointer !pointer-events-auto border-blue-600 hover:text-white font-semibold px-4 py-1 rounded-md text-center bg-transparent duration-150 text-blue-600 text-base order-2"
                        >
                          Non Driver End
                        </a>
                      </div>
                    )
                  )}
                </>
              ) : (
                report?.sensors?.map((sensor, index) => {
                  const deSensorsBeforeThis = report?.sensors
                    .slice(0, index)
                    .filter((s) => s.sensorType === "DE").length;
                  const ndeSensorsBeforeThis = report?.sensors
                    .slice(0, index)
                    .filter((s) => s.sensorType === "NDE").length;

                  if (sensor.sensorType === "DE") {
                    const dePosition = deSensorsBeforeThis;

                    if (dePosition === 0) {
                      return (
                        // <div
                        //   className="relative w-[450px]"
                        //   key={sensor.sensorId}
                        // >
                          <div className="absolute top-[60%] left-[31.5%] flex justify-center items-center gap-10">
                            <a
                              href={`#${sensor.sensorId}`}
                              className=" hover:bg-blue-600 border-[2px] border-blue-600 hover:text-white font-semibold px-8 py-1 text-center rounded-md bg-transparent cursor-pointer duration-150 text-blue-600 text-base"
                            >
                              Driver End
                            </a>
                            <img
                              src={sensorImage}
                              alt=""
                              className="w-8 order-1"
                            />
                          </div>
                        // </div>
                      );
                    } else if (dePosition === 1) {
                      return (
                        // <div className="relative w-[48%]" key={sensor.sensorId}>
                          <div className="absolute top-[31%] left-[33.5%] flex justify-center items-center gap-10">
                            <a
                              href={`#${sensor.sensorId}`}
                              className="hover:bg-blue-600 border-[2px] border-blue-600 hover:text-white font-semibold px-8 py-1 text-center rounded-md bg-transparent cursor-pointer duration-150 text-blue-600 text-base"
                            >
                              Driver End
                            </a>
                            <img src={sensorImage} alt="" className="w-8 order-1" />
                          </div>
                        // </div>
                      );
                    }
                  } else {
                    const ndePosition = ndeSensorsBeforeThis;
                    if (ndePosition === 0) {
                      return (
                        // <div
                        //   className="relative w-[510px]"
                        //   key={sensor.sensorId}
                        // >
                          <div className="absolute top-[30.5%] right-[34.4%] flex justify-center items-center gap-2">
                            <img
                              src={sensorImage}
                              alt=""
                              className="w-11 order-1"
                            />
                            <a
                              href={`#${sensor.sensorId}`}
                              className="hover:bg-blue-600 border-[2px] border-blue-600 w-full hover:text-white font-semibold px-4 py-1 rounded-md text-center bg-transparent cursor-pointer duration-150 text-blue-600 text-base order-2"
                            >
                              Non Driver End
                            </a>
                          </div>
                        // </div>
                      );
                    } else if (ndePosition === 1) {
                      return (
                        <div
                          className="w-[540px] relative"
                          key={sensor.sensorId}
                        >
                          <div className="absolute top-[218px] left-[345px] flex justify-center items-center gap-2">
                            <img
                              src={sensorImage}
                              alt=""
                              className="w-11 order-1"
                            />
                            <a
                              href={`#${sensor.sensorId}`}
                              className="hover:bg-blue-600 border-[2px] border-blue-600 w-full hover:text-white font-semibold px-4 py-1 rounded-md text-center bg-transparent cursor-pointer duration-150 text-blue-600 text-base order-2"
                            >
                              Non Driver End
                            </a>
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })
              )}
            </div>

            <img
              src={report?.assetImage}
              className="w-[200px] md:w-[300px]"
              alt=""
            />

            <div className="font-semibold text-xl md:text-3xl text-center mt-2">
              {report.assetClass} - {report.assetType}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 justify-center p-2 md:p-5">
          {report?.sensors?.map((sensor) =>
            sensor?.Data?.timestamp?.length > 0 ? (
              <React.Fragment key={sensor.sensorId}>
                <div
                  className="flex justify-start w-full gap-2 md:gap-4 mb-4"
                  id={sensor.sensorId}
                >
                  <div className="text-base md:text-lg font-medium bg-blue-600 text-center flex items-center justify-center px-3 md:px-4 py-1 md:py-2 rounded text-white">
                    {sensor.sensorId}
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center">
                    {sensor.sensorType}
                  </div>
                </div>

                {sensor.Analysis && (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse border border-gray-300 text-sm md:text-lg mb-6">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="border border-gray-300 p-2 md:p-4">
                            Sensor ID
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Type
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Mean Temp (°C)
                          </th>
                           <th className="border border-gray-300 p-2 md:p-4">
                            Mean Vib (X,Y,Z)
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Mean Mic (ch1,ch2)
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Mean MagneticFLux (X,Y,Z)
                          </th>
                         
                          <th className="border border-gray-300 p-2 md:p-4">
                            Temp Status
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Vib Status
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            Mic Status
                          </th>
                          <th className="border border-gray-300 p-2 md:p-4">
                            MagneticFlux Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-center text-gray-700">
                          <td className="border border-gray-300 p-2 md:p-4 font-medium bg-gray-50">
                            {sensor.sensorId}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-4">
                            {sensor.sensorType}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-4">
                            {sensor.Analysis?.meanTemperature || "-"}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-4 text-xs md:text-base">
                            {sensor.Analysis?.meanVibration
                              ? `X: ${sensor.Analysis.meanVibration.x}, Y: ${sensor.Analysis.meanVibration.y}, Z: ${sensor.Analysis.meanVibration.z}`
                              : "-"}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-4">
                            {sensor.Analysis?.meanmicrophone
                              ? `ch1: ${sensor.Analysis.meanmicrophone.ch1}, ch2: ${sensor.Analysis.meanmicrophone.ch2}`
                              : "-"}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-4">
                            {sensor.Analysis?.meanMagneticFlux
                              ? `X: ${sensor.Analysis.meanMagneticFlux.x}, Y: ${sensor.Analysis.meanMagneticFlux.y}, Z: ${sensor.Analysis.meanMagneticFlux.z}`
                              : "-"}
                          </td>
                          
                          <td
                            className={`border border-gray-300 p-2 md:p-4 ${
                              sensor.Analysis?.temperatureStatus === "NORMAL"
                                ? "text-green-600"
                                : sensor.Analysis?.temperatureStatus === "MINOR"
                                ? "text-yellow-500"
                                : sensor.Analysis?.temperatureStatus ===
                                  "SERIOUS"
                                ? "text-orange-600"
                                : sensor.Analysis?.temperatureStatus ===
                                  "CRITICAL"
                                ? "text-red-700"
                                : "text-gray-600"
                            } font-semibold`}
                          >
                            {sensor.Analysis?.temperatureStatus || "-"}
                          </td>
                          <td
                            className={`border border-gray-300 p-2 md:p-4 ${
                              sensor.Analysis?.vibrationStatus === "NORMAL"
                                ? "text-green-600"
                                : sensor.Analysis?.vibrationStatus === "MINOR"
                                ? "text-yellow-500"
                                : sensor.Analysis?.vibrationStatus === "SERIOUS"
                                ? "text-orange-600"
                                : sensor.Analysis?.vibrationStatus ===
                                  "CRITICAL"
                                ? "text-red-700"
                                : "text-gray-600"
                            } font-semibold`}
                          >
                            {sensor.Analysis?.vibrationStatus || "-"}
                          </td>
                          <td
                            className={`border border-gray-300 p-2 md:p-4 ${
                              sensor.Analysis?.microphoneStatus === "NORMAL"
                                ? "text-green-600"
                                : sensor.Analysis?.microphoneStatus === "MINOR"
                                ? "text-yellow-500"
                                : sensor.Analysis?.microphoneStatus ===
                                  "SERIOUS"
                                ? "text-orange-600"
                                : sensor.Analysis?.microphoneStatus ===
                                  "CRITICAL"
                                ? "text-red-700"
                                : "text-gray-600"
                            } font-semibold`}
                          >
                            {sensor.Analysis?.microphoneStatus || "-"}
                          </td>
                          <td
                            className={`border border-gray-300 p-2 md:p-4 ${
                              sensor.Analysis?.magneticFluxStatus === "NORMAL"
                                ? "text-green-600"
                                : sensor.Analysis?.magneticFluxStatus ===
                                  "MINOR"
                                ? "text-yellow-500"
                                : sensor.Analysis?.magneticFluxStatus ===
                                  "SERIOUS"
                                ? "text-orange-600"
                                : sensor.Analysis?.magneticFluxStatus ===
                                  "CRITICAL"
                                ? "text-red-700"
                                : "text-gray-600"
                            } font-semibold`}
                          >
                            {sensor.Analysis?.magneticFluxStatus || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="10"
                            className="border border-gray-300 p-2 md:p-4 text-gray-700 bg-gray-50 text-sm md:text-base"
                          >
                            <strong>Temperature Action:</strong>{" "}
                            {sensor.Analysis?.temperatureAction || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="10"
                            className="border border-gray-300 p-2 md:p-4 text-gray-700 bg-gray-50 text-sm md:text-base"
                          >
                            <strong>Vibration Action:</strong>{" "}
                            {sensor.Analysis?.vibrationAction || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="10"
                            className="border border-gray-300 p-2 md:p-4 text-gray-700 bg-gray-50 text-sm md:text-base"
                          >
                            <strong>Ultrasound Action:</strong>{" "}
                            {sensor.Analysis?.microphoneAction || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="10"
                            className="border border-gray-300 p-2 md:p-4 text-gray-700 bg-gray-50 text-sm md:text-base"
                          >
                            <strong>Magnetic Flux Action:</strong>{" "}
                            {sensor.Analysis?.magneticFluxAction || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                 <DiagnosisAlert
  timeStamp={sensor.Data.timestamp}
  {...{
    temperature_one_status: sensor.Data.temperature_one,
    temperature_two_status: sensor.Data.temperature_two,
  
  }}
/>
              <DiagnosisAlert
  timeStamp={sensor.Data.timestamp}
  {...{
   
    vibration_x_status: sensor.Data.vibration_x,
    vibration_y_status: sensor.Data.vibration_y,
    vibration_z_status: sensor.Data.vibration_z,
  }}
/>
              <DiagnosisAlert
  timeStamp={sensor.Data.timestamp}
  {...{
   
    mic_one_status: sensor.Data.microphone_one,
    mic_two_status: sensor.Data.microphone_two,

  }}
/>
              <DiagnosisAlert
  timeStamp={sensor.Data.timestamp}
  {...{
   
    magnetic_flux_x_status: sensor.Data.magnetic_flux_x,
    magnetic_flux_y_status: sensor.Data.magnetic_flux_y,
    magnetic_flux_z_status: sensor.Data.magnetic_flux_xz
    
    
  }}
/>
              </React.Fragment>
            ) : (
              <React.Fragment key={sensor.id}>
                <div
                  className="flex justify-start w-full gap-2 mb-4"
                  id={sensor.sensorId}
                >
                  <div className="text-base md:text-lg font-medium bg-blue-600 px-3 md:px-4 py-1 md:py-2 rounded text-white">
                    {sensor.sensorId}
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center">
                    {sensor.sensorType}
                  </div>
                </div>
                <div className="flex justify-center items-center w-full">
                  <div className="text-base md:text-lg font-medium text-gray-600 px-4 py-2 rounded">
                    No Data
                  </div>
                </div>
              </React.Fragment>
            )
          )}
        </div>

        <div className="flex w-full mt-4 justify-end">
          <div
            onClick={handleDownload}
            className="bg-blue-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-md cursor-pointer hover:bg-transparent hover:text-blue-600 border-[2px] border-blue-600 duration-300 text-sm md:text-base"
          >
            Download
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
