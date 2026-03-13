import { getThresholdValue } from "./get_thresold.utils.js";
import { transformThresholdData } from "./utils/thresold.utils.js";
import fs from "fs";
import csv from "csv-parser";
import { stringify } from "csv-stringify/sync";
import path from "path";
import lockfile from "proper-lockfile";

export const fetchThresholdController = async (req, res) => {
  try {
    const { sensorId } = req.body;

    if (!sensorId) {
      return res.status(400).json({
        success: false,
        message: "Sensor ID is required",
      });
    }

    const threshold = await getThresholdValue(sensorId);

    if (!threshold) {
      return res.status(404).json({
        success: false,
        message: `Threshold not found for sensor ${sensorId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Threshold data fetched successfully",
      data: transformThresholdData(threshold),
    });

  } catch (error) {
    console.error("Error fetching threshold:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const thresholdFile = path.join(process.cwd(), "data/thresold_sensor.csv");
export const updateThresholdController = async (req, res) => {
  let release;

  try {
    const { sensor_id } = req.params;
    const { type, min, healthy, warning, max } = req.body;

    if (!sensor_id || !type || min == null || healthy == null || warning == null || max == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const typeMapping = {
      temperature_skin: "temperature_skin",
      temperature_bearing: "temperature_bearing",
      vibration_X: "vibration_X",
      vibration_Y: "vibration_Y",
      vibration_Z: "vibration_Z",
      magnetic_flux_X: "magnetic_flux_X",
      magnetic_flux_Y: "magnetic_flux_Y",
      magnetic_flux_Z: "magnetic_flux_Z",
      microphone_one: "microphone_one",
      microphone_two: "microphone_two",
    };

    const prefix = typeMapping[type];

    if (!prefix) {
      return res.status(400).json({
        success: false,
        message: "Invalid threshold type",
      });
    }

    // 🔒 lock CSV file
    release = await lockfile.lock(thresholdFile);

    const rows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(thresholdFile)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    let updatedRow = null;

    for (let row of rows) {
      if (row.sensor_id === sensor_id) {
        row[`${prefix}_min`] = min;
        row[`${prefix}_healthy`] = healthy;
        row[`${prefix}_warning`] = warning;
        row[`${prefix}_max`] = max;
        updatedRow = row;
      }
    }

    if (!updatedRow) {
      await release();

      return res.status(404).json({
        success: false,
        message: `Sensor threshold not found for ${sensor_id}`,
      });
    }

    // rewrite CSV
    const csvOutput = stringify(rows, { header: true });
    fs.writeFileSync(thresholdFile, csvOutput);

    await release();

    return res.status(200).json({
      success: true,
      message: "Threshold updated successfully",
      data: transformThresholdData(updatedRow),
    });

  } catch (error) {
    console.error("Threshold update error:", error);

    if (release) {
      try { await release(); } catch {}
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const totalRuntimeCSV = async (req, res) => {
  try {
    const sensorID = req.params.sensor_id;

    const inactivityThreshold = 3 * 60; // 3 minutes (seconds)

    const filePath = path.join(process.cwd(), "data", `${sensorID}.csv`);

    // Check if CSV exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Sensor CSV not found",
      });
    }

    let previousTimestamp = null;
    let totalRuntimeSeconds = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {

          if (!row.timestamp) return;

          const currentTimestamp = new Date(row.timestamp).getTime();

          if (!isNaN(currentTimestamp)) {

            if (previousTimestamp !== null) {

              const diffSeconds =
                (currentTimestamp - previousTimestamp) / 1000;

              if (diffSeconds <= inactivityThreshold) {
                totalRuntimeSeconds += diffSeconds;
              }

            }

            previousTimestamp = currentTimestamp;
          }

        })
        .on("end", resolve)
        .on("error", reject);
    });

    return res.status(200).json({
      success: true,
      message: "Total runtime calculated successfully",
      data: {
        total_runtime_seconds: Math.floor(totalRuntimeSeconds),
      },
    });

  } catch (error) {
    console.error("Runtime calculation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLatestCSVRows =async (req, res) => {
  try {
    const sensorID = req.params.sensor_id;

    const filePath = path.join(process.cwd(), "data", `${sensorID}.csv`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "CSV file not found",
      });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.trim().split("\n");

    const header = lines[0].split(",");

    // remove device_id column
    const filteredHeader = header.filter(col => col !== "device_id");

    const latestRows = lines.slice(-100);

    const result = {};
    filteredHeader.forEach(col => {
      result[col] = [];
    });

    latestRows.forEach(line => {
      const values = line.split(",");

      header.forEach((col, index) => {
        if (col !== "device_id") {
          result[col].push(values[index]);
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Latest 100 records fetched",
      data: result
    });

  } catch (error) {
    console.error("CSV fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};