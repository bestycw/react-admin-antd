import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Space, message } from 'antd';
import { 
  SendOutlined, 
  StopOutlined, 
  LoadingOutlined, 
  RobotOutlined 
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface StreamChatProps {
  title?: string;
}

const StreamChat: React.FC<StreamChatProps> = ({ title = '流式响应测试' }) => {
  const [streamContent, setStreamContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 开始流式响应
  const handleStartStream = () => {
    setIsStreaming(true);
    setStreamContent('');

    // 关闭之前的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // 创建新的 EventSource 连接
      const eventSource = new EventSource('http://localhost:3000/api/stream/chat');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.done) {
            eventSource.close();
            setIsStreaming(false);
          } else {
            setStreamContent(prev => prev + data.text);
          }
        } catch (error) {
          console.error('Stream error:', error);
          message.error('数据解析错误');
          handleStopStream();
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        message.error('流式响应连接失败');
        handleStopStream();
      };
    } catch (error) {
      console.error('Connection error:', error);
      message.error('创建流式连接失败');
      setIsStreaming(false);
    }
  };

  // 停止流式响应
  const handleStopStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  };

  // 清理
  useEffect(() => {
    return () => {
      handleStopStream();
    };
  }, []);

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-blue-500" />
          <span>{title}</span>
        </div>
      } 
      className="shadow-md"
      extra={
        <Space>
          <Button
            type="primary"
            icon={isStreaming ? <LoadingOutlined /> : <SendOutlined />}
            onClick={handleStartStream}
            disabled={isStreaming}
          >
            开始流式响应
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={handleStopStream}
            disabled={!isStreaming}
          >
            停止响应
          </Button>
        </Space>
      }
    >
      <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] relative">
        <ReactMarkdown
          components={{
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className}>{children}</code>
              );
            }
          }}
        >
          {streamContent || '点击"开始流式响应"查看效果...'}
        </ReactMarkdown>
        {isStreaming && (
          <div className="absolute bottom-4 left-4">
            <LoadingOutlined style={{ fontSize: 24 }} className="text-blue-500" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StreamChat; 