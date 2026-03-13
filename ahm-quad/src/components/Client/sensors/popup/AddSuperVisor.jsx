import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { TbCopyCheckFilled } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { usePost } from "../../../../hooks/usehttp";
import AddSupervisorcomp from "./AddSupervisorcomp";
import AlreadyAddedSuperVisorcomp from "./AlreadyAddedSuperVisorcomp";
import loadinng from "../../../../Lottie/loading.json";
import Lottie from "react-lottie";
function AddSuperVisor({ onClose, asset_id }) {
  // console.log(asset_id, "sdfasset");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [addedSupervisors, setAddedSupervisors] = useState([]);
  const accesToken = localStorage.getItem("token");
  const { postRequest } = usePost();
  const defaultOptionsforloading = {
    loop: false,
    autoplay: true,
    animationData: loadinng,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(asset_id)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        setLoading(true);
        const [availableResponse, addedResponse] = await Promise.all([
          postRequest(
            `/company/fetchspecificsupervisor/${asset_id}`,
            { availability: true },
            accesToken
          ),
          postRequest(
            `/company/fetchspecificsupervisor/${asset_id}`,
            { availability: false },
            accesToken
          ),
        ]);

        setAvailableSupervisors(availableResponse.data || []);
        setAddedSupervisors(addedResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch supervisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, [asset_id]);

  const handleSupervisorAdd = (supervisor) => {
    setAvailableSupervisors((prev) =>
      prev.filter((sup) => sup.supervisor_id !== supervisor.s_id)
    );
    setAddedSupervisors((prev) => [
      ...prev,
      {
        supervisor_id: supervisor.s_id,
        supervisor_name: supervisor.name,
        supervisor_email: supervisor.email,
        supervisor_phone: supervisor.phone,
        supervisor_image: supervisor.image,
      },
    ]);
  };

  const handleRemoveClick = (supervisor) => {
    setAddedSupervisors((prev) =>
      prev.filter((sup) => sup.supervisor_id !== supervisor.s_id)
    );

    setAvailableSupervisors((prev) => [
      ...prev,
      {
        supervisor_id: supervisor.s_id,
        supervisor_name: supervisor.name,
        supervisor_email: supervisor.email,
        supervisor_phone: supervisor.phone,
        supervisor_image: supervisor.image,
      },
    ]);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const filteredSupervisors = availableSupervisors.filter((supervisor) =>
    supervisor.supervisor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-full h-full top-0 left-0 z-40">
      <div className="bg-white py-20 px-14 rounded-[14px] flex flex-col justify-center items-center alertcontent gap-4 relative min-w-[1200px] h-[90vh] ">
        <div className="flex items-center w-full justify-between relative">
          <div
            onClick={onClose}
            className="cursor-pointer -top-5 -right-8 absolute bg-red-500 rounded-full"
          >
            <IoIosClose color="white" />
          </div>
          <div className="font-normal text-[36px]">Add Supervisors</div>
          <div className="bg-[#3481FF] rounded-[6px] text-white flex items-center justify-center px-4 py-1 ml-4">
            <div className="text-[#E7E7E7] text-[10px] mr-1">Asset ID</div> -{" "}
            <div className="text-[10px] ml-1">{asset_id}</div>
            <div className="ml-1 cursor-pointer" onClick={handleCopyClick}>
              {isCopied ? <TbCopyCheckFilled /> : <MdContentCopy />}
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full relative h-[100%]">
          <div className="relative">
            <BiSearch className="absolute left-[440px] top-[23px] cursor-pointer transform -translate-y-2 text-gray-500" />
            <input
              type="text"
              placeholder="Enter the name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 pr-10 rounded w-[474px] min-w-[470px] bg-[#EBEBEB]"
            />
            <div className="mt-10 overflow-y-auto overflow-x-hidden h-[90%] relative">
              {loading ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
                  <Lottie
                    options={defaultOptionsforloading}
                    height={100}
                    width={100}
                  />
                </div>
              ) : filteredSupervisors.length > 0 ? (
                filteredSupervisors.map((supervisor) => (
                  <AddSupervisorcomp
                    key={supervisor.supervisor_id}
                    AssetId={asset_id}
                    s_id={supervisor.supervisor_id}
                    name={supervisor.supervisor_name}
                    email={supervisor.supervisor_email}
                    phone={supervisor.supervisor_phone}
                    image={supervisor.supervisor_image}
                    onAdd={handleSupervisorAdd}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 flex items-start min-w-[600px]">
                  No supervisors found.
                </div>
              )}
            </div>
          </div>

          <div className="h-full p-[1px] bg-black text-white"></div>
          <div>
            <h3 className="font-medium text-[32px] min-w-[450px] ">
              Added Supervisors
            </h3>
            <div className="overflow-y-auto overflow-x-hidden h-[90%] w-[600px] relative">
              {loading ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 text-center text-gray-500">
                  <Lottie
                    options={defaultOptionsforloading}
                    height={100}
                    width={100}
                  />
                </div>
              ) : addedSupervisors.length > 0 ? (
                addedSupervisors.map((supervisor) => (
                  <AlreadyAddedSuperVisorcomp
                    key={supervisor.supervisor_id}
                    AssetId={asset_id}
                    s_id={supervisor.supervisor_id}
                    name={supervisor.supervisor_name}
                    email={supervisor.supervisor_email}
                    phone={supervisor.supervisor_phone}
                    image={supervisor.supervisor_image}
                    onRemove={handleRemoveClick}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center text-gray-500 min-w-[600px] h-full">
                  No one is added
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSuperVisor;
