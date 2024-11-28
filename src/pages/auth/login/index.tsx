import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  QrcodeOutlined,
  LoginOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import {
  Form,
  Input,
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
import Captcha from '@/components/Captcha';
import LanguageSwitch from '@/components/LanguageSwitch';
import logo from '@/assets/logo.svg';
import './index.scss';

interface LoginForm {
  username: string;
  password: string;
  mobile: string;
  verificationCode: string;
  captcha: string;
  remember: boolean;
}

const LoginPage: React.FC = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { UserStore, ConfigStore } = useStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'account' | 'mobile' | 'qrcode'>('account');
  const [countdown, setCountdown] = useState(0);
//   const isDynamic = ConfigStore.themeStyle === 'dynamic';

  // 粒子背景初始化
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  // 处理登录
  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await authService.login({
        ...values,
        loginType
      });
      UserStore.setUserInfo(response.user);
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
    switch (loginType) {
      case 'account':
        return (
          <div className="form-item-group">
            <Form.Item
              name="username"
              rules={[{ required: true, message: t('login.usernameRequired') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('login.usernamePlaceholder')}
                className="login-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('login.passwordPlaceholder')}
                className="login-input"
              />
            </Form.Item>
            <div className="captcha-container">
              <Form.Item
                name="captcha"
                rules={[{ required: true, message: t('login.captchaRequired') }]}
                className="captcha-input"
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder={t('login.captchaPlaceholder')}
                  className="login-input"
                />
              </Form.Item>
              <Captcha onChange={(code) => {
                // 只显示验证码，不自动填入
                console.log('验证码:', code);
              }} />
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="form-item-group">
            <Form.Item
              name="mobile"
              rules={[{ required: true, message: t('login.mobileRequired') }]}
            >
              <Input
                prefix={<MobileOutlined />}
                placeholder={t('login.mobilePlaceholder')}
                className="login-input"
              />
            </Form.Item>
            <div className="captcha-container">
              <Form.Item
                name="verificationCode"
                rules={[{ required: true, message: t('login.smsRequired') }]}
                className="captcha-input"
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder={t('login.smsPlaceholder')}
                  className="login-input"
                />
              </Form.Item>
              <Button
                className="verification-code-button"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}s` : t('login.sendCode')}
              </Button>
            </div>
          </div>
        );
      case 'qrcode':
        return (
          <div className="qrcode-container">
            <div className="qrcode-wrapper">
              <div className="qrcode-content">
                {/* QR Code content */}
              </div>
            </div>
            <div className="qrcode-tip">
              {t('login.scanQrcode')}
            </div>
          </div>
        );
    }
  };

  return (
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
          <div className="header-section">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">{t('login.title')}</h1>
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
              <a className="forgot-password" href="#/auth/reset-password">
                {t('login.forgotPassword')}
              </a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              loading={loading}
              icon={<LoginOutlined />}
            >
              {t('login.loginButton')}
            </Button>
          </Form>

          <div className="action-buttons">
            <a href="#/auth/register" className="action-button">
              {t('login.register')}
            </a>
          </div>
        </div>

        <div className="copyright">
          Copyright © {new Date().getFullYear()} Coffee Admin
        </div>
      </div>
    </div>
  );
});

export default LoginPage;