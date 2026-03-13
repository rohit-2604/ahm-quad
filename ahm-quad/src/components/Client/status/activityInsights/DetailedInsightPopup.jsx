import { MdCancel } from "react-icons/md";

const SECONDS_IN_12_HOURS = 43200;

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const DetailedInsightPopup = ({ DetailedInsightsData, setDetailedInsightsData }) => {
  return (
    <div className="flex bg-[#00000034] backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40 p-4">
      <div className="alertcontent bg-white py-6 px-6 md:py-10 md:px-10 rounded-2xl flex flex-col w-full lg:max-w-[900px] max-h-[90vh] overflow-hidden relative shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between w-full items-center pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            12-Hour Detailed Uptime/Downtime Insights
          </h2>
          <MdCancel
            color="red"
            className="cursor-pointer hover:scale-110 transition-transform"
            size={30}
            onClick={() => setDetailedInsightsData(null)}
          />
        </div>

        {/* Scrollable List */}
        <div className="w-full mt-6 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {DetailedInsightsData?.map((entry, index) => {
            const totalTime = Number(entry.totaltime || 0);
            const downTime = Number(entry.downtime || 0);
            const upTime = Math.max(0, totalTime - downTime);
            const sensorOffTime = Math.max(0, SECONDS_IN_12_HOURS - (upTime + downTime));

            const upPercent = ((upTime / SECONDS_IN_12_HOURS) * 100).toFixed(1);
            const downPercent = ((downTime / SECONDS_IN_12_HOURS) * 100).toFixed(1);
            const offPercent = ((sensorOffTime / SECONDS_IN_12_HOURS) * 100).toFixed(1);

            return (
              <div
                key={entry.id}
                className="w-full p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Title */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Window {index + 1}
                  </h3>
                  <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
                </div>

                {/* Stacked Progress Bar */}
                <div className="relative w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${upPercent}%` }}
                  />
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${downPercent}%` }}
                  />
                  {sensorOffTime > 0 && (
                    <div
                      className="bg-gray-400 h-full"
                      style={{ width: `${offPercent}%` }}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="flex justify-between text-xs mt-3 text-gray-600 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Uptime: {formatDuration(upTime)} ({upPercent}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Downtime: {formatDuration(downTime)} ({downPercent}%)
                  </span>
                  {sensorOffTime > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                      Sensor Off: {formatDuration(sensorOffTime)} ({offPercent}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedInsightPopup;
