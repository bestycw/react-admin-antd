import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Radio, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';

interface DictType {
  id: number;
  code: string;
  name: string;
  status: '0' | '1';
  remark?: string;
}

const DictPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dictList, setDictList] = useState<DictType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDict, setCurrentDict] = useState<DictType | null>(null);
  const [form] = Form.useForm();

  const fetchDictList = async () => {
    setLoading(true);
    try {
      const res = await request.get('/api/dict');
      setDictList(res as DictType[]);
    } catch (error) {
    //   message.error('获取字典列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDictList();
  }, []);

  const columns: TableColumnsType<DictType> = [
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === '1' ? 'text-green-500' : 'text-red-500'}>
          {status === '1' ? '正常' : '停用'}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
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
    setCurrentDict(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: DictType) => {
    setCurrentDict(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: DictType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除字典"${record.name}"吗？`,
      onOk: async () => {
        try {
          await request.delete(`/api/dict/${record.id}`);
          message.success('删除成功');
          fetchDictList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (currentDict) {
        await request.put(`/api/dict/${currentDict.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/api/dict', values);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchDictList();
    } catch (error) {
      message.error('操作失败');
    }
  };

  return (
    <div >
      <Card>
        <div className="mb-4">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增字典
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={dictList}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={currentDict ? '编辑字典' : '新增字典'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="字典编码"
            rules={[{ required: true, message: '请输入字典编码' }]}
          >
            <Input placeholder="请输入字典编码" />
          </Form.Item>
          <Form.Item
            name="name"
            label="字典名称"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="1"
          >
            <Radio.Group>
              <Radio value="1">正常</Radio>
              <Radio value="0">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictPage;

export const routeConfig = {
  title: '字典管理',
  layout: true,
}; 