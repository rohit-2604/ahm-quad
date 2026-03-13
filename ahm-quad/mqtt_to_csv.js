import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function saveTopicsToCSV(topic1, topic2) {

    const topics = [topic1, topic2];
    const files = {};

    topics.forEach(topic => {

        const filePath = path.join(__dirname, `${topic}.csv`);
        files[topic] = filePath;

        if (!fs.existsSync(filePath)) {

            const header = [
                "timestamp",
                "device_id",
                "temperature_one",
                "temperature_two",
                "vibration_x",
                "vibration_y",
                "vibration_z",
                "magnetic_flux_x",
                "magnetic_flux_y",
                "magnetic_flux_z",
                "microphone_one",
                "microphone_two"
            ].join(",") + "\n";

            fs.writeFileSync(filePath, header);
        }

    });

    function random(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }

    function generateRandomData(topic) {

        const timestamp = new Date().toISOString();

        const data = {
            device_id: topic,
            temperature_one: random(20, 40),
            temperature_two: random(20, 40),
            vibration_x: random(-5, 5),
            vibration_y: random(-5, 5),
            vibration_z: random(-5, 5),
            magnetic_flux_x: random(-100, 100),
            magnetic_flux_y: random(-100, 100),
            magnetic_flux_z: random(-100, 100),
            microphone_one: random(30, 100),
            microphone_two: random(30, 100)
        };

        const row = [
            timestamp,
            data.device_id,
            data.temperature_one,
            data.temperature_two,
            data.vibration_x,
            data.vibration_y,
            data.vibration_z,
            data.magnetic_flux_x,
            data.magnetic_flux_y,
            data.magnetic_flux_z,
            data.microphone_one,
            data.microphone_two
        ].join(",") + "\n";

        const filePath = files[topic];

        fs.appendFile(filePath, row, err => {
            if (err) console.error("CSV write error:", err);
        });

    }

    console.log("Generating random sensor data...");

    setInterval(() => {
        topics.forEach(topic => {
            generateRandomData(topic);
        });
    }, 1000); // every 1 second
}