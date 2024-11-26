import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Space, Input, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { createWebSocket, type WebSocketRequest } from '@/utils/request';

interface WebSocketChatProps {
  title?: string;
}

const WebSocketChat: React.FC<WebSocketChatProps> = ({ title = 'WebSocket 测试' }) => {
  const [wsMessage, setWsMessage] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocketRequest | null>(null);

  // WebSocket 连接
  useEffect(() => {
    const ws = createWebSocket({
      url: 'ws://localhost:3000/ws',
      onOpen: () => {
        setWsConnected(true);
      },
      onMessage: (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          message.info(`收到消息: ${data.message}`);
        } catch {
          message.info(`收到消息: ${event.data}`);
        }
      },
      onClose: () => {
        setWsConnected(false);
      },
      heartbeatInterval: 30000,
      heartbeatMessage: 'ping'
    });

    wsRef.current = ws;
    ws.connect();

    return () => {
      ws.close();
    };
  }, []);

  // 发送 WebSocket 消息
  const handleWsSend = () => {
    if (!wsRef.current?.isConnected()) {
      message.error('WebSocket 未连接');
      return;
    }

    if (!wsMessage.trim()) {
      message.warning('请输入要发送的消息');
      return;
    }

    wsRef.current.send({
      type: 'message',
      content: wsMessage
    });
    setWsMessage('');
  };

  return (
    <Card title={title} className="shadow-md">
      <Space direction="vertical" className="w-full">
        <div className="flex items-center gap-2">
          <Input.TextArea
            value={wsMessage}
            onChange={(e) => setWsMessage(e.target.value)}
            placeholder="输入要发送的消息"
            autoSize={{ minRows: 2, maxRows: 6 }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleWsSend}
            disabled={!wsConnected}
            className="h-auto"
          >
            发送
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-500">
            {wsConnected ? 'WebSocket 已连接' : 'WebSocket 未连接'}
          </span>
        </div>
      </Space>
    </Card>
  );
};

export default WebSocketChat; 