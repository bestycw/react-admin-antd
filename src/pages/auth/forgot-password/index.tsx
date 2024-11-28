import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
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

export const routeConfig: RouteConfig = {
    title: '忘记密码',
    layout: false,
    auth: false,
}

const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // 粒子背景初始化
    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
    };

    // 处理重置密码
    const handleReset = async (values: any) => {
        setLoading(true);
        try {
            await authService.resetPassword(values);
            message.success(t('forgotPassword.success'));
            navigate('/auth/login');
        } catch (error) {
            console.error('Reset password failed:', error);
            message.error(t('forgotPassword.failed'));
        } finally {
            setLoading(false);
        }
    };

    // 发送验证码
    const handleSendCode = async () => {
        try {
            const mobile = form.getFieldValue('mobile');
            if (!mobile) {
                message.error(t('forgotPassword.mobileRequired'));
                return;
            }

            await authService.sendVerificationCode(mobile, 'reset');
            message.success(t('forgotPassword.smsSent'));
            let count = 60;
            setCountdown(count);
            const timer = setInterval(() => {
                count -= 1;
                setCountdown(count);
                if (count === 0) {
                    clearInterval(timer);
                }
            }, 1000);
        } catch (error) {
            console.error('Send verification code failed:', error);
            message.error(t('forgotPassword.smsFailed'));
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
                            <p className="subtitle">{t('forgotPassword.subtitle')}</p>
                        </div>

                        <Form
                            form={form}
                            onFinish={handleReset}
                            className="login-form"
                        >
                            <div className="form-item-group">
                                <Form.Item
                                    name="mobile"
                                    rules={[{ required: true, message: t('forgotPassword.mobileRequired') }]}
                                >
                                    <Input
                                        prefix={<MobileOutlined />}
                                        placeholder={t('forgotPassword.mobilePlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <div className="captcha-container">
                                    <Form.Item
                                        name="verificationCode"
                                        rules={[{ required: true, message: t('forgotPassword.smsRequired') }]}
                                        className="captcha-input"
                                    >
                                        <Input
                                            prefix={<LockOutlined />}
                                            placeholder={t('forgotPassword.smsPlaceholder')}
                                            className="login-input"
                                        />
                                    </Form.Item>
                                    <Button
                                        className="verification-code-button"
                                        disabled={countdown > 0}
                                        onClick={handleSendCode}
                                    >
                                        {countdown > 0 ? `${countdown}s` : t('forgotPassword.sendCode')}
                                    </Button>
                                </div>

                                <Form.Item
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: t('forgotPassword.newPasswordRequired') },
                                        { min: 6, message: t('forgotPassword.passwordMinLength') }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder={t('forgotPassword.newPasswordPlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: t('forgotPassword.confirmPasswordRequired') },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('forgotPassword.passwordNotMatch')));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                                        className="login-input"
                                    />
                                </Form.Item>
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-button"
                                loading={loading}
                            >
                                {t('forgotPassword.submit')}
                            </Button>

                            <div className="text-center mt-4">
                                <a 
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                    onClick={() => navigate('/auth/login')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {t('forgotPassword.backToLogin')}
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

export default ForgotPasswordPage; 