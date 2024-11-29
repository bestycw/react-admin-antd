import React, { useState } from 'react';
import { Button, Tag, Modal, Form, Input, Switch, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';

interface RoleType {
  id: number;
  name: string;
  code: string;
  description: string;
  status: boolean;
  createTime: string;
}

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [form] = Form.useForm();

  const [dataSource] = useState<RoleType[]>([
    {
      id: 1,
      name: '管理员',
      code: 'admin',
      description: '系统管理员，拥有所有权限',
      status: true,
      createTime: '2024-01-01 12:00:00',
    },
    {
      id: 2,
      name: '普通用户',
      code: 'user',
      description: '普通用户，拥有基本权限',
      status: true,
      createTime: '2024-01-01 12:00:00',
    },
  ]);

  const columns: TableColumnType<RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
    setModalTitle('新增角色');
    setCurrentRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: RoleType) => {
    setModalTitle('编辑角色');
    setCurrentRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: RoleType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色"${record.name}"吗？`,
      onOk() {
        message.success('删除成功');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      message.success(`${modalTitle}成功`);
      setModalVisible(false);
    });
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
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoleManagement;

export const routeConfig = {
  title: '角色管理',
  sort: 1,
}; 