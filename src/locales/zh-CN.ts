export default {
  login: {
    title: 'CoffeeAdmin',
    subtitle: '轻量级后台管理系统',
    accountLogin: '账号登录',
    mobileLogin: '手机登录',
    qrCodeLogin: '二维码登录',
    register: '注册',
    scanQRCodeTip: '请使用手机扫描二维码登录',
    backToLogin: '返回登录',
    mobilePlaceholder: '手机号',
    qrCodePlaceholder: '二维码',
    smsPlaceholder: '短信验证码',
    verificationCodePlaceholder: '验证码',
    mobileRequired: '请输入手机号',
    qrCodeRequired: '请扫描二维码',
    smsRequired: '请输入短信验证码',
    
    sendCode: '发送验证码',
    scanQrcode: '扫描二维码',
    // qrCodeLogin: '二维码登录',
    usernamePlaceholder: '请输入用户名/手机号',
    passwordPlaceholder: '请输入密码',
    captchaPlaceholder: '请输入验证码',
    usernameRequired: '请输入用户名/手机号',
    passwordRequired: '请输入密码',
    captchaRequired: '请输入验证码',
    captchaError: '验证码错误',
    rememberMe: '7天内免登录',
    forgotPassword: '忘记密码？',
    loginButton: '登录',
    loginSuccess: '登录成功！',
    loginFailed: '登录失败，请检查用户名和密码！'
  },
  common: {
    theme: {
      light: '浅色模式',
      dark: '深色模式'
    },
    language: {
      zh: '简体中文',
      en: 'English'
    },
    actions: {
      expand: '展开',
      collapse: '收起'
    },
    notification: '通知',
    search: '搜索',
    fullscreen: '全屏显示',
    exitFullscreen: '退出全屏',
    languageSwitch: '切换语言',
    settings: '系统设置',
    yes: '确定',
    no: '取消'
  },
  messages: {
    error: {
      networkError: '网络错误，请稍后重试',
      serverError: '服务器错误，请稍后重试'
    }
  },
  register: {
    subtitle: '欢迎注册 Coffee Admin',
    usernamePlaceholder: '请输入用户名',
    mobilePlaceholder: '请输入手机号',
    smsPlaceholder: '请输入短信验证码',
    passwordPlaceholder: '请输入密码',
    confirmPasswordPlaceholder: '请确认密码',
    usernameRequired: '请输入用户名',
    mobileRequired: '请输入手机号',
    smsRequired: '请输入短信验证码',
    passwordRequired: '请输入密码',
    confirmPasswordRequired: '请确认密码',
    passwordMinLength: '密码长度不能小于6位',
    passwordNotMatch: '两次输入的密码不一致',
    agreement: '我已阅读并同意',
    agreementLink: '《用户协议》',
    agreementRequired: '请阅读并同意用户协议',
    sendCode: '发送验证码',
    smsSent: '验证码已发送',
    smsFailed: '验证码发送失败',
    submit: '注册',
    success: '注册成功',
    failed: '注册失败',
    backToLogin: '返回登录',
    passwordRules: {
      minLength: '密码长度不能少于{length}位',
      maxLength: '密码长度不能超过{length}位',
      requireNumber: '密码必须包含数字',
      requireLower: '密码必须包含小写字母',
      requireUpper: '密码必须包含大写字母',
      requireSpecial: '密码必须包含特殊字符'
    },
    passwordStrength: {
      veryWeak: '极弱',
      weak: '弱',
      medium: '中等',
      strong: '强',
      veryStrong: '极强'
    },
    passwordRequirements: {
      title: '密码要求',
      length: '长度在8-20个字符之间',
      number: '必须包含数字',
      upper: '必须包含大写字母',
      lower: '必须包含小写字母',
      special: '必须包含特殊字符'
    }
  },
  reset: {
    subtitle: '重置您的密码',
    mobilePlaceholder: '请输入手机号',
    smsPlaceholder: '请输入短信验证码',
    newPasswordPlaceholder: '请输入新密码',
    confirmPasswordPlaceholder: '请确认新密码',
    mobileRequired: '请输入手机号',
    smsRequired: '请输入短信验证码',
    newPasswordRequired: '请输入新密码',
    confirmPasswordRequired: '请确认新密码',
    passwordMinLength: '密码长度不能小于6位',
    passwordNotMatch: '两次输入的密码不一致',
    sendCode: '发送验证码',
    smsSent: '验证码已发送',
    smsFailed: '验证码发送失败',
    submit: '重置密码',
    success: '密码重置成功',
    failed: '密码重置失败',
    backToLogin: '返回登录'
  },
  profile: {
    basicInfo: '基本信息',
    security: '安全设置',
    activity: '账号动态',
    notification: '通知设置',
    apiAccess: 'API 访问',
    username: '用户名',
    email: '邮箱',
    mobile: '手机号',
    gender: '性别',
    genderOptions: {
      male: '男',
      female: '女',
      other: '其他'
    },
    birthday: '生日',
    location: '所在地',
    bio: '个人简介',
    company: '公司',
    position: '职位',
    website: '个人网站',
    uploadAvatar: '上传头像',
    cropAvatar: '裁剪头像',
    avatarTypeError: '只能上传 JPG/PNG 格式的图片',
    avatarSizeError: '图片大小不能超过 2MB',
    avatarUpdateSuccess: '头像更新成功',
    avatarUpdateFailed: '头像更新失败',
    save: '保存',
    validation: {
      usernameRequired: '请输入用户名',
      usernameFormat: '用户名只能包含字母、数字、下划线，长度3-20位',
      emailRequired: '请输入邮箱',
      emailFormat: '请输入正确的邮箱格式',
      mobileRequired: '请输入手机号',
      mobileFormat: '请输入正确的手机号格式',
      bioMaxLength: '个人简介不能超过200字',
      websiteFormat: '请输入正确的网址格式'
    },
    oldPassword: '原密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    changePassword: '修改密码',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    passwordChanged: '密码修改成功',
    passwordChangeFailed: '密码修改失败',
    invalidMobile: '请输入正确的手机号',
    twoFactor: '两步验证',
    loginDevices: '登录设备',
    notificationSettings: '通知设置',
    loginHistory: '登录历史',
    operationLog: '操作记录',
    apiTokens: 'API 令牌',
    webhooks: 'Webhook 设置',
    loginDays: '登录天数',
    lastActive: '最近活跃',
    deviceInfo: {
      browser: '浏览器',
      os: '操作系统',
      ip: 'IP 地址',
      location: '登录地点',
      time: '登录时间',
      current: '当前设备',
      lastActive: '最后活跃',
      revokeAccess: '撤销访问',
      revokeConfirm: '确定要撤销此设备的访问权限吗？'
    },
    notificationTypes: {
      all: '所有通知',
      system: '系统通知',
      security: '安全通知',
      activity: '活动通知'
    },
    apiTokenSettings: {
      create: '创建令牌',
      name: '令牌名称',
      token: '令牌',
      permissions: '权限',
      expiresAt: '过期时间',
      lastUsed: '最后使用',
      created: '创建时间',
      status: '状态',
      active: '生效中',
      expired: '已过期',
      revoked: '已撤销'
    },
    webhookSettings: {
      create: '创建 Webhook',
      url: '回调 URL',
      secret: '密钥',
      events: '事件类型',
      status: '状态',
      lastDelivery: '最后推送',
      deliveryStatus: '推送状态'
    }
  },
  user: {
    profile: '个人信息',
    logout: '退出登录',
    defaultName: '用户',
    actions: {
      notification: {
        title: '通知中心',
        unread: '{count} 条未读消息'
      },
      search: {
        title: '全局搜索',
        placeholder: '搜索...'
      },
      settings: {
        title: '系统设置',
        theme: '主题设置',
        language: '语言设置',
        other: '其他设置'
      }
    }
  },
  route: {
    // 仪表盘
    dashboard: '仪表盘',
    
    // 表格页面
    table: '表格页',
    'table.basic': '基础表格',
    'table.advanced': '高级表格',
    'table.draggable': '拖拽表格',
    'table.tree': '树形表格',
    'table.editable': '可编辑表格',
    'table.adaptive': '自适应表格',
    // 'table.draggable': '拖拽表格',
    'table.virtual': '虚拟滚动表格',
    'table.draggable.row': '行拖拽',
    'table.draggable.column': '列拖拽',
    
    // 表单页面
    form: '表单页',
    'form.basic': '基础表单',
    'form.step': '分步表单',
    'form.search': '搜索表单',
    'form.advanced': '高级表单',
    
    // 编辑器
    editor: '编辑器',
    'editor.code': '代码编辑器',
    'editor.rich': '富文本',
    'editor.image': '图片编辑器',
    'editor.json': 'JSON编辑器',
    
    // 功能
    function: '功能',
    'function.lazy-image': '图片懒加载',
    'function.btn-permission': '按钮权限',
    'function.flow': '流程图',
    'function.carousel': '轮播图',
    'function.loading': '加载动画',
    'function.split': '分割面板',
    'function.waterfall': '瀑布流',
    'function.draggable': '拖拽',
    'function.charts': '图表',
    'function.split-panel': '分割面板',

    // 系统管理
    system: '系统管理',
    'system.user': '用户管理',
    'system.role': '角色管理',
    'system.menu': '菜单管理',
    'system.dept': '部门管理',
    
    // 网络请求
    network: '网络请求',
    'network.basic': '基础网络',
    'network.advanced': '高级网络',
    
    // 个人页面
    profile: '个人页',
    'profile.basic': '基础详情页',
    'profile.advanced': '高级详情页',
    
    // 错误页面
    error: '错误页',
    'error.403': '403',
    'error.404': '404',
    'error.500': '500',
    // 认证页面
    auth: '认证页',
    'auth.login': '登录',
    'auth.register': '注册'
  },
  network:{
    'network-error': '网络错误，请检查网络连接',
    'bad-request': '400 请求参数错误',
    'unauthorized': '401 账号密码错误，请重新登录',
    'forbidden': '403 拒绝访问',
    'not-found': '404 请求错误，未找到该资源',
    'internal-error': '500 服务器错误',
    'request-canceled-or-timeout': '请求已取消或超时'
  }
} 
