import { io } from "socket.io-client";

const SOCKET_URL = ""; // Change this if backend is deployed

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;
