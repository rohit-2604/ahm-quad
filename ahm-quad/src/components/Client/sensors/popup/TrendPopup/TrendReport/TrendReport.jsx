import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import TrendGraph from "../TrendGraph";
import TrendDiffGraph from "../TrendDiffGraph";
import { usePost } from "../../../../../../hooks/usehttp";
import AccuracyPopup from "../Accuracy/AccuracyPopup";
import LoadingExample from "../../../../../LoadingSpinner ";
import { TrendingUpDown,TrendingUp, TrendingDown, Activity, Thermometer, Zap } from 'lucide-react';

const TrendReport = ({ data, setTrendReportData }) => {
    const { postRequest } = usePost();
    const [AccuracyReportData, setAccuracyReportData] = useState(null);
    const [isloading, setisloading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const token = localStorage.getItem("token");
    
    const { 
        predicted_vibration_x, 
        predicted_vibration_y, 
        predicted_vibration_z, 
        timestamp 
    } = data.result.ForecastResults;

    // Calculate statistics
    const calculateStats = (array) => {
        const values = array.filter(val => val !== null && val !== undefined);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { mean, stdDev, min, max, variance };
    };

    const vibrationXStats = calculateStats(predicted_vibration_x);
    const vibrationYStats = calculateStats(predicted_vibration_y);
    const vibrationZStats = calculateStats(predicted_vibration_z);
    const tempOneStats = calculateStats(data.result.ForecastResults.predicted_temperature_skin);
    const tempTwoStats = calculateStats(data.result.ForecastResults.predicted_temperature_bearing);

    // Calculate magnitude and frequency
    const futureFrequency = predicted_vibration_x.map((_, i) => {
        const x = predicted_vibration_x[i] || 0;
        const y = predicted_vibration_y[i] || 0;
        const z = predicted_vibration_z[i] || 0;
        return Math.sqrt(x * x + y * y + z * z);
    });
    
    const pastFrequency = data.request_data.vibration_x.map((_, i) => {
        const x = data.request_data.vibration_x[i] || 0;
        const y = data.request_data.vibration_y[i] || 0;
        const z = data.request_data.vibration_z[i] || 0;
        return Math.sqrt(x * x + y * y + z * z);
    });

    // Calculate trends
    const calculateTrend = (values) => {
        const n = values.length;
        const sumX = (n * (n + 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, index) => sum + val * (index + 1), 0);
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
    };

    const vibrationTrend = calculateTrend(futureFrequency);
    const tempOneTrend = calculateTrend(data.result.ForecastResults.predicted_temperature_skin);
    
    // Time horizon calculation
    const forecastStartTime = new Date(timestamp[0]);
    const forecastEndTime = new Date(timestamp[timestamp.length - 1]);
    const forecastDuration = Math.round((forecastEndTime - forecastStartTime) / (1000 * 60)); // in minutes

    const FetchAccuracyReport = async (reportId) => {
        setisloading(true);
        const response = await postRequest(
            `/company/comparepredict/${reportId}`,
            {},
            token
        );
        if (response.success) {
            setAccuracyReportData(response.data);
            setisloading(false);
        } else {
            setisloading(false);
            console.error("Error Accuracy Report:", response.message);
        }
    };

const StatCard = ({ title, value, unit, icon: Icon, color, trend, comparison }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className={`w-5 h-5 ${color}`} />}
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      </div>
      {trend && (
        <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="text-2xl font-bold text-gray-800">
        {typeof value === 'string' ? value : value.toFixed(2)}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
      {comparison && (
        <div className="text-xs text-gray-500">
          vs avg: {comparison}
        </div>
      )}
    </div>
  </div>
);

    const TabButton = ({ id, label, active, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                active 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40 p-4">
            <div className="bg-white py-6 px-4 md:py-10 md:px-14 rounded-[14px] flex flex-col justify-start items-center alertcontent gap-6 relative w-full lg:max-w-[1200px] md:max-w-[1000px] h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-start w-full">
                    <div className="flex justify-center items-center gap-4">
                        <TrendingUpDown color="blue" size={"40px"}/><span className="text-black text-2xl sm:text-4xl font-semibold"> Forecast</span>
                        <div className="flex bg-blue-600 text-white px-4 py-2 rounded-md">
                            Sensor Id: {data.sensor_id_fk}
                        </div>
                        <div className="flex bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                            {forecastDuration} min forecast
                        </div>
                    </div>
                    <IoMdCloseCircle
                        color="red"
                        className="cursor-pointer text-2xl sm:text-3xl"
                        onClick={() => setTrendReportData(null)}
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 w-full justify-start">
                    <TabButton id="overview" label="Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
                    <TabButton id="statistics" label="Statistics" active={activeTab === 'statistics'} onClick={setActiveTab} />
                    <TabButton id="analysis" label="Analysis" active={activeTab === 'analysis'} onClick={setActiveTab} />
                    {/* <TabButton id="insights" label="Insights" active={activeTab === 'insights'} onClick={setActiveTab} /> */}
                </div>

                {/* Overview Tab - Original Content */}
                {activeTab === 'overview' && (
                    <div className="w-full">
                        {/* Prediction Summary - Original */}
                        {data.prediction && (
                            <div className="flex flex-col w-full gap-6 mt-6">
                                <div className="flex justify-between w-full items-center">
                                    <div className="text-2xl font-semibold text-[#5a5a5a]">Prediction Summary</div>
                                    <div className={`flex ${isloading ? "bg-transparent border-[2px] border-blue-500 w-32 flex justify-center items-center" : "bg-blue-500"} px-3 py-1 text-white text-[12px] rounded-md cursor-pointer`} 
                                         onClick={() => FetchAccuracyReport(data.prediction_id)}>
                                        {isloading ? <LoadingExample size="sm" color="white" /> : "Check Accuracy"}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* VIBRATION PREDICTION */}
                                    <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xl font-semibold text-gray-700">Vibration</div>
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium
                                                ${data.prediction.vibrationStatus === "NORMAL" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {data.prediction.vibrationStatus}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{data.prediction.vibrationAction}</p>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="bg-gray-100 rounded-md py-2">
                                                <div className="text-sm text-gray-500">X</div>
                                                <div className="font-medium text-gray-700">{parseFloat(data.prediction.meanVibration.x).toFixed(2)}</div>
                                            </div>
                                            <div className="bg-gray-100 rounded-md py-2">
                                                <div className="text-sm text-gray-500">Y</div>
                                                <div className="font-medium text-gray-700">{parseFloat(data.prediction.meanVibration.y).toFixed(2)}</div>
                                            </div>
                                            <div className="bg-gray-100 rounded-md py-2">
                                                <div className="text-sm text-gray-500">Z</div>
                                                <div className="font-medium text-gray-700">{parseFloat(data.prediction.meanVibration.z).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TEMPERATURE PREDICTION */}
                                    <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xl font-semibold text-gray-700">Temperature</div>
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium
                                                ${data.prediction.temperatureStatus === "NORMAL" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {data.prediction.temperatureStatus}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{data.prediction.temperatureAction}</p>
                                        <div className="bg-gray-100 rounded-md py-2 text-center">
                                            <div className="text-sm text-gray-500">Mean Temp</div>
                                            <div className="font-medium text-gray-700">{parseFloat(data.prediction.meanTemperature).toFixed(2)}°C</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Original Graphs */}
                        <div className="flex flex-col w-full gap-5 mt-8">
                            <div className="flex text-2xl font-semibold text-[#5a5a5a]">Temperature Forecast</div>
                            <div className="graph">
                                <TrendDiffGraph
                                    axisname="Temperature (°C)"
                                    futuretimestamp={data.result.ForecastResults.timestamp}
                                    pasttimestamp={data.request_data.timestamp}
                                    pasandfururedatapairs={[
                                        {
                                            past_skin_temperature: data.request_data.temperature_skin,
                                            future_skin_temperature: data.result.ForecastResults.predicted_temperature_skin,
                                        },
                                        {
                                            past_bearing_temperature: data.request_data.temperature_bearing,
                                            future_bearing_temperature: data.result.ForecastResults.predicted_temperature_bearing,
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-5 mt-3">
                            <div className="flex text-2xl font-semibold text-[#5a5a5a]">Vibration Forecast</div>
                            <div className="graph">
                                <TrendDiffGraph
                                    axisname="Vibration (m/s²)"
                                    futuretimestamp={data.result.ForecastResults.timestamp}
                                    pasttimestamp={data.request_data.timestamp}
                                    pasandfururedatapairs={[
                                        {
                                            past_vibration_x: data.request_data.vibration_x,
                                            future_vibration_x: data.result.ForecastResults.predicted_vibration_x,
                                        },
                                        {
                                            past_vibration_y: data.request_data.vibration_y,
                                            future_vibration_y: data.result.ForecastResults.predicted_vibration_y,
                                        },
                                        {
                                            past_vibration_z: data.request_data.vibration_z,
                                            future_vibration_z: data.result.ForecastResults.predicted_vibration_z,
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-5 mt-3">
                            <div className="flex text-2xl font-semibold text-[#5a5a5a]">Magnitude Forecast</div>
                            <div className="graph">
                                <TrendDiffGraph
                                    axisname="Magnitude"
                                    futuretimestamp={data.result.ForecastResults.timestamp}
                                    pasttimestamp={data.request_data.timestamp}
                                    pasandfururedatapairs={[
                                        {
                                            past_magnitude: pastFrequency,
                                            future_magnitude: futureFrequency,
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'statistics' && (
                    <div className="w-full space-y-6">
                        <div className="text-2xl font-semibold text-[#5a5a5a]">Statistical Analysis</div>
                        
                        {/* Vibration Statistics */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">Vibration Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="X-Axis Mean" value={vibrationXStats.mean} unit=" m/s²" />
                                <StatCard title="X-Axis Std Dev" value={vibrationXStats.stdDev} unit=" m/s²" />
                                <StatCard title="X-Axis Range" value={`${vibrationXStats.min.toFixed(2)} to ${vibrationXStats.max.toFixed(2)}`} unit=" m/s²" />
                                <StatCard title="X-Axis Variance" value={vibrationXStats.variance} unit=" m/s²" />
                                
                                <StatCard title="Y-Axis Mean" value={vibrationYStats.mean} unit=" m/s²" />
                                <StatCard title="Y-Axis Std Dev" value={vibrationYStats.stdDev} unit=" m/s²" />
                                <StatCard title="Y-Axis Range" value={`${vibrationYStats.min.toFixed(2)} to ${vibrationYStats.max.toFixed(2)}`} unit=" m/s²" />
                                <StatCard title="Y-Axis Variance" value={vibrationYStats.variance} unit=" m/s²" />
                                
                                <StatCard title="Z-Axis Mean" value={vibrationZStats.mean} unit=" m/s²" />
                                <StatCard title="Z-Axis Std Dev" value={vibrationZStats.stdDev} unit=" m/s²" />
                                <StatCard title="Z-Axis Range" value={`${vibrationZStats.min.toFixed(2)} to ${vibrationZStats.max.toFixed(2)}`} unit=" m/s²" />
                                <StatCard title="Z-Axis Variance" value={vibrationZStats.variance} unit=" m/s²" />
                            </div>
                        </div>

                        {/* Temperature Statistics */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">Temperature Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="Skin Temp Mean" value={tempOneStats.mean} unit="°C" />
                                <StatCard title="Skin Temp Std Dev" value={tempOneStats.stdDev} unit="°C" />
                                <StatCard title="Skin Temp Range" value={`${tempOneStats.min.toFixed(1)} to ${tempOneStats.max.toFixed(1)}`} unit="°C" />
                                <StatCard title="Skin Temp Variance" value={tempOneStats.variance} unit="°C" />
                                
                                <StatCard title="Bearing Temp Mean" value={tempTwoStats.mean} unit="°C" />
                                <StatCard title="Bearing Temp Std Dev" value={tempTwoStats.stdDev} unit="°C" />
                                <StatCard title="Bearing Temp Range" value={`${tempTwoStats.min.toFixed(1)} to ${tempTwoStats.max.toFixed(1)}`} unit="°C" />
                                <StatCard title="Bearing Temp Variance" value={tempTwoStats.variance} unit="°C" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                    <div className="w-full space-y-6">
                        <div className="text-2xl font-semibold text-[#5a5a5a]">Trend Analysis</div>
                        
                        {/* Trend Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Vibration Trends</h3>
                                <div className="space-y-3">
                                    <StatCard 
                                        title="Overall Magnitude Trend" 
                                        value={vibrationTrend > 0 ? "Increasing" : vibrationTrend < 0 ? "Decreasing" : "Stable"} 
                                        trend={vibrationTrend} 
                                    />
                                    <div className="text-sm text-gray-600">
                                        {vibrationTrend > 0.001 ? "Vibration levels are trending upward - monitor closely" :
                                         vibrationTrend < -0.001 ? "Vibration levels are trending downward - good sign" :
                                         "Vibration levels are stable within normal range"}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Temperature Trends</h3>
                                <div className="space-y-3">
                                    <StatCard 
                                        title="Temperature 1 Trend" 
                                        value={tempOneTrend > 0 ? "Increasing" : tempOneTrend < 0 ? "Decreasing" : "Stable"} 
                                        trend={tempOneTrend} 
                                    />
                                    <div className="text-sm text-gray-600">
                                        {tempOneTrend > 0.01 ? "Temperature is rising - check cooling systems" :
                                         tempOneTrend < -0.01 ? "Temperature is declining - normal operation" :
                                         "Temperature is stable within expected range"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Quality Assessment */}
                        <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Data Quality Assessment</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="Historical Points" value={data.request_data.timestamp.length} unit=" samples" />
                                <StatCard title="Forecast Points" value={timestamp.length} unit=" samples" />
                                <StatCard title="Data Completeness" value="100" unit="%" />
                                <StatCard title="Sampling Rate" value="Variable" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="w-full space-y-6">
                        <div className="text-2xl font-semibold text-[#5a5a5a]">Operational Insights</div>
                        
                        {/* Risk Assessment */}
                        <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Risk Assessment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-green-800">Low Risk</div>
                                    <div className="text-xs text-green-600 mt-1">
                                        Current predictions indicate stable operation within normal parameters
                                    </div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-yellow-800">Monitor</div>
                                    <div className="text-xs text-yellow-600 mt-1">
                                        Some parameters approaching upper thresholds - continue monitoring
                                    </div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-blue-800">Preventive</div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        Consider scheduling maintenance during next planned downtime
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommendations</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-800">Continue Normal Operation</div>
                                        <div className="text-sm text-gray-600">All parameters within acceptable ranges</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-800">Schedule Routine Inspection</div>
                                        <div className="text-sm text-gray-600">Recommended within next 30 days based on trends</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <div className="font-medium text-gray-800">Monitor Temperature Sensors</div>
                                        <div className="text-sm text-gray-600">Ensure calibration is up to date</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forecast Metadata */}
                        <div className="border border-gray-300 rounded-xl p-5 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Forecast Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard title="Forecast Duration" value={forecastDuration} unit=" minutes" />
                                <StatCard title="Model Status" value={data.status} />
                                <StatCard title="Prediction ID" value={data.prediction_id.slice(0, 8)} unit="..." />
                                <StatCard title="Data Points" value={data.request_data.timestamp.length + timestamp.length} unit=" total" />
                            </div>
                        </div>
                    </div>
                )}

                {AccuracyReportData && (
                    <AccuracyPopup 
                        AccuracyReportData={AccuracyReportData} 
                        setAccuracyReportData={setAccuracyReportData} 
                    />
                )}
            </div>
        </div>
    );
};

export default TrendReport;