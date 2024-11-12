import React from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const User: React.FC = () => {
  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ];

  const data: UserType[] = [
    {
      id: 1,
      name: 'admin',
      email: 'admin@example.com',
      role: '管理员',
      status: '正常',
    },
  ];

  return (
    <div className="p-6">
      <Card title="用户管理" className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  );
};

export default User; 