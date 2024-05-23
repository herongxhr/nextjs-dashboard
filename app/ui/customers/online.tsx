"use client"
import Search from '@/app/ui/search';
import { useEffect, useState } from 'react';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { Tabs } from 'antd';
import InputArea from '@/app/ui/inputArea'
import InfoForm from '@/app/ui/customers/info'
import socket from '@/app/lib/socket'

export default function CustomersOnline({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState('');
  const handleSendMessage = () => {

  }

  const handleSendMessageToUser = (userId) => {
    socket.emit("sendMessageToUser", { toUserId: userId, message }, (response) => {
      if (response.status === "ok") {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message:", response.message);
      }
    });
  };

  const handleSendMessageToAll = () => {
    socket.emit("sendMessageToAll", message, (response) => {
      if (response.status === "ok") {
        console.log("Message sent to all users successfully");
      } else {
        console.error("Failed to send message to all users");
      }
    });
  };


  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on('receiveMessage', (data) => {
      console.log('Message received:', data);
    });

    return () => {
      socket.disconnect();
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="w-full">
      <Search placeholder="Search customers..." />
      <Tabs
        defaultActiveKey="1"
        tabPosition={'left'}
        style={{ height: 220 }}
        items={customers?.map(({ userId, name }, index) => {
          return {
            label: name,
            key: `${index}`,
            children: <div>
              <InfoForm />
              <InputArea onSend={() => handleSendMessageToUser(userId)} />
            </div>,
          };
        })}
      />
    </div>
  );
}
