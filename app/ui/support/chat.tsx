'use client';
import { useEffect, useRef, useState } from 'react';
import  socket  from './socket';
import Records from './records';
import ChatTools from './chatTools';
import InputArea from './inputArea';

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<
    Array<{ type: 'text' | 'image'; content: string }>
  >([]);

  const handleSendMessage = (
    content: Array<{ type: 'text' | 'image'; content: string }>,
  ) => {
    console.log('Sent content:', content);
    // 处理发送的消息和图片，例如通过 WebSocket 发送到服务器
    socket.emit('chatMessage', content, (error: Error, response: any) => {
      if (error) {
        // the server did not acknowledge the event in the given delay
      } else {
        console.log(response.status); // 'ok'
        setMessages([...messages, ...content]);
      }
    });
  };

  const handleReceiveMessage = (message: string) => {
    setMessages([...messages, { type: 'text', content: message }]);
  };

  const handleFileUpload = (file: File) => {
    console.log('Uploaded file:', file);
    // 处理上传的文件，例如显示预览或上传到服务器
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      socket.auth = { userId };
      socket.connect();
    }

    function handleConnect() {
      console.log('socket已连接');
      // setIsConnected(true);
    }

    function onDisconnect() {
      console.log('socket已断开');
      // setIsConnected(false);
    }

    function saveSessionID(userId: string) {
      localStorage.setItem('userId', userId);
    }

    socket.on('userId', saveSessionID);
    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chatMessage', handleReceiveMessage);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('chatMessage', handleReceiveMessage);
    };
  }, []);
  return (
    <div className="h-300 fixed bottom-8 right-8 z-50 w-60">
      <h1>Chat</h1>
      <Records />
      {/* <ChatTools onFileUpload={handleFileUpload} /> */}
      <InputArea onSend={handleSendMessage} />
    </div>
  );
}
