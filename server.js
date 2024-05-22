import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
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

app.prepare().then(() => {
  const httpServer = createServer(handler);

  console.log('appp', app);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    const ipAddress = getClientIpAddress(socket);
    console.log('ip地址：', ipAddress, socket.handshake);
    socket.on("chatMessage", (message, callback) => {
      console.log('服务器收到消息:', message);
      callback({
        status: 'ok'
      })
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