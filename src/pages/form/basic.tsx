import React from 'react';
import { Card, Form, Input, Button, Select, DatePicker, Radio, Switch, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface BasicFormValues {
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'private';
  date: Dayjs;
  tags: string[];
  status: boolean;
}

const BasicForm: React.FC = () => {
  const [form] = Form.useForm<BasicFormValues>();

  const handleSubmit = async (values: BasicFormValues) => {
    try {
      console.log('Form values:', values);
      message.success('表单提交成功！');
    } catch (error) {
      message.error('提交失败，请重试！');
    }
  };

  return (
    <div className="p-6">
      <Card title="基础表单" className="shadow-md">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className="max-w-2xl"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={4} placeholder="请输入描述信息" />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Option value="technology">技术</Option>
              <Option value="design">设计</Option>
              <Option value="business">业务</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="可见性"
            name="visibility"
            rules={[{ required: true, message: '请选择可见性' }]}
          >
            <Radio.Group>
              <Radio value="public">公开</Radio>
              <Radio value="private">私密</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="发布日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <Select mode="tags" placeholder="请选择或输入标签">
              <Option value="frontend">前端</Option>
              <Option value="backend">后端</Option>
              <Option value="design">设计</Option>
              <Option value="product">产品</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={() => form.resetFields()}>
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

export default BasicForm;

export const routeConfig = {
  title: '基础表单',
  icon: <FormOutlined />,
  layout: true,
  auth: true,
};
