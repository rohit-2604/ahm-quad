import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import SensorMonitorForClient from "./pages/Client/sensorMonitor/SensorMonitor";
import AssetsForClient from "./pages/Client/workshop_asssets/Assets.page";
import SensorMonitorForClient from "./pages/Client/sensorMonitor/SensorMonitor";

const AppRouter = () => {
  return (
    <Routes>
   
      <Route
        path="/assets/:asset_id/sensors/:sensor_id"
        element={<SensorMonitorForClient />}
      />
        <Route
        path="/"
        element={<AssetsForClient />}
      />
    </Routes>
  );
};

export default AppRouter;
