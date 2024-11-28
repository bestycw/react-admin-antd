export interface NotificationSetting {
  type: string;
  email: boolean;
  browser: boolean;
  mobile: boolean;
  [key: string]: string | boolean;
}

export type NotificationMode = 'all' | 'important' | 'none'; 