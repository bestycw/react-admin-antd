import React from 'react';
import { Space } from 'antd';
import WebSocketChat from './components/WebSocketChat';
import StreamChat from './components/StreamChat';
import BigFileUpload from './components/BigFileUpload';
// import P2PVideoChat from './components/P2PVideoChat';
import { ApiOutlined } from '@ant-design/icons';
import ConcurrentRequests from './components/ConcurrentRequest';

const NetworkAdvance: React.FC = () => {
  return (
    <div >
      <Space direction="vertical" size="large" className="w-full">
        {/* <Card title="WebSocket 实时通信" className="w-full"> */}
          <WebSocketChat />
        {/* </Card> */}
        
        {/* <Card title="流式响应" className="w-full"> */}
          <StreamChat />
        {/* </Card> */}
        
        {/* <Card title="大文件分片上传" className="w-full"> */}
          <BigFileUpload />
        {/* </Card> */}
        <ConcurrentRequests 
        title="并发请求示例" 
        defaultLimit={3}
          maxRequests={10}
        />
{/*    
        <Card title="P2P 视频聊天 (WebRTC)" className="w-full">
          <P2PVideoChat />
        </Card> */}
      </Space>
    </div>
  );
};

export default NetworkAdvance;

export const routeConfig = {
  title: '高级网络',
  icon: <ApiOutlined />,
  layout: true,
  
  sort: 2
}; 