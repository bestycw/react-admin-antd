import React, { useState } from 'react';
import { Button, Space, Tag, message, Modal, Form, Input, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type {  TableColumnType } from '@/components/Table/types';

interface TreeUser {
  key: string;
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
  department?: string;
  children?: TreeUser[];
}



const TreeTable: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TreeUser>();
  const [dataSource, setDataSource] = useState<TreeUser[]>([
    {
      key: '1',
      id: 1,
      name: '技术部',
      age: 0,
      email: 'tech@example.com',
      status: 'active',
      children: [
        {
          key: '1-1',
          id: 11,
          name: '前端组',
          age: 0,
          email: 'frontend@example.com',
          status: 'active',
          children: [
            {
              key: '1-1-1',
              id: 111,
              name: 'John Brown',
              age: 32,
              email: 'john@example.com',
              status: 'active',
              department: '前端组',
            },
            {
              key: '1-1-2',
              id: 112,
              name: 'Jim Green',
              age: 42,
              email: 'jim@example.com',
              status: 'inactive',
              department: '前端组',
            },
          ],
        },
        {
          key: '1-2',
          id: 12,
          name: '后端组',
          age: 0,
          email: 'backend@example.com',
          status: 'active',
          children: [
            {
              key: '1-2-1',
              id: 121,
              name: 'Joe Black',
              age: 32,
              email: 'joe@example.com',
              status: 'active',
              department: '后端组',
            },
          ],
        },
      ],
    },
    {
      key: '2',
      id: 2,
      name: '产品部',
      age: 0,
      email: 'product@example.com',
      status: 'active',
      children: [
        {
          key: '2-1',
          id: 21,
          name: '产品组',
          age: 0,
          email: 'pm@example.com',
          status: 'active',
          children: [
            {
              key: '2-1-1',
              id: 211,
              name: 'Tom Brown',
              age: 28,
              email: 'tom@example.com',
              status: 'active',
              department: '产品组',
            },
          ],
        },
      ],
    },
  ]);

  const showModal = (record?: TreeUser) => {
    setCurrentRecord(record);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentRecord) {
        // 编辑现有节点
        const newData = JSON.parse(JSON.stringify(dataSource));
        const updateTreeData = (data: TreeUser[], key: string, values: Partial<TreeUser>): TreeUser[] => {
          return data.map(node => {
            if (node.key === key) {
              return { ...node, ...values };
            }
            if (node.children) {
              return { ...node, children: updateTreeData(node.children, key, values) };
            }
            return node;
          });
        };
        setDataSource(updateTreeData(newData, currentRecord.key, values));
        message.success('编辑成功');
      } else {
        // 添加新节点
        const newId = Math.max(...dataSource.map(item => item.id)) + 1;
        const newNode: TreeUser = {
          key: `${newId}`,
          id: newId,
          name: values.name,
          age: 0,
          email: values.email,
          status: values.status,
        };
        setDataSource([...dataSource, newNode]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (record: TreeUser) => {
    showModal(record);
  };

  const handleDelete = (record: TreeUser) => {
    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后数据将无法恢复',
      onOk: () => {
        const deleteNode = (data: TreeUser[], key: string): TreeUser[] => {
          return data.filter(node => {
            if (node.key === key) {
              return false;
            }
            if (node.children) {
              node.children = deleteNode(node.children, key);
            }
            return true;
          });
        };
        const newData = deleteNode(JSON.parse(JSON.stringify(dataSource)), record.key);
        setDataSource(newData);
        message.success('删除成功');
      },
    });
  };

  const handleAdd = (record?: TreeUser) => {
    if (record) {
      // 添加子节点
      form.setFieldsValue({
        department: record.name,
      });
    }
    showModal();
  };

  const columns: TableColumnType<TreeUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      valueType: 'text',
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      hideInSearch: true,
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
      fixed: 'right',
      width: 200,
      hideInSearch: true,
      render: (_: any, record: TreeUser) => (
        <Space>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => handleAdd(record)}
          >
            添加
          </Button>
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        toolbarRight={
          <Button type="primary" onClick={() => handleAdd()}>
            新建
          </Button>
        }
        loading={loading}
        cardProps={{
          title: '树形表格',
        }}
      />
      <Modal
        title={currentRecord ? '编辑节点' : '新建节点'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="active">启用</Radio.Button>
              <Radio.Button value="inactive">禁用</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TreeTable;

export const routeConfig = {
  title: 'route.table.tree',
  sort: 4,
}; 