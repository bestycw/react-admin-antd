import React, { useState } from 'react';
import { Card, Button, Space, message, Alert, InputNumber } from 'antd';
import { ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { AxiosRequest, FetchRequest } from '@/utils/request';

interface TimeoutResponse {
  message: string;
  time: string;
}

interface TimeoutTestProps {
  title?: string;
}

const TimeoutTest: React.FC<TimeoutTestProps> = ({ title = '超时取消测试' }) => {
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(5000);
  const abortController = React.useRef<AbortController | null>(null);

  const handleTest = async (type: 'axios' | 'fetch') => {
    try {
      setLoading(true);
      abortController.current = new AbortController();

      const config = {
        timeout: 3000, // 3秒超时
        signal: abortController.current.signal
      };

      if (type === 'axios') {
        const request = new AxiosRequest();
        const response = await request.get<TimeoutResponse>(`/api/test-timeout?delay=${delay}`, config);
        message.success(`Axios请求成功: ${response.message}`);
      } else {
        const request = new FetchRequest();
        const response = await request.get<TimeoutResponse>(`/api/test-timeout?delay=${delay}`, config);
        message.success(`Fetch请求成功: ${response.message}`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message.includes('timeout')) {
        message.warning('请求已取消');
      } else {
        message.error(`请求失败: ${err.message}`);
      }
    } finally {
      setLoading(false);
      abortController.current = null;
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      message.info('已发送取消请求信号');
    }
  };

  return (
    <Card title={title} className="shadow-md">
      <Space direction="vertical" size="large" className="w-full">
        <Alert
          message="这里演示了使用 Axios 和 Fetch 的超时和取消功能"
          description={
            <ul className="mt-2">
              <li>请求默认 3 秒超时</li>
              <li>可以手动取消请求</li>
              <li>可以设置服务器延迟时间来测试</li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Space direction="vertical" className="w-full">
          <Space>
            <span>服务器延迟时间(ms):</span>
            <InputNumber
              min={1000}
              max={10000}
              step={1000}
              value={delay}
              onChange={(value) => setDelay(value || 5000)}
            />
          </Space>

          <Space wrap>
            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => handleTest('axios')}
              loading={loading}
            >
              测试 Axios 超时
            </Button>

            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => handleTest('fetch')}
              loading={loading}
            >
              测试 Fetch 超时
            </Button>

            <Button
              danger
              icon={<StopOutlined />}
              onClick={handleCancel}
              disabled={!loading}
            >
              取消请求
            </Button>
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default TimeoutTest; 