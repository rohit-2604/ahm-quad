import { useParams } from "react-router-dom";
import { usePost } from "../../../../../hooks/usehttp";
import TrendReport from "./TrendReport/TrendReport";
import { useState } from "react";
import LoadingExample from "../../../../LoadingSpinner ";

const Trend = ({report}) => {


  const  formatDateTime=(isoString) => {
  const dateObj = new Date(isoString);

  const dateOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  };

  const formattedDate = dateObj.toLocaleDateString('en-GB', dateOptions);
  const formattedTime = dateObj.toLocaleTimeString('en-GB', timeOptions);

  return `${formattedDate}, ${formattedTime}`;
}
  const [SinglePredictionloading, setSinglePredictionloading] = useState(false)
      const { postRequest } = usePost();
        const token = localStorage.getItem("token");
      const { sensor_id } = useParams();
        const [TrendReportData, setTrendReportData] = useState(null);
      const fetchOnePrediction = async (predictionId) => {
        setSinglePredictionloading(true)
        const response = await postRequest(`/company/specificpredict/${predictionId}`, {}, token);
        if (response.success) {
          
          setSinglePredictionloading(false)
          setTrendReportData(response.data);
        } else {
          setSinglePredictionloading(false)
          console.error("Error fetching single prediction:", response.message);
        }
      };
  return (
<div
                    key={report.prediction_id}
                    className="border-[#235ba5] px-4 py-3 flex justify-between items-center border-l-[4px] bg-[#f5f8ff] rounded-md transition"
                  >
                    <div className="flex flex-col">
                      <span className="text-md font-medium text-gray-800">
                        Prediction ID: {report.prediction_id}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          report.status === "done"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        Status: {report.status}
                      </span>
                    </div>{
                      report.created_at&&( <div className="">{formatDateTime(report.created_at)}</div>)
                    }
                   <div className=" font-semibold text-xs">{report.duration_minutes?report.duration_minutes:0} min</div>
                    {report.status === "done" && (<>{SinglePredictionloading ? (<div className=" h-[11px]">
          <LoadingExample size="sm" />
        </div>):(<button
                      className="text-blue-600 hover:underline font-medium text-sm"
                      onClick={() => fetchOnePrediction(report.prediction_id)}
                    >
                      View
                    </button>)}</>)}
                      {TrendReportData && (
        <TrendReport
          data={TrendReportData}
          setTrendReportData={setTrendReportData}
        />
      )}
                  </div>
  )
}
export default Trend