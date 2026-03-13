// import React from "react";
// import { usePost } from "../../../../hooks/usehttp";
// function AddSupervisorcomp({
//   name,
//   email,
//   phone,
//   image,
//   s_id,
//   AssetId,
//   onAdd,
// }) {
//   const { postRequest } = usePost();

//   const handleAddClick = async () => {
//     try {
//       const requestBody = {
//         action: "add",
//         asset_id: AssetId,
//       };

//       const response = await postRequest(
//         `/company/addassetinsupervisor/${s_id}`,
//         requestBody,
//         localStorage.getItem("token")
//       );

//       if (response) {
//         // console.log("Supervisor added successfully:", response.data);
//         if (onAdd) {
//           onAdd({
//             s_id,
//             name,
//             email,
//             phone,
//             image,
//           });
//         }
//       } else {
//         console.error("Failed to add supervisor:", response);
//       }
//     } catch (error) {
//       console.error("Error adding supervisor:", error);
//     }
//   };
//   const truncateName = (name) => {
//     return name.length > 6 ? name.slice(0, 6) + "..." : name;
//   };
//   return (
//     <div>
//       <div className="bg-[#E8F1FF] rounded-[8px] flex items-center justify-between py-3 px-5 mt-3 w-[674px]">
//         <div className="flex items-center ">
//           <img src={image} alt="" className="w-11 h-11" />
//           <div
//             className="text-[20px] pl-4 font-medium cursor-pointer"
//             title={name}
//           >
//             {truncateName(name)}
//           </div>
//         </div>
//         <div className="text-[20px] flex items-center justify-center gap-4 font-medium">
//           {email}
//         </div>
//         <div className="bg-[#00E15E] w-[77px] h-[25px] rounded-[4px] text-white ">
//           <div
//             className="items-center justify-center flex cursor-pointer"
//             onClick={handleAddClick}
//           >
//             Add
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddSupervisorcomp;

import React, { useState } from "react";
import { usePost } from "../../../../hooks/usehttp";
import { MdContentCopy } from "react-icons/md";
import { TbCopyCheck } from "react-icons/tb";
function AddSupervisorcomp({
  name,
  email,
  phone,
  image,
  s_id,
  AssetId,
  onAdd,
}) {
  const { postRequest } = usePost();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltipemail, setShowTooltipemail] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [addloading, setAddloading] = useState(false);
  // console.log(AssetId, "shdfgvsjdhfjhhsdfjh");
  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy email:", err));
  };
  const handleAddClick = async () => {
    setAddloading(true);
    try {
      const requestBody = {
        action: "add",
        asset_id: AssetId,
      };

      const response = await postRequest(
        `/company/addassetinsupervisor/${s_id}`,
        requestBody,
        localStorage.getItem("token")
      );

      if (response) {
        // console.log("Supervisor added successfully:", response.data);
        if (onAdd) {
          onAdd({
            s_id,
            name,
            email,
            phone,
            image,
          });
        }
      } else {
        console.error("Failed to add supervisor:", response);
      }
    } catch (error) {
      console.error("Error adding supervisor:", error);
    } finally {
      setAddloading(false);
    }
  };

  const truncateName = (name) => {
    return name.length > 6 ? name.slice(0, 6) + "..." : name;
  };
  const truncateEmail = (email) => {
    return email.length > 6 ? email.slice(0, 6) + "..." : email;
  };

  return (
    <div>
      <div className="bg-[#E8F1FF] rounded-[8px] flex items-center justify-between py-3 px-5 mt-3 w-[574px]">
        <div className="flex items-center relative">
          <img src={image} alt="" className="w-11 h-11" />
          <div
            className="text-[20px] pl-4 font-medium cursor-pointer w-[100px]"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {truncateName(name)}
            {showTooltip && (
              <div className="absolute left-10 -top-8  mt-1 bg-black text-white text-sm p-2 rounded shadow-lg z-10">
                {name}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex items-center">
          <div
            className="text-[20px] font-medium cursor-pointer w-[100px]"
            onMouseEnter={() => setShowTooltipemail(true)}
            onMouseLeave={() => setShowTooltipemail(false)}
          >
            {truncateEmail(email)}
            {showTooltipemail && (
              <div className="absolute left-0 -top-8 mt-1 bg-black text-white text-sm p-2 rounded shadow-lg z-10">
                {email}
              </div>
            )}
          </div>
          <div className="ml-2 cursor-pointer" onClick={handleCopyEmail}>
            {isCopied ? <TbCopyCheck /> : <MdContentCopy />}
          </div>
        </div>

        <div className="bg-[#00E15E] w-[77px] h-[25px] rounded-[4px] text-white items-center justify-center flex cursor-pointer text-[14px]">
          <div
            className="items-center justify-center flex cursor-pointer text-[14px]"
            onClick={handleAddClick}
          >
            {addloading ? "Adding" : "Add"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSupervisorcomp;
