import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import User from '@/models/user';
import { getClientIpAddress } from '@/server/utils.js'

export const updateCustomerInfo = async (socket: Socket, next: () => void) => {
  let userId = socket.handshake.auth.userId;
  const ipAddress = getClientIpAddress(socket);
  const userAgent = socket.handshake.headers["user-agent"] || "unknown";

  // 调用新浪 IP API 服务
  let location = 'Unknown';
  try {
    const response = await fetch(`https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ipAddress}`);
    const data = await response.json();
    if (data && data.ret === 1) {
      const { country, province, city } = data;
      location = `${country} ${province} ${city}`;
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }

  if (userId) {
    // 如果存在 sessionID，更新用户的 IP 地址、User-Agent 信息和位置信息
    await User.findOneAndUpdate({ userId: userId }, { ipAddress, userAgent, ipLocation: location });
  } else {
    // 如果不存在 sessionID，创建新用户
    userId = uuidv4();
    const user = new User({
      userId: userId,
      ipAddress,
      userAgent,
      ipLocation: location,
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
}
