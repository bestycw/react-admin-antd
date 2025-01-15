import React from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import type { DataType } from '../config';

interface AntdVirtualTableProps {
  dataSource: DataType[];
  loading?: boolean;
}

const AntdVirtualTable: React.FC<AntdVirtualTableProps> = ({ dataSource, loading }) => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 150,
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      width: 120,
      render: (salary: number) => `￥${salary.toLocaleString()}`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      width: 200,
    },
  ];

  return (
    <Table<DataType>
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      scroll={{ y: 'calc(100vh - 380px)', x: '100%' }}
      pagination={false}
      rowKey="id"
      virtual
      size="middle"
      className="virtual-table"
    />
  );
};

export default AntdVirtualTable; 