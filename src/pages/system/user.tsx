import React, { useState, useEffect } from 'react';
import { Button, Tag, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import Table, { TableParams } from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  type UserType,
  type CreateUserParams,
  type UpdateUserParams,
} from '@/services/user';
import UserForm from './components/UserForm';

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [dataSource, setDataSource] = useState<UserType[]>([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsers({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...params
      });
      setDataSource(response.list || []);
      setPagination({
        ...pagination,
        total: response.total
      });
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
      dataIndex: 'roles',
      key: 'roles',
      width: 100,
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => (
            <Tag key={role} color={role === 'admin' ? 'blue' : 'default'}>
              {role === 'admin' ? '管理员' : '普通用户'}
            </Tag>
          ))}
        </Space>
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
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
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
            onClick={() => handleDelete(record.id)}
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
    form.setFieldsValue(record);  // 设置表单初始值
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？删除后不可恢复',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          fetchUsers();
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleResetPassword = async (record: UserType) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置用户"${record.username}"的密码吗？`,
      onOk: async () => {
        try {
          await resetUserPassword(record.id);
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
      setConfirmLoading(true);

      if (currentUser) {
        await updateUser(currentUser.id, values);
        message.success('更新成功');
      } else {
        await createUser(values);
        message.success('创建成功');
      }

      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Modal 关闭时清理状态
  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  // 处理表格变化（搜索、排序、筛选、分页）
  const handleTableChange = (params: TableParams) => {
    const newPagination = {
      current: params.pagination?.current || 1,
      pageSize: params.pagination?.pageSize || 10,
      total: params.pagination?.total || 0
    };
    setPagination(newPagination);
    fetchUsers({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      ...params.filters
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
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
        title={currentUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        width={600}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            ...currentUser
          }}
        >
          <UserForm initialValues={currentUser} />
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;

export const routeConfig = {
  title: '用户管理',
  sort: 2,
  roles: ['admin'],
}; 