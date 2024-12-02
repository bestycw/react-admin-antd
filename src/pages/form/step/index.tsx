import React, { useState } from 'react';
import { Card, Steps, Form, Input, Button, Select, Result, message } from 'antd';
// import { FormOutlined } from '@ant-design/icons';
import type { RouteConfig } from '@/types/route';

export const routeConfig: RouteConfig = {
    title: '分步表单',
    // icon: <FormOutlined />,
    layout: true,
    auth: true,
    sort: 2
};

const { Option } = Select;
const { TextArea } = Input;

interface StepFormValues {
    projectName: string;
    projectDesc: string;
    projectType: string;
    teamMembers: string[];
    budget: string;
    timeline: string;
    goals: string;
    risks: string;
}

const StepForm: React.FC = () => {
    const [form] = Form.useForm<StepFormValues>();
    const [currentStep, setCurrentStep] = useState(0);
    const [formValues, setFormValues] = useState<StepFormValues>();

    const next = async () => {
        try {
            const values = await form.validateFields();
            setFormValues({ ...formValues, ...values });
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = async (values: StepFormValues) => {
        const finalValues = { ...formValues, ...values };
        try {
            console.log('Form values:', finalValues);
            message.success('项目创建成功！');
            setCurrentStep(currentStep + 1);
        } catch (error) {
            message.error('提交失败，请重试！');
        }
    };

    const steps = [
        {
            title: '基本信息',
            content: (
                <Form.Item
                    label="项目名称"
                    name="projectName"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                >
                    <Input placeholder="请输入项目名称" />
                </Form.Item>
            ),
        },
        {
            title: '项目详情',
            content: (
                <>
                    <Form.Item
                        label="项目描述"
                        name="projectDesc"
                        rules={[{ required: true, message: '请输入项目描述' }]}
                    >
                        <TextArea rows={4} placeholder="请输入项目描述" />
                    </Form.Item>
                    <Form.Item
                        label="项目类型"
                        name="projectType"
                        rules={[{ required: true, message: '请选择项目类型' }]}
                    >
                        <Select placeholder="请选择项目类型">
                            <Option value="development">开发项目</Option>
                            <Option value="design">设计项目</Option>
                            <Option value="research">研究项目</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '团队配置',
            content: (
                <>
                    <Form.Item
                        label="团队成员"
                        name="teamMembers"
                        rules={[{ required: true, message: '请选择团队成员' }]}
                    >
                        <Select mode="multiple" placeholder="请选择团队成员">
                            <Option value="member1">成员1</Option>
                            <Option value="member2">成员2</Option>
                            <Option value="member3">成员3</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="预算范围"
                        name="budget"
                        rules={[{ required: true, message: '请选择预算范围' }]}
                    >
                        <Select placeholder="请选择预算范围">
                            <Option value="low">10万以下</Option>
                            <Option value="medium">10-50万</Option>
                            <Option value="high">50万以上</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '项目规划',
            content: (
                <>
                    <Form.Item
                        label="时间规划"
                        name="timeline"
                        rules={[{ required: true, message: '请输入时间规划' }]}
                    >
                        <TextArea rows={4} placeholder="请输入项目时间规划" />
                    </Form.Item>
                    <Form.Item
                        label="项目目标"
                        name="goals"
                        rules={[{ required: true, message: '请输入项目目标' }]}
                    >
                        <TextArea rows={4} placeholder="请输入项目目标" />
                    </Form.Item>
                    <Form.Item
                        label="风险评估"
                        name="risks"
                        rules={[{ required: true, message: '请输入风险评估' }]}
                    >
                        <TextArea rows={4} placeholder="请输入风险评估" />
                    </Form.Item>
                </>
            ),
        },
    ];

    const renderContent = () => {
        if (currentStep === steps.length) {
            return (
                <Result
                    status="success"
                    title="项目创建成功！"
                    subTitle="你可以继续创建新的项目或返回项目列表。"
                    extra={[
                        <Button type="primary" key="new" onClick={() => {
                            setCurrentStep(0);
                            form.resetFields();
                            setFormValues(undefined);
                        }}>
                            创建新项目
                        </Button>,
                    ]}
                />
            );
        }

        return (
            <Form
                form={form}
                layout="vertical"
                className="max-w-2xl mx-auto"
                onFinish={onFinish}
            >
                {steps[currentStep].content}
                <Form.Item>
                    <div className="flex justify-between mt-8">
                        {currentStep > 0 && (
                            <Button onClick={prev}>
                                上一步
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                下一步
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        )}
                    </div>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div>
            <Card title="分步表单" className="shadow-md">
                <Steps current={currentStep} items={steps.map(item => ({ title: item.title }))} className="mb-8" />
                {renderContent()}
            </Card>
        </div>
    );
};

export default StepForm;
