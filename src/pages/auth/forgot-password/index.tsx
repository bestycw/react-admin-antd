import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import { ParticlesOptions } from '@/config/particles';
import { authService } from '@/services/auth';
import LanguageSwitch from '@/components/LanguageSwitch';
import TypeWriter from '@/components/TypeWriter';
import logo from '@/assets/logo.svg';
import '../login/index.scss';
import { RouteConfig } from '@/types/route';
import PageTransition from '@/components/PageTransition';
import MobileVerification from '@/components/MobileVerification';
import PasswordInput from '@/components/PasswordInput';
// import { useVerificationCode } from '@/hooks/useVerificationCode';

export const routeConfig: RouteConfig = {
    title: '忘记密码',
    layout: false,
    
}

const ForgotPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const { countdown, sendCode } = useVerificationCode('reset');

    const handleReset = async (values: any) => {
        setLoading(true);
        try {
            await authService.resetPassword({
                mobile: values.mobile,
                verificationCode: values.verificationCode,
                newPassword: values.password
            });
            message.success(t('reset.success'));
            navigate('/auth/login');
        } catch (error) {
            console.error('Reset password failed:', error);
            message.error(t('reset.failed'));
        } finally {
            setLoading(false);
        }
    };

    const particlesInit = async (engine: Engine) => {
        await loadSlim(engine);
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

                    <div className="absolute top-4 right-4">
                        <LanguageSwitch />
                    </div>

                    <div className="login-form-container">
                        <div className="header-section">
                            <img src={logo} alt="Logo" className="logo" />
                            <TypeWriter text="Coffee Admin" loop={true} loopDelay={2000} />
                            <p className="subtitle">{t('reset.subtitle')}</p>
                        </div>

                        <Form
                            form={form}
                            onFinish={handleReset}
                            className="login-form"
                        >
                            <div className="form-item-group">
                                <MobileVerification
                                    // onSendCode={sendCode}
                                    // countdown={countdown}
                                    type="reset"
                                    form={form}
                                />

                                <PasswordInput
                                    name="password"
                                />

                                <PasswordInput
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    isConfirm
                                />
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-button"
                                loading={loading}
                            >
                                {t('reset.submit')}
                            </Button>

                            <div className="text-center mt-4">
                                <a 
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                    onClick={() => navigate('/auth/login')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {t('reset.backToLogin')}
                                </a>
                            </div>
                        </Form>
                    </div>

                    <div className="copyright">
                        Copyright © {new Date().getFullYear()} Coffee Admin
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ForgotPasswordPage; 