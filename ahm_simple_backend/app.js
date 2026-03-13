import express from "express";
import http from "http";
import cors from "cors";
import initsocket from "./socket.js";
const app = express();
import { configDotenv } from "dotenv";
import morgan from "morgan";
import { fetchThresholdController, getLatestCSVRows, totalRuntimeCSV, updateThresholdController } from "./fetchthresold.controller.js";
import saveTopicsToCSV from "./mqtt_to_csv.js";
import topics from "./topics.config.js";
const socketserver = http.createServer(app);
initsocket(socketserver);


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

const port = 3000;


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to socket server" });
});

app.post("/company/thresolddata",fetchThresholdController);
app.post("/company/updatethresold/:sensor_id",updateThresholdController);
app.post("/company/totalruntimes/:sensor_id",totalRuntimeCSV);
app.post("/company/getlatestcsvrows/:sensor_id",getLatestCSVRows);

socketserver.listen(port, () => {
    saveTopicsToCSV(topics);
  console.log(`server listening on port ${port}`);
}
);