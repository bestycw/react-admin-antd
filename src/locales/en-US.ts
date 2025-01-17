export default {
  login: {
    title: 'CoffeeAdmin',
    subtitle: 'Lightweight Admin System',
    usernamePlaceholder: 'Username/Mobile',
    mobilePlaceholder: 'Mobile',
    qrCodePlaceholder: 'QR Code',
    accountLogin: 'Account Login',
    mobileLogin: 'Mobile Login',
    qrCodeLogin: 'QR Code Login',
    smsPlaceholder: 'SMS Code',
    register: 'Register',
    sendCode: 'Send Code',
    scanQRCodeTip: 'Please scan the QR code with your mobile phone',
    backToLogin: 'Back to Login',
    passwordPlaceholder: 'Password',
    mobileRequired: 'Please input your mobile!',
    qrCodeRequired: 'Please scan the QR code!',
    smsRequired: 'Please input your SMS code!',
    verificationCodePlaceholder: 'Verification Code',
    usernameRequired: 'Please input your username or mobile!',
    passwordRequired: 'Please input your password!',
    captchaRequired: 'Please input verification code!',
    captchaError: 'Invalid verification code',
    rememberMe: 'Remember me for 7 days',
    forgotPassword: 'Forgot',
    loginButton: 'Login',
    scanQrcode: 'Scan QR Code',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed, please check your username and password!'
  },
  common: {
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode'
    },
    language: {
      zh: '简体中文',
      en: 'English'
    },
    actions: {
      expand: 'Expand',
      collapse: 'Collapse'
    },
    notification: 'Notification',
    search: 'Search',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    languageSwitch: 'Switch Language',
    settings: 'Settings',
    yes: 'Yes',
    no: 'No'
  },
  messages: {
    error: {
      networkError: 'Network error, please try again later',
      serverError: 'Server error, please try again later'
    }
  },
  register: {
    subtitle: 'Welcome to Coffee Admin',
    usernamePlaceholder: 'Username',
    mobilePlaceholder: 'Mobile Number',
    smsPlaceholder: 'SMS Code',
    passwordPlaceholder: 'Password',
    confirmPasswordPlaceholder: 'Confirm Password',
    usernameRequired: 'Please input your username',
    mobileRequired: 'Please input your mobile number',
    smsRequired: 'Please input SMS code',
    passwordRequired: 'Please input your password',
    confirmPasswordRequired: 'Please confirm your password',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordNotMatch: 'The two passwords do not match',
    agreement: 'I have read and agree to the',
    agreementLink: 'User Agreement',
    agreementRequired: 'Please read and agree to the user agreement',
    sendCode: 'Send Code',
    smsSent: 'Verification code sent',
    smsFailed: 'Failed to send verification code',
    submit: 'Register',
    success: 'Registration successful',
    failed: 'Registration failed',
    backToLogin: 'Back to Login'
  },
  reset: {
    subtitle: 'Reset Your Password',
    mobilePlaceholder: 'Mobile Number',
    smsPlaceholder: 'SMS Code',
    newPasswordPlaceholder: 'New Password',
    confirmPasswordPlaceholder: 'Confirm Password',
    mobileRequired: 'Please input your mobile number',
    smsRequired: 'Please input SMS code',
    newPasswordRequired: 'Please input new password',
    confirmPasswordRequired: 'Please confirm your password',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordNotMatch: 'The two passwords do not match',
    sendCode: 'Send Code',
    smsSent: 'Verification code sent',
    smsFailed: 'Failed to send verification code',
    submit: 'Reset Password',
    success: 'Password reset successful',
    failed: 'Password reset failed',
    backToLogin: 'Back to Login'
  },
  profile: {
    basicInfo: 'Basic Information',
    security: 'Security Settings',
    activity: 'Account Activity',
    notification: 'Notifications',
    apiAccess: 'API Access',
    username: 'Username',
    email: 'Email',
    mobile: 'Mobile',
    gender: 'Gender',
    genderOptions: {
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    birthday: 'Birthday',
    location: 'Location',
    bio: 'Bio',
    company: 'Company',
    position: 'Position',
    website: 'Website',
    uploadAvatar: 'Upload Avatar',
    cropAvatar: 'Crop Avatar',
    avatarTypeError: 'You can only upload JPG/PNG files',
    avatarSizeError: 'Image must be smaller than 2MB',
    avatarUpdateSuccess: 'Avatar updated successfully',
    avatarUpdateFailed: 'Failed to update avatar',
    save: 'Save',
    validation: {
      usernameRequired: 'Please enter username',
      usernameFormat: 'Username can only contain letters, numbers and underscores, length 3-20',
      emailRequired: 'Please enter email',
      emailFormat: 'Please enter a valid email',
      mobileRequired: 'Please enter mobile number',
      mobileFormat: 'Please enter a valid mobile number',
      bioMaxLength: 'Bio cannot exceed 200 characters',
      websiteFormat: 'Please enter a valid URL'
    },
    oldPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    changePassword: 'Change Password',
    updateSuccess: 'Update successful',
    updateFailed: 'Update failed',
    passwordChanged: 'Password changed successfully',
    passwordChangeFailed: 'Failed to change password',
    invalidMobile: 'Please enter a valid mobile number',
    twoFactor: 'Two-Factor Authentication',
    loginDevices: 'Login Devices',
    notificationSettings: 'Notification Settings',
    loginHistory: 'Login History',
    operationLog: 'Operation Log',
    apiTokens: 'API Tokens',
    webhooks: 'Webhooks',
    loginDays: 'Login Days',
    lastActive: 'Last Active',
    deviceInfo: {
      browser: 'Browser',
      os: 'Operating System',
      ip: 'IP Address',
      location: 'Location',
      time: 'Login Time'
    },
    notificationTypes: {
      all: 'All Notifications',
      system: 'System',
      security: 'Security',
      activity: 'Activity'
    },
    apiTokenSettings: {
      create: 'Create Token',
      name: 'Token Name',
      token: 'Token',
      permissions: 'Permissions',
      expiresAt: 'Expires At',
      lastUsed: 'Last Used',
      created: 'Created',
      status: 'Status',
      active: 'Active',
      expired: 'Expired',
      revoked: 'Revoked'
    },
    webhookSettings: {
      create: 'Create Webhook',
      url: 'Callback URL',
      secret: 'Secret',
      events: 'Event Types',
      status: 'Status',
      lastDelivery: 'Last Delivery',
      deliveryStatus: 'Delivery Status'
    }
  },
  user: {
    profile: 'Profile',
    logout: 'Logout',
    defaultName: 'User'
  },
  route: {
    dashboard: 'Dashboard',
    
    table: 'Table',
    'table.basic': 'Basic Table',
    'table.advanced': 'Advanced Table',
    'table.draggable': 'Draggable Table',
    'table.tree': 'Tree Table',
    'table.editable': 'Editable Table',
    'table.adaptive': 'Adaptive Table',
    'table.virtual': 'Virtual Scroll Table',
    'table.draggable.row': 'Row Draggable',
    'table.draggable.column': 'Column Draggable',
    
    form: 'Form',
    'form.basic': 'Basic Form',
    'form.step': 'Step Form',
    'form.search': 'Search Form',
    'form.advanced': 'Advanced Form',
    
    editor: 'Editor',
    'editor.code': 'Code Editor',
    'editor.rich': 'Rich Text',
    'editor.image': 'Image Editor', 
    'editor.json': 'JSON Editor',
    
    function: 'Function',
    'function.lazy-image': 'Lazy Image',
    'function.btn-permission': 'Button Permission',
    'function.flow': 'Flow Chart',
    'function.carousel': 'Carousel',
    'function.loading': 'Loading',
    'function.split': 'Split Panel',
    'function.waterfall': 'Waterfall',
    'function.draggable': 'Draggable',
    'function.charts': 'Charts',
    'function.split-panel': 'Split Panel',
    system: 'System',
    'system.user': 'User Management',
    'system.role': 'Role Management',
    'system.menu': 'Menu Management',
    'system.dept': 'Department Management',
    
    network: 'Network',
    'network.basic': 'Basic Network',
    'network.advanced': 'Advanced Network',
    
    profile: 'Profile',
    'profile.basic': 'Basic Profile',
    'profile.advanced': 'Advanced Profile',
    
    error: 'Error',
    'error.403': '403',
    'error.404': '404',
    'error.500': '500',
    'error.network-error': 'Network error, please check network connection',
    auth: 'Auth',
    'auth.login': 'Login',
    'auth.register': 'Register'
  },
  network:{
    'network-error': 'Network error, please check network connection',
    'bad-request': '400 Bad Request',
    'unauthorized': '401 Unauthorized',
    'forbidden': '403 Forbidden',
    'not-found': '404 Not Found',
    'internal-error': '500 Internal Server Error',
    'request-canceled-or-timeout': 'Request canceled or timeout'
  }
} 
