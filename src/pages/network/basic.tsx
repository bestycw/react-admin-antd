import React, { useState } from 'react';
import { Card, Button, Space, message, Alert, Tabs, Row, Col, Typography, Upload, Progress, Divider } from 'antd';
import { 
  ApiOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SendOutlined,
  DownloadOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  FileOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { AxiosRequest, FetchRequest, axiosInstance, fetchInstance } from '@/utils/request';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import { RouteConfig } from '@/types/route';
import axios from 'axios';

const { TabPane } = Tabs;
const { Text } = Typography;

interface RequestCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  axiosHandler: () => void;
  fetchHandler: () => void;
  type?: 'default' | 'danger';
}

const RequestCard: React.FC<RequestCardProps> = ({
  title,
  icon,
  description,
  axiosHandler,
  fetchHandler,
  type = 'default'
}) => (
  <Card 
    className="shadow-sm hover:shadow-md transition-shadow duration-300"
    size="small"
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space>
          {icon}
          <Text strong>{title}</Text>
        </Space>
        <div className="mt-2 text-gray-500 text-sm">{description}</div>
      </Col>
      <Col span={24}>
        <Space className="w-full justify-end">
          <Button
            type={type === 'danger' ? 'primary' : 'default'}
            danger={type === 'danger'}
            onClick={axiosHandler}
            icon={<SendOutlined />}
          >
            Axios
          </Button>
          <Button
            type={type === 'danger' ? 'default' : 'primary'}
            ghost
            danger={type === 'danger'}
            onClick={fetchHandler}
            icon={<SendOutlined />}
          >
            Fetch
          </Button>
        </Space>
      </Col>
    </Row>
  </Card>
);

const NetworkBasic: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // 创建实例
  const axiosRequest = new AxiosRequest();
  const fetchRequest = new FetchRequest();

  // 测试 GET 请求
  const handleGet = async (type: 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : fetchRequest;
      const response = await api.get('/api/test');
      message.success({
        content: `GET 请求成功: ${JSON.stringify(response)}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      message.error(`GET 请求失败: ${error}`);
    }
  };

  // 测试 POST 请求
  const handlePost = async (type: 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : fetchRequest;
      const data = {
        name: 'test',
        time: new Date().toISOString()
      };
      const response = await api.post('/api/test', data);
      message.success({
        content: `POST 请求成功: ${JSON.stringify(response)}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      message.error(`POST 请求失败: ${error}`);
    }
  };

  // 测试 PUT 请求
  const handlePut = async (type: 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : fetchRequest;
      const data = {
        id: 1,
        name: 'updated test',
        time: new Date().toISOString()
      };
      const response = await api.put('/api/test/1', data);
      message.success({
        content: `PUT 请求成功: ${JSON.stringify(response)}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      message.error(`PUT 请求失败: ${error}`);
    }
  };

  // 测试 DELETE 请求
  const handleDelete = async (type: 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : fetchRequest;
      const response = await api.delete('/api/test/1');
      message.success({
        content: `DELETE 请求成功: ${JSON.stringify(response)}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      message.error(`DELETE 请求失败: ${error}`);
    }
  };

  // 测试请求重试
  const handleRetry = async (type: 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : fetchRequest;
      const response = await api.get('/api/test-retry', {
        retry: 3,
        retryDelay: 1000
      });
      message.success({
        content: `重试请求成功: ${JSON.stringify(response)}`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      message.error(`重试请求失败: ${error}`);
    }
  };

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" className="w-full">
        {/* 基础请求测试 */}
        <Card 
          title={
            <Space>
              <ApiOutlined />
              <span>基础请求测试</span>
            </Space>
          }
          className="shadow-md"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={6}>
              <RequestCard
                title="GET 请求"
                icon={<DownloadOutlined className="text-blue-500" />}
                description="获取资源，幂等操作"
                axiosHandler={() => handleGet('axios')}
                fetchHandler={() => handleGet('fetch')}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={6}>
              <RequestCard
                title="POST 请求"
                icon={<SendOutlined className="text-green-500" />}
                description="创建资源，非幂等操作"
                axiosHandler={() => handlePost('axios')}
                fetchHandler={() => handlePost('fetch')}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={6}>
              <RequestCard
                title="PUT 请求"
                icon={<EditOutlined className="text-orange-500" />}
                description="更新资源，幂等操作"
                axiosHandler={() => handlePut('axios')}
                fetchHandler={() => handlePut('fetch')}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={6}>
              <RequestCard
                title="DELETE 请求"
                icon={<DeleteOutlined className="text-red-500" />}
                description="删除资源，幂等操作"
                axiosHandler={() => handleDelete('axios')}
                fetchHandler={() => handleDelete('fetch')}
                type="danger"
              />
            </Col>
          </Row>

          <div className="mt-4">
            <Alert
              message="RESTful API 说明"
              description={
                <ul className="list-disc list-inside">
                  <li>幂等性：多次请求产生的效果与一次请求相同</li>
                  <li>GET：安全且幂等，用于查询操作</li>
                  <li>POST：非安全非幂等，用于创建操作</li>
                  <li>PUT：非安全但幂等，用于更新操作</li>
                  <li>DELETE：非安全但幂等，用于删除操作</li>
                </ul>
              }
              type="info"
              showIcon
            />
          </div>
        </Card>

        {/* 文件上传组件 */}
        <FileUpload axiosRequest={axiosRequest} fetchRequest={fetchRequest} />

        {/* 文件下载组件 */}
        <FileDownload axiosRequest={axiosRequest} fetchRequest={fetchRequest} />

        {/* 重试请求测试 */}
        <Card 
          title={
            <Space>
              <SyncOutlined />
              <span>重试请求测试</span>
            </Space>
          } 
          className="shadow-md"
        >
          <Space>
            <Button 
              icon={<ApiOutlined />}
              onClick={() => handleRetry('axios')}
              type="primary"
            >
              Axios 重试
            </Button>
            <Button 
              icon={<ApiOutlined />}
              onClick={() => handleRetry('fetch')}
              type="primary"
              ghost
            >
              Fetch 重试
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default NetworkBasic;

export const routeConfig: RouteConfig = {
  title: '基础网络',
  icon: <ApiOutlined />,
  layout: true,
  auth: true,
};