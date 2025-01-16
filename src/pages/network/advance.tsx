import React from 'react';
import { Space } from 'antd';
import WebSocketChat from './components/WebSocketChat';
import StreamChat from './components/StreamChat';
import BigFileUpload from './components/BigFileUpload';
import MQTTChat from './components/MQTTChat';
import { ApiOutlined } from '@ant-design/icons';
import ConcurrentRequests from './components/ConcurrentRequest';

const NetworkAdvance: React.FC = () => {
  return (
    <div>
      <Space direction="vertical" size="large" className="w-full">
        <WebSocketChat />
        <MQTTChat />
        <StreamChat />
        <BigFileUpload />
        <ConcurrentRequests 
          title="并发请求示例" 
          defaultLimit={3}
          maxRequests={10}
        />
      </Space>
    </div>
  );
};

export default NetworkAdvance;

export const routeConfig = {
  title: 'route.network.advanced',
  icon: <ApiOutlined />,
  layout: true,
  sort: 2
}; 