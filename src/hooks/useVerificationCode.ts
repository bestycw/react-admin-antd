import { useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth';
import { FormInstance } from 'antd';

export const useVerificationCode = (type: 'register' | 'reset') => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(0);

  const sendCode = async (mobile: string) => {
    if (!mobile) {
      message.error(t(`${type}.mobileRequired`));
      return;
    }

    try {
      const response = await authService.sendVerificationCode(mobile, type);
      
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

      // 在开发环境下自动填入验证码并显示
      if (process.env.NODE_ENV === 'development' && response.data?.verifyCode) {
        message.success(`验证码: ${response.data.verifyCode}`, 5);
        return response.data.verifyCode;
      }

      message.success(t(`${type}.smsSent`));
    } catch (error) {
      console.error('Send verification code failed:', error);
      message.error(t(`${type}.smsFailed`));
    }
  };

  return { countdown, sendCode };
}; 