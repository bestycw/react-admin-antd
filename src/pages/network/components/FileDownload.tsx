import React, { useState } from 'react';
import { Card, Button, Space, message, Alert, Tabs, Progress } from 'antd';
import { 
  FileTextOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FilePdfOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { AxiosRequest, FetchRequest } from '@/utils/request';

// 文件类型配置
const fileTypes = [
  { label: '文本文件', value: 'txt', icon: 'FileTextOutlined' },
  { label: 'Word文档', value: 'word', icon: 'FileWordOutlined' },
  { label: 'Excel表格', value: 'excel', icon: 'FileExcelOutlined' },
  { label: 'PPT演示', value: 'ppt', icon: 'FilePptOutlined' },
  { label: 'PDF文档', value: 'pdf', icon: 'FilePdfOutlined' },
  { label: '视频文件', value: 'video', icon: 'VideoCameraOutlined' },
];

const Icons: Record<string, any> = {
  FileTextOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FilePdfOutlined,
  VideoCameraOutlined
};

interface FileDownloadProps {
  axiosRequest: AxiosRequest;
  fetchRequest: FetchRequest;
}

const FileDownload: React.FC<FileDownloadProps> = ({ axiosRequest, fetchRequest }) => {
  const [loading, setLoading] = useState(false);
  const [axiosProgress, setAxiosProgress] = useState(0);
  const [fetchProgress, setFetchProgress] = useState(0);

  const handleDownload = async (type: 'axios' | 'fetch', fileType: string) => {
    try {
      setLoading(true);
      let lastProgress = 0;

      if (type === 'axios') {
        setAxiosProgress(0);
        await axiosRequest.download(`/api/download/${fileType}`, `sample.${fileType}`, {
          onDownloadProgress: (progress: number) => {
            const percent = Math.round(progress * 100);
            setAxiosProgress(percent);
            console.log(percent)
            if (progress === 0) {
              message.loading({ content: 'Axios: 准备下载...', key: 'axiosDownload' });
            } else if (percent > lastProgress) {
              lastProgress = percent;
              message.loading({ 
                content: `Axios: 下载进度 ${percent}%`, 
                key: 'axiosDownload' 
              });
            }
          }
        });
        message.success({ content: 'Axios: 下载成功', key: 'axiosDownload' });
      } else {
        setFetchProgress(0);
        await fetchRequest.download(`/api/download/${fileType}`, `sample.${fileType}`, {
          onDownloadProgress: (progress: number) => {
            const percent = Math.round(progress * 100);
            setFetchProgress(percent);
            if (progress === 0) {
              message.loading({ content: 'Fetch: 准备下载...', key: 'fetchDownload' });
            } else if (percent > lastProgress) {
              lastProgress = percent;
              message.loading({ 
                content: `Fetch: 下载进度 ${percent}%`, 
                key: 'fetchDownload' 
              });
            }
          }
        });
        message.success({ content: 'Fetch: 下载成功', key: 'fetchDownload' });
      }
    } catch (error) {
      const key = type === 'axios' ? 'axiosDownload' : 'fetchDownload';
      message.error({ content: `${type}: 下载失败 - ${error}`, key });
      if (type === 'axios') {
        setAxiosProgress(0);
      } else {
        setFetchProgress(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'axios',
      label: 'Axios下载',
      children: (
        <Space direction="vertical" className="w-full">
          <Space wrap>
            {fileTypes.map(fileType => (
              <Button
                key={fileType.value}
                icon={React.createElement(Icons[fileType.icon])}
                onClick={() => handleDownload('axios', fileType.value)}
                loading={loading && axiosProgress > 0 && axiosProgress < 100}
                disabled={loading && fetchProgress > 0}
              >
                下载{fileType.label}
              </Button>
            ))}
          </Space>
          {axiosProgress > 0 && (
            <div style={{ width: '100%' }}>
              <Progress
                percent={axiosProgress}
                status={axiosProgress === 100 ? 'success' : 'active'}
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
              />
            </div>
          )}
        </Space>
      )
    },
    {
      key: 'fetch',
      label: 'Fetch下载',
      children: (
        <Space direction="vertical" className="w-full">
          <Space wrap>
            {fileTypes.map(fileType => (
              <Button
                key={fileType.value}
                icon={React.createElement(Icons[fileType.icon])}
                onClick={() => handleDownload('fetch', fileType.value)}
                loading={loading && fetchProgress > 0 && fetchProgress < 100}
                disabled={loading && axiosProgress > 0}
              >
                下载{fileType.label}
              </Button>
            ))}
          </Space>
          {fetchProgress > 0 && (
            <div style={{ width: '100%' }}>
              <Progress
                percent={fetchProgress}
                status={fetchProgress === 100 ? 'success' : 'active'}
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
              />
            </div>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card title="文件下载测试" className="shadow-md">
      <Space direction="vertical" className="w-full">
        <Tabs defaultActiveKey="axios" items={tabItems} />
        <Alert
          message="下载方式对比"
          description={
            <ul>
              <li>Axios: 使用 XMLHttpRequest，原生支持下载进度</li>
              <li>Fetch: 使用 ReadableStream，通过流式处理实现进度</li>
              <li>两种方式都支持断点续传和取消下载</li>
              <li>两种方式都支持自定义文件名和类型</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

export default FileDownload; 