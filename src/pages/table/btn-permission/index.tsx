import React, { useState } from 'react';
import { Button, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableParams, TableColumnType } from '@/components/Table/types';
import Permission from '@/components/Permission';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const BtnPermissionTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<User[]>([
    { 
      id: 1, 
      name: 'John Brown', 
      age: 32, 
      email: 'john@example.com', 
      role: 'admin',
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Jim Green', 
      age: 42, 
      email: 'jim@example.com', 
      role: 'user',
      status: 'inactive' 
    },
    { 
      id: 3, 
      name: 'Joe Black', 
      age: 32, 
      email: 'joe@example.com', 
      role: 'guest',
      status: 'active' 
    },
  ]);

  // 列定义
  const columns: TableColumnType<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left' as const,
      hideInSearch: true
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
      valueType: 'text'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sorter: true,
      hideInSearch: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      hideInSearch: true
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', status: 'Success' },
        user: { text: '用户', status: 'Processing' },
        guest: { text: '访客', status: 'Default' }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' }
      },
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
      width: 200,
      hideInSearch: true,
      render: (_: any, record: User) => (
        <Space>
          <Permission permissions={['edit']} roles={['admin']}>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Permission>
          
          <Permission permissions={['delete']} roles={['admin']}>
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </Permission>
        </Space>
      ),
    },
  ];

  // 模拟API请求
  const fetchData = (params: TableParams) => {
    setLoading(true);
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
      toolbarRight={
        <Permission permissions={['add']} roles={['admin']}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建用户
          </Button>
        </Permission>
      }
      loading={loading}
      onChange={handleTableChange}
      onRefresh={() => fetchData({})}
      cardProps={{
        title: '按钮权限表格',
      }}
    />
  );
};

export default BtnPermissionTable;

export const routeConfig = {
  title: '按钮权限表格',
  sort: 2,
};