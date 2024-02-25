import { io } from "socket.io-client";

const socket = io("http://192.168.206.226:8080");
// const socket = io("https://expen-share-app-server.vercel.app")

export default socket;
