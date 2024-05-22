import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dbConnect from '../db/mongodb.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.ts';
import dotenv from 'dotenv';

dotenv.config(); // 确保在引用任何环境变量之前调用

const dev = process.env.NODE_ENV !== "production";

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const getClientIpAddress = (socket) => {
  const forwardedHeader = socket.handshake.headers["forwarded"];
  const xForwardedForHeader = socket.handshake.headers["x-forwarded-for"];
  const cloudflareHeader = socket.handshake.headers["cf-connecting-ip"];
  const fastlyHeader = socket.handshake.headers["fastly-client-ip"];

  // Check if Forwarded header is present
  if (forwardedHeader) {
    const directives = forwardedHeader.split(",");
    for (const directive of directives) {
      const parts = directive.split(";");
      for (const part of parts) {
        const [key, value] = part.trim().split("=");
        if (key === "for" && value) {
          return value.trim();
        }
      }
    }
  }

  // Check if X-Forwarded-For header is present
  if (xForwardedForHeader) {
    const ipAddress = xForwardedForHeader.split(",")[0].trim();
    if (ipAddress) {
      return ipAddress;
    }
  }

  // Check if CloudFlare header is present
  if (cloudflareHeader) {
    return cloudflareHeader;
  }

  // Check if Fastly header is present
  if (fastlyHeader) {
    return fastlyHeader;
  }

  // Default: use the direct connection address
  return socket.handshake.address;
};

app.prepare().then(async () => {
  await dbConnect(); // 确保数据库连接成功

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const ipAddress = getClientIpAddress(socket);
    console.log('ip地址：', ipAddress, socket.handshake);
    socket.on("chatMessage", async (message, callback) => {
      console.log('服务器收到消息:', message);
      try {
        // 假设有一个 Chat 模型可用于存储消息
        const Chat = mongoose.model('Chat', new mongoose.Schema({ message: String, timestamp: Date }));
        const newMessage = new Chat({ message: message, timestamp: new Date() });
        await newMessage.save();
        callback({ status: 'ok' });
      } catch (error) {
        console.error('Error saving message:', error);
        callback({ status: 'error' });
      }
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});