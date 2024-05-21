'use client';
import { useEffect, useState } from 'react';
import { socket } from './socket';
import Records from './records';
import ChatTools from './chatTools';
import InputArea from './inputArea';

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const handleMessageChange = (newMessage: string) => {
    // setMessage(newMessage);
  };

  const handleSendMessage = (sentMessage: string) => {
    console.log('Sent message:', sentMessage);
    // 处理发送的消息，例如通过 WebSocket 发送到服务器
  };

  const handleImagePaste = (imageBase64: string) => {
    // setImage(imageBase64);
    console.log('Pasted image:', imageBase64);
    // 处理粘贴的图片，例如显示预览或上传到服务器
  };

  const handleFileUpload = (file: File) => {
    console.log('Uploaded file:', file);
    // 处理上传的文件，例如显示预览或上传到服务器
  };

  useEffect(() => {
    function handleConnect() {
      console.log('socket已连接');
      // setIsConnected(true);
    }

    function onDisconnect() {
      console.log('socket已断开');
      // setIsConnected(false);
    }

    function handleMessage(message: string) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', handleMessage);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('message', handleMessage);
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
