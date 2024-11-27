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

interface FileList {
  fileList: UploadFile[];
}

const BigFileUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const workerRef = useRef<Worker | null>(null);

  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk

  const handleUpload = async (file: File) => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setUploading(true);
    setProgress(0);

    try {
      // 创建 Web Worker
      const worker = new Worker(
        new URL('@/workers/chunk.worker.ts', import.meta.url),
        { type: 'module' }
      );
      workerRef.current = worker;

      // 监听 Worker 消息
      worker.onmessage = async (e) => {
        const { type, data } = e.data;
        console.log('Worker message:', type, data);

        if (type === 'progress') {
          setProgress(data.percent);
        } else if (type === 'complete') {
          const { chunks, fileHash, fileName, totalSize } = data;
          console.log('Chunks:', chunks.length, 'Hash:', fileHash);

          try {
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
          } catch (error) {
            console.error('Upload process error:', error);
            message.error('上传过程中出错，请重试');
          }
        }
      };

      // 处理 Worker 错误
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        message.error('文件处理出错，请重试');
        setUploading(false);
      };

      // 发送文件到 Worker 进行处理
      console.log('Sending file to worker:', file.name, file.size);
      worker.postMessage({
        file,
        chunkSize: CHUNK_SIZE
      });

    } catch (error) {
      console.error('Upload error:', error);
      message.error('上传失败，请重试');
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      console.log('Starting upload for file:', file.name, file.size);
      handleUpload(file);
      return false;
    },
    fileList,
    onChange: ({ fileList }: FileList) => setFileList(fileList),
    multiple: false
  };

  return (
    <Card title="大文件上传" className="shadow-md">
      <div className="p-4">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
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