import React from 'react';
import { Card, Button, Space, message } from 'antd';
import request, { axiosRequest, fetchRequest } from '@/utils/request';
import { CloudUploadOutlined, CloudDownloadOutlined, ApiOutlined } from '@ant-design/icons';

interface ProgressEvent {
  loaded: number;
  total?: number;
}

const NetworkBasic: React.FC = () => {
  // 测试 GET 请求
  const handleGet = async (type: 'default' | 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : type === 'fetch' ? fetchRequest : request;
      console.log(`Testing ${type} GET request`);
      console.log('API instance:', api);
      const response = await api.get('/api/test');
      console.log(`${type} GET response:`, response);
      message.success(`GET 请求成功: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error(`${type} GET error:`, error);
      message.error(`GET 请求失败: ${error}`);
    }
  };

  // 测试 POST 请求
  const handlePost = async (type: 'default' | 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : type === 'fetch' ? fetchRequest : request;
      const data = {
        name: 'test',
        time: new Date().toISOString()
      };
      const response = await api.post('/api/test', data);
      message.success(`POST 请求成功: ${JSON.stringify(response)}`);
    } catch (error) {
      message.error(`POST 请求失败: ${error}`);
    }
  };

  // 测试文件上传
  const handleUpload = async (type: 'default' | 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : type === 'fetch' ? fetchRequest : request;
      const formData = new FormData();
      const blob = new Blob(['test file content'], { type: 'text/plain' });
      formData.append('file', blob, 'test.txt');
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progress: number) => {
          message.info(`上传进度: ${progress * 100}%`);
        }
      });
      
      message.success(`上传成功: ${JSON.stringify(response)}`);
    } catch (error) {
      message.error(`上传失败: ${error}`);
    }
  };

  // 测试文件下载
  const handleDownload = async (type: 'default' | 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : type === 'fetch' ? fetchRequest : request;
      await api.download('/api/download', 'test.txt', {
        onDownloadProgress: (progress: number) => {
          message.info(`下载进度: ${progress * 100}%`);
        }
      });
      message.success('下载成功');
    } catch (error) {
      message.error(`下载失败: ${error}`);
    }
  };

  // 测试请求重试
  const handleRetry = async (type: 'default' | 'axios' | 'fetch') => {
    try {
      const api = type === 'axios' ? axiosRequest : type === 'fetch' ? fetchRequest : request;
      const response = await api.get('/api/test-retry', {
        retry: 3,
        retryDelay: 1000
      });
      message.success(`重试请求成功: ${JSON.stringify(response)}`);
    } catch (error) {
      message.error(`重试请求失败: ${error}`);
    }
  };

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" className="w-full">
        {/* GET 请求测试 */}
        <Card title="GET 请求测试" className="shadow-md">
          <Space>
            <Button onClick={() => handleGet('default')}>默认 GET</Button>
            <Button onClick={() => handleGet('axios')} type="primary">Axios GET</Button>
            <Button onClick={() => handleGet('fetch')} type="primary" ghost>Fetch GET</Button>
          </Space>
        </Card>

        {/* POST 请求测试 */}
        <Card title="POST 请求测试" className="shadow-md">
          <Space>
            <Button onClick={() => handlePost('default')}>默认 POST</Button>
            <Button onClick={() => handlePost('axios')} type="primary">Axios POST</Button>
            <Button onClick={() => handlePost('fetch')} type="primary" ghost>Fetch POST</Button>
          </Space>
        </Card>

        {/* 文件上传测试 */}
        <Card title="文件上传测试" className="shadow-md">
          <Space>
            <Button 
              icon={<CloudUploadOutlined />} 
              onClick={() => handleUpload('default')}
            >
              默认上传
            </Button>
            <Button 
              icon={<CloudUploadOutlined />} 
              onClick={() => handleUpload('axios')} 
              type="primary"
            >
              Axios 上传
            </Button>
            <Button 
              icon={<CloudUploadOutlined />} 
              onClick={() => handleUpload('fetch')} 
              type="primary" 
              ghost
            >
              Fetch 上传
            </Button>
          </Space>
        </Card>

        {/* 文件下载测试 */}
        <Card title="文件下载测试" className="shadow-md">
          <Space>
            <Button 
              icon={<CloudDownloadOutlined />} 
              onClick={() => handleDownload('default')}
            >
              默认下载
            </Button>
            <Button 
              icon={<CloudDownloadOutlined />} 
              onClick={() => handleDownload('axios')} 
              type="primary"
            >
              Axios 下载
            </Button>
            <Button 
              icon={<CloudDownloadOutlined />} 
              onClick={() => handleDownload('fetch')} 
              type="primary" 
              ghost
            >
              Fetch 下载
            </Button>
          </Space>
        </Card>

        {/* 请求重试测试 */}
        <Card title="请求重试测试" className="shadow-md">
          <Space>
            <Button 
              icon={<ApiOutlined />} 
              onClick={() => handleRetry('default')}
            >
              默认重试
            </Button>
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

export const routeConfig = {
  title: '基础请求',
  icon: <ApiOutlined />,
  layout: true,
  auth: true,
};
