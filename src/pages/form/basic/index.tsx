import React from 'react';
import { Card, Form, Input, Button, Select, DatePicker, Radio, Checkbox, Space, message } from 'antd';
// import { FormOutlined } from '@ant-design/icons';
import type { RouteConfig } from '@/types/route';

export const routeConfig: RouteConfig = {
    title: 'route.form.basic',
    // icon: <FormOutlined />,
    layout: true,
    
    sort: 1
};

const { Option } = Select;
const { TextArea } = Input;

interface BasicFormValues {
    title: string;
    description: string;
    type: string;
    urgency: string;
    deadline: Date;
    notify: boolean;
    assignee: string[];
}

const BasicForm: React.FC = () => {
    const [form] = Form.useForm<BasicFormValues>();

    const onFinish = async (values: BasicFormValues) => {
        try {
            console.log('Form values:', values);
            message.success('表单提交成功！');
            form.resetFields();
        } catch (error) {
            message.error('提交失败，请重试！');
        }
    };

    return (
        <div>
            <Card title="基础表单" className="shadow-md">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="max-w-2xl mx-auto"
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
                        <TextArea rows={4} placeholder="请输入描述" />
                    </Form.Item>

                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[{ required: true, message: '请选择类型' }]}
                    >
                        <Select placeholder="请选择类型">
                            <Option value="feature">功能需求</Option>
                            <Option value="bug">错误修复</Option>
                            <Option value="optimization">优化改进</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="紧急程度"
                        name="urgency"
                        rules={[{ required: true, message: '请选择紧急程度' }]}
                    >
                        <Radio.Group>
                            <Radio value="low">低</Radio>
                            <Radio value="medium">中</Radio>
                            <Radio value="high">高</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="截止日期"
                        name="deadline"
                        rules={[{ required: true, message: '请选择截止日期' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="指派给"
                        name="assignee"
                        rules={[{ required: true, message: '请选择指派人员' }]}
                    >
                        <Select mode="multiple" placeholder="请选择指派人员">
                            <Option value="user1">用户1</Option>
                            <Option value="user2">用户2</Option>
                            <Option value="user3">用户3</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="notify"
                        valuePropName="checked"
                    >
                        <Checkbox>完成后通知我</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Space className="w-full justify-end">
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default BasicForm; 