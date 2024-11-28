import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { ParticlesOptions } from '@/config/particles';
import { authService } from '@/services/auth';
import LanguageSwitch from '@/components/LanguageSwitch';
import TypeWriter from '@/components/TypeWriter';
import logo from '@/assets/logo.svg';
import '../login/index.scss';
import { RouteConfig } from '@/types/route';
import PageTransition from '@/components/PageTransition';
import { validatePassword, getPasswordStrength } from '@/utils/validator';

export const routeConfig: RouteConfig = {
    title: '注册',
    // icon: <StopOutlined />,
    layout: false,
    auth: false,
    // hidden: true // 在菜单中隐藏
}

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // 添加返回登录处理函数
    const handleBackToLogin = () => {
        navigate('/auth/login');
    };

    // 粒子背景初始化
    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
    };

    // 处理注册
    const handleRegister = async (values: any) => {
        if (!values.agreement) {
            message.error(t('register.agreementRequired'));
            return;
        }
        
        setLoading(true);
        try {
            await authService.register(values);
            message.success(t('register.success'));
            navigate('/auth/login');
        } catch (error) {
            console.error('Register failed:', error);
            message.error(t('register.failed'));
        } finally {
            setLoading(false);
        }
    };

    // 发送验证码
    const handleSendCode = async () => {
        try {
            const mobile = form.getFieldValue('mobile');
            if (!mobile) {
                message.error(t('register.mobileRequired'));
                return;
            }

            const response:any= await authService.sendVerificationCode(mobile, 'register');
            console.log('response', response);
            // 先设置验证码
            if (response?.verifyCode) {
                form.setFieldsValue({ verificationCode: response.verifyCode });
            }

            // 开始倒计时
            let count = 60;
            setCountdown(count);
            const timer = setInterval(() => {
                count -= 1;
                setCountdown(count);
                if (count === 0) {
                    clearInterval(timer);
                }
            }, 1000);

            // 最后显示成功消息
            message.success(response.verifyCode);
        } catch (error) {
            console.error('Send verification code failed:', error);
            message.error(t('register.smsFailed'));
        }
    };

    return (
        <PageTransition>
            <div className="login-page">
                <div className="login-container">
                    <Particles
                        className="absolute inset-0"
                        init={particlesInit}
                        options={ParticlesOptions}
                    />

                    <div className="absolute top-4 right-4">
                        <LanguageSwitch />
                    </div>

                    <div className="login-form-container">
                        <div className="header-section">
                            <img src={logo} alt="Logo" className="logo" />
                            <TypeWriter text="Coffee Admin" loop={true} loopDelay={2000} />
                            <p className="subtitle">{t('register.subtitle')}</p>
                        </div>

                        <Form
                            form={form}
                            onFinish={handleRegister}
                            className="login-form"
                            initialValues={{ agreement: false }}
                        >
                            <div className="form-item-group">
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: t('register.usernameRequired') }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder={t('register.usernamePlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="mobile"
                                    rules={[{ required: true, message: t('register.mobileRequired') }]}
                                >
                                    <Input
                                        prefix={<MobileOutlined />}
                                        placeholder={t('register.mobilePlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <div className="captcha-container">
                                    <Form.Item
                                        name="verificationCode"
                                        rules={[{ required: true, message: t('register.smsRequired') }]}
                                        className="captcha-input"
                                    >
                                        <Input
                                            prefix={<LockOutlined />}
                                            placeholder={t('register.smsPlaceholder')}
                                            className="login-input"
                                        />
                                    </Form.Item>
                                    <Button
                                        className="verification-code-button"
                                        disabled={countdown > 0}
                                        onClick={handleSendCode}
                                    >
                                        {countdown > 0 ? `${countdown}s` : t('register.sendCode')}
                                    </Button>
                                </div>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: t('register.passwordRequired') },
                                        {
                                            validator: async (_, value) => {
                                                if (!value) return Promise.resolve();
                                                
                                                const result = validatePassword(value);
                                                if (!result.isValid) {
                                                    return Promise.reject(new Error(result.message));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <div className="relative flex items-center">
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder={t('register.passwordPlaceholder')}
                                            className="login-input"
                                            onChange={(e) => {
                                                const strength = getPasswordStrength(e.target.value);
                                                setPasswordStrength(strength);
                                            }}
                                        />
                                        <Tooltip
                                            title={
                                                <ul className="text-xs space-y-1">
                                                    <li>• {t('register.passwordRequirements.length')}</li>
                                                    <li>• {t('register.passwordRequirements.number')}</li>
                                                    <li>• {t('register.passwordRequirements.upper')}</li>
                                                    <li>• {t('register.passwordRequirements.lower')}</li>
                                                    <li>• {t('register.passwordRequirements.special')}</li>
                                                </ul>
                                            }
                                            placement="right"
                                        >
                                            <QuestionCircleOutlined className="ml-2 text-gray-400 hover:text-blue-500 cursor-help" />
                                        </Tooltip>
                                        {/* 密码强度指示器 - 只在输入时显示 */}
                                        {form.getFieldValue('password') && (
                                            <div 
                                                className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                                                    ['bg-red-500 w-1/5', 
                                                     'bg-orange-500 w-2/5',
                                                     'bg-yellow-500 w-3/5', 
                                                     'bg-blue-500 w-4/5',
                                                     'bg-green-500 w-full'
                                                    ][passwordStrength]
                                                }`}
                                            />
                                        )}
                                    </div>
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: t('register.confirmPasswordRequired') },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('register.passwordNotMatch')));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder={t('register.confirmPasswordPlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                className="agreement-checkbox"
                            >
                                <Checkbox>
                                    {t('register.agreement')}
                                    <a href="#/agreement" className="text-blue-500 hover:text-blue-600 ml-1">
                                        {t('register.agreementLink')}
                                    </a>
                                </Checkbox>
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-button"
                                loading={loading}
                            >
                                {t('register.submit')}
                            </Button>

                            <div className="text-center mt-4">
                                <a 
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                    onClick={() => navigate('/auth/login')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {t('register.backToLogin')}
                                </a>
                            </div>
                        </Form>
                    </div>

                    <div className="copyright">
                        Copyright © {new Date().getFullYear()} Coffee Admin
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default RegisterPage;