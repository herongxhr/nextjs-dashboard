"use client";
import { io } from "socket.io-client";

const { HOSTNAME, PORT } = process.env;
const socket = io(`${HOSTNAME}:${PORT}`, {
    autoConnect: false,
});


socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;