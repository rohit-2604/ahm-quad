// utils/thresholdUtils.js
const transformThresholdData = (threshold) => {
  return {
    sensorId: threshold.sensor_id,
    threshold_data: [
      {
        type: "temperature_skin",
        min: threshold.temperature_skin_min,
        healthy: threshold.temperature_skin_healthy,
        warning: threshold.temperature_skin_warning,
        max: threshold.temperature_skin_max,
      },
      {
        type: "temperature_bearing",
        min: threshold.temperature_bearing_min,
        healthy: threshold.temperature_bearing_healthy,
        warning: threshold.temperature_bearing_warning,
        max: threshold.temperature_bearing_max,
      },
      {
        type: "vibration_X",
        min: threshold.vibration_X_min,
        healthy: threshold.vibration_X_healthy,
        warning: threshold.vibration_X_warning,
        max: threshold.vibration_X_max,
      },
      {
        type: "vibration_Y",
        min: threshold.vibration_Y_min,
        healthy: threshold.vibration_Y_healthy,
        warning: threshold.vibration_Y_warning,
        max: threshold.vibration_Y_max,
      },
      {
        type: "vibration_Z",
        min: threshold.vibration_Z_min,
        healthy: threshold.vibration_Z_healthy,
        warning: threshold.vibration_Z_warning,
        max: threshold.vibration_Z_max,
      },
      {
        type: "magnetic_flux_X",
        min: threshold.magnetic_flux_X_min,
        healthy: threshold.magnetic_flux_X_healthy,
        warning: threshold.magnetic_flux_X_warning,
        max: threshold.magnetic_flux_X_max,
      },
      {
        type: "magnetic_flux_Y",
        min: threshold.magnetic_flux_Y_min,
        healthy: threshold.magnetic_flux_Y_healthy,
        warning: threshold.magnetic_flux_Y_warning,
        max: threshold.magnetic_flux_Y_max,
      },
      {
        type: "magnetic_flux_Z",
        min: threshold.magnetic_flux_Z_min,
        healthy: threshold.magnetic_flux_Z_healthy,
        warning: threshold.magnetic_flux_Z_warning,
        max: threshold.magnetic_flux_Z_max,
      },
      {
        type: "microphone_one",
        min: threshold.microphone_one_min,
        healthy: threshold.microphone_one_healthy,
        warning: threshold.microphone_one_warning,
        max: threshold.microphone_one_max,
      },
      {
        type: "microphone_two",
        min: threshold.microphone_two_min,
        healthy: threshold.microphone_two_healthy,
        warning: threshold.microphone_two_warning,
        max: threshold.microphone_two_max,
      },
    ],
  };
};

export { transformThresholdData };