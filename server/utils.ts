import { Socket } from "socket.io";

export const getClientIpAddress = (socket: Socket) => {
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
    const ipAddress = (xForwardedForHeader as string).split(",")[0].trim();
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