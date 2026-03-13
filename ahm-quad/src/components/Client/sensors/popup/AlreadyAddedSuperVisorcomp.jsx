import React, { useState } from "react";
import { usePost } from "../../../../hooks/usehttp";
import { TbCopyCheck } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";

function AlreadyAddedSuperVisorcomp({
  name,
  email,
  phone,
  image,
  s_id,
  AssetId,
  onRemove,
}) {
  const { postRequest } = usePost();
  const [removeLoading, setRemoveLoading] = useState(false);
  const [showTooltipName, setShowTooltipName] = useState(false);
  const [showTooltipEmail, setShowTooltipEmail] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleRemoveClick = async () => {
    setRemoveLoading(true);
    try {
      const requestBody = {
        action: "remove",
        asset_id: AssetId,
      };

      const response = await postRequest(
        `/company/addassetinsupervisor/${s_id}`,
        requestBody,
        localStorage.getItem("token")
      );

      if (response?.data) {
        // console.log("Supervisor removed successfully:", response.data);
        if (onRemove) {
          onRemove({ s_id, name, email, phone, image });
        }
      } else {
        console.error("Failed to remove supervisor:", response);
      }
    } catch (error) {
      console.error("Error removing supervisor:", error);
    } finally {
      setRemoveLoading(false);
    }
  };

  const truncateName = (name) => {
    return name.length > 6 ? name.slice(0, 6) + "..." : name;
  };
  const truncateEmail = (email) => {
    return email.length > 6 ? email.slice(0, 6) + "..." : email;
  };
  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy email:", err));
  };
  return (
    <div>
      <div className="bg-[#E8F1FF] rounded-[8px] flex items-center justify-between py-3 px-5 mt-2 w-[570px]">
        <div className="flex items-center relative">
          <img src={image} alt="Supervisor" className="w-11 h-11" />
          <div
            className="text-[20px] pl-4 font-medium cursor-pointer w-[100px]"
            onMouseEnter={() => setShowTooltipName(true)}
            onMouseLeave={() => setShowTooltipName(false)}
          >
            {truncateName(name)}
            {showTooltipName && (
              <div className="absolute left-10 -top-6 mt-1 bg-black text-white text-sm p-2 rounded shadow-lg z-10">
                {name}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex items-center">
          <div
            className="text-[20px] flex items-center justify-center gap-4 font-medium cursor-pointer"
            onMouseEnter={() => setShowTooltipEmail(true)}
            onMouseLeave={() => setShowTooltipEmail(false)}
          >
            {truncateEmail(email)}
            {showTooltipEmail && (
              <div className="absolute left-0 -top-8 mt-1 bg-black text-white text-sm p-2 rounded shadow-lg z-10">
                {email}
              </div>
            )}
          </div>
          <div className="ml-2 cursor-pointer" onClick={handleCopyEmail}>
            {isCopied ? <TbCopyCheck /> : <MdContentCopy />}
          </div>
        </div>

        <div
          className="bg-[#D14633] text-[14px] w-[88px] h-[25px] rounded-[4px] text-white flex items-center justify-center cursor-pointer"
          onClick={handleRemoveClick}
        >
          {removeLoading ? "Removing" : "Remove"}
        </div>
      </div>
    </div>
  );
}

export default AlreadyAddedSuperVisorcomp;
