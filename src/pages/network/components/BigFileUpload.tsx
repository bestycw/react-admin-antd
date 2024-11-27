import React, { useRef, useState } from 'react';
import { Upload, Button, Progress, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { fetchRequest } from '@/utils/request';

interface UploadResponse {
  code: number;
  data: {
    uploaded: boolean;
    message?: string;
  };
}

const BigFileUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const workerRef = useRef<Worker | null>(null);

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // 创建 Web Worker
      workerRef.current = new Worker(new URL('@/utils/workers/chunk.worker.ts', import.meta.url));

      // 监听 Worker 消息
      workerRef.current.onmessage = async (e) => {
        const { type, data } = e.data;
        console.log('Worker message:', e.data);
        if (type === 'progress') {
          setProgress(data.percent);
        } else if (type === 'complete') {
          const { chunks, fileHash, fileName, totalSize } = data;

          // 检查文件是否已上传（秒传）
          const checkResult = await fetchRequest.post<UploadResponse>('/api/upload/check', {
            fileHash,
            fileName,
            fileSize: totalSize
          });

          if (checkResult.data?.uploaded) {
            message.success('文件秒传成功！');
            setUploading(false);
            return;
          }

          // 上传所有分片
          const uploadPromises = chunks.map((chunk: Blob, index: number) => {
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('hash', `${fileHash}-${index}`);
            formData.append('fileHash', fileHash);
            formData.append('fileName', fileName);
            formData.append('chunkIndex', String(index));
            formData.append('totalChunks', String(chunks.length));

            return fetchRequest.post('/api/upload/chunk', formData);
          });

          // 并发上传分片
          await Promise.all(uploadPromises);

          // 合并分片
          await fetchRequest.post('/api/upload/merge', {
            fileHash,
            fileName,
            size: totalSize
          });

          message.success('上传成功！');
        }
      };

      // 发送文件到 Worker 进行处理
      workerRef.current.postMessage({
        file,
        chunkSize: CHUNK_SIZE
      });

    } catch (error) {
      console.error('Upload error:', error);
      message.error('上传失败，请重试');
    } finally {
      setUploading(false);
      workerRef.current?.terminate();
      workerRef.current = null;
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
        // console.log('beforeUpload:', file);
      handleUpload(file);
      return false;
    },
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
  };

  return (
    <Card title="大文件上传" className="shadow-md">
      <div className="p-4">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            选择文件
          </Button>
        </Upload>
        {uploading && (
          <Progress
            percent={progress}
            status="active"
            className="mt-4"
          />
        )}
      </div>
    </Card>
  );
};

export default BigFileUpload; 