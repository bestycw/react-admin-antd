import React from 'react';
import { Form, Input, Button } from 'antd';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface PhoneLoginProps {
  countdown: number;
  onSendCode: () => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ countdown, onSendCode }) => {
  const { t } = useTranslation();

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
          onClick={onSendCode}
        >
          {countdown > 0 ? `${countdown}s` : t('login.sendCode')}
        </Button>
      </div>
    </div>
  );
};

export default PhoneLogin; 