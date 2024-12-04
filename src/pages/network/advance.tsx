import React from 'react';
import { Space } from 'antd';
import WebSocketChat from './components/WebSocketChat';
import StreamChat from './components/StreamChat';
import BigFileUpload from './components/BigFileUpload';
// import P2PVideoChat from './components/P2PVideoChat';
import { ApiOutlined } from '@ant-design/icons';

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
  auth: true,
  sort: 2
}; 