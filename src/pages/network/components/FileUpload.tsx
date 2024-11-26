import React, { useState } from 'react';
import { Card, Upload, Button, Space, message, Alert, Tabs, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { AxiosRequest, FetchRequest } from '@/utils/request';

const { TabPane } = Tabs;

interface FileUploadProps {
  axiosRequest: AxiosRequest;
  fetchRequest: FetchRequest;
}

const FileUpload: React.FC<FileUploadProps> = ({ axiosRequest, fetchRequest }) => {
  const [loading, setLoading] = useState(false);
  const [axiosProgress, setAxiosProgress] = useState(0);
  const [fetchProgress, setFetchProgress] = useState(0);

  const handleUpload = async (file: File, type: 'axios' | 'fetch') => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      if (type === 'axios') {
        setAxiosProgress(0);
        await axiosRequest.upload('/api/upload', formData, {
          onUploadProgress: (progress: number) => {
            const percent = Math.round(progress * 100);
            setAxiosProgress(percent);
            if (progress === 0) {
              message.loading({ content: 'Axios: 准备上传...', key: 'axiosUpload' });
            } else {
              message.loading({ 
                content: `Axios: 上传进度 ${percent}%`, 
                key: 'axiosUpload' 
              });
            }
          }
        });
        message.success({ content: 'Axios: 上传成功', key: 'axiosUpload' });
      } else {
        setFetchProgress(0);
        await fetchRequest.upload('/api/upload', formData, {
          onUploadProgress: (progress: number) => {
            const percent = Math.round(progress * 100);
            setFetchProgress(percent);
            if (progress === 0) {
              message.loading({ content: 'Fetch: 准备上传...', key: 'fetchUpload' });
            } else {
              message.loading({ 
                content: `Fetch: 上传进度 ${percent}%`, 
                key: 'fetchUpload' 
              });
            }
          }
        });
        message.success({ content: 'Fetch: 上传成功', key: 'fetchUpload' });
      }
    } catch (error) {
      const key = type === 'axios' ? 'axiosUpload' : 'fetchUpload';
      message.error({ content: `${type}: 上传失败 - ${error}`, key });
      if (type === 'axios') {
        setAxiosProgress(0);
      } else {
        setFetchProgress(0);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="文件上传测试" className="shadow-md">
      <Space direction="vertical" className="w-full">
        <Tabs defaultActiveKey="axios">
          <TabPane tab="Axios上传" key="axios">
            <Space direction="vertical" className="w-full">
              <Upload
                customRequest={({ file }) => handleUpload(file as File, 'axios')}
                showUploadList={false}
              >
                <Button 
                  icon={<UploadOutlined />}
                  loading={loading && axiosProgress > 0 && axiosProgress < 100}
                  disabled={loading && fetchProgress > 0}
                >
                  选择文件
                </Button>
              </Upload>
              {axiosProgress > 0 && (
                <Progress
                  percent={axiosProgress}
                  status={axiosProgress === 100 ? 'success' : 'active'}
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                />
              )}
            </Space>
          </TabPane>
          <TabPane tab="Fetch上传" key="fetch">
            <Space direction="vertical" className="w-full">
              <Upload
                customRequest={({ file }) => handleUpload(file as File, 'fetch')}
                showUploadList={false}
              >
                <Button 
                  icon={<UploadOutlined />}
                  loading={loading && fetchProgress > 0 && fetchProgress < 100}
                  disabled={loading && axiosProgress > 0}
                >
                  选择文件
                </Button>
              </Upload>
              {fetchProgress > 0 && (
                <Progress
                  percent={fetchProgress}
                  status={fetchProgress === 100 ? 'success' : 'active'}
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                />
              )}
            </Space>
          </TabPane>
        </Tabs>
        <Alert
          message="上传方式对比"
          description={
            <ul>
              <li>Axios: 使用 XMLHttpRequest，支持上传进度监控</li>
              <li>Fetch: 使用 ReadableStream，支持流式上传</li>
              <li>两种方式都支持文件类型检查</li>
              <li>两种方式都支持取消上传</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

export default FileUpload; 