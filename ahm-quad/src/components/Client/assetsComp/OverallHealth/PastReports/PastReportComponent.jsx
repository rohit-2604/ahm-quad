import React, { useEffect, useState } from "react";

import { usePost } from "../../../../../hooks/usehttp";
import LoadingExample from "../../../../LoadingSpinner ";
import Report from "./Report";
import { TbReload } from "react-icons/tb";

function PastReportComponent({ assetId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState();
  const [pastReports, setPastReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const reportsPerPage = 5; // Number of reports per page

  // Calculate indexes for slicing data
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports =
    pastReports?.reports?.slice(indexOfFirstReport, indexOfLastReport) || [];
  const { postRequest } = usePost();
  const accesToken = localStorage.getItem("token");
  const totalPages = pastReports?.totalPages;
  const [refreshCounter, setrefreshCounter] = useState(0);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const json = await postRequest(
          `/company/fetchallanalysisreports/${assetId}?page=${currentPage}&limit=5`,
          {},
          accesToken
        );
        if (json.success) {
          setIsLoading(false);
          // console.log(json.data)
          setPastReports(json.data);
          setCurrentPage(json?.data?.currentPage);
          setPageLimit(json?.data?.currentPage);
        }
      } catch (error) {
        setIsLoading(false);
        // console.log("Error fatching past reports on overall heath status popup", error)
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [currentPage, refreshCounter]);
  // // console.log(pastReports)

  return (
    <div className="w-full bg-[#EFF5FF] p-4 rounded-[5px] min-h-[215px]">
      <div className="w-full flex justify-end items-end">
        <TbReload
          className={`cursor-pointer ${isLoading ? "rotate" : ""}`}
          onClick={() => {
            setrefreshCounter((prev) => prev + 1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex w-full justify-center items-center min-h-[215px]">
          <LoadingExample />
        </div>
      ) : (
        pastReports?.reports?.map((report, index) => (
          <Report report={report} index={index} />
        ))
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            className={`px-3 py-1 text-[12px] border rounded ${
              isLoading && "cursor-not-allowed"
            } ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={isLoading || currentPage === 1}
          >
            Previous
          </button>

          <span className="text-[14px] font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            className={`px-3 py-1 text-[12px] border rounded ${
              isLoading && "cursor-not-allowed"
            } ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={isLoading || currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PastReportComponent;
