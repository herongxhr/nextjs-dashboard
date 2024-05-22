import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import dbConnect from '../db/mongodb.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.ts';
import dotenv from 'dotenv';
import { getClientIpAddress } from './utils.js'

dotenv.config(); // 确保在引用任何环境变量之前调用

const dev = process.env.NODE_ENV !== "production";

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();



app.prepare().then(async () => {
  await dbConnect(); // 确保数据库连接成功

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.use(async (socket: Socket, next) => {
    let userId = socket.handshake.auth.userId;
    const ipAddress = getClientIpAddress(socket);
    const userAgent = socket.handshake.headers["user-agent"] || "unknown";

    if (userId) {
      // 如果存在 sessionID，更新用户的 IP 地址和 User-Agent 信息
      await User.findOneAndUpdate({ userId: userId }, { ipAddress, userAgent });
    } else {
      // 如果不存在 sessionID，创建新用户
      userId = uuidv4();
      const user = new User({
        userId: userId,
        ipAddress,
        userAgent,
        location: 'Unknown',
        name: 'Unknown',
        gender: 'Unknown',
        createdAt: new Date(),
      });
      await user.save();
    }

    // 发送 userId 到客户端
    socket.emit('userId', userId);

    // 将 userId 附加到 socket 对象
    (socket as any).userId = userId;

    next();
  });

  io.on("connection", async (socket) => {

    socket.on("chatMessage", async (message, callback) => {
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