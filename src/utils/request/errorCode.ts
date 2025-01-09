export const ErrorCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

export interface ErrorMessage {
  [key: number]: string;
}

export const DefaultErrorMessages: ErrorMessage = {
  [ErrorCode.BAD_REQUEST]: '请求参数错误',
  [ErrorCode.UNAUTHORIZED]: '账号密码错误，请重新登录',
  [ErrorCode.FORBIDDEN]: '拒绝访问',
  [ErrorCode.NOT_FOUND]: '请求错误，未找到该资源',
  [ErrorCode.INTERNAL_ERROR]: '服务器错误',
};

export const handleErrorMessage = (status: number): string => {
  return DefaultErrorMessages[status] || `未知错误 ${status}`;
}; 