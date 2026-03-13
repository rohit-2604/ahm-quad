import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import { usePost } from "../../../../hooks/usehttp";
import profile from "../../../../assets/profilephoto.jpg";
import LoadingExample from "../../../LoadingSpinner ";
import { MdDelete } from "react-icons/md";
import ConfirmpPopup from "./ConfirmpPopup";

function AllPastreportsPopup({ onClose, setRangeData }) {
  // {{server}}/superadmin/deleteReport/:report_id

  const [isLoading, setIsLoading] = useState(true);
  const [pastReports, setPastReports] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5); // Number of reports per page
  const { sensor_id } = useParams();
  const [selectedReportId, setSelectedReportId] = useState(null);

  const accesToken = localStorage.getItem("token");
  const { postRequest } = usePost();

  useEffect(() => {
    fetchPastReport();
    // // console.log("Past Report->>>")
  }, []);

  const handleDeleteClick = (reportId) => {
    setSelectedReportId(reportId); // Store the specific report ID
    setIsOpenPopup(true); // Open the confirmation popup
  };

  const deleteReport = async (reportId) => {
    // // console.log("Deleting report ID:", reportId); // Debugging

    try {
      const response = await postRequest(
        `/company/deleteReport/${reportId}`,
        {},
        accesToken
      );

      if (response.success) { // Ensure response indicates success
        setPastReports((prevReports) => {
          const updatedReports = [...prevReports];
          const index = updatedReports.findIndex(report => report.report_id === reportId);

          if (index !== -1) {
            updatedReports.splice(index, 1); // Remove only the selected report
          }

          return updatedReports;
        });
      } else {
        console.error("Failed to delete report:", response.message);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };



  const fetchPastReport = async () => {
    try {
      setIsLoading(true)
      const json = await postRequest(
        `/company/fetchreport/${sensor_id}`,
        {},
        accesToken
      );
      // console.log(json.data);
      if (json?.data?.length) {
        setPastReports(json.data);
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching past reports:", error);
    } finally {
      setIsLoading(false)
    }
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = pastReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const totalPages = Math.ceil(pastReports.length / reportsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
  
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
  
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };
  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-[100%] h-[100%] top-0 left-0 z-40">
      <div className="bg-white py-10 px-14 rounded-[14px] flex flex-col justify-center items-center alertcontent gap-4 relative min-w-[800px]">
        <div className="flex justify-between w-full">
          <h2 className="text-[40px] mb-4 font-normal text-[#5A5A5A]">
            Past Reports
          </h2>
          <div onClick={onClose}>
            <MdCancel color="red" className="cursor-pointer" size={24} />
          </div>
        </div>

        {currentReports.length > 0 ? (
          <div className="w-full max-h-[450px] overflow-y-auto">
            {currentReports.map((report) => (
              <div
                key={report.report_id}
                className="flex justify-between bg-[#EFF5FF] rounded-[9px] w-full mb-2 p-4"
              >

                <div className="flex items-center justify-center">
                  {report.report_id}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-[22px] h-[22px] rounded-full flex">
                    <img
                      src={profile}
                      alt="Profile"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="text-[13px] text-[#939393] font-medium">
                    Created at
                    <span className="ml-1">
                      {formatDateTime(report.timestamp)}
                    </span>
                  </div>
                </div>
                {/* View Button / Pending Status */}
                {report.status === "pending" ? (
                  <div className="bg-yellow-500 w-[130px] h-[42px] text-white text-[13px] rounded-[5px] font-medium flex items-center justify-center cursor-not-allowed">
                    Pending
                  </div>
                ) : (
                  <div
                    className="bg-[#2879FF] w-[130px] h-[42px] text-white text-[13px] rounded-[5px] font-medium flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setRangeData(report.reports);
                      onClose();
                    }}
                  >
                    View
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <MdDelete
                    className="text-2xl text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(report.report_id)}
                  />
                </div>

                {isOpenPopup && selectedReportId !== null && (
                  <ConfirmpPopup
                    setIsOpenPopup={setIsOpenPopup}
                    deleteReport={deleteReport}
                    reportId={selectedReportId} // Pass the correct report ID
                  />
                )}
              </div>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-4 text-[#3A3A3A]">
            No past reports available.
          </div>
        ) : (
          <LoadingExample />
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center w-full mt-4">
          <button
            className={`bg-[#EFF5FF] px-4 py-2 rounded-[5px] font-medium ${currentPage === 1
              ? "cursor-not-allowed text-gray-400"
              : "cursor-pointer text-blue-500"
              }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-[#3A3A3A] text-[14px] font-medium">
            Page {currentPage} of {totalPages} (Showing {currentReports.length}{" "}
            of {pastReports.length} total)
          </div>
          <button
            className={`bg-[#EFF5FF] px-4 py-2 rounded-[5px] font-medium ${currentPage === totalPages
              ? "cursor-not-allowed text-gray-400"
              : "cursor-pointer text-blue-500"
              }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllPastreportsPopup;
