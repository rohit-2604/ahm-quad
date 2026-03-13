import React, { useState } from "react"
import moment from 'moment-timezone';
import { usePost } from "../../../../../hooks/usehttp";
import { useClientContext } from "../../../../../context/ClientStateContext";
import LoadingExample from '../../../../LoadingSpinner ';
const Report = ({report,index}) => {

 const { postRequest } = usePost();
     const [isLoading, setIsLoading] = useState(false)
      const {FetchedReport, setFetchedReport} = useClientContext();
     const accesToken = localStorage.getItem("token");
    const handleViewReport = async() => {
        try {
            setIsLoading(true);
            const json = await postRequest(`/company/fetchoneanalysisreport/${report.report_id}`, {}, accesToken)
            if (json.success) {
                setIsLoading(false)
                // console.log(json.data)
                setFetchedReport(json.data.analysisreports)
                

            }
        } catch (error) {
            setIsLoading(false)
            // console.log("Error fatching past reports on overall heath status popup", error)
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300 gap-2">
    <span className="text-[10px] lg:text-[12px] text-black">
        {report?.report_id?.slice(0, 5)}
    </span>

    <span className="text-[10px] lg:text-[12px] text-gray-700 flex flex-wrap">
        Created at: {moment.utc(report?.created_at).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A")}
    </span>

    <span className="text-[#3481FF] text-[10px] lg:text-[12px] text-center py-1 cursor-pointer hover:scale-110 transition-all duration-100 flex justify-center items-center" onClick={handleViewReport}>
        {isLoading? <LoadingExample size={"sm"}/>:"View"}
    </span>
</div>
  )
}
export default Report