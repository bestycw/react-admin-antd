// 密码验证规则
export interface PasswordRules {
  minLength?: number;      // 最小长度
  maxLength?: number;      // 最大长度
  requireNumber?: boolean; // 是否需要数字
  requireLower?: boolean;  // 是否需要小写字母
  requireUpper?: boolean;  // 是否需要大写字母
  requireSpecial?: boolean;// 是否需要特殊字符
}

// 默认密码规则
const defaultRules: PasswordRules = {
  minLength: 8,
  maxLength: 20,
  requireNumber: true,
  requireLower: true,
  requireUpper: true,
  requireSpecial: true
};

// 密码验证函数
export const validatePassword = (
  password: string,
  rules: PasswordRules = defaultRules
): { isValid: boolean; message: string } => {
  const {
    minLength = 8,
    maxLength = 20,
    requireNumber = true,
    requireLower = true,
    requireUpper = true,
    requireSpecial = true
  } = rules;

  // 长度验证
  if (password.length < minLength) {
    return { isValid: false, message: `密码长度不能少于${minLength}位` };
  }
  if (password.length > maxLength) {
    return { isValid: false, message: `密码长度不能超过${maxLength}位` };
  }

  // 数字验证
  if (requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: '密码必须包含数字' };
  }

  // 小写字母验证
  if (requireLower && !/[a-z]/.test(password)) {
    return { isValid: false, message: '密码必须包含小写字母' };
  }

  // 大写字母验证
  if (requireUpper && !/[A-Z]/.test(password)) {
    return { isValid: false, message: '密码必须包含大写字母' };
  }

  // 特殊字符验证
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: '密码必须包含特殊字符' };
  }

  return { isValid: true, message: '密码格式正确' };
};

// 获取密码强度
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  // 基础长度分数
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // 包含数字
  if (/\d/.test(password)) strength += 1;

  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 1;

  // 包含大写字母
  if (/[A-Z]/.test(password)) strength += 1;

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  return Math.min(strength, 5); // 最高5分
}; 