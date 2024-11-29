import React, { useState, useEffect } from 'react';
import { Button, Tag, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
import request from '@/utils/request';

interface UserType {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [dataSource, setDataSource] = useState<UserType[]>([]);
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await request.get('/api/users');
      setDataSource(data.data || []);
    } catch (error: any) {
      message.error(error.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: TableColumnType<UserType>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
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
            icon={<LockOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            重置密码
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

  const handleAdd = () => {
    setModalTitle('新增用户');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: UserType) => {
    setModalTitle('编辑用户');
    setCurrentUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: UserType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户"${record.username}"吗？`,
      onOk: async () => {
        try {
          await request.delete(`/api/users/${record.id}`);
          message.success('删除成功');
          fetchUsers();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleResetPassword = async (record: UserType) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置用户"${record.username}"的密码吗？`,
      onOk: async () => {
        try {
          await request.post(`/api/users/${record.id}/reset-password`);
          message.success('密码重置成功');
        } catch (error: any) {
          message.error(error.message || '密码重置失败');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentUser) {
        // 更新用户
        await request.put(`/api/users/${currentUser.id}`, values);
        message.success('更新成功');
      } else {
        // 创建用户
        await request.post('/api/users', values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        // 表单验证错误
        return;
      }
      message.error(error.message || '操作失败');
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        toolbarRight={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        }
        cardProps={{
          title: '用户管理',
        }}
      />

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', role: 'user' }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 30, message: '用户名长度为3-30个字符' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          {!currentUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少6个字符' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;

export const routeConfig = {
  title: '用户管理',
  sort: 2,
}; 