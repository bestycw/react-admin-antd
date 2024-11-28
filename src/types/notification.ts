export interface NotificationSetting {
  type: string;
  [key: string]: string | boolean;
  email: boolean;
  browser: boolean;
  mobile: boolean;
} 