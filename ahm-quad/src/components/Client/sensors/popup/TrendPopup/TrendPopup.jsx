import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { usePost } from "../../../../../hooks/usehttp";
import { useParams } from "react-router-dom";
import TrendReport from "./TrendReport/TrendReport";
import Trend from "./Trend";
import { TbReload } from "react-icons/tb";
import TrendPopupSkeleton from "../../../../../loaders/TrendPopupSkeleton";
import { useClientContext } from "../../../../../context/ClientStateContext";

const TrendPopup = ({ setTrendPopupshow }) => {
  const { postRequest } = usePost();
  const { sensor_id } = useParams();
  const token = localStorage.getItem("token");
  const [Isloadingforpredicting, setIsloadingforpredicting] = useState(false);
  const [refreshCounter, setrefreshCounter] = useState(0);
  const [PredtictedQUeneRes, setPredtictedQUeneRes] = useState(null);
  const [allPredictions, setAllPredictions] = useState([]);
  const [selectedDays, setSelectedDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [AnyquenePresent, setAnyquenePresent] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(60); // default: 1 hour
const [daysShow, setDaysShow] = useState(true);
const [weeksShow, setWeeksShow] = useState(false);
      const { totalRuntime, settotalRuntime } =
      useClientContext();
      console.log(totalRuntime,"dfhgfsdfd")
// All possible forecast options (minutes)
const hourOptions = [1, 2, 3, 4, 6, 12].map((h) => h * 60); // in minutes
const dayOptions = daysShow ? [1, 2, 3, 4, 5, 6, 7].map((d) => d * 24 * 60) : [];
const weekOptions = weeksShow ? [1, 2].map((w) => w * 7 * 24 * 60) : [];

// Combine all options
const allOptions = [...hourOptions, ...dayOptions, ...weekOptions];

// Filter based on available runtime (needs 10× forecast)
const availableOptions = allOptions.filter(
  (forecastMinutes) => totalRuntime >= forecastMinutes * 60 * 10
);
  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const handlePredict = async () => {
    const body = { minCount: selectedMinutes };
    setIsloadingforpredicting(true);
    const response = await postRequest(
      `/company/predict/${sensor_id}`,
      body,
      token
    );
    if (response.success) {
      if (response.data.status === "queued" || response.data.status === "processing") {
        setAnyquenePresent(true);
      }
      setIsloadingforpredicting(false);
   
      setPredtictedQUeneRes(response.data);
    } else {
      setIsloadingforpredicting(false);
     
      console.error("Error fetching prediction:", response.message);
    }
  };

  const fetchAllPredictions = async (pageNumber = 1) => {
    setLoading(true);
    const response = await postRequest(
      `/company/allpredict/${sensor_id}?page=${pageNumber}&limit=${limit}`,
      {},
      token
    );
    setLoading(false);

    if (response.success) {
      setIsloadingforpredicting(false);
      setAllPredictions(response.data.data);
      response.data.data.forEach((element) => {
        console.log(element, "element in quene");
        // Check if the element has a queue
        if (element.status === "queued" || element.status === "processing") {
          console.log("first")
          setAnyquenePresent(true);
          return;
        }
        else {
          setAnyquenePresent(false);
        }
        
      });
      setTotalPages(response.data.totalPages || 1);
    } else {
      setIsloadingforpredicting(false);
      console.error("Error fetching all predictions:", response.message);
    }
  };

  useEffect(() => {
    if (PredtictedQUeneRes) {
      setAllPredictions((prev) => [PredtictedQUeneRes, ...prev]);
    }
  }, [PredtictedQUeneRes]);

  useEffect(() => {
    fetchAllPredictions(page);
  }, [page, refreshCounter]);

  useEffect(() => {
    console.log(AnyquenePresent, "AnyquenePresent");
  }, [AnyquenePresent]);

  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40 p-4">
      <div className="bg-white py-6 px-4 md:py-10 md:px-14 rounded-[14px] flex flex-col justify-start items-center alertcontent gap-6 relative w-full lg:max-w-[1000px] md:max-w-[900px] max-h-[100vh] overflow-y-auto min-h-[70vh]">
        <div className="flex justify-between items-start w-full">
          <span className="text-black text-2xl sm:text-4xl font-semibold">
            Forecast
          </span>
          <IoMdCloseCircle
            color="red"
            className="cursor-pointer text-2xl sm:text-3xl"
            onClick={() => setTrendPopupshow(false)}
          />
        </div>

        <div className="flex flex-col w-full justify-center items-center gap-6">
          {/* Forecast Selector */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <label
              htmlFor="forecastDays"
              className="text-gray-800 font-semibold text-base sm:text-lg"
            >
              Forecast Duration
            </label>

          <div className="relative">
<select
  id="forecastDuration"
  value={selectedMinutes}
  onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
  className="appearance-none border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
>
  {hourOptions
    .filter((m) => availableOptions.includes(m))
    .map((m) => (
      <option key={`hour-${m}`} value={m}>
        {m / 60} Hour{m > 60 && "s"}
      </option>
    ))}

  {daysShow &&
    dayOptions
      .filter((m) => availableOptions.includes(m))
      .map((m) => (
        <option key={`day-${m}`} value={m}>
          {m / (60 * 24)} Day{m > 1440 && "s"}
        </option>
      ))}

  {weeksShow &&
    weekOptions
      .filter((m) => availableOptions.includes(m))
      .map((m) => (
        <option key={`week-${m}`} value={m}>
          {m / (60 * 24 * 7)} Week{m > 10080 && "s"}
        </option>
      ))}
</select>


  {/* Dropdown Icon */}
  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
    ▼
  </div>
</div>

          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base sm:text-lg px-6 py-2 rounded-md font-medium transition duration-200 shadow-md ${
              Isloadingforpredicting || AnyquenePresent
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={Isloadingforpredicting || AnyquenePresent}
          >
            {AnyquenePresent
              ? "Already in quene..."
              : Isloadingforpredicting
              ? "Predicting..."
              : `Predict Next ${selectedMinutes} Minute${
                  selectedMinutes > 1 ? "s" : ""
                }`}
          </button>

          {/* Success Message */}
          {PredtictedQUeneRes && (
            <div className="bg-green-100 text-green-800 text-sm sm:text-base px-4 py-2 rounded-md border border-green-300 shadow-sm">
              ✅ Prediction Queued Successfully!
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold mb-4 text-gray-800">
              Past Forecast Reports
            </div>
            <TbReload
              size={20}
              className={`cursor-pointer ${loading ? "rotate" : ""}`}
              onClick={() => {
                setrefreshCounter((prev) => prev + 1);
              }}
            />
          </div>

          {loading ? (
            <div className="text-gray-600">
              <TrendPopupSkeleton />
            </div>
          ) : allPredictions.length === 0 ? (
            <div className="text-gray-500">No forecast reports available.</div>
          ) : (
            <>
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                {allPredictions.map((report) => (
                  <Trend key={report.prediction_id} report={report} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-gray-700 text-sm pt-1">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-4 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendPopup;
