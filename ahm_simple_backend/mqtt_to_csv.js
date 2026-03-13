import { connect } from "mqtt";
import { existsSync, writeFileSync, appendFile, mkdirSync } from "fs";
import { join } from "path";

    const BROKER = "mqtt://INSIEMA.local"; // replace with your MQTT broker address
    const PORT = 1883;


const DATA_DIR = join(process.cwd(), "data");

function saveTopicsToCSV(topics = []) {

    // Create data directory if not exists
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
        console.log("Created data directory:", DATA_DIR);
    }

    const client = connect(BROKER, {
        port: PORT
    });

    const files = {};

    topics.forEach(topic => {

        // sanitize topic name (important if topic contains "/")
        const safeTopic = topic.replace(/[\/#]/g, "_");

        const filePath = join(DATA_DIR, `${safeTopic}.csv`);
        files[topic] = filePath;

        // Create CSV file with header if not exists
        if (!existsSync(filePath)) {

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

            writeFileSync(filePath, header);
            console.log("Created CSV file:", filePath);
        }

    });

    client.on("connect", () => {

        console.log("MQTT connected");

        topics.forEach(topic => {
            client.subscribe(topic);
            console.log(`Subscribed to topic: ${topic}`);
        });

    });

    client.on("message", (topic, message) => {

        try {

            const data = JSON.parse(message.toString());
            const timestamp = new Date().toISOString();

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

            if (filePath) {

                appendFile(filePath, row, err => {
                    if (err) {
                        console.error("CSV write error:", err);
                    }
                });

            }

        } catch (err) {
            console.error("Invalid JSON received:", err);
        }

    });

    client.on("error", err => {
        console.error("MQTT Error:", err);
    });

}

export default saveTopicsToCSV;