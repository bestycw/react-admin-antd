import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Space, Tag, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type {  TableColumnType } from '@/components/Table/types';

interface EditableUser {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: keyof EditableUser;
  title: string;
  record: EditableUser;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  const inputNode = (() => {
    switch (dataIndex) {
      case 'age':
        return <InputNumber min={1} max={120} />;
      case 'status':
        return (
          <Select>
            <Select.Option value="active">启用</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
        );
      default:
        return <Input />;
    }
  })();

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<EditableUser[]>([
    { id: 1, name: 'John Brown', age: 32, email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jim Green', age: 42, email: 'jim@example.com', status: 'inactive' },
    { id: 3, name: 'Joe Black', age: 32, email: 'joe@example.com', status: 'active' },
  ]);
  const [editingKey, setEditingKey] = useState<number>();

  const isEditing = (record: EditableUser) => record.id === editingKey;

  const edit = (record: EditableUser) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(undefined);
  };

  const save = async (key: number) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey(undefined);
        message.success('保存成功');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      message.error('验证失败');
    }
  };

  const handleDelete = (record: EditableUser) => {
    setDataSource(dataSource.filter(item => item.id !== record.id));
    message.success('删除成功');
  };

  const handleAdd = () => {
    const newId = Math.max(...dataSource.map(item => item.id)) + 1;
    const newRecord: EditableUser = {
      id: newId,
      name: `用户${newId}`,
      age: 25,
      email: `user${newId}@example.com`,
      status: 'active',
    };
    setDataSource([...dataSource, newRecord]);
    edit(newRecord);
  };

  const columns: TableColumnType<EditableUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      valueType: 'text',
      render: (text: string, record: EditableUser) => {
        const editable = isEditing(record);
        return <EditableCell
          editing={editable}
          dataIndex="name"
          title="姓名"
          record={record}
        >
          {text}
        </EditableCell>;
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      hideInSearch: true,
      render: (text: number, record: EditableUser) => {
        const editable = isEditing(record);
        return <EditableCell
          editing={editable}
          dataIndex="age"
          title="年龄"
          record={record}
        >
          {text}
        </EditableCell>;
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      hideInSearch: true,
      render: (text: string, record: EditableUser) => {
        const editable = isEditing(record);
        return <EditableCell
          editing={editable}
          dataIndex="email"
          title="邮箱"
          record={record}
        >
          {text}
        </EditableCell>;
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
      render: (text: string, record: EditableUser) => {
        const editable = isEditing(record);
        return editable ? (
          <EditableCell
            editing={editable}
            dataIndex="status"
            title="状态"
            record={record}
          >
            {text}
          </EditableCell>
        ) : (
          <Tag color={text === 'active' ? 'success' : 'default'}>
            {text === 'active' ? '启用' : '禁用'}
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      hideInSearch: true,
      render: (_: any, record: EditableUser) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={() => save(record.id)}
            >
              保存
            </Button>
            <Button
              type="link"
              icon={<CloseOutlined />}
              onClick={cancel}
            >
              取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={!!editingKey}
              icon={<EditOutlined />}
              onClick={() => edit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除吗？"
              onConfirm={() => handleDelete(record)}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={!!editingKey}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        columns={columns}
        dataSource={dataSource}
        toolbarRight={
          <Button type="primary" onClick={handleAdd} disabled={!!editingKey}>
            新建
          </Button>
        }
        loading={loading}
        cardProps={{
          title: '可编辑表格',
        }}
      />
    </Form>
  );
};

export default EditableTable;

export const routeConfig = {
  title: '可编辑表格',
  sort: 2,
}; 