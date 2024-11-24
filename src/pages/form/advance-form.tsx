import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Space,
  Table,
  Tag,
  Divider,
  message,
  InputNumber
} from 'antd';
import { FormOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { TableColumnsType } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TableItem {
  key: string;
  name: string;
  amount: number;
  status: string;
}

const AdvanceForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);

  const columns: TableColumnsType<TableItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status === 'completed' ? '已完成' : '进行中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleRemoveItem(record.key)}>
          删除
        </Button>
      ),
    },
  ];

  const handleRemoveItem = (key: string) => {
    setTableData(tableData.filter(item => item.key !== key));
  };

  const handleAddItem = () => {
    const newItem: TableItem = {
      key: Date.now().toString(),
      name: `项目 ${tableData.length + 1}`,
      amount: 0,
      status: 'pending',
    };
    setTableData([...tableData, newItem]);
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Form values:', {
        ...values,
        files: fileList,
        items: tableData,
      });
      message.success('表单提交成功！');
    } catch (error) {
      message.error('提交失败，请重试！');
    }
  };

  return (
    <div className="p-6">
      <Card title="高级表单" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="项目名称"
              name="projectName"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>

            <Form.Item
              label="项目编号"
              name="projectCode"
              rules={[{ required: true, message: '请输入项目编号' }]}
            >
              <Input placeholder="请输入项目编号" />
            </Form.Item>

            <Form.Item
              label="项目时间"
              name="projectTime"
              rules={[{ required: true, message: '请选择项目时间' }]}
            >
              <RangePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="项目预算"
              name="budget"
              rules={[{ required: true, message: '请输入项目预算' }]}
            >
              <InputNumber
                className="w-full"
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\￥\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="项目描述"
            name="description"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea rows={4} placeholder="请输入项目描述" />
          </Form.Item>

          <Form.Item label="附件上传" name="files">
            <Upload.Dragger
              multiple
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            </Upload.Dragger>
          </Form.Item>

          <Divider orientation="left">项目清单</Divider>

          <div className="mb-4">
            <Button type="dashed" onClick={handleAddItem} block icon={<PlusOutlined />}>
              添加项目
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            className="mb-6"
          />

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={() => {
                form.resetFields();
                setFileList([]);
                setTableData([]);
              }}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdvanceForm;

export const routeConfig = {
  title: '高级表单',
  icon: <FormOutlined />,
  layout: true,
  auth: true,
};
