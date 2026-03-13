import { IoMdCloseCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import AccuracyGraph from "./AccuracyGraph/AccuracyGraph";

const computeStats = (actualArr, predictedArr) => {
  if (!actualArr?.length || !predictedArr?.length) return null;

  const lastActual = actualArr[actualArr.length - 1];
  const firstPredicted = predictedArr[0];

  const minActual = Math.min(...actualArr);
  const maxActual = Math.max(...actualArr);
  const avgActual = (actualArr.reduce((a, b) => a + b, 0) / actualArr.length).toFixed(2);

  const minPred = Math.min(...predictedArr);
  const maxPred = Math.max(...predictedArr);
  const avgPred = (predictedArr.reduce((a, b) => a + b, 0) / predictedArr.length).toFixed(2);

  const deviation = (((firstPredicted - lastActual) / lastActual) * 100).toFixed(2);

  return {
    lastActual,
    firstPredicted,
    minActual,
    maxActual,
    avgActual,
    minPred,
    maxPred,
    avgPred,
    deviation,
  };
};

const InsightCard = ({ title, stats }) => {
  if (!stats) return null;
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-gray-50 mt-2">
      <h3 className="font-semibold text-lg mb-2">{title} Insights</h3>
      <div className="text-sm space-y-1">
        <p>Last Actual: <span className="font-medium">{stats.lastActual}</span></p>
        <p>First Predicted: <span className="font-medium">{stats.firstPredicted}</span></p>
        <p>Deviation: <span className="font-medium">{stats.deviation}%</span></p>
        <p>Actual Range: {stats.minActual} – {stats.maxActual} (avg {stats.avgActual})</p>
        <p>Predicted Range: {stats.minPred} – {stats.maxPred} (avg {stats.avgPred})</p>
      </div>
    </div>
  );
};
 const downloadPDF = async () => {
    const popup = document.getElementById("accuracy-popup");
    const canvas = await html2canvas(popup, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Accuracy_Report_${sensor_id}.pdf`);
  };

const AccuracyPopup = ({ setAccuracyReportData, AccuracyReportData }) => {
  const { sensor_id } = useParams();

  const actual = AccuracyReportData?.actual || {};
  const prediction = AccuracyReportData?.prediction || {};
console.log(actual,"dfhdgdg")
  const statsTemp1 = computeStats(actual.temperature_skin, prediction.predicted_temperature_skin);
  const statsTemp2 = computeStats(actual.temperature_bearing, prediction.predicted_temperature_bearing);
  const statsVibX = computeStats(actual.vibration_x, prediction.predicted_vibration_x);
  const statsVibY = computeStats(actual.vibration_y, prediction.predicted_vibration_y);
  const statsVibZ = computeStats(actual.vibration_z, prediction.predicted_vibration_z);

  const metrics = [
    { title: "Skin Temperature", actualKey: "temperature_skin", predictedKey: "predicted_temperature_skin", stats: statsTemp1 },
    { title: "Bearing Temperature", actualKey: "temperature_bearing", predictedKey: "predicted_temperature_bearing", stats: statsTemp2 },
    { title: "Vibration X", actualKey: "vibration_x", predictedKey: "predicted_vibration_x", stats: statsVibX },
    { title: "Vibration Y", actualKey: "vibration_y", predictedKey: "predicted_vibration_y", stats: statsVibY },
    { title: "Vibration Z", actualKey: "vibration_z", predictedKey: "predicted_vibration_z", stats: statsVibZ },
  ];

  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40 p-4">
      <div className="bg-white py-6 px-4 md:py-10 md:px-14 rounded-[14px] flex flex-col justify-start items-center alertcontent gap-8 relative w-full lg:max-w-[1200px] max-h-[100vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <div className="flex justify-center items-center gap-4">
            <span className="text-black text-2xl sm:text-4xl font-semibold">
              Accuracy Report
            </span>
            <div className="flex bg-blue-600 text-white px-4 py-2 rounded-md">
              Sensor Id : {sensor_id}
            </div>
          </div>
          <IoMdCloseCircle
            color="red"
            className="cursor-pointer text-2xl sm:text-3xl"
            onClick={() => setAccuracyReportData(null)}
          />
        </div>

        {/* Metric-wise stacked layout */}
        <div className="flex flex-col w-full gap-10">
          {metrics.map((metric, idx) => (
            <div key={idx} className="w-full">
              <h4 className="font-semibold text-2xl">{metric.title}</h4>
              <AccuracyGraph
                prediction={{ [metric.predictedKey]: prediction?.[metric.predictedKey], timestamp: prediction?.timestamp }}
                actual={{ [metric.actualKey]: actual?.[metric.actualKey], timestamp: actual?.timestamp }}
              />
              <InsightCard title={metric.title} stats={metric.stats} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccuracyPopup;
