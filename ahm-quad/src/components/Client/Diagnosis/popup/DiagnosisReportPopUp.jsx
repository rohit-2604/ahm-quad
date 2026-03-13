import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Lottie from "react-lottie";
import greenTick from "../../../../Lottie/greentick.json";
import unHealthyAnimation from "../../../../Lottie/inactive.json";
import { FaCircleInfo } from "react-icons/fa6";
import DiagnosisGraph from "../../graph/DiagnosisGraph";
import FrequencyGraph from "../../graph/FrequencyGraph";
import ReportGraph from "../../graph/ReportGraph";
import { IoCloseCircleSharp } from "react-icons/io5";
import logo from "../../../../assets/logo.png";
import { useParams } from "react-router-dom";
import { usePost } from "../../../../hooks/usehttp";
import { RiHealthBookFill } from "react-icons/ri";
import gsap from "gsap";
import { useClientContext } from "../../../../context/ClientStateContext";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";

function DiagnosisReportPopUp({
  onClose,
  AccelerationGraphData,
  TemperatureTimeGraphData,
  VibrationGraphData,
  AccelerationVelocityGraphData,
  MagneticfluxGraphData,
  UltrasoundGraphData,
  RangeData,
}) {
  // // console.log(reportRef.current)

  const accessToken = localStorage.getItem("token");
  const [ultrasonicData, setultrasonicData] = useState();
  const { asset_id } = useParams();
  const { sensor_id } = useParams();
      const { sensorThresholdData, setsensorThresholdData } = useClientContext();
  const { postRequest } = usePost();
  const [assetData, setAssetData] = useState();
  const [assetParameter, setAssetParameter] = useState();
  const [assetSensor, setAssetSensor] = useState([]);
  const [assetSensorDetail, setAssetSensorDetail] = useState();
  const [assetParameterDetail, setAssetParameterDetail] = useState();
  const [assetDetails, setassetDetails] = useState();
  const [oneSensor, setOneSensor] = useState();

  // // console.log("SENSOR ID>>>>>>  "+sensor_id)
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  useEffect(() => {
    // // console.log(ultrasonicData)
  }, [ultrasonicData]);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const json = await postRequest(
          `/company/fetchoneasset/${asset_id}`,
          {},
          accessToken
        );

        setAssetData(json.data);
      } catch (error) {
        console.error("Error fetching asset details:", error);
      }
    };

    const fetchAssetParameter = async () => {
      try {
        const json = await postRequest(
          `/company/fetchparameters/${asset_id}`,
          {},
          accessToken
        );
        setAssetParameter(json.data);
        // // console.log("Asset Parameter: " + assetParameterDetail);
      } catch (error) {
        console.error("Error fetching asset parameters:", error);
      }
    };

    const fetchAssetSensor = async () => {
      try {
        const json = await postRequest(
          `/company/fetchsensor/${asset_id}`,
          {},
          accessToken
        );
        setAssetSensor(json.data);
        // // console.log(json,"asset sensor")
      } catch (error) {
        console.error("Error fetching asset Sensors:", error);
      }
    };

    fetchAssetDetails();
    fetchAssetParameter();
    fetchAssetSensor();
  }, [asset_id, accessToken]);

  const averageValue = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0; // Return 0 if input is not a valid array or is empty
    }
    const sum = arr.reduce((acc, value) => acc + value, 0); // Sum all elements
    const average = sum / arr.length; // Divide sum by the number of elements
    return average.toFixed(2); // Format to two decimal places
  };

  useEffect(() => {
    const fetchOneSensor = async () => {
      try {
        const json = await postRequest(
          `/company/fetchonesensor/${sensor_id}`,
          {},
          accessToken
        );

        if (json && json.data) {
          setOneSensor(json.data);
        } else {
          console.warn("No sensor data returned from the API:", json);
        }
      } catch (error) {
        console.error("Error fetching One Sensor:", error);
      }
    };

    if (sensor_id) {
      fetchOneSensor();
    }
  }, [sensor_id]);

  useEffect(() => {
    // // console.log(oneSensor);
  }, [oneSensor]);

  const reportRef = useRef();

  const handleDownloadReport = () => {
  if (reportRef.current) {
    // Temporarily adjust styles for full capture
    reportRef.current.style.overflowY = "visible";
    reportRef.current.style.height = "auto";

    // Create the watermark element
    const watermark = document.createElement("img");
    watermark.src = logo;
    watermark.alt = "Watermark";
    watermark.style.position = "absolute";
    watermark.style.top = "50%";
    watermark.style.left = "50%";
    watermark.style.transform = "translate(-50%, -50%)";
    watermark.style.opacity = "0.05";
    watermark.style.zIndex = "0";
    watermark.style.pointerEvents = "none";
    watermark.style.width = "500px";
    watermark.style.userSelect = "none";

    // Append watermark to the report
    reportRef.current.appendChild(watermark);

    // Wait a short delay to ensure DOM is updated before capturing
    setTimeout(() => {
      html2canvas(reportRef.current, {
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let position = 0;
        const marginTop = 5;

        while (position < imgHeight) {
          pdf.addImage(
            imgData,
            "PNG",
            0,
            marginTop - position,
            pdfWidth,
            imgHeight
          );
          position += pdfHeight;
          if (position < imgHeight) {
            pdf.addPage();
          }
        }

        // Clean up watermark
        reportRef.current.removeChild(watermark);
        // Restore styles
        reportRef.current.style.overflowY = "scroll";
        reportRef.current.style.height = "100%";

        pdf.save("Diagnosis_Report.pdf");
      });
    }, 100); // slight delay to allow DOM update
  }
};


  const unhealthyAnimation = {
    loop: false,
    autoplay: true,
    animationData: unHealthyAnimation,
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

  useEffect(() => {
    if (assetData) {
      // // console.log(assetData)
      setassetDetails({
        title: "Asset Details",
        items: [
          { label: "Asset Id", value: assetData.asset_id },
          { label: "Asset Type", value: assetData.asset_type },
          { label: "Workshop Id", value: assetData.workshop_id_fk },
          { label: "Site", value: assetData.site },
          { label: "Application", value: assetData.application },
          { label: "Manufacturer", value: "IEMA" },
        ],
      });
    }
  }, [assetData]);

  useEffect(() => {
    if (assetParameter) {
      // // console.log(assetParameter);

      if (
        assetParameter?.parameters &&
        assetParameter?.parameters?.length > 0
      ) {
        setAssetParameterDetail({
          title: "Asset Parameters",
          items: assetParameter?.parameters?.map((param) => ({
            label: param.type,
            value: `${param.value} ${param.unit}`,
          })),
        });
      } else {
        setAssetParameterDetail({
          title: "Asset Parameters",
          items: [{ label: "No parameter is selected", value: "" }],
        });
      }
    }
  }, [assetParameter]);
  useEffect(() => {
    if (Array.isArray(assetSensor)) { // Ensure it's an array
      const sensorDetails = assetSensor.map((sensor) => ({
        title: `Sensor: ${sensor?.sensor_type}`,
        items: [
          { label: "Sensor ID", value: sensor.sensor_id },
          { label: "Sensor Type", value: sensor.sensor_type },
          { label: "Asset ID", value: sensor.asset_id_fk },
          { label: "Sensor Description", value: sensor.sensor_description },
        ],
      }));
  
      setAssetSensorDetail(sensorDetails);
    } else {
      console.error("assetSensor is not an array:", assetSensor);
    }
  }, [assetSensor]);
  

  const renderTable = (data) => (
    <div className="w-full">
      <div className="px-10 py-1 bg-black rounded-md text-white flex items-center justify-start text-sm w-auto">
        {data.title}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <td className="px-6 py-2 border font-bold border-black text-xs bg-[#C5D3E8]">
                Attribute
              </td>
              <td className="px-6 py-2 border font-bold border-black text-xs bg-[#C5D3E8]">
                Value
              </td>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-2 border border-black text-xs">
                  {item.label}
                </td>
                <td className="px-6 py-2 border border-black text-xs">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
  return (
    <div
      className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40 pl-20 pr-10 pt-10"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white h-full w-full rounded-[14px] flex flex-col alertcontent gap-14 relative overflow-y-scroll p-5 "
        ref={reportRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center">
          <img
  src={logo}
 
  className="h-16"
/>
            <p className="text-[#6F6F6F] text-xl">Diagnosis Report</p>
            <IoCloseCircleSharp
              color="red"
              onClick={handleOverlayClick}
              className="cursor-pointer self-start"
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <p className="text-black text-2xl font-semibold">{assetData?.asset_name}</p>
              <div className="px-4 h-5 bg-black text-white text-[8px] flex items-center justify-center rounded-md">
              {assetData?.class}
              </div>
            </div>
            <div className="text-xs text-gray-500">
            {RangeData?.currentDate}
            </div>
            <button
              className="px-10 py-1 bg-black text-white rounded-md cursor-pointer"
              onClick={handleDownloadReport}
              aria-label="Download Diagnosis Report"
            >
              Download
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 w-full">
            {assetDetails ? renderTable(assetDetails) : "NO KEY DATA AVAILABLE"}

            {assetParameterDetail ? (
              renderTable(assetParameterDetail)
            ) : (
              <span>NO PARAMETERS AVAILABLE</span>
            )}

            {assetSensorDetail
              ? assetSensorDetail.map((sensorDetail, index) => (
                  <div key={index}>{renderTable(sensorDetail)}</div>
                ))
              : "NO KEY DATA AVAILABLE"}
          </div>






{/* add the new maintanance field code here */}


{RangeData.maintenance && (
  <div className="mt-10 p-6 rounded-md bg-white  ">
    <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
      🔧 Maintenance Suggestions & Fault Report
    </h2>

    {/* Probable Faults */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-red-600 mb-3 ">🛠 Probable Faults</h3>
      <ul className="list-disc pl-6 text-base text-gray-800 font-medium">
        {RangeData.maintenance.probable_faults.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    {/* Fault Ranking Table */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-red-600 mb-3 ">📊 Fault Ranking</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-base border border-gray-400 rounded-md shadow-md">
          <thead className="bg-gray-100 text-gray-900 font-bold">
            <tr>
              <th className="border px-4 py-3 text-left">Fault</th>
              <th className="border px-4 py-3 text-left">Score</th>
              <th className="border px-4 py-3 text-left">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {RangeData.maintenance.fault_ranking.map((fault, idx) => (
              <tr key={idx} className="hover:bg-red-50">
                <td className="border px-4 py-3 font-semibold">{fault.fault}</td>
                <td className="border px-4 py-3 text-red-700 font-bold">{fault.score.toFixed(2)}</td>
                <td className="border px-4 py-3">
                  {fault.evidence.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {fault.evidence.map((ev, i) => (
                        <li key={i} className="text-gray-700">
                          <span className="font-semibold">{ev.field}</span>: deviation{" "}
                          <span className="text-red-600 font-bold">{ev.deviation.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic">No evidence</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* ROC & Surge Section */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-red-600 mb-3 ">⚡ Overcurrent Analysis</h3>
      <div className="text-base text-gray-800 grid grid-cols-2 gap-6 font-medium">
        <p>
          <span className="font-bold text-gray-900">ROC Mean:</span>{" "}
          <span className="text-red-700">{RangeData.maintenance.overcurrent.roc_mean.toFixed(4)}</span>
        </p>
        <p>
          <span className="font-bold text-gray-900">Surge %:</span>{" "}
          <span className="text-red-700">
            {(RangeData.maintenance.overcurrent.surge_pct * 100).toFixed(4)}%
          </span>
        </p>
      </div>
    </div>

    {/* Hard Limits */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-red-600 mb-3 ">📌 Thresholds Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-800 font-medium">
        {Object.entries(RangeData.maintenance.hard_limits_used).map(([key, value], idx) => (
          <div key={idx} className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm">
            <p className="font-bold text-gray-900 mb-2">
              {key.replace(/_/g, " ").toUpperCase()}
            </p>
            {typeof value === "object" ? (
              <ul className="list-disc pl-4">
                {Object.entries(value).map(([k, v], i) => (
                  <li key={i}>
                    {k}: <span className="text-red-700 font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-700 font-semibold">{value}</p>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Distance to ISO limits */}
    {RangeData.maintenance.vibration_distance_to_limits && (
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-red-600 mb-3 ">📉 Distance to ISO Limits</h3>
        <div className="text-base text-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 font-medium">
          {Object.entries(RangeData.maintenance.vibration_distance_to_limits).map(
            ([label, val], i) => (
              <p key={i}>
                <strong className="text-gray-900">{label.replace(/_/g, " ")}:</strong>{" "}
                <span className="text-red-700">{val}</span>
              </p>
            )
          )}
        </div>
      </div>
    )}
  </div>
)}








          <div className="flex items-center justify-center mt-10 ">
            <div className="bg-black px-10 py-2 text-xs text-white flex justify-center items-center  rounded-md ">
              Asset Current status
            </div>
          </div>

       <div className="flex flex-wrap items-center justify-center gap-10 mt-10">
  {/* Operational Health */}
  <div className="flex flex-col rounded-md border border-black overflow-hidden w-[260px]">
    <div className="flex w-full bg-black items-center justify-center">
      <p className="text-white text-xs text-center p-2">Operational</p>
    </div>
    <div
      className={`flex ${
        RangeData.operational_health === "Healthy"
          ? "bg-[#EDFFEE]"
          : RangeData.operational_health === "Unhealthy"
          ? "bg-[#FFF7DB]"
          : ""
      } justify-center items-center text-center py-8 px-10`}
    >
      {RangeData.operational_health === "Healthy" ? (
        <Lottie options={healthyAnimation} height={40} width={40} />
      ) : RangeData.operational_health === "Unhealthy" ? (
        <Lottie options={unhealthyAnimation} height={40} width={40} />
      ) : (
        ""
      )}
      <div
        className={`${
          RangeData.operational_health === "Healthy"
            ? "text-[#4BAE4F]"
            : "text-[#F1BC00]"
        } flex text-xl font-[500]`}
      >
        {RangeData.operational_health}
      </div>
    </div>
  </div>

  {/* Overall Health */}
  <div className="flex flex-col rounded-md border border-black overflow-hidden w-[260px]">
    <div className="flex w-full bg-black items-center justify-center">
      <p className="text-white text-xs text-center p-2">Overall Health</p>
    </div>
    <div
      className={`flex ${
        RangeData.overall_health === "Healthy"
          ? "bg-[#EDFFEE]"
          : RangeData.overall_health === "Unhealthy"
          ? "bg-[#FFF7DB]"
          : ""
      } justify-center items-center text-center py-8 px-10`}
    >
      {RangeData.overall_health === "Healthy" ? (
        <Lottie options={healthyAnimation} height={40} width={40} />
      ) : RangeData.overall_health === "Unhealthy" ? (
        <Lottie options={unhealthyAnimation} height={40} width={40} />
      ) : (
        ""
      )}
      <div
        className={`${
          RangeData.overall_health === "Healthy"
            ? "text-[#4BAE4F]"
            : "text-[#F1BC00]"
        } flex text-xl font-[500]`}
      >
        {RangeData.overall_health}
      </div>
    </div>

    {/* Possible Cause Section */}
    {RangeData.overall_health === "Unhealthy" && RangeData.possible_cause && (
      <div className="bg-white px-4 py-3 border-t border-gray-300">
        <p className="text-sm text-gray-700 font-medium mb-1">Possible Cause:</p>
        <p className="text-xs text-gray-600">{RangeData.possible_cause}</p>
      </div>
    )}
  </div>

  {/* Service Status */}
  <div className="flex flex-col rounded-md border border-black overflow-hidden w-[260px]">
    <div className="flex w-full bg-black items-center justify-center">
      <p className="text-white text-xs text-center p-2">Service Status</p>
    </div>
    <div
      className={`flex ${
        RangeData.serviceStatus === "Ok" ? "bg-[#EDFFEE]" : "bg-[#FFF7DB]"
      } justify-center items-center text-center py-8 px-10`}
    >
      {RangeData.serviceStatus === "Ok" ? (
        <Lottie options={healthyAnimation} height={40} width={40} />
      ) : (
        <Lottie options={unhealthyAnimation} height={40} width={40} />
      )}
      <div
        className={`flex text-xl font-[500] ${
          RangeData.serviceStatus === "Ok"
            ? "text-[#4BAE4F]"
            : "text-[#F1BC00]"
        }`}
      >
        {RangeData.serviceStatus}
      </div>
    </div>
  </div>
 
</div>

           <div className="flex my-6 gap-5 flex-wrap justify-center items-center w-full">
  <div className="flex bg-white w-full min-h-[50px] rounded-md gap-3 py-3 pt-6 px-5 flex-col pb-8 border-[1px] border-gray-200">
          <div className="flex justify-start items-center  gap-2">
            <IoMdTrendingUp size={30} />
            <p className="text-2xl font-semibold"> Total Up Time</p>
          </div>
          <div className="flex w-full justify-center items-center bg-[#EBF2FF] py-6 rounded-md">
            {formatTime(RangeData.totalRuntime-RangeData.totalDowntime)}
          </div>
        </div>
        <div className="flex bg-white w-full min-h-[50px] rounded-md gap-3 py-3 pt-6 px-5 flex-col pb-8 border-[1px] border-gray-200">
          <div className="flex justify-start items-center  gap-2">
            <IoMdTrendingDown size={30} />
            <p className="text-2xl font-semibold"> Total Down Time</p>
          </div>
          <div className="flex w-full justify-center items-center bg-[#EBF2FF] py-6 rounded-md">
            {formatTime(RangeData.totalDowntime)}
          </div>
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
      ([key, { status, average,high,low }]) => {
        const label = key
          .replace(/_/g, ' ')
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
              <p className="text-lg font-medium text-gray-800">{label==="Temperature One"?"Bearing":label==="Temperature Two"?"Skin":label}</p>
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
          <div className="flex flex-col">
            <div className="flex items-start justify-start mt-10">
              <div className="bg-black px-10 py-2 text-xs text-white flex justify-center items-center rounded-md">
                Motor Health Report:
              </div>
            </div>

            <div className="flex mt-4 gap-10">
              <table className="w-full border-collapse">
                {/* Overall Header */}
                <thead>
                  <tr>
                    <th
                      colSpan="3"
                      className="bg-[#E8E8E8] text-black text-center py-2 rounded-t-md"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p>Temperature</p>
                        <FaCircleInfo />
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan="3"
                      className="border px-4 py-2 bg-white text-center"
                    >
                      {oneSensor?.sensor_type || "N/A"}
                    </th>
                  </tr>
                  <tr>
                    <th className="border px-4 py-2 bg-white text-center">
                      Skin
                    </th>
                    <th className="border px-4 py-2 bg-white text-center">
                      Bearing
                    </th>
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.skin[0]}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.bearing[0]}
                    </td>
                    {/* <td className="border px-4 py-2 text-center">18 C</td> */}
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.skin[49]}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.bearing[49]}
                    </td>
                    {/* <td className="border px-4 py-2 text-center">19 C</td> */}
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.skin[99]}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {TemperatureTimeGraphData?.bearing[99]}
                    </td>
                    {/* <td className="border px-4 py-2 text-center">20 C</td> */}
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-collapse">
                {/* Overall Header */}
                <thead>
                  <tr>
                    <th
                      colSpan="3"
                      className="bg-[#E8E8E8] text-black text-center py-2 rounded-t-md"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p>Acceleration</p>
                        <FaCircleInfo />
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="border px-4 py-2 bg-white text-center">
                      Direction
                    </th>
                    <th className="border px-4 py-2 bg-white text-center">
                      {oneSensor?.sensor_type}
                    </th>
                    {/* <th className="border px-4 py-2 bg-white text-center">DE</th> */}
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 text-center">Tangential</td>
                    <td className="border px-4 py-2 text-center">
                      {averageValue(AccelerationGraphData?.tangential)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-center">Axial</td>
                    <td className="border px-4 py-2 text-center">
                      {averageValue(AccelerationGraphData?.axial)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-center">Radial</td>
                    <td className="border px-4 py-2 text-center">
                      {averageValue(AccelerationGraphData?.radial)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col">
              <div className="flex items-start justify-start mt-10">
                <div className="bg-black px-10 py-2 text-xs text-white flex justify-center items-center rounded-md w-full">
                  Spatial Analysis
                </div>
              </div>

              <div className="flex mt-10 w-full mr-5">
                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-[500] my-5 ">
                      Acceleration Spectra:{" "}
                    </p>
                  </div>

                  {/* Scale down ReportGraph */}
                  <div className="w-full flex justify-center">
                    <div
                      style={{
                        transformOrigin: "top left",
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      {AccelerationGraphData ? (
                        <ReportGraph graphData={AccelerationGraphData}  axisname="Acceleration "
 limit={{
    min: sensorThresholdData?.threshold_data[2].min,
    healthy: sensorThresholdData?.threshold_data[2].healthy,
    warning: sensorThresholdData?.threshold_data[2].warning,
    max: sensorThresholdData?.threshold_data[2].max
  }} />
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-sm font-[500] my-5 ">
                      Vibration Spectra:{" "}
                    </p>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <div style={{ width: "100%", height: "auto" }}>
                      {VibrationGraphData ? (
                        <ReportGraph graphData={VibrationGraphData}  axisname="Vibration "
 limit={{
    min: sensorThresholdData?.threshold_data[2].min,
    healthy: sensorThresholdData?.threshold_data[2].healthy,
    warning: sensorThresholdData?.threshold_data[2].warning,
    max: sensorThresholdData?.threshold_data[2].max
  }}  />
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-10 w-full mr-5">
                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-[500] my-5 ">
                      Microphone One Spectra:{" "}
                    </p>
                  </div>

                  {/* Scale down ReportGraph */}
                  <div className="w-full flex justify-center">
                    <div
                      style={{
                        transformOrigin: "top left",
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      {AccelerationGraphData ? (
                        <ReportGraph graphData={{
                  timestamp: UltrasoundGraphData.timestamp,
                  microphone_one: UltrasoundGraphData.microphone_one,
                }} 
                 limit={{
                  min: sensorThresholdData?.threshold_data[8].min,
                  healthy: sensorThresholdData?.threshold_data[8].healthy,
                  warning: sensorThresholdData?.threshold_data[8].warning,
                  max: sensorThresholdData?.threshold_data[8].max,
                }}
                axisname="Microphone One"/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-[500] my-5 ">
                      Microphone Two Spectra:{" "}
                    </p>
                  </div>

                  {/* Scale down ReportGraph */}
                  <div className="w-full flex justify-center">
                    <div
                      style={{
                        transformOrigin: "top left",
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      {AccelerationGraphData ? (
                        <ReportGraph graphData={{
                  timestamp: UltrasoundGraphData.timestamp,
                  microphone_two: UltrasoundGraphData.microphone_two,
                }} 
                 limit={{
                  min: sensorThresholdData?.threshold_data[9].min,
                  healthy: sensorThresholdData?.threshold_data[9].healthy,
                  warning: sensorThresholdData?.threshold_data[9].warning,
                  max: sensorThresholdData?.threshold_data[9].max,
                }}
                axisname="Microphone Two"/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>
             
                
              </div>

  <div className="flex mt-10 w-full mr-5">



   <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-sm font-[500] my-5 ">
                      Magnetic flux_X Spectra:{" "}
                    </p>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <div style={{ width: "100%", height: "auto" }}>
                      {VibrationGraphData ? (
                        <ReportGraph graphData={{timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_X: MagneticfluxGraphData.magnetic_flux_x,}}  limit={{
                  min: sensorThresholdData?.threshold_data[5].min,
                  healthy: sensorThresholdData?.threshold_data[5].healthy,
                  warning: sensorThresholdData?.threshold_data[5].warning,
                  max: sensorThresholdData?.threshold_data[5].max,
                }}
                axisname="Magnetic flux_X"/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>
                 <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-sm font-[500] my-5 ">
                      Magnetic flux_Y Spectra:{" "}
                    </p>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <div style={{ width: "100%", height: "auto" }}>
                      {VibrationGraphData ? (
                        <ReportGraph graphData={{timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_Y: MagneticfluxGraphData.magnetic_flux_y,}}  limit={{
                  min: sensorThresholdData?.threshold_data[6].min,
                  healthy: sensorThresholdData?.threshold_data[6].healthy,
                  warning: sensorThresholdData?.threshold_data[6].warning,
                  max: sensorThresholdData?.threshold_data[6].max,
                }}
                axisname="Magnetic flux_Y"/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>
                 <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-sm font-[500] my-5 ">
                      Magnetic flux_Z Spectra:{" "}
                    </p>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <div style={{ width: "100%", height: "auto" }}>
                      {VibrationGraphData ? (
                        <ReportGraph graphData={{timestamp: MagneticfluxGraphData.timestamp,
                  Magnetic_flux_Z: MagneticfluxGraphData.magnetic_flux_z,}}  limit={{
                  min: sensorThresholdData?.threshold_data[7].min,
                  healthy: sensorThresholdData?.threshold_data[7].healthy,
                  warning: sensorThresholdData?.threshold_data[7].warning,
                  max: sensorThresholdData?.threshold_data[7].max,
                }}
                axisname="Magnetic flux_Z"/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>


</div>





 <div className="flex mt-10 w-full mr-5">
                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-[500] my-5 ">
                      Temperature Spectra:{" "}
                    </p>
                  </div>

                  {/* Scale down ReportGraph */}
                  <div className="w-full flex justify-center">
                    <div
                      style={{
                        transformOrigin: "top left",
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      {TemperatureTimeGraphData ? (
                        <ReportGraph graphData={TemperatureTimeGraphData}  axisname="Temperature" limit={{
    min: sensorThresholdData?.threshold_data[0].min,
    healthy: sensorThresholdData?.threshold_data[0].healthy,
    warning: sensorThresholdData?.threshold_data[0].warning,
    max: sensorThresholdData?.threshold_data[0].max
  }}/>
                      ) : (
                        "loading..."
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-sm font-[500] my-5 ">
                     Acceleration - Velocity Trend:{" "}
                    </p>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <div style={{ width: "100%", height: "auto" }}>
                      {AccelerationVelocityGraphData ? (
                        <ReportGraph
                          graphData={AccelerationVelocityGraphData}
                           axisname="Acceleration - Velocity "
 limit={{
    min: sensorThresholdData?.threshold_data[2].min,
    healthy: sensorThresholdData?.threshold_data[2].healthy,
    warning: sensorThresholdData?.threshold_data[2].warning,
    max: sensorThresholdData?.threshold_data[2].max
  }} 
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                
              </div>













            </div>
          
         

          

       

           

        
          
          </div>
        </div>
      </div>
    </div>
  );
}
export default DiagnosisReportPopUp;
