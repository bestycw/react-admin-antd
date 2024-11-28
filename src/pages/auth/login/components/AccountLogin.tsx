import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Captcha from '@/components/Captcha';

const AccountLogin: React.FC = () => {
  const { t } = useTranslation();

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
          console.log('验证码:', code);
        }} />
      </div>
    </div>
  );
};

export default AccountLogin; 