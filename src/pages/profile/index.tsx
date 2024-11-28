import React, { useEffect, useState } from 'react';
import { Card, Menu, Form, Input, Button, message, Avatar, Badge, Statistic, DatePicker, Radio } from 'antd';
import { 
  UserOutlined, 
  SecurityScanOutlined,
  BellOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import type { MenuProps } from 'antd';
import DeviceManager from '@/pages/profile/components/DeviceManager';
import ApiTokenManager from '@/pages/profile/components/ApiTokenManager';
import NotificationSettings from '@/pages/profile/components/NotificationSettings';
import PasswordInput from '@/components/PasswordInput';
import PageTransition from '@/components/PageTransition';
import AvatarUpload from '@/components/AvatarUpload';
import classNames from 'classnames';
import { validateEmail, validateMobile, validateUrl } from '@/utils/validator';

const Profile: React.FC = observer(() => {
  const { t } = useTranslation();
  const { UserStore } = useStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState('basic');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    UserStore.fetchDevices();
    UserStore.fetchApiTokens();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      await UserStore.updateProfile(values);
      message.success(t('profile.updateSuccess'));
    } catch (error) {
      message.error(t('profile.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await UserStore.changePassword(values.oldPassword, values.newPassword);
      message.success(t('profile.passwordChanged'));
      form.resetFields(['oldPassword', 'newPassword', 'confirmPassword']);
    } catch (error) {
      message.error(t('profile.passwordChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: RcFile) => {
    try {
      const response = await authService.uploadAvatar(file);
      message.success(t('profile.avatarUpdateSuccess'));
      return false;
    } catch (error) {
      message.error(t('profile.avatarUpdateFailed'));
      return Upload.LIST_IGNORE;
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'basic',
      icon: <UserOutlined />,
      label: t('profile.basicInfo'),
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: t('profile.security'),
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      label: t('profile.notification'),
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: t('profile.apiAccess'),
    }
  ];

  const renderBasicInfoForm = () => (
    <Form
      layout="vertical"
      initialValues={UserStore.userInfo || {}}
      onFinish={handleProfileUpdate}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="username"
          label={t('profile.username')}
          rules={[
            { required: true, message: t('profile.validation.usernameRequired') },
            { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: t('profile.validation.usernameFormat') }
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label={t('profile.email')}
          rules={[
            { required: true, message: t('profile.validation.emailRequired') },
            { validator: validateEmail, message: t('profile.validation.emailFormat') }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="mobile"
          label={t('profile.mobile')}
          rules={[
            { required: true, message: t('profile.validation.mobileRequired') },
            { validator: validateMobile, message: t('profile.validation.mobileFormat') }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label={t('profile.gender')}
        >
          <Radio.Group>
            <Radio value="male">{t('profile.genderOptions.male')}</Radio>
            <Radio value="female">{t('profile.genderOptions.female')}</Radio>
            <Radio value="other">{t('profile.genderOptions.other')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="birthday"
          label={t('profile.birthday')}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="location"
          label={t('profile.location')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label={t('profile.company')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label={t('profile.position')}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="website"
          label={t('profile.website')}
          rules={[
            { validator: validateUrl, message: t('profile.validation.websiteFormat') }
          ]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="bio"
        label={t('profile.bio')}
        rules={[
          { max: 200, message: t('profile.validation.bioMaxLength') }
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t('profile.save')}
        </Button>
      </Form.Item>
    </Form>
  );

  const renderContent = () => {
    switch (activeKey) {
      case 'basic':
        return (
          <Card className="shadow-sm">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 flex justify-center">
                <AvatarUpload
                  value={UserStore.userInfo?.avatar}
                  onChange={(url) => UserStore.updateProfile({ avatar: url })}
                />
              </div>
              {renderBasicInfoForm()}
            </div>
          </Card>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <Card title={t('profile.changePassword')} className="shadow-sm">
              <div className="max-w-2xl mx-auto">
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handlePasswordChange}
                >
                  <PasswordInput name="oldPassword" />
                  <PasswordInput
                    name="newPassword"
                    onChange={(strength) => console.log('Password strength:', strength)}
                  />
                  <PasswordInput
                    name="confirmPassword"
                    isConfirm
                    dependencies={['newPassword']}
                  />

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {t('profile.changePassword')}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>

            <Card title={t('profile.loginDevices')} className="shadow-sm">
              <DeviceManager
                devices={UserStore.devices}
                onRevokeAccess={UserStore.revokeDevice}
              />
            </Card>
          </div>
        );
      case 'notification':
        return (
          <NotificationSettings
            settings={UserStore.notificationSettings}
            onSettingChange={UserStore.updateNotificationSetting}
            notificationMode={UserStore.notificationMode}
            onModeChange={UserStore.setNotificationMode}
          />
        );
      case 'api':
        return (
          <Card className="shadow-sm">
            <ApiTokenManager
              tokens={UserStore.apiTokens}
              onCreateToken={UserStore.createApiToken}
              onRevokeToken={UserStore.revokeApiToken}
            />
          </Card>
        );
      default:
        return null;
    }
  };

  const UserInfoCard = () => (
    <Card bordered={false} className={classNames(
      "bg-white dark:bg-gray-800",
      { "sticky top-0": !isMobile }
    )}>
      <div className={classNames(
        "flex",
        isMobile ? "flex-row items-center" : "flex-col items-center"
      )}>
        <div className={classNames(
          isMobile ? "mr-4" : "mb-6",
          "flex-shrink-0"
        )}>
          <Badge count={5} offset={[-5, 5]}>
            <Avatar 
              size={isMobile ? 64 : 100}
              src={UserStore.userInfo?.avatar}
              icon={<UserOutlined />}
              className="shadow-lg"
            />
          </Badge>
        </div>
        <div className={classNames(
          "flex-grow",
          isMobile ? "text-left" : "text-center mb-6"
        )}>
          <h3 className="text-lg font-medium">{UserStore.userInfo?.username}</h3>
          <p className="text-gray-500">{UserStore.userInfo?.email}</p>
          <div className={classNames(
            "grid gap-4 mt-4",
            isMobile ? "grid-cols-2" : "grid-cols-2"
          )}>
            <Statistic title={t('profile.loginDays')} value={365} />
            <Statistic title={t('profile.lastActive')} value="2h" />
          </div>
        </div>
      </div>

      <Menu
        mode={isMobile ? "horizontal" : "inline"}
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => setActiveKey(key)}
        className={isMobile ? "mt-4 border-t" : "mt-6"}
      />
    </Card>
  );

  return (
    <PageTransition>
      <div>
        <div className={classNames(
          "flex",
          isMobile ? "flex-col space-y-4" : "flex-row gap-6"
        )}>
          {/* 左侧/顶部面板 */}
          <div className={classNames(
            isMobile ? "w-full" : "w-64 flex-shrink-0"
          )}>
            <UserInfoCard />
          </div>

          {/* 右侧/底部内容 */}
          <div className="flex-1">
            <Card bordered={false} className="bg-white dark:bg-gray-800">
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
});

export default Profile; 
