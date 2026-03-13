import { useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { gsap } from "gsap";
import useSocket from "../../../../hooks/useSocket";
import { usePost } from "../../../../hooks/usehttp";
import Sensor from "./Sensor";
import Report from "./Report/Report";
import PastReportComponent from "./PastReports/PastReportComponent";
import { useClientContext } from "../../../../context/ClientStateContext";

const OverallHealthPopup = ({ setPopupOpen, sensors, assetId, asset }) => {
  // // console.log(assetId)
  const circleRef = useRef(null);
  const accesToken = localStorage.getItem("token");
  const { FetchedReport, setFetchedReport } = useClientContext();

  const bgcircleRef = useRef(null);
  const [isLoading, setisLoading] = useState(false);
  const { postRequest } = usePost();

  const handleAnalyzeOver = () => {
    const circle = circleRef.current;
    const bgcircle = bgcircleRef.current;
    if (isLoading) return null;
    else {
      gsap
        .timeline()
        .to(
          circle,
          {
            padding: 0,
            duration: 0.3,
            ease: "power1.inOut",
          },
          0
        )
        .to(
          bgcircle,
          {
            scale: 0.9,
            duration: 0.3,
            ease: "power1.inOut",
          },
          "<"
        );
    }
  };
  const handleAnalyzeLeave = () => {
    const circle = circleRef.current;
    const bgcircle = bgcircleRef.current;
    if (isLoading) return null;
    else {
      gsap
        .timeline()
        .to(bgcircle, {
          delay: 0.1,
          scale: 1,
          duration: 0.3,
          ease: "power1.inOut",
        })
        .to(circle, {
          scale: 1,
          padding: "0.25rem 0.25rem 0.25rem 0.25rem",
          duration: 0.3,
          ease: "power1.inOut",
        });
    }
  };
  const formatDate = (date) => {
    const pad = (num) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const handleAnalyzeClick = async () => {
    const circle = circleRef.current;
    const bgcircle = bgcircleRef.current;
    gsap
      .timeline()
      .to(bgcircle, {
        delay: 0.1,
        scale: 1,
        padding: "0.5rem 5rem 0.5rem 5rem",
        duration: 0.3,
        ease: "power1.inOut",
      })
      .to(circle, {
        scale: 1,

        duration: 0.3,
        ease: "power1.inOut",
      });
    setTimeout(() => {
      setisLoading(true);
    }, 200);
    const date = new Date();
    // console.log(formatDate(date));

    try {
      const response = await postRequest(
        `/company/analysisreports/${assetId}`,
        { datetime: formatDate(date) },
        accesToken
      );
      if (response.success) {
        setisLoading(false);
        setFetchedReport(response.data);
        // console.log(response.data);
        gsap
          .timeline()
          .to(bgcircle, {
            delay: 0.1,
            scale: 1,
            padding: "2.5rem 1.25rem 2.5rem 1.25rem",
            duration: 0.3,
            ease: "power1.inOut",
          })
          .to(circle, {
            scale: 1,
            padding: "0.25rem",
            duration: 0.3,
            ease: "power1.inOut",
          });
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  return (
    <div className="flex bg-[#00000034] backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-[400]">
      <div className="bg-white py-6 px-6 md:py-10 md:px-14 rounded-[14px] flex flex-col justify-center items-center relative w-[90%] sm:max-w-[400px] md:max-w-[600px] alertcontent lg:max-w-[800px] h-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between w-full">
          <div className="text-2xl font-semibold">Overall Health</div>
          <div className="cursor-pointer" onClick={() => setPopupOpen(false)}>
            <MdCancel color="red" className="cursor-pointer" size={21} />
          </div>
        </div>
        <div className="flex mt-3 justify-center items-center gap-x-10 gap-y-2 flex-wrap w-[100%]">
          {sensors.map((sensor) => {
            return <Sensor sensor={sensor} />;
          })}
        </div>
        <div className="flex w-full justify-center items-center min-h-[200px] ">
          <div
            className="animcircle border-2 rounded-full border-blue-400 py-1 px-1"
            ref={circleRef}
          >
            <div
              className="circle bg-blue-600 px-5 cursor-pointer py-10 text-white rounded-full"
              ref={bgcircleRef}
              onMouseOver={handleAnalyzeOver}
              onMouseLeave={handleAnalyzeLeave}
              onClick={handleAnalyzeClick}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </div>
          </div>
        </div>
        {FetchedReport && <Report report={FetchedReport} />}
        <div className="flex flex-col items-start w-full justify-between">
          <div className="flex items-start w-full justify-between">
            <span className="text-xl font-semibold text-black">
              Past Reports
            </span>
          </div>

          <div className="flex w-full mt-5">
            <PastReportComponent assetId={assetId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallHealthPopup;
