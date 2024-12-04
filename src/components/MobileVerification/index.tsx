import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd';
import { authService } from '@/services/auth';

interface MobileVerificationProps {
  type: 'register' | 'reset' | 'login';
  form: FormInstance;
}

const MobileVerification: React.FC<MobileVerificationProps> = ({
  type,
  form
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    const mobile = form.getFieldValue('mobile');
    if (!mobile) {
      message.error(t(`${type}.mobileRequired`));
      return;
    }

    try {
      const response:any = await authService.sendVerificationCode(mobile, type);
      console.log(response)
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

      // 在开发环境下自动填入验证码
      if (process.env.NODE_ENV === 'development' && response?.verifyCode) {
        form.setFieldValue('verificationCode', response.verifyCode);
        message.success(`验证码: ${response.verifyCode}`, 5);
      } else {
        message.success(t(`${type}.smsSent`));
      }
    } catch (error) {
      console.error('Send verification code failed:', error);
      message.error(t(`${type}.smsFailed`));
    }
  };

  return (
    <>
      <Form.Item
        name="mobile"
        rules={[{ required: true, message: t(`${type}.mobileRequired`) }]}
      >
        <Input
          prefix={<MobileOutlined />}
          placeholder={t(`${type}.mobilePlaceholder`)}
          className="login-input"
        />
      </Form.Item>

      <div className="captcha-container">
        <Form.Item
          name="verificationCode"
          rules={[{ required: true, message: t(`${type}.smsRequired`) }]}
          className="captcha-input"
        >
          <Input
            prefix={<LockOutlined />}
            placeholder={t(`${type}.smsPlaceholder`)}
            className="login-input"
          />
        </Form.Item>
        <Button
          className="verification-code-button"
          disabled={countdown > 0}
          onClick={handleSendCode}
        >
          {countdown > 0 ? `${countdown}s` : t(`${type}.sendCode`)}
        </Button>
      </div>
    </>
  );
};

export default MobileVerification; 