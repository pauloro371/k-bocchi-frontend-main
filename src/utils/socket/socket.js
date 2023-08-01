import { io } from "socket.io-client";
export const socket = io(process.env.REACT_APP_BACKEND_API, {
   autoConnect: false,
 });
//export const socket = io("http://localhost:4000", {
 // autoConnect: false,
//});

