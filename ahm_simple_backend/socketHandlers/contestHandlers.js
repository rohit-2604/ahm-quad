import {calculateVibrationValue} from '../utils/change_vibration.utils.js';
import {getThresholdValue} from '../get_thresold.utils.js';
import topics from '../topics.config.js';
import { configDotenv } from "dotenv";

import mqtt from 'mqtt';

console.log(topics);


const options = 
{
  host: "INSIEMA.local", // replace with your MQTT broker address
  port: 1883,
};


const client = mqtt.connect(options);
client.setMaxListeners(1000);


client.on("connect", async () => {
  console.log("Subscriber connected to the broker");

  if (!topics || topics.length === 0) {
    console.log("No topics to subscribe to.");
    return;
  }

  client.subscribe(topics, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to topics: ${topics.join(", ")}`);
    }
  });
});

const handleContestEvents = (socket) => {
     /* ================= SENSOR LIVE DATA (FIXED PART) ================= */

  socket.on("topicId", async (data) => {
    console.log(`Received data for sensor: ${data.sId}`);
    
    if (!data || !data.sId) return;

    const thresholdValue = await getThresholdValue(data.sId);
    // console.log(`Threshold for ${data.sId}:`, thresholdValue);
    const sensorFrequency = 50;

    // 🚨 HARD GUARD (CRASH FIX)
    if (!thresholdValue || !sensorFrequency) {
      console.warn(`Missing threshold/frequency for ${data.sId}`);
      return;
    }

    let messageReceived = false;
    let noMessageCounter = 0;

    const messageHandler = async (topic, message) => {
      try {
        if (topic !== data.sId) return;
        if (!message || !message.length) return;

        messageReceived = true;
        noMessageCounter = 0;

        const currentTime = new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const payload = JSON.parse(message.toString());
        const { device_id, ...sensorData } = payload;

        const integerSensorData = Object.fromEntries(
          Object.entries(sensorData).map(([k, v]) => [k, Number(v)])
        );

        const vibration_velocity = await calculateVibrationValue(
          integerSensorData.vibration_x || 0,
          integerSensorData.vibration_y || 0,
          integerSensorData.vibration_z || 0,
          sensorFrequency
        );

        const combinedData = {
          deviceID: device_id,
          ...integerSensorData,
          timestamp: currentTime,

          temperature_skin_health:
            integerSensorData.temperature_two >=
              thresholdValue.temperature_skin_healthy &&
              integerSensorData.temperature_two <=
              thresholdValue.temperature_skin_warning
              ? "healthy"
              : "unhealthy",

          temperature_bearing_health:
            integerSensorData.temperature_one >=
              thresholdValue.temperature_bearing_healthy &&
              integerSensorData.temperature_one <=
              thresholdValue.temperature_bearing_warning
              ? "healthy"
              : "unhealthy",

          vibration_health:
            vibration_velocity < 0.01
              ? "inactive"
              : vibration_velocity <= thresholdValue.vibration_X_warning
                ? "healthy"
                : "unhealthy",
        };

        const healthStates = Object.values(combinedData);

        combinedData.overall_health = healthStates.includes("inactive")
          ? "Inactive"
          : healthStates.includes("unhealthy")
            ? "Unhealthy"
            : "Healthy";

        combinedData.sensorstatus =
          combinedData.overall_health === "Inactive"
            ? "Inactive"
            : "Active";

        socket.broadcast.emit(`${data.sId}`, combinedData);
      } catch (err) {
        console.error("MQTT message error:", err);
      }
    };

    // ✅ attach ONCE
    client.on("message", messageHandler);

    const interval = setInterval(() => {
      if (!messageReceived) {
        noMessageCounter++;

        if (noMessageCounter >= 2) {
          socket.broadcast.emit(`${data.sId}`, {
            deviceID: data.sId,
            timestamp: new Date().toLocaleTimeString("en-GB"),
            overall_health: null,
          });
          noMessageCounter = 0;
        }
      }
      messageReceived = false;
    }, 40000);

    // 🔥 CLEANUP (VERY IMPORTANT)
    socket.on("disconnect", () => {
      client.off("message", messageHandler);
      clearInterval(interval);
    });
  });
};

export default handleContestEvents;
