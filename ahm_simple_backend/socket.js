// socket.js
import { Server } from "socket.io";
import handleContestEvents from "./socketHandlers/contestHandlers.js";


let io;

export default function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Connected: ${socket.id}`);
        handleContestEvents(socket);
    });

    return io;
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
