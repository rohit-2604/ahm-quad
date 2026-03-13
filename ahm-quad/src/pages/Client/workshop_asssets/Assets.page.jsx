import React, { useEffect, useState } from "react";
import profile_pic from "../../../assets/profile_pic.png";
import "./style.css";
import assets_bg from "../../../assets/assetsImg/asset_bg.png";
import AssetCard from "../../../components/Client/assetsComp/AssetCard";
import { IoChevronBack, IoSearchSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
// import AssetAddPopup from "../../../components/Client/assetsComp/popups/AssetAddPopup";
import { usePost } from "../../../hooks/usehttp";
import useSocket from "../../../hooks/useSocket";
import Lottie from "react-lottie";
import ClientLoading from "../../../Lottie/ClientLoading.json";
import WorkshopAssetLoader from "../../../loaders/WorkshopAssetLoader";
import AssetCardV2 from "../../../components/Client/assetsComp/AssetCardV2";
import AssetBgPicLoader from "../../../loaders/AssetBgPicLoader";
import AssetPageLoader from "../../../loaders/AssetPageLoader";
import { useClientContext } from "../../../context/ClientStateContext";
import { RxCross2 } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import lowfifi from "../../../assets/lowwifi.png";
import highwifi from "../../../assets/highwifi.png";
import Header from "../../../components/header/Header";
import assetData from "../../../Assets.json";

function Assets() {
  const deviceId = localStorage.getItem("deviceId");
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const { AssetStatus, setAssetStatus } = useClientContext();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("none");
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const { UpdatedAsset, setUpdatedAsset, pinnedAsset, setpinnedAsset } =
    useClientContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdating2, setIsUpdating2] = useState(false);
  const { postRequest, isLoading } = usePost();
  const [selectedAssetType, setselectedAssetType] = useState("none");
  const [AssetTypes, setAssetTypes] = useState();
  const [newAsset, setnewAsset] = useState();
  const { workshop_id, company_id } = useParams();
  const navigate = useNavigate();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [assets, setAssets] = useState(assetData.assets);
  const [workshop, setWorkshop] = useState({
    workshop_id: "INS_m8alwuml2ku6",
    company_id_fk: "y1xscetqq4bdy77922ucn0pk",
    workshop_name: "INS-IEMA",
    workshop_address: "Visak",
    workshop_description: "INS HIMGIRI",
    Workshop_image:
      "https://res.cloudinary.com/durfyg4h8/image/upload/v1725882549/vvb4unype0i6cllwjspg.png",
    low_internet_area: false,
    company_image:
      "https://res.cloudinary.com/dae1usdo1/image/upload/v1769499113/company_images/zvutbubk4so3vvyakwox.png",
  });
  const [filteredAssets, setFilteredAssets] = useState(assetData.assets);
  const [query, setQuery] = useState("");

  const [isLowInternet, setIsLowInternet] = useState(false);
  const [OtherOrganizational, setOtherOrganizational] = useState(false);

  const handleToggleChange2 = async () => {
    //  setIsUpdating2(!isUpdating2);
    setOtherOrganizational(!OtherOrganizational);
  };

  const handleToggleChange = async () => {
    try {
      setIsUpdating(true);
      const accessToken = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();
      formData.append("low_internet_area", !isLowInternet);

      const response = await fetch(
        `https://bhilai-ahm-backend.iemamerica.com/company/updateWorkshop/${workshop_id}`,
        {
          method: "POST", // or PUT if your API expects PUT
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // ❌ Do not set Content-Type manually, fetch will handle it for FormData
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data.data);
        setIsLowInternet(data.data.low_internet_area);
        setIsUpdating(false);
      } else {
        console.error(
          "Failed to update workshop:",
          data.message || "Unknown error"
        );
        setIsUpdating(false);
      }
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating workshop:", error);
    }
  };

  const handleSearch = () => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = assets.filter(
      (asset) =>
        asset.asset_name.toLowerCase().includes(lowerCaseQuery) ||
        asset.asset_id.toString().includes(lowerCaseQuery)
    );
    setFilteredAssets(filtered);
  };
  const removeAsset = (assetId) => {
    setAssets((prevAssets) =>
      prevAssets.filter((asset) => asset.asset_id !== assetId)
    );
    setFilteredAssets((prevAssets) =>
      prevAssets.filter((asset) => asset.asset_id !== assetId)
    );
  };

  const handleBack = () => {
    navigate(`/client/workshop`);
  };


  useEffect(() => {
 console.log(filteredAssets,"current")
  }, [filteredAssets])
  
  const toggleAddAssetPopup = () => {
    setShowAddPopup(!showAddPopup);
  };
  useEffect(() => {
    const typeCounts = Object.values(
      filteredAssets.reduce((acc, curr) => {
        const type = curr.asset_type;
        if (!acc[type]) {
          acc[type] = { Type: type, Count: 0 };
        }
        acc[type].Count += 1;
        return acc;
      }, {})
    );
    setAssetTypes(typeCounts);
    console.log(typeCounts, "filteredAssets");
  }, [filteredAssets]);



//   useEffect(() => {
//     const filteredByType =
//       selectedAssetType !== "none"
//         ? assets.filter((asset) => asset.asset_type === selectedAssetType)
//         : assets;

//     const filteredByStatus =
//       selectedStatusFilter !== "none"
//         ? filteredByType.filter((asset) => {
//             const statusObj = AssetStatus.find(
//               (status) => status.assetId === asset.asset_id
//             );
//             return statusObj?.MachineStatus === selectedStatusFilter;
//           })
//         : filteredByType;

//     setFilteredAssets(filteredByStatus);
//   }, [selectedAssetType, selectedStatusFilter, assets, AssetStatus]);

  // Fetch assets
//   useEffect(() => {
//     const fetchAssets = async () => {
//       try {
//         const accessToken = localStorage.getItem("token");
//         const response = await postRequest(
//           `/company/fetchasset/${workshop_id}`,
//           {},
//           accessToken
//         );
//         if (response.success) {
//           if (Array.isArray(response.data)) {
//             setAssets(response.data);
//             console.log(response.data);
//             setFilteredAssets(response.data);
//           } else {
//             console.error("Unexpected data format, expected an array.");
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching assets:", err);
//       }
//     };

//     fetchAssets();
//   }, [workshop_id]);

  // Fetch workshop details
//   useEffect(() => {
//     const fetchWorkshopDetails = async () => {
//       try {
//         const accessToken = localStorage.getItem("token");
//         const response = await postRequest(
//           `/company/fetchoneworkshop/${workshop_id}`,
//           {},
//           accessToken
//         );
//         console.log(response.data, "sdfsdfsdfsdf");
//         if (response.success) {
//           setWorkshop(response.data);
//           setIsLowInternet(Boolean(response.data.low_internet_area));
//         }
//       } catch (err) {
//         console.error("Error fetching workshop details:", err);
//       }
//     };

//     if (workshop_id) {
//       fetchWorkshopDetails();
//     }
//   }, [workshop_id]);

//   useEffect(() => {
//     if (socket) {
//       socket.on(`assetCreatedby_${workshop_id}`, (data) => {
//         // // console.log(data)
//         if (data.deviceId != deviceId) {
//           if (assets.length > 0) {
//             setAssets([...assets, data]);
//             setFilteredAssets([...filteredAssets, data]);
//           } else {
//             setAssets([data]);
//             setFilteredAssets([data]);
//           }
//         }
//       });
//       socket.on(`assetDeletedby_${workshop_id}`, (data) => {
//         if (assets.length > 0) {
//           setAssets(assets.filter((asset) => asset.asset_id !== data.asset_id));
//           setFilteredAssets(
//             filteredAssets.filter((asset) => asset.asset_id !== data.asset_id)
//           );
//         } else {
//           setAssets([]);
//           setFilteredAssets([]);
//         }
//       });
//     }
//   }, [socket, assets]);


//   useEffect(() => {
//     if (newAsset) {
//       if (assets.length > 0) {
//         setAssets([...assets, newAsset]);
//         setFilteredAssets([...filteredAssets, newAsset]);
//       } else {
//         setAssets([newAsset]);
//         setFilteredAssets([newAsset]);
//       }
//       setnewAsset(null);
//     }
//   }, [newAsset]);
  const loadingClient = {
    loop: true,
    autoplay: true,
    animationData: ClientLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

//   useEffect(() => {
//     if (UpdatedAsset) {
//       setFilteredAssets((prevAssets) =>
//         prevAssets.map((asset) => {
//           if (asset.asset_id === UpdatedAsset.asset_id) {
//             return { ...asset, ...UpdatedAsset };
//           }
//           return asset;
//         })
//       );
//     }
//   }, [UpdatedAsset]);
  useEffect(() => {
    if (pinnedAsset) {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.asset_id === pinnedAsset.asset_id
            ? { ...asset, ...pinnedAsset }
            : asset
        )
      );
    }
  }, [pinnedAsset]);

  useEffect(() => {
    console.log(selectedAssetType);
    if (selectedAssetType !== "none") {
      setFilteredAssets(
        assets.filter((asset) => asset.asset_type === selectedAssetType)
      );
    } else {
      console.log("null tapped");
      setFilteredAssets(assets);
    }
  }, [selectedAssetType]);

  return (
    <div className="w-full md:ml-4 lg:ml-4 lg:pr-9 md:pr-9 ml-2 pr-2">
      <div className="w-full">
        {/* <div className="flex items-center w-full">
          <div className="mb-2">
            <IoChevronBack
              className="text-xs mt-2 gap-2 text-[#929090]"
              onClick={handleBack}
            />
          </div>
          <p
            className="font-semibold text-[#929090] text-[11px] cursor-pointer"
            onClick={handleBack}
          >
            Back
          </p>
          <div className="ml-3">
            <p
              className="font-semibold text-[#929090] text-[10px] cursor-pointer"
              onClick={handleBack}
            >
              workshops/assets/{workshop?.workshop_id}
            </p>
          </div>
        </div> */}
        <Header/>

        <div className="mb-2 ml-1 text-[24px] w-full text-[#4D4D4D] font-semibold">
          Assets ({assets.length})
        </div>

        <div>
          <div className="bg-[#F5F5F5] rounded-[9px] w-full flex flex-col">
            <div className="cardconimg p-4">
              {isLoading ? (
                <AssetBgPicLoader />
              ) : (
                <div className="relative">
                  <img
                    src={workshop?.Workshop_image}
                    alt="assets background"
                    className="w-[100%] md:h-[250px] lg:h-[250px] h-[100px] object-cover rounded-[10px] brightness-75  workshop_banner"
                  />

                  <div className="absolute top-[10%] left-[1.75%] flex bg-black px-3 items-center justify-center rounded-[3px] text-white text-xs py-1 overflow-hidden">
                    {workshop?.workshop_address}
                  </div>

                  <div className="absolute bottom-[10%] right-[2%]"></div>

                  <div className="absolute bottom-[7%] left-[3%] flex items-center ">
                    <div className="text-[#fff] lg:text-[50px] text-[18px] font-semibold lg:min-w-[400px] md:min-w-[400px] min-w-[150px] ">
                      {workshop?.workshop_name}
                    </div>

                    <div className=" z-[2] flex rounded-md lg:text-xs text-[10px] items-center mt-4 bg-white w-[100%] text-black px-2 py-1 h-[28px] text-center font-bold justify-center ">
                      {workshop?.workshop_id}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isLoading ? (
              <AssetPageLoader />
            ) : isMobile ? (
              <>
                <div className=" bg-blue-100 px-4  py-2 mb-2 flex-wrap  flex justify-center items-center rounded-md gap-2 justify-self-center self-center w-[90%]">
                  {AssetTypes?.map((assetType, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className={`flex items-center justify-center w-[150px] gap-1 hover:bg-blue-600 hover:text-white duration-300 ${
                            selectedAssetType === assetType.Type
                              ? "bg-blue-600 text-white"
                              : "bg-[#ffffff] text-black"
                          }  px-2 py-1 rounded-md mr-2 text-center cursor-pointer`}
                          onClick={() => setselectedAssetType(assetType.Type)}
                        >
                          <div className="text-[10px] lg:text-[12px] font-semibold text-center">
                            {assetType.Type}
                          </div>
                          <div className="text-[10px] lg:text-[12px] font-semibold text-center">
                            ({assetType.Count})
                          </div>
                        </div>
                        {selectedAssetType !== "none" ? (
                          <div
                            className="ml-4 cursor-pointer bg-red-600 text-white rounded-full p-2"
                            onClick={() => {
                              setselectedAssetType("none");
                            }}
                          >
                            <RxCross2 />
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  })}
                </div>

                <div className="lg:w-full  flex justify-end mb-5 gap-3 ">
                  <div className="flex w-full justify-end items-center gap-3">
                    <div className="flex bg-white px-5 items-center space-x-2 py-2 border rounded-md p-1">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-white text-black w-[100px] lg:w-full"
                        onKeyUp={handleSearch}
                      />
                      <button className="">
                        <IoSearchSharp className="lg:w-5 lg:h-5 w-3 h-3  text-gray-600" />
                      </button>
                    </div>
                    <div
                      className="flex items-center bg-[#3481FF] text-white rounded-md cursor-pointer pl-3 pr-4 w-[] lg:w-[155px] lg:text-[16px] font-semibold h-[38px] mr-4 gap-3"
                      onClick={toggleAddAssetPopup}
                    >
                      <span className="flex text-[12px] lg:text-[16px] flex-wrap ">
                        Add Asset
                      </span>
                      <div className="bg-white w-[19px] h-[19px] lg:w-[23px] lg:h-[23px] flex items-center justify-center rounded-[3px] ml-2">
                        <BsPlus color="blue" className="lg:text-xl text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="lg:w-full  flex justify-end mb-5 gap-3 ">
                {AssetTypes && AssetTypes.length > 0 ? (
                  <div className="ml-5 bg-blue-100 px-4 py-1 flex md:flex-row lg:flex-row  justify-center items-center rounded-md">
                    {AssetTypes?.map((assetType, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className={`flex items-center justify-center w-[150px] gap-1 hover:bg-blue-600 hover:text-white duration-300 ${
                              selectedAssetType === assetType.Type
                                ? "bg-blue-600 text-white"
                                : "bg-[#ffffff] text-black"
                            }  px-2 py-1 rounded-md mr-2 text-center cursor-pointer`}
                            onClick={() => setselectedAssetType(assetType.Type)}
                          >
                            <div className="text-[10px] lg:text-[12px] font-semibold text-center">
                              {assetType.Type}
                            </div>
                            <div className="text-[10px] lg:text-[12px] font-semibold text-center">
                              ({assetType.Count})
                            </div>
                          </div>
                          {selectedAssetType !== "none" ? (
                            <div
                              className="ml-4 cursor-pointer bg-red-600 text-white rounded-full p-2"
                              onClick={() => {
                                setselectedAssetType("none");
                              }}
                            >
                              <RxCross2 />
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}

                {/* <div className="flex flex-row gap-2 items-center  mt-2 ml-4">
                  {["Healthy", "Unhealthy", "Inactive"].map((status) => (
                    <div
                      key={status}
                      className={`cursor-pointer px-3 py-1 rounded-md text-sm font-semibold border ${
                        selectedStatusFilter === status
                          ? "bg-blue-600 text-white"
                          : "bg-white text-black"
                      } hover:bg-blue-500 hover:text-white duration-300`}
                      onClick={() => setSelectedStatusFilter(status)}
                    >
                      {status}
                    </div>
                  ))}
                  {selectedStatusFilter !== "none" && (
                    <div
                      className="ml-2 cursor-pointer bg-red-600 text-white rounded-full p-2"
                      onClick={() => setSelectedStatusFilter("none")}
                    >
                      <RxCross2 />
                    </div>
                  )}
                </div> */}
                {/* {workshop?.low_internet_area ? (
                  <div className="max-w-[400px] w-full h-[30px] self-end rounded-md   justify-center flex items-center bg-red-100 ">
                    <p>Low internet area</p>
                  </div>
                ) : (
                  ""
                )} */}

                {/* <div
                  className={`max-w-[400px] w-full h-[30px] self-end rounded-md justify-center flex items-center px-4 ${
                    isLowInternet ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {" "}
                  <div className=" rounded-full p-1">
                    {" "}
                    <img
                      src={isLowInternet ? lowfifi : highwifi}
                      alt=""
                      className="w-5 h-5 group relative"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    Low Internet Area
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleChange}
                    disabled={isUpdating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      isLowInternet ? "bg-red-500" : "bg-gray-300"
                    } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 flex items-center justify-center ${
                        isLowInternet ? "translate-x-6" : "translate-x-1"
                      }`}
                    >
                      {isUpdating && (
                        <svg
                          className="animate-spin h-3 w-3 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                    </span>
                  </button>
                  <span
                    className={`text-xs ml-2 ${
                      isLowInternet ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {isLowInternet ? "ON" : "OFF"}
                  </span>
                </div> */}

                <div className="flex w-full justify-end items-center gap-3">
                  <div className="flex bg-white px-5 items-center space-x-2 py-2 border rounded-md p-1">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-white text-black w-[100px] lg:w-full"
                      onKeyUp={handleSearch}
                    />
                    <button className="">
                      <IoSearchSharp className="lg:w-5 lg:h-5 w-3 h-3  text-gray-600" />
                    </button>
                  </div>
                  {/* <div
                    className="flex items-center bg-[#3481FF] text-white rounded-md cursor-pointer pl-3 pr-4 w-[] lg:w-[155px] lg:text-[16px] font-semibold h-[38px] mr-4 gap-3"
                    onClick={toggleAddAssetPopup}
                  >
                    <span className="flex text-[12px] lg:text-[16px] flex-wrap ">
                      Add Asset
                    </span>
                    <div className="bg-white w-[19px] h-[19px] lg:w-[23px] lg:h-[23px] flex items-center justify-center rounded-[3px] ml-2">
                      <BsPlus color="blue" className="lg:text-xl text-sm" />
                    </div>
                  </div> */}
                </div>
              </div>
            )}
              {filteredAssets.some(asset => asset.asset_pin) && (
            <div className="flex flex-wrap min-h-full min-w-full lg:justify-start md:justify-start justify-center lg:items-start md:items-start items-center ">
            
  <div className="head w-full pl-6">
    <p className="font-semibold text-xl">📌 Pinned Assets</p>
  </div>

              {isLoading ? (
                <div className="flex ml-4 min-w-full min-h-full  flex-col">
                  <WorkshopAssetLoader />
                </div>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => {
                  if (asset.asset_pin) {
                    if (
                      asset.asset_type === "Motor" ||
                      asset.asset_type === "Pump" ||
                      asset.asset_type === "Blower"
                    ) {
                      return (
                        <div className="">
                          <AssetCard
                            key={index}
                            asset={asset}
                            onDelete={removeAsset}
                          />
                        </div>
                      );
                    } else if (
                      asset.asset_type === "Motor with Pump" ||
                      asset.asset_type === "Motor with Grinder"
                    ) {
                      return (
                        <AssetCardV2
                          key={index}
                          asset={asset}
                          onDelete={removeAsset}
                          isFromAssetPage={true}
                        />
                      );
                    }
                  }
                })
              ) : (
                <p className="w-full flex justify-center items-center py-48">
                  No assets available
                </p>
              )}
            </div>
            )}
            <div className="flex flex-wrap min-h-full min-w-full lg:justify-start md:justify-start justify-center lg:items-start md:items-start items-center">
              <div className="head w-full pl-6">
                <p className="font-semibold text-xl">🛠️ All Assets</p>
              </div>
              {isLoading ? (
                <div className="flex ml-4 min-w-full min-h-full  flex-col">
                  <WorkshopAssetLoader />
                </div>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => {
                  if (asset.asset_pin === false) {
                    if (
                      asset.asset_type === "Motor" ||
                      asset.asset_type === "Pump" ||
                      asset.asset_type === "Blower"
                    ) {
                      return (
                        <div className="">
                          <AssetCard
                            key={index}
                            asset={asset}
                            onDelete={removeAsset}
                          />
                        </div>
                      );
                    } else if (
                      asset.asset_type === "Motor with Pump" ||
                      asset.asset_type === "Motor with Grinder"
                    ) {
                      return (
                        <AssetCardV2
                          key={index}
                          asset={asset}
                          onDelete={removeAsset}
                          isFromAssetPage={true}
                        />
                      );
                    }
                  }
                })
              ) : (
                <p className="w-full flex justify-center items-center py-48">
                  No assets available
                </p>
              )}
            </div>
            {/* <div className="flex w-full justify-center items-center gap-3 mb-6">
              <div className="bg-white flex gap-3 px-10 py-2 rounded-md">
                <p>Other Organizations?</p>{" "}
                <button
                  type="button"
                  onClick={handleToggleChange2}
                  disabled={isUpdating2}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    OtherOrganizational ? "bg-green-500" : "bg-gray-300"
                  } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 flex items-center justify-center ${
                      OtherOrganizational ? "translate-x-6" : "translate-x-1"
                    }`}
                  >
                    {isUpdating2 && (
                      <svg
                        className="animate-spin h-3 w-3 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div> */}

            {OtherOrganizational && (
              <div className="  flex justify-center items-center mb-6 w-full flex-col gap-6 relative px-8">
                <div className="text-sm text-gray-500">
                  This setting allows assets from other organizations to be
                  included.
                </div>
                {/* <div className="bg-[#191919] h-[50px] min-w-[220px] w-[22%] absolute top-[7.2%] left-[76%]"></div> */}
                <div className="overflow-hidden w-full h-[700px] rounded-lg flex justify-center items-center ">
                  {/* Loader overlay */}
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-gray-600 mt-4 font-medium">
                        Loading...
                      </p>
                    </div>
                  )}
                  <iframe
                    src="https://iot.sailisp.com/#/login"
                    frameBorder="0"
                    className="w-full h-[900px] mt-[90px] zoom-crop"
                    onLoad={() => setLoading(false)}
                  ></iframe>
                  <style jsx>{`
                    @media (max-width: 1365px) {
                      /* Applies when zoomed in (viewport smaller) */
                      .zoom-crop {
                        margin-top: 0px !important; /* more cropped on top */
                      }
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {showAddPopup && (
          <AssetAddPopup
            onClose={toggleAddAssetPopup}
            setnewAsset={setnewAsset}
          />
        )} */}
      </div>
    </div>
  );
}

export default Assets;
