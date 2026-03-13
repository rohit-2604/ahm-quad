import React, { createContext, useContext, useState } from "react";

// Create the context
export const ClientStateContext = createContext();

// Create a provider component
export const ClientStateContextProvider = ({ children }) => {
  const [companyStateData, setcompanyStateData] = useState();
  const [workshopStateData, setWorkshopStateData] = useState();
  const [sensorThresholdData, setsensorThresholdData] = useState();
  const [deleteClientLoading, setDeleteClientLoading] = useState(false);
  const [deleteworkshopLoading, setDeleteworkshopLoading] = useState(false);
  const [deleteworkshopLoadingforClient, setDeleteworkshopLoadingforClient] =
    useState(false);
  const [resolveData, setResolveData] = useState([]);
  const [clientClicked, setClientClicked] = useState(false);
  const [FetchedReport, setFetchedReport] = useState();
  const [supervisorassetlength, Setsupervisorassetlength] = useState(null);
  const [UpdatedAsset, setUpdatedAsset] = useState(null)
  const [AssetStatus, setAssetStatus] = useState([])
  const [totalRuntime, settotalRuntime] = useState(null)
  const [pinnedAsset, setpinnedAsset] = useState(null)
  // New state for service form data selection
  const [serviceSelections, setServiceSelections] = useState({});

  return (
    <ClientStateContext.Provider
      value={{
        companyStateData,
        setcompanyStateData,
        workshopStateData,
        setWorkshopStateData,
        sensorThresholdData,
        setsensorThresholdData,
        deleteClientLoading,
        setDeleteClientLoading,
        deleteworkshopLoading,
        setDeleteworkshopLoading,
        deleteworkshopLoadingforClient,
        setDeleteworkshopLoadingforClient,
        clientClicked,
        setClientClicked,
        serviceSelections, // Add this to the context
        setServiceSelections, // Function to update selections
        FetchedReport,
        setFetchedReport,
        resolveData,
        setResolveData,
        supervisorassetlength,
        Setsupervisorassetlength,
        UpdatedAsset,
        setUpdatedAsset,
        AssetStatus,
        setAssetStatus,
         totalRuntime,
        settotalRuntime,
        pinnedAsset,
        setpinnedAsset,
      }}
    >
      {children}
    </ClientStateContext.Provider>
  );
};

// Custom hook to access the context
export const useClientContext = () => {
  const context = useContext(ClientStateContext);
  if (context === undefined) {
    throw new Error(
      "useClientContext must be used within a ClientStateContextProvider"
    );
  }
  return context;
};
