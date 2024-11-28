import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface RegisterFormProps {
    countdown: number;
    onSendCode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ countdown, onSendCode }) => {
    const { t } = useTranslation();

    return (
        <div className="form-item-group">
            <Form.Item
                name="username"
                rules={[{ required: true, message: t('register.usernameRequired') }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder={t('register.usernamePlaceholder')}
                    className="login-input"
                />
            </Form.Item>

            <Form.Item
                name="mobile"
                rules={[{ required: true, message: t('register.mobileRequired') }]}
            >
                <Input
                    prefix={<MobileOutlined />}
                    placeholder={t('register.mobilePlaceholder')}
                    className="login-input"
                />
            </Form.Item>

            <div className="captcha-container">
                <Form.Item
                    name="verificationCode"
                    rules={[{ required: true, message: t('register.smsRequired') }]}
                    className="captcha-input"
                >
                    <Input
                        prefix={<LockOutlined />}
                        placeholder={t('register.smsPlaceholder')}
                        className="login-input"
                    />
                </Form.Item>
                <Button
                    className="verification-code-button"
                    disabled={countdown > 0}
                    onClick={onSendCode}
                >
                    {countdown > 0 ? `${countdown}s` : t('register.sendCode')}
                </Button>
            </div>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: t('register.passwordRequired') },
                    { min: 6, message: t('register.passwordMinLength') }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('register.passwordPlaceholder')}
                    className="login-input"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: t('register.confirmPasswordRequired') },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error(t('register.passwordNotMatch')));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    className="login-input"
                />
            </Form.Item>
        </div>
    );
};

export default RegisterForm; 