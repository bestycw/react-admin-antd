import React from 'react';
import { Space } from 'antd';
import WebSocketChat from './components/WebSocketChat';
import StreamChat from './components/StreamChat';
import { ApiOutlined } from '@ant-design/icons';

const NetworkAdvance: React.FC = () => {
  return (
    <div className="p-6">
      <Space direction="vertical" size="large" className="w-full">
        <WebSocketChat />
        <StreamChat />
      </Space>
    </div>
  );
};

export default NetworkAdvance; 

export const routeConfig = {
    title: '基础网络',
    icon: <ApiOutlined />,
    layout: true,
    auth: true,
};