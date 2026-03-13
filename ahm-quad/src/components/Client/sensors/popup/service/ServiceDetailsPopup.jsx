import React, { useEffect, useState, useRef } from "react";
import { MdCancel, MdContentCopy } from "react-icons/md";
import { LuCopyCheck } from "react-icons/lu";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useClientContext } from "../../../../../context/ClientStateContext.jsx";
import gsap from "gsap";
import { usePost } from "../../../../../hooks/usehttp.jsx";
import LoadingExample from "../../../../LoadingSpinner .jsx";
import { TbReload } from "react-icons/tb";

function ServiceDetailsPopup({ setServicePopup, formData }) {
  const { asset_id } = useParams();
  const { postRequest } = usePost();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false)
  const { serviceSelections, setServiceSelections } = useClientContext();
  const [cause, setCause] = useState(formData?.cause_of_maintainance)
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = formData?.date_of_maintainance;
    return date ? new Date(date) : null;
  });
  const [selectedNextDate, setSelectedNextDate] = useState(() => {
    const date = formData?.next_maintainance;
    return date ? new Date(date) : null;
  });
  const [activeSection, setActiveSection] = useState(null);
  const [name, setName] = useState(formData?.service_person_name || "");
  const [email, setEmail] = useState(formData?.service_person_email || "");
  const [designation, setDesignation] = useState(formData?.service_person_designation || "");
  const [assets, setAssets] = useState();
  const [copied, setCopied] = useState(false);
  const [refreshCounter, setrefreshCounter] = useState(0)

  const accesToken = localStorage.getItem("token");
  const sectionRefs = useRef({});
  // const { workshop_id } = useParams();
  // /superadmin/createserviceform/:asset_id

  useEffect(() => {
    if (formData) {
      setServiceSelections(formData.form)
      console.log("Form Data:", formData);
    }

  }, [formData])


  const handleClose = () => {
    setServicePopup(false)
  }

  const submitServiceForm = async () => {
    if (!asset_id) {
      console.error("Asset ID is missing or invalid!");
      return; // Stop function execution if asset_id is missing
    }
    const body = {
      date_of_maintainance: selectedDate ? selectedDate.toISOString() : null,
      cause_of_maintainance: cause,
      next_maintainance: selectedNextDate ? selectedNextDate.toISOString() : null,
      name,
      email,
      designation,
      Type: assets?.asset_type || "Unknown",
      forms: serviceFormData,
    };


    try {
      setIsLoading(true);
      const response = await postRequest(
        `/company/createserviceform/${asset_id}`,

        body
        ,
        accesToken
      );
      // // console.log(body)
      // // console.log("Response from API:", response);

      if (response.success) {
        // console.log("Form submitted successfully!");
        setServicePopup(false)
        setServiceSelections({})
        // ✅ Reset all checkboxes (uncheck them)
        // setServiceFormData(transformServiceData());
        // setServiceSelections(transformServiceData());

        // ✅ Reset cause, date, and next date
        // setCause("");
        // setSelectedDate(null);
        // setSelectedNextDate(null);
        setName("");
        setEmail("");
        setDesignation("");
        setCause("");
        setSelectedDate(null);
        setSelectedNextDate(null);
      } else {
        console.error("API Error:", response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const isFormComplete = () => {
    return (
      selectedDate !== null &&
      selectedNextDate !== null &&
      cause.trim() !== "" &&
      name.trim() !== "" &&
      email.trim() !== "" &&
      designation.trim() !== "" &&
      serviceFormData.some(category =>
        category.inspections.some(inspection =>
          inspection.tasks.some(task => task.completed)
        )
      )
    );
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setFetchLoading(true)
        const accessToken = localStorage.getItem("token");

        const response = await postRequest(
          `/company/fetchoneasset/${asset_id}`,
          {},
          accessToken
        );

        if (response.success) {
          setFetchLoading(false)
          // console.log(response);

          setAssets(response.data);


        }
      } catch (err) {
        setFetchLoading(false)
        console.error("Error fetching assets:", err);

      }
    };

    fetchAssets();
  }, []);


  const serviceData = [
    {
      "Lubrication": [
        {
          "Visual Inspection": [
            { "Check for any oil leaks around the bearing or seals": false },
            { "Ensure proper lubrication levels": false },
          ],
        },
        {
          "Bearing Lubrication": [
            { "Use the recommended lubricant": false },
            { "Lubricate bearings according to manufacurer": false },
          ],
        },
        {
          "Oil quality": [
            {
              "Replace oil if it shows signs of contamination or degradation": false,
            },
            { "Check the condition of the lubrication oil.": false },
          ],
        },
      ],
      "Overhauling": [
        {
          "Visual Inspection": [
            { "Inspect motor for wear, damage": false },
            { "Check for corrosion.": false },
          ],
        },
        {
          "Bearing Lubrication": [
            { "Inspect and replace bearings if needed.": false },
            { "Verify rotor integrity.": false },
          ],
        },
        {
          "Winding Inspection": [
            {
              "Check windings for wear, overheating, or breakdown.": false,
            },
            { "Check oil condition.": false },
          ],
        },
        {
          "Brush Inspection": [
            {
              "Examine brushes thoroughly for signs of wear.": false,
            },
            { "Replace brushes": false },
          ],
        },
      ],
      "Electrical Testing": [
        {
          "Insulation Resistance": [
            { "Perform insulation resistance test": false },
            { "Record insulation resistance values": false },
          ],
        },
        {
          "Connection Checks": [
            { "Inspect terminal connections for tightness.": false },
            { "Verify proper cable routing and management.": false },
          ],
        },

      ],
      "Cooling System": [
        {
          "Fan Inspection": [
            { "Check the fan for damage or obstruction.": false },
            { "Verify proper operation": false },
          ],
        },
        {
          "Airflow and Cooling Fins": [
            { "Ensure cooling fins are clean and free of debris.": false },
            { "Check for any blockages affecting airflow.": false },
          ],
        },

      ],
      "General Inspection": [
        {
          "Fan Inspection": [
            { "Check motor frame and housing for cracks or damage.": false },
            { "Check for loose bolts or connections": false },
          ],
        },
        {
          "Noise and Vibration": [
            { "Listen for abnormal noises during operation.": false },
            { "Check for excessive vibrations": false },
          ],
        },

      ],
    },
  ];

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(asset_id);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Transform serviceData to match state format
  const transformServiceData = () => {
    return Object.entries(serviceData[0]).map(([category, inspections]) => ({
      category,
      inspections: inspections.map((inspection) => ({
        title: Object.keys(inspection)[0],
        tasks: Object.values(inspection)[0].map((task) => ({
          description: Object.keys(task)[0],
          completed: task[Object.keys(task)[0]],
        })),
      })),
    }));
  };

  // Initialize state with transformed data
  const [serviceFormData, setServiceFormData] = useState(formData?.from);

  // useEffect(() => {
  //   if (serviceSelections.length > 0) {
  //     setServiceFormData([...serviceSelections]);
  //   }
  // }, [serviceSelections]);

  // GSAP animations for expanding sections
  useEffect(() => {
    if (activeSection !== null && sectionRefs.current[activeSection]) {
      gsap.fromTo(
        sectionRefs.current[activeSection],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power1.out" }
      );
    }
  }, [activeSection]);

  const handleCheckboxChange = (categoryIndex, inspectionIndex, taskIndex) => {
    const updatedData = [...serviceFormData];
    updatedData[categoryIndex].inspections[inspectionIndex].tasks[taskIndex].completed =
      !updatedData[categoryIndex].inspections[inspectionIndex].tasks[taskIndex].completed;

    setServiceFormData(updatedData);
    setServiceSelections(updatedData);
  };

  const handleSectionClick = (category) => {
    setActiveSection((prev) => (prev === category ? null : category));
  };

  const handleSelectAllInCategory = (categoryIndex) => {
    const allChecked = serviceFormData[categoryIndex].inspections.every(inspection =>
      inspection.tasks.every(task => task.completed)
    );

    const updatedData = [...serviceFormData];
    updatedData[categoryIndex].inspections = updatedData[categoryIndex].inspections.map(inspection => ({
      ...inspection,
      tasks: inspection.tasks.map(task => ({
        ...task,
        completed: !allChecked,
      })),
    }));

    setServiceFormData(updatedData);
    setServiceSelections(updatedData);
  };

  const handleSelectAll = () => {
    const allChecked = serviceFormData.every(category =>
      category.inspections.every(inspection =>
        inspection.tasks.every(task => task.completed)
      )
    );

    const updatedData = serviceFormData.map(category => ({
      ...category,
      inspections: category.inspections.map(inspection => ({
        ...inspection,
        tasks: inspection.tasks.map(task => ({
          ...task,
          completed: !allChecked,
        })),
      })),
    }));

    setServiceFormData(updatedData);
    setServiceSelections(updatedData);
  };
  useEffect(() => {
    // console.log(serviceFormData)
  }, [serviceFormData])


  return (
    <>
      {fetchLoading ? (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-[100%] h-[100%] top-0 left-0 z-40">
          <div className="bg-white py-10 px-4 rounded-[14px] h-[700px] flex flex-col justify-center items-center alertcontent gap-14 relative min-w-[800px]">
            <div>
              <LoadingExample />
            </div>
          </div>

        </div>
      ) : (
        <div className="flex bg-[#00000034] alertcontainer backdrop-blur-md fixed justify-center items-center w-[100%] h-[100%] top-0 left-0 z-40">
          <div className="alertcontent bg-[#ffffff] rounded-md flex max-h-[90vh] justify-start items-start min-w-[800px] px-[2%] py-8 flex-col gap-1 overflow-y-auto relative">
            <button className="absolute top-4 right-4 text-red-600"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setServicePopup(false);
                setServiceSelections({})
              }}
            >
              <MdCancel size={24} />


            </button>


            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center w-full text-[35px]">Service Form</h2>

            <div className="flex justify-between w-full">
              <div className="flex items-center mt-3 bg-blue-500 text-white px-4 py-0 rounded-md">
                <span className="mr-2 text-[12px]">Asset ID - {asset_id}</span>
                {copied ? <LuCopyCheck /> : <MdContentCopy className="cursor-pointer text-sm" onClick={handleCopy} />}

              </div>

              <div className="flex justify-center mt-3 items-center bg-blue-500 text-white px-4 py-0 rounded-md">
                <span className="text-[12px] ">Asset Type - {assets?.asset_type}</span>
              </div>
            </div>

            {/* Date Picker */}
            <div className="mt-5 flex gap-10">
              <div>
                <label className="block text-lg">Date of maintenance</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  showTimeSelect
                  timeIntervals={15}
                  className="border rounded-md px-3 py-2 mt-2 w-full"
                  placeholderText="Choose a date and time"
                />
              </div>

              <div>
                <label className="block text-lg ">Next Date</label>
                <DatePicker
                  selected={selectedNextDate}
                  onChange={(date) => setSelectedNextDate(date)}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  showTimeSelect
                  timeIntervals={15}
                  className="border rounded-md px-3 py-2 mt-2 w-full"
                  placeholderText="Choose a date and time"
                  minDate={selectedDate}
                />
              </div>
            </div>
            <div className="mt-5 flex gap-10">
              <div className="flex flex-col w-full">
                <label className="block text-lg">Maintenance person's Name</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 mt-2 w-full"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="block text-lg">Email</label>
                <input
                  type="email"
                  className="border rounded-md px-3 py-2 mt-2 w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="block text-lg">Designation</label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 mt-2 w-full"
                  placeholder="Enter your designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="block text-lg">Cuase of maintenance</label>
              <textarea className="border-2 w-full p-1" onChange={(e) => setCause(e.target.value)} value={cause} />
            </div>

            {/* Global Select All Checkbox */}
            <label className="flex items-center mt-5 space-x-3 text-green-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer text-[20px]"
                checked={serviceFormData.every(category =>
                  category.inspections.every(inspection =>
                    inspection.tasks.every(task => task.completed)
                  )
                )}
                onChange={handleSelectAll}
              />
              <span className="border-2 border-black rounded-md py-1 px-5 bg-gray-200 select-none">Select All</span>
            </label>

            <div className="mt-5 w-full text-[20px]">
              {serviceFormData.map((category, categoryIndex) => (
                <div key={category.category} className="mb-3">
                  {/* Category Section (Expands on Click) */}
                  <div
                    className="flex items-center bg-blue-400 w-full text-black px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => handleSectionClick(category.category)}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 mr-3 cursor-pointer"
                      checked={category.inspections.every(inspection =>
                        inspection.tasks.every(task => task.completed)
                      )}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleSelectAllInCategory(categoryIndex)}
                    />
                    <span>{category.category}</span>
                  </div>

                  <div ref={(el) => (sectionRefs.current[category.category] = el)} className="overflow-hidden">
                    {activeSection === category.category && (
                      <div className="ml-6 mt-3 space-y-2">
                        {category.inspections.map((inspection, inspectionIndex) => (
                          <div key={inspection.title}>
                            <h3 className="text-lg font-medium text-green-600">{inspection.title}</h3>
                            {inspection.tasks.map((task, taskIndex) => (
                              <label key={task.description} className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 text-green-600 cursor-pointer"
                                  checked={task.completed}
                                  onChange={() =>
                                    handleCheckboxChange(categoryIndex, inspectionIndex, taskIndex)
                                  }
                                />
                                <span>{task.description}</span>
                              </label>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center  w-full ">
              {isFormComplete() ? (
                <div className="px-10 py-2 bg-green-600 rounded-md text-white text-[20px] cursor-pointer" onClick={submitServiceForm}>
                  {!isLoading ? "Submitting" : "Submit"}
                </div>
              ) : (<div className="flex justify-center items-center text-sm text-gray-500">
                Please fill all the fields to submit the form
              </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default ServiceDetailsPopup;
