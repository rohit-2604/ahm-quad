import React from "react";

const ConfrimationPopup = ({
  setConfirmationPopupShow,
  setConfirmationMessage,
}) => {
  
  return (
    <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-[100%] h-[100%] top-0 left-0 z-40">
      <div className="bg-white py-10 px-4 rounded-[14px] flex flex-col justify-center items-center alertcontent  gap-14 relative">
        <div className="font-semibold w-[90%] text-center flex justify-center items-center text-2xl">
          Are you sure you want to continue?
        </div>
        <div className="flex justify-center items-center w-full gap-8">
        <div
            className="py-2 px-12 rounded-md cursor-pointer bg-transparent border-[2px] hover:border-blue-500 hover:text-white hover:bg-blue-500 border-blue-500 duration-200 text-blue-500"
            onClick={() => {
              setConfirmationMessage(false);
              setConfirmationPopupShow(false);
            }}
          >
            No
          </div>
          <div
            className="py-2 px-12 rounded-md cursor-pointer bg-blue-500 border-[2px] hover:border-blue-500 hover:text-blue-500 hover:bg-transparent border-blue-500 duration-200 text-white"
            onClick={() => {
              setConfirmationMessage(true);
              setConfirmationPopupShow(false);
            }}
          >
            Yes
          </div>
         
        </div>
      </div>
    </div>
  );
};
export default ConfrimationPopup;
