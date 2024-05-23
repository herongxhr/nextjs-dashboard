import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dbConnect from '../db/mongodb.js';
import dotenv from 'dotenv';
import { updateCustomerInfo } from './middleware.js'

dotenv.config(); // 确保在引用任何环境变量之前调用

const dev = process.env.NODE_ENV !== "production";

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


const onlineUsers = new Map<string, string>(); // 存储 userId 和 socket.id 的映射

app.prepare().then(async () => {
  await dbConnect(); // 确保数据库连接成功

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.use(updateCustomerInfo);

  io.on("connection", async (socket) => {
    const userId = (socket as any).userId;
    onlineUsers.set(userId, socket.id);
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });
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

    // 向特定用户发送消息
    socket.on("sendMessageToUser", (data, callback) => {
      const { toUserId, message } = data;
      const toSocketId = onlineUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit("receiveMessage", { from: userId, message });
        callback({ status: "ok" });
      } else {
        callback({ status: "error", message: "User is not online" });
      }
    });

    // 向所有用户发送消息
    socket.on("sendMessageToAll", (message, callback) => {
      io.emit("receiveMessage", { from: "客服", message });
      callback({ status: "ok" });
    });

    // 每隔一段时间广播在线用户列表
    setInterval(() => {
      const users = Array.from(onlineUsers.keys()).map(userId => ({
        id: userId,
        // 假设用户名和 userId 相同，实际情况下应查询用户信息
        name: userId
      }));
      io.emit("onlineUsers", users);
    }, 5000);
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