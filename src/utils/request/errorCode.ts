import { t } from 'i18next';
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
  [ErrorCode.BAD_REQUEST]: t('network.bad-request'),
  [ErrorCode.UNAUTHORIZED]: t('network.unauthorized'),
  [ErrorCode.FORBIDDEN]: t('network.forbidden'),
  [ErrorCode.NOT_FOUND]: t('network.not-found'),
  [ErrorCode.INTERNAL_ERROR]: t('network.internal-error'),
};

export const handleErrorMessage = (status: number): string => {
  return DefaultErrorMessages[status] || `未知错误 ${status}`;
}; 