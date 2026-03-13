import { useEffect, useState } from "react";
import React from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
const MobileNav = () => {

  const [MenuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();
  const handleMenu = () => {
    gsap.to(".mv",{height:"auto",width:"auto"})
    gsap.to(".mvitem", { opacity: 1 ,pointerEvents:"auto"});
  
    gsap.to(".line:nth-child(2)", { opacity: 0 });
    gsap.to(".line:nth-child(1)", { transform: "rotate(45deg)" });
    gsap.to(".line:nth-child(3)", { transform: "rotate(-45deg)" });
    gsap.to(".ham", {scale:0.7})
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    gsap.to(".mvitem", { opacity: 0 ,pointerEvents:"none"});
    gsap.to(".line:nth-child(2)", { opacity: 1 });
    gsap.to(".line:nth-child(1)", { transform: "rotate(0deg)" });
    gsap.to(".line:nth-child(3)", { transform: "rotate(0deg)" });
    setTimeout(() => {

    
      gsap.to(".ham", {scale:1})
      gsap.to(".mv",{height:0,width:0})
    }, 500);
  };

  useEffect(() => {
    if (MenuOpen) {
      handleMenu();
    } else {
      handleMenuClose();
    }
  }, [MenuOpen]);
  return (
    <div className="relative z-10">
      {" "}
      <div
        className="ham ml-1 flex flex-col gap-[0.4rem] cursor-pointer z-[101]"
        onClick={() => {
          setMenuOpen(!MenuOpen);
          
        }}
      >
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className="bg-white rounded-md absolute  top-[-12px] z-[-1] left-[-6px] flex flex-col gap-2 px-6 justify-center items-center py-4 pt-7 shadow-2xl mv overflow-hidden">
       
       
         <span className="mvitem hover:bg-blue-500 px-6 hover:text-white rounded-md duration-150 cursor-pointer py-2 " onClick={()=>{
            navigate("/client/home");
            handleMenuClose()
         }}>Home</span>
         <span className="mvitem hover:bg-blue-500 px-6 hover:text-white rounded-md duration-150 cursor-pointer py-2 " onClick={()=>{
            navigate("/client/workshop");
              handleMenuClose()
         }}>Workshop</span>
         <span className="mvitem hover:bg-blue-500 px-6 hover:text-white rounded-md duration-150 cursor-pointer py-2 " onClick={()=>{
            navigate("/client/supervisor");
              handleMenuClose()
         }}>Supervisor</span>
         <span className="mvitem hover:bg-blue-500 px-6 hover:text-white rounded-md duration-150 cursor-pointer py-2 " onClick={()=>{
            navigate("/client/settings");
              handleMenuClose()
         }}>Settings</span>
         <span className="mvitem hover:bg-blue-500 px-6 hover:text-white rounded-md duration-150 cursor-pointer py-2 " onClick={()=>{
            navigate("/client/help");
              handleMenuClose()
         }}>Help</span>
         
      </div>
    </div>
  );
};
export default MobileNav;
