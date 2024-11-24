import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, SunOutlined, MoonOutlined, LoginOutlined } from '@ant-design/icons';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, IOptions, RecursivePartial } from "tsparticles-engine";
import { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.svg";
import getGlobalConfig from '../../config/GlobalConfig'
import TypeWriter from '../../components/TypeWriter';
import Captcha from '../../components/Captcha';
import { authService } from '../../services/auth';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '../../components/LanguageSwitch';
import './index.scss';
import type { RouteConfig } from '@/types/route'

// 路由配置
export const routeConfig: RouteConfig = {
    title: '登录',
    icon: <LoginOutlined />,
    layout: false,
    auth: false,
    sort: 999 // 放在最后
}

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  remember?: boolean;
}
const ParticlesOptions:RecursivePartial<IOptions> = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#94a3b8",
    },
    links: {
      color: "#94a3b8",
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
}
const Login = observer(() => {
  const { UserStore, ConfigStore } = useStore();
  // const { AdminName } = GlobalConfig;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isDynamic = ConfigStore.themeStyle === 'dynamic'
  console.log('login init')
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const [captchaCode, setCaptchaCode] = useState('');

  const onFinish = async (values: LoginForm) => {
    if (values.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      message.error(t('login.captchaError'));
      return;
    }
    
    setLoading(true);
    try {
      // 1. 登录获取用户信息
      const userInfo = await authService.login(values);
      UserStore.setUserInfo(userInfo, values.remember);

      // 2. 获取动态路由
      // const routes = await UserStore.getDynamicRoutes();
      // UserStore.setDynamicRoutes(routes);

      message.success(t('login.loginSuccess'));
      // 4. 使用 replace 进行导航，避免历史记录
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      message.error(t('login.loginFailed'));
    } finally {
      setLoading(false);
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
            className={`
              w-10 h-10 flex items-center justify-center rounded-full transition-all
              ${isDynamic
                ? 'dynamic-bg dynamic-bg-hover'
                : 'classic-bg classic-bg-hover'
              }
              text-secondary
            `}
            onClick={() => ConfigStore.setThemeMode(ConfigStore.isDark ? 'light' : 'dark')}
          >
            {ConfigStore.isDark ? (
              <SunOutlined className="text-lg text-amber-500" />
            ) : (
              <MoonOutlined className="text-lg text-blue-500" />
            )}
          </button>
        </div>

        <div className="login-form-container">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="h-16 mx-auto mb-4" />
            <TypeWriter
              text={getGlobalConfig('AdminName')}
              className="artistic-text mb-2"
              loop={true}
              loopDelay={3000}
              speed={100}
              showCursor={false}
            />
            <p className="text-gray-600 dark:text-gray-400">{t('login.subtitle')}</p>
          </div>

          <Form
            name="login"
            autoComplete="off"
            onFinish={onFinish}
            className="login-form space-y-4"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: t('login.usernameRequired') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('login.usernamePlaceholder')}
                size="large"
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
                size="large"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <div className="captcha-container">
                <Form.Item
                  name="captcha"
                  noStyle
                  rules={[{ required: true, message: t('login.captchaRequired') }]}
                >
                  <Input
                    placeholder={t('login.captchaPlaceholder')}
                    size="large"
                    className="login-input captcha-input"
                  />
                </Form.Item>
                <Captcha onChange={setCaptchaCode} />
              </div>
            </Form.Item>

            <div className="login-form-footer flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600 dark:text-gray-400">
                  {t('login.rememberMe')}
                </Checkbox>
              </Form.Item>
              <a className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                {t('login.forgotPassword')}
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 
                  hover:from-blue-600 hover:to-indigo-700 border-none"
              >
                {t('login.loginButton')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="copyright">
        <p>Copyright © {new Date().getFullYear()} CoffeeAdmin. All Rights Reserved.</p>
      </div>
    </div>
  );
});

export default Login;