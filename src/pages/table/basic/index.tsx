import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableParams } from '@/components/Table';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}

const BasicTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>([
    { id: 1, name: 'John Brown', age: 32, email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jim Green', age: 42, email: 'jim@example.com', status: 'inactive' },
    { id: 3, name: 'Joe Black', age: 32, email: 'joe@example.com', status: 'active' },
  ]);

  // 列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left' as const,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 搜索表单
  const searchForm = (
    <>
      <Form.Item name="name" label="姓名">
        <Input placeholder="请输入姓名" allowClear />
      </Form.Item>
      <Form.Item name="status" label="状态">
        <Select
          placeholder="请选择状态"
          allowClear
          options={[
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ]}
        />
      </Form.Item>
    </>
  );

  // 模拟API请求
  const fetchData = (params: TableParams) => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      console.log('Fetching data with params:', params);
      setLoading(false);
    }, 500);
  };

  // 处理表格变化
  const handleTableChange = (params: TableParams) => {
    fetchData(params);
  };

  // 处理编辑
  const handleEdit = (record: User) => {
    message.info(`编辑用户: ${record.name}`);
  };

  // 处理删除
  const handleDelete = (record: User) => {
    message.success(`删除用户: ${record.name}`);
    setDataSource(dataSource.filter(item => item.id !== record.id));
  };

  // 处理新建
  const handleAdd = () => {
    message.info('点击了新建按钮');
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      searchForm={searchForm}
      toolbarRight={
        <Button type="primary" onClick={handleAdd}>
          新建
        </Button>
      }
      loading={loading}
      onChange={handleTableChange}
      onRefresh={() => fetchData({})}
      cardProps={{
        title: '基础表格',
      }}
    />
  );
};

export default BasicTable; 