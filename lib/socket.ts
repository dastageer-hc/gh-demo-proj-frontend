import { io } from "socket.io-client";

const SOCKET_URL = "https://dastageerhc-gh-demo-pro-61.deno.dev"; // Change this if backend is deployed

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export default socket;
