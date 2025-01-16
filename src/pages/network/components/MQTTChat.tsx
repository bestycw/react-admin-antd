import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Form, Space, List, Tag, message, Select } from 'antd';
import { createMQTT } from '@/utils/request';
import type { MQTTRequest } from '@/utils/request';

interface MQTTConfig {
  protocol: 'ws' | 'wss' | 'mqtt' | 'mqtts';
  host: string;
  port: number;
  clientId: string;
  path?: string;
  username?: string;
  password?: string;
}

const MQTTChat: React.FC = () => {
  const [form] = Form.useForm();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{topic: string; message: string; time: string}>>([]);
  const clientRef = useRef<MQTTRequest | null>(null);

  const handleConnect = async (values: MQTTConfig) => {
    try {
      const { protocol, host, port, path, ...rest } = values;
      const url = `${protocol}://${host}:${port}${path || ''}`;
      
      clientRef.current = createMQTT({
        url,
        ...rest,
        onMessage: (topic, payload) => {
          setMessages(prev => [...prev, {
            topic,
            message: payload.toString(),
            time: new Date().toLocaleTimeString()
          }]);
        }
      });

      await clientRef.current.connect();
      setConnected(true);
      message.success('MQTT 连接成功');
    } catch (error) {
      message.error('MQTT 连接失败');
      console.error(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await clientRef.current?.disconnect();
      setConnected(false);
      message.success('MQTT 已断开连接');
    } catch (error) {
      message.error('断开连接失败');
      console.error(error);
    }
  };

  const handleSubscribe = async (values: { topic: string }) => {
    try {
      await clientRef.current?.subscribe(values.topic);
      message.success(`已订阅主题: ${values.topic}`);
    } catch (error) {
      message.error('订阅失败');
      console.error(error);
    }
  };

  const handlePublish = async (values: { topic: string; message: string }) => {
    try {
      await clientRef.current?.publish(values.topic, values.message);
      message.success('消息发送成功');
    } catch (error) {
      message.error('发送失败');
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  return (
    <Card title="MQTT 通信" className="w-full">
      <Space direction="vertical" className="w-full" size="large">
        {/* 连接配置表单 */}
        <Form
          form={form}
          onFinish={handleConnect}
          className="w-full"
          initialValues={{
            protocol: 'ws',
            host: 'broker.emqx.io',
            port: 8083,
            clientId: `client_${Math.random().toString(16).slice(2, 8)}`
          }}
        >
          {/* 连接信息配置区域 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* 连接地址配置 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Form.Item name="protocol" label="协议" className="mb-0" rules={[{ required: true }]}>
                <Select style={{ width: 90 }} disabled={connected}>
                  <Select.Option value="ws">ws</Select.Option>
                  <Select.Option value="wss">wss</Select.Option>
                  <Select.Option value="mqtt">mqtt</Select.Option>
                  <Select.Option value="mqtts">mqtts</Select.Option>
                </Select>
              </Form.Item>
              <span className="text-gray-500">://</span>
              <Form.Item name="host" label="主机" className="mb-0" rules={[{ required: true }]}>
                <Input style={{ width: 180 }} disabled={connected} />
              </Form.Item>
              <span className="text-gray-500">:</span>
              <Form.Item name="port" label="端口" className="mb-0" rules={[{ required: true }]}>
                <Input type="number" style={{ width: 80 }} disabled={connected} />
              </Form.Item>
              <Form.Item name="path" label="路径" className="mb-0">
                <Input style={{ width: 100 }} disabled={connected} placeholder="/mqtt" />
              </Form.Item>
            </div>

            {/* 认证信息配置 */}
            <div className="flex flex-wrap items-center gap-4">
              <Form.Item name="clientId" label="客户端ID" className="mb-0" rules={[{ required: true }]}>
                <Input style={{ width: 160 }} disabled={connected} />
              </Form.Item>
              <Form.Item name="username" label="用户名" className="mb-0">
                <Input style={{ width: 120 }} disabled={connected} />
              </Form.Item>
              <Form.Item name="password" label="密码" className="mb-0">
                <Input.Password style={{ width: 120 }} disabled={connected} />
              </Form.Item>
              <Form.Item className="mb-0 ml-auto">
                <Space>
                  <Button type="primary" htmlType="submit" disabled={connected}>
                    连接
                  </Button>
                  <Button danger onClick={handleDisconnect} disabled={!connected}>
                    断开
                  </Button>
                </Space>
              </Form.Item>
            </div>
          </div>
        </Form>

        {connected && (
          <div className="flex flex-col gap-4">
            {/* 订阅表单 */}
            <Form layout="inline" onFinish={handleSubscribe} className="bg-blue-50 p-3 rounded-lg">
              <Form.Item name="topic" label="主题" rules={[{ required: true }]} className="flex-1">
                <Input placeholder="输入要订阅的主题" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  订阅
                </Button>
              </Form.Item>
            </Form>

            {/* 发布表单 */}
            <Form layout="inline" onFinish={handlePublish} className="bg-green-50 p-3 rounded-lg">
              <div className="flex w-full gap-4">
                <Form.Item name="topic" label="主题" rules={[{ required: true }]} className="flex-1">
                  <Input placeholder="输入发布主题" />
                </Form.Item>
                <Form.Item name="message" label="消息" rules={[{ required: true }]} className="flex-1">
                  <Input.TextArea rows={1} placeholder="输入要发送的消息" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    发送
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        )}

        {/* 消息列表 */}
        <Card className="w-full" size="small" title="消息记录" styles={{ body: { padding: 0 } }}>
          <List
            className="h-80 overflow-auto"
            dataSource={messages}
            renderItem={item => (
              <List.Item className="px-4 hover:bg-gray-50">
                <Space>
                  <Tag color="blue">{item.time}</Tag>
                  <Tag color="green">{item.topic}</Tag>
                  <span>{item.message}</span>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </Card>
  );
};

export default MQTTChat; 