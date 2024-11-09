import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, IOptions, RecursivePartial } from "tsparticles-engine";
import { useCallback, useState } from "react";
import logo from "../../assets/logo.svg";
import GlobalConfig  from '../../config/GlobalConfig'
import TypeWriter from '../../components/TypeWriter';
import Captcha from '../../components/Captcha';

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
  const { UserStore, AuthStore } = useStore();
  const {AdminName} = GlobalConfig
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const [captchaCode, setCaptchaCode] = useState('');

  const onFinish = (values: LoginForm) => {
    if (values.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      message.error('验证码错误！');
      return;
    }
    
    console.log('登录信息:', values);
    UserStore.setUserInfo({
      name: values.username,
      accessToken: '1234567890',
      roles: ['admin'],
      rolesValue: 0,
    });
    AuthStore.setIsLogin(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Particles
        className="absolute inset-0"
        init={particlesInit}
        options={ParticlesOptions}
      />

      <div className="flex flex-col items-center z-10">
        <div className="modern-glass p-8 rounded-xl w-96 mb-4">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="mx-auto mb-4 h-16 w-auto" />
            <h2 className="typewriter-text">
              <TypeWriter text={AdminName} delay={150} />
            </h2>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            size="large"
            initialValues={{ remember: false }}
            className="space-y-4"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入用户名"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <div className="flex space-x-2">
                <Input
                  placeholder="请输入验证码"
                  className="login-input"
                />
                <Captcha
                  width={120}
                  height={40}
                  onChange={code => setCaptchaCode(code)}
                />
              </div>
            </Form.Item>

            <div className="flex justify-between items-center -mt-2 mb-4">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox className="text-white">7天免登录</Checkbox>
              </Form.Item>
              <a
                className="text-white hover:text-blue-200 text-sm"
                onClick={() => console.log('忘记密码')}
              >
                忘记密码？
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 transition-all duration-300"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div className="text-slate-300 text-sm">
          <p>Copyright © {new Date().getFullYear()} {GlobalConfig.AdminName}. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
});

export default Login;