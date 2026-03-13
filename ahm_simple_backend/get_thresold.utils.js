import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvFile = join(__dirname, "/data/thresold_sensor.csv");

export function getThresholdValue(sensorId) {
  return new Promise((resolve, reject) => {
    let result = null;

    fs.createReadStream(csvFile)
      .pipe(csv())
      .on("data", (row) => {
        if (row.sensor_id == sensorId) {
          result = row;
        }
      })
      .on("end", () => resolve(result))
      .on("error", reject);
  });
}