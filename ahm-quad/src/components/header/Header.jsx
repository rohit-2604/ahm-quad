import React, { useEffect, useState, useRef } from "react";
// import profile_pic from "../../../assets/profile_pic.png";
import { usePost } from "../../hooks/usehttp";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MobileNav from "../navbar/MobileNav/MobileNav";
import LoadingExample from "./LoadingSpinner ";
import MakeInIndia from "../../../src/assets/mii.png";
import { IoNotifications } from "react-icons/io5";
import NotificationOverview from "../Notification/NotificationOverview";
import compLogo from "../../assets/navbar/comp_logo.png"
function Header() {
  const [userData, setuserData] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { postRequest } = usePost();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        setIsLoading(true);
        const response = await postRequest(
          `/company/dashboard`,
          {},
          accessToken
        );

        console.log(response);
        setuserData(response.data);

        // // console.log(response);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching userData:", err);

        setIsLoading(false);
      }
    };

    // fetchUserDetails();
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center py-3   md:w-full w-full">
      {/* Title */}
      {isMobile && <MobileNav />}
      <div className="font-bold text-lg md:text-2xl lg:text-4xl flex gap-3 relative items-center">
            <img src={compLogo} alt="Company Logo" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16" />
        <p className="truncate">IEMA-AHM</p>
        <div className="bg-black overflow-hidden h-5 md:h-7 rounded-md text-white px-2 lg:px-4 text-[0.5rem] md:text-[0.6rem] lg:bottom-0 flex justify-center items-center  md:bottom-0 md:right-[-35%] right-[-45%]">
          QUAD
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
        <div
          className="relative"
          ref={notificationRef} // <-- ref wraps bell + overview
        >
        

          
        </div>

        {/* <div className=""><img src={MakeInIndia} width="50px" alt="" /></div> */}
        {/* System Admin Label - Hidden on Mobile */}
        <div className="hidden lg:flex items-center justify-center px-4 py-2 text-sm bg-black text-white rounded-md">
          Client
        </div>

        {/* Profile Section */}
       <div className="relative" ref={dropdownRef}>
  <div
    className="flex items-center  rounded-full cursor-pointer"
    onClick={handleProfileClick}
  >
    <img
      src={MakeInIndia}
      alt="profile pic"
      className="object-cover p-1 w-8 h-8 md:w-14 md:h-14 rounded-full"
    />
  </div>

  {/* Dropdown Menu */}
</div>
      </div>
    </div>
  );
}

export default Header;
