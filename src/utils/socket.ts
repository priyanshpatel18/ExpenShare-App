import { io } from "socket.io-client";

const socket = io("http://192.168.1.4:8080");
// const socket = io("https://expen-share-app-server.vercel.app/")

export default socket;
