import React from 'react';
import { Form, Input, Tooltip } from 'antd';
import type { Rule } from 'antd/es/form';
import { LockOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { validatePassword, getPasswordStrength } from '@/utils/validator';

interface PasswordInputProps {
  name: string;
  dependencies?: string[];
  isConfirm?: boolean;
  onChange?: (strength: number) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  dependencies,
  isConfirm,
  onChange
}) => {
  const { t } = useTranslation();

  const rules = isConfirm ? [
    { required: true, message: t('register.confirmPasswordRequired') },
    ({ getFieldValue }: { getFieldValue: (field: string) => string }) => ({
      validator(_: any, value: any) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(t('register.passwordNotMatch')));
      },
    }),
  ] : [
    { required: true, message: t('register.passwordRequired') },
    {
      validator: async (_: any, value: any) => {
        if (!value) return Promise.resolve();
        const result = validatePassword(value);
        if (!result.isValid) {
          return Promise.reject(new Error(result.message));
        }
        return Promise.resolve();
      }
    }
  ];

  return (
    <Form.Item
      name={name}
      dependencies={dependencies}
      rules={rules}
    >
      <div className="relative flex items-center">
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t(isConfirm ? 'register.confirmPasswordPlaceholder' : 'register.passwordPlaceholder')}
          className="login-input"
          onChange={(e) => {
            if (!isConfirm && onChange) {
              onChange(getPasswordStrength(e.target.value));
            }
          }}
        />
        {!isConfirm && (
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
        )}
      </div>
    </Form.Item>
  );
};

export default PasswordInput; 