import React from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RoleType {
  id: number;
  name: string;
  description: string;
  permissions: string;
}

const Role: React.FC = () => {
  const columns: ColumnsType<RoleType> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色名',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
    },
  ];

  const data: RoleType[] = [
    {
      id: 1,
      name: '管理员',
      description: '系统管理员',
      permissions: '所有权限',
    },
  ];

  return (
    <div className="p-6">
      <Card title="角色管理" className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  );
};

export default Role; 