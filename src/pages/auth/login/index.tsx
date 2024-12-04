import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import {
    UserOutlined,

    MobileOutlined,
    QrcodeOutlined,

    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import {
    Form,
    Button,
    Checkbox,
    message,
    Segmented,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { ParticlesOptions } from '@/config/particles';
import { authService } from '@/services/auth';

import LanguageSwitch from '@/components/LanguageSwitch';
import logo from '@/assets/logo.svg';
import './index.scss';
import AccountLogin from './components/AccountLogin';
import PhoneLogin from './components/PhoneLogin';
import QrCodeLogin from './components/QrCodeLogin';
import TypeWriter from '@/components/TypeWriter';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteConfig } from '@/types/route';
import PageTransition from '@/components/PageTransition';

export const routeConfig: RouteConfig = {
    title: '登录',
    // icon: <StopOutlined />,
    layout: false,
    // hidden: true // 在菜单中隐藏
}


const LoginPage: React.FC = observer(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { UserStore, ConfigStore } = useStore();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<'account' | 'mobile' | 'qrcode'>('account');
    const [countdown, setCountdown] = useState(0);

    // 粒子背景初始化
    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
    };

    // 处理登录
    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            const response = await authService.login({
                ...values,
                loginType,
                remember: values.remember  // 确保这个值被传递到后端
            });

            // 确保返回的用户信息符合 UserStore 的要求
            const userInfo = {
                ...response.user,
                roles: response.user.roles || [],
                accessToken: response.token,
                dynamicRoutesList: response.user.dynamicRoutesList || [],
                permissions: response.user.permissions || []
            };

            UserStore.setUserInfo(userInfo);
            
            message.success(t('login.loginSuccess'));
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            message.error(t('login.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    // 发送验证码
    const handleSendCode = async () => {
        try {
            const mobile = form.getFieldValue('mobile');
            if (!mobile) {
                message.error(t('login.mobileRequired'));
                return;
            }

            await authService.sendVerificationCode(mobile, 'login');
            message.success(t('login.smsSent'));
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
            message.error(t('login.smsFailed'));
        }
    };

    // 登录方式配置
    const loginOptions = [
        {
            value: 'account',
            icon: <UserOutlined />,
            label: t('login.accountLogin')
        },
        {
            value: 'mobile',
            icon: <MobileOutlined />,
            label: t('login.mobileLogin')
        },
        {
            value: 'qrcode',
            icon: <QrcodeOutlined />,
            label: t('login.qrCodeLogin')
        }
    ];

    // 渲染登录表单
    const renderLoginForm = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={loginType}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                        duration: 0.3,
                        ease: "easeInOut"
                    }}
                >
                    {loginType === 'account' && <AccountLogin />}
                    {loginType === 'mobile' && (
                        <PhoneLogin 
                            countdown={countdown} 
                            onSendCode={handleSendCode} 
                        />
                    )}
                    {loginType === 'qrcode' && <QrCodeLogin />}
                </motion.div>
            </AnimatePresence>
        );
    };

    // 渲染主要内容
    const renderMainContent = () => {
        return (
            <>
                <div className="header-section">
                    <img src={logo} alt="Logo" className="logo" />
                    <TypeWriter text="Coffee Admin" loop={true} loopDelay={2000} />
                    <p className="subtitle">{t('login.subtitle')}</p>
                </div>

                <Segmented
                    block
                    className="login-segment"
                    value={loginType}
                    onChange={(value) => setLoginType(value as typeof loginType)}
                    options={loginOptions}
                />

                <Form
                    form={form}
                    onFinish={handleLogin}
                    className="login-form"
                    initialValues={{ remember: true }}
                >
                    {renderLoginForm()}

                    <div className="form-footer">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t('login.rememberMe')}</Checkbox>
                        </Form.Item>
                        <div className="flex items-center space-x-4">
                            <a 
                                className="register-link" 
                                onClick={() => navigate('/auth/register')}
                                style={{ cursor: 'pointer' }}
                            >
                                {t('login.register')}
                            </a>

                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                            <a 
                                className="forgot-password"
                                onClick={() => navigate('/auth/forgot-password')}
                                style={{ cursor: 'pointer' }}
                            >
                                {t('login.forgotPassword')}
                            </a>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className="submit-button"
                        loading={loading}
                    >
                        {t('login.loginButton')}
                    </Button>
                </Form>
            </>
        );
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

                    <div className="absolute top-4 right-4 flex items-center space-x-3">
                        <LanguageSwitch />
                        <button
                            className="theme-switch"
                            onClick={() => ConfigStore.setThemeMode(ConfigStore.isDark ? 'light' : 'dark')}
                        >
                            {ConfigStore.isDark ? (
                                <SunOutlined className="text-amber-500" />
                            ) : (
                                <MoonOutlined className="text-blue-500" />
                            )}
                        </button>
                    </div>

                    <div className="login-form-container">
                        {renderMainContent()}
                    </div>

                    <div className="copyright">
                        Copyright © {new Date().getFullYear()} Coffee Admin
                    </div>
                </div>
            </div>
        </PageTransition>
    );
});

export default LoginPage;