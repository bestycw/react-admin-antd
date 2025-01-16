import React from 'react';
import { Card, Form, Input, Button, Select, DatePicker, InputNumber, Upload, Space, message, Divider } from 'antd';
import {  InboxOutlined } from '@ant-design/icons';
import type { RouteConfig } from '@/types/route';
import type { UploadFile } from 'antd/es/upload/interface';

export const routeConfig: RouteConfig = {
    title: 'route.form.advanced',
    // icon: <FormOutlined />,
    layout: true,
    
    sort: 3
};

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface AdvancedFormValues {
    name: string;
    url: string;
    owner: string;
    approver: string[];
    dateRange: [Date, Date];
    type: string;
    category: string[];
    visibility: string;
    description: string;
    visitors: number;
    attachments: UploadFile[];
}

const AdvancedForm: React.FC = () => {
    const [form] = Form.useForm<AdvancedFormValues>();

    const onFinish = async (values: AdvancedFormValues) => {
        try {
            console.log('Form values:', values);
            message.success('提交成功！');
        } catch (error) {
            message.error('提交失败，请重试！');
        }
    };

    return (
        <div >
            <Card title="高级表单" className="shadow-md">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="max-w-4xl mx-auto"
                >
                    {/* 基本信息 */}
                    <Divider orientation="left">基本信息</Divider>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="项目名称"
                            name="name"
                            rules={[{ required: true, message: '请输入项目名称' }]}
                        >
                            <Input placeholder="请输入项目名称" />
                        </Form.Item>

                        <Form.Item
                            label="项目地址"
                            name="url"
                            rules={[
                                { required: true, message: '请输入项目地址' },
                                { type: 'url', message: '请输入有效的URL' }
                            ]}
                        >
                            <Input placeholder="请输入项目地址" />
                        </Form.Item>

                        <Form.Item
                            label="项目负责人"
                            name="owner"
                            rules={[{ required: true, message: '请选择项目负责人' }]}
                        >
                            <Select placeholder="请选择项目负责人">
                                <Option value="user1">用户1</Option>
                                <Option value="user2">用户2</Option>
                                <Option value="user3">用户3</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="审批人"
                            name="approver"
                            rules={[{ required: true, message: '请选择审批人' }]}
                        >
                            <Select mode="multiple" placeholder="请选择审批人">
                                <Option value="approver1">审批人1</Option>
                                <Option value="approver2">审批人2</Option>
                                <Option value="approver3">审批人3</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* 项目配置 */}
                    <Divider orientation="left">项目配置</Divider>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="起止日期"
                            name="dateRange"
                            rules={[{ required: true, message: '请选择起止日期' }]}
                        >
                            <RangePicker className="w-full" />
                        </Form.Item>

                        <Form.Item
                            label="项目类型"
                            name="type"
                            rules={[{ required: true, message: '请选择项目类型' }]}
                        >
                            <Select placeholder="请选择项目类型">
                                <Option value="internal">内部项目</Option>
                                <Option value="external">外部项目</Option>
                                <Option value="cooperation">合作项目</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="项目分类"
                            name="category"
                            rules={[{ required: true, message: '请选择项目分类' }]}
                        >
                            <Select mode="multiple" placeholder="请选择项目分类">
                                <Option value="technology">技术</Option>
                                <Option value="marketing">市场</Option>
                                <Option value="operation">运营</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="可见范围"
                            name="visibility"
                            rules={[{ required: true, message: '请选择可见范围' }]}
                        >
                            <Select placeholder="请选择可见范围">
                                <Option value="public">公开</Option>
                                <Option value="private">私密</Option>
                                <Option value="custom">自定义</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* 项目描述 */}
                    <Divider orientation="left">项目描述</Divider>
                    <Form.Item
                        label="项目描述"
                        name="description"
                        rules={[{ required: true, message: '请输入项目描述' }]}
                    >
                        <TextArea rows={4} placeholder="请输入项目描述" />
                    </Form.Item>

                    <Form.Item
                        label="访问人数"
                        name="visitors"
                        rules={[{ required: true, message: '请输入访问人数' }]}
                    >
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    {/* 附件上传 */}
                    <Form.Item
                        label="项目附件"
                        name="attachments"
                    >
                        <Upload.Dragger
                            multiple
                            action="/api/upload"
                            listType="picture"
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                            <p className="ant-upload-hint">
                                支持单个或批量上传，严禁上传公司数据或其他违禁文件
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    {/* 提交按钮 */}
                    <Form.Item>
                        <Space className="w-full justify-end">
                            <Button onClick={() => form.resetFields()}>
                                重置
                            </Button>
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

export default AdvancedForm;
