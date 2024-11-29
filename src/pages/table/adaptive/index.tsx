import React, { useState } from 'react';
import { Tag, Tooltip, Space } from 'antd';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';

interface AdaptiveUser {
  id: number;
  name: string;
  description: string;
  longText: string;
  tags: string[];
  address: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

const AdaptiveTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource] = useState<AdaptiveUser[]>([
    {
      id: 1,
      name: 'John Brown',
      description: '这是一段很长的描述文本，用来测试自动省略和tooltip的效果',
      longText: '这是一段非常非常长的文本内容，当文本内容超出列宽时会自动显示省略号，鼠标悬停时会显示完整内容。这是一段非常非常长的文本内容，当文本内容超出列宽时会自动显示省略号，鼠标悬停时会显示完整内容。',
      tags: ['前端', 'React', 'TypeScript', 'Tailwind', 'Ant Design'],
      address: '浙江省杭州市西湖区工专路 77 号',
      email: 'john.brown@example.com',
      department: '技术研发中心前端开发组',
      status: 'active',
    },
    // 添加更多示例数据...
  ]);

  const columns: TableColumnType<AdaptiveUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="line-clamp-2">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '长文本',
      dataIndex: 'longText',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="line-clamp-3">{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      ellipsis: true,
      render: (tags: string[]) => (
        <Tooltip 
          placement="topLeft" 
          title={
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          }
        >
          <div className="flex flex-wrap gap-1 overflow-hidden max-h-6">
            {tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      cardProps={{
        title: '自适应内容表格',
      }}
      scroll={{ x: 1500 }}
    />
  );
};

export default AdaptiveTable;

export const routeConfig = {
  title: '自适应内容表格',
  sort: 5,
}; 