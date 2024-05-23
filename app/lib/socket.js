"use client";
import { io } from "socket.io-client";

const { NEXT_PUBLIC_HOSTNAME, NEXT_PUBLIC_PORT } = process.env;

console.log('process.env', process.env)

const socket = io(`http://localhost:3000`, {
    autoConnect: false,
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
