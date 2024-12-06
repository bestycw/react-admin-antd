import React, { useState } from 'react';
import { Card, Button, List, Tag, Space, message, InputNumber } from 'antd';
import request from '@/utils/request';

interface RequestResult {
  id: number;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  time?: number;
}

interface ConcurrentRequestsProps {
  title?: string;
  defaultLimit?: number;
  maxRequests?: number;
}

const ConcurrentRequests: React.FC<ConcurrentRequestsProps> = ({
  title = "并发请求测试",
  defaultLimit = 3,
  maxRequests = 10
}) => {
  const [results, setResults] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [concurrentLimit, setConcurrentLimit] = useState(defaultLimit);

  // 模拟一个异步请求
  const mockRequest = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      const delay = Math.random() * 2000 + 1000; // 1-3秒随机延迟
      setTimeout(() => {
        if (Math.random() > 0.3) { // 70%成功率
          resolve({ id, data: `Success data for request ${id}`, time: delay });
        } else {
          reject(new Error(`Request ${id} failed`));
        }
      }, delay);
    });
  };

  // 执行并发请求
  const handleConcurrentRequests = async () => {
    setLoading(true);
    setResults([]);

    const requests = Array.from({ length: maxRequests }, (_, i) => ({
      id: i + 1,
      status: 'pending' as const
    }));
    setResults(requests);

    try {
      const promises = requests.map(req => mockRequest(req.id));
      const startTime = Date.now();

      // 使用限制并发数的请求方法
      const responses = await request.allLimit(promises, concurrentLimit);

      responses.forEach((response, index) => {
        setResults(prev => prev.map(item => 
          item.id === index + 1 
            ? { 
                ...item, 
                status: 'success', 
                data: response.data,
                time: response.time 
              }
            : item
        ));
      });

      const totalTime = Date.now() - startTime;
      message.success(`所有请求完成，总耗时: ${totalTime}ms`);
    } catch (error) {
      message.error('部分请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={title}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <span>并发限制:</span>
          <InputNumber 
            min={1} 
            max={maxRequests} 
            value={concurrentLimit}
            onChange={value => setConcurrentLimit(value || 1)}
          />
          <Button 
            type="primary" 
            onClick={handleConcurrentRequests}
            loading={loading}
          >
            开始并发请求
          </Button>
        </Space>

        <List
          bordered
          dataSource={results}
          renderItem={item => (
            <List.Item>
              <Space>
                <span>请求 {item.id}</span>
                <Tag color={
                  item.status === 'pending' ? 'processing' :
                  item.status === 'success' ? 'success' : 'error'
                }>
                  {item.status === 'pending' ? '进行中' :
                   item.status === 'success' ? '成功' : '失败'}
                </Tag>
                {item.time && <span>{Math.round(item.time)}ms</span>}
                {item.data && <span>{item.data}</span>}
                {item.error && <span style={{ color: 'red' }}>{item.error}</span>}
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
};

export default ConcurrentRequests; 