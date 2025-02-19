import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3200"; // Change this if backend is deployed

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;
