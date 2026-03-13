import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { usePost } from "../../../hooks/usehttp";
import AllPastreportsPopup from "./popup/AllPastreportsPopup";
import LoadingExample from "../../LoadingSpinner ";

function Range({ setRangeData, RangeData }) {
  const [isLoading, setIsloading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pastReportCount, setPastReportCount] = useState(0);
  const [showallPastreports, SetshowallPastreports] = useState(false);
  const calendarRef = useRef(null);

  const accesToken = localStorage.getItem("token");
  const { sensor_id } = useParams();
  const { postRequest } = usePost();

  const formatDate = (date) => {
    if (!date) return "Select Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };
  const formatDateTime = (date, time) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${time}:00`;
  };


  const resetTime = (date) => {
    return date ? new Date(date.setHours(0, 0, 0, 0)) : null;
  };

  useEffect(() => {
    if (startDate) setFormattedStartDate(formatDate(startDate));
    if (endDate) setFormattedEndDate(formatDate(endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    fetchPastReport();
  }, []);

  const fetchPastReport = async () => {
    try {
      const json = await postRequest(
        `/company/fetchreport/${sensor_id}`,
        {},
        accesToken
      );
      if (json?.data?.length) {
        setPastReportCount(json.data.length);
      }
    } catch (error) {
      console.error("Error fetching past reports:", error);
    }
  };

  const fetchRange = async () => {
    try {
      setIsloading(true);
      const formattedStartDate = formatDateTime(startDate, startTime);
      const formattedEndDate = formatDateTime(endDate, endTime);

      // // console.log("Start Date:", formattedStartDate);
      // // console.log("End Date:", formattedEndDate);

      const json = await postRequest(
        `/company/diagnosticdata/${sensor_id}`,
        {
          startdate: formattedStartDate,
          enddate: formattedEndDate,
        },
        accesToken
      );
      setRangeData(json.data);
    } catch (err) {
      console.error("Error fetching workshop:", err);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarRef]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
      <div className="flex items-center justify-center w-full h-auto lg:h-[70vh] max-w-6xl">
        <div className="flex flex-col bg-white rounded-lg w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] pb-10 pt-6 px-4 sm:px-6 lg:px-10 shadow-lg">
          <div className="flex items-center justify-center lg:justify-start w-full">
            <p className="text-lg sm:text-xl font-semibold whitespace-nowrap text-center lg:text-left">
              Choose the time range
            </p>
          </div>

          {/* Date Picker Button */}
          <div className="flex justify-center items-center w-full mt-6">
            <div
              className="bg-black px-6 sm:px-8 py-2 text-white rounded-md cursor-pointer text-center w-full max-w-xs"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {formattedStartDate && formattedEndDate
                ? `${formattedStartDate} to ${formattedEndDate}`
                : "Select Date Range"}
            </div>
          </div>

          {/* Date Picker Calendar */}
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute mt-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xs sm:max-w-sm"
            >
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(resetTime(start));
                  setEndDate(resetTime(end));
                  if (start && end) {
                    setShowCalendar(false);
                  }
                  setShowTimePicker(true);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                maxDate={new Date()}
              />
            </div>
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <div className="flex flex-col items-center justify-center mt-4 w-full">
              <label className="text-sm font-semibold">Select Time:</label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-2 bg-gray-100 p-3 rounded-lg shadow-md w-full max-w-xs sm:max-w-md">
                <div className="flex flex-col items-center w-full">
                  <label className="text-xs text-gray-600">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
                  />
                </div>
                <span className="hidden sm:flex text-xl font-semibold text-gray-600">-</span>
                <div className="flex flex-col items-center w-full">
                  <label className="text-xs text-gray-600">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 px-4 lg:px-10 w-full">
            <div
              className="bg-black relative px-6 py-2 text-white rounded-md cursor-pointer flex items-center justify-center w-full sm:w-auto"
              onClick={() => SetshowallPastreports(true)}
            >
              Past Reports
              <div className="absolute -top-2 -right-2 text-black bg-gray-300 h-6 w-6 flex items-center justify-center text-xs font-bold rounded-full">
                {pastReportCount}
              </div>
            </div>
            <div
              className={`${isLoading ? "bg-gray-300 text-black cursor-not-allowed" : "bg-black text-white"} px-6 py-2 rounded-md cursor-pointer w-full sm:w-auto text-center`}
              onClick={fetchRange}
            >
              {isLoading ? <LoadingExample /> : "Continue"}
            </div>
          </div>
          {isLoading && (
            <span className="flex items-center justify-center text-[12px] mt-6 text-gray-500 text-center">
              It may take some time! You can see this report and previous ones by clicking the past reports.
            </span>
          )}
        </div>
      </div>

      {/* Past Reports Popup */}
      {showallPastreports && (
        <AllPastreportsPopup onClose={() => SetshowallPastreports(false)} setRangeData={setRangeData} />
      )}
    </div>
  );
}

export default Range;
