import React, { useState, useEffect } from 'react';
import { Button, Tag, Modal, Form, Input, Select, message, Space, Steps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
import PermissionTree from '@/components/PermissionTree';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleType,
  type CreateRoleParams,
} from '@/services/role';

const steps = [
  {
    title: '基本信息',
    description: '设置角色的基本信息'
  },
  {
    title: '权限配置',
    description: '配置角色的权限'
  }
];

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [dataSource, setDataSource] = useState<RoleType[]>([]);
  const [form] = Form.useForm();

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setDataSource(data || []);
    } catch (error: any) {
      message.error(error.message || '获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: TableColumnType<RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
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
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
    setCurrentRole(null);
    setCurrentStep(0);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: RoleType) => {
    setCurrentRole(record);
    setCurrentStep(0);
    form.setFieldsValue({
      ...record,
      permissions: record.permissions || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (record: RoleType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色"${record.name}"吗？`,
      onOk: async () => {
        try {
          await deleteRole(record.id);
          message.success('删除成功');
          fetchRoles();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleNext = async () => {
    try {
      // 只验证当前步骤的表单项
      const fields = currentStep === 0 
        ? ['name', 'code', 'description', 'status']
        : ['permissions'];
      await form.validateFields(fields);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // 表单验证失败
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentRole) {
        await updateRole(currentRole.id, values);
        message.success('更新成功');
      } else {
        await createRole(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="px-8">
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" maxLength={30} showCount />
            </Form.Item>
            <Form.Item
              name="code"
              label="角色编码"
              rules={[{ required: true, message: '请输入角色编码' }]}
              extra="角色编码用于系统识别，建议使用英文和下划线"
            >
              <Input placeholder="请输入角色编码" maxLength={50} showCount />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea 
                placeholder="请输入角色描述" 
                maxLength={200} 
                showCount 
                rows={4}
              />
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
          </div>
        );
      case 1:
        return (
          <div className="px-4">
            <Form.Item
              name="permissions"
              rules={[{ required: true, message: '请选择权限' }]}
              className="mb-0"
            >
              <PermissionTree />
            </Form.Item>
          </div>
        );
      default:
        return null;
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
          title: '角色管理',
        }}
      />

      <Modal
        title={currentRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        width={800}
        bodyStyle={{ 
          padding: '24px 0',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          currentStep > 0 && (
            <Button key="prev" onClick={handlePrev}>
              上一步
            </Button>
          ),
          currentStep < steps.length - 1 ? (
            <Button key="next" type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleModalOk}>
              确定
            </Button>
          ),
        ]}
      >
        <Steps
          current={currentStep}
          items={steps}
          className="px-8 mb-6"
        />
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', permissions: [] }}
        >
          {renderStepContent()}
        </Form>
      </Modal>
    </>
  );
};

export default RoleManagement;

export const routeConfig = {
  title: '角色管理',
  sort: 3,
}; 