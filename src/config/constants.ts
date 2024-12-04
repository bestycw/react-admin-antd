// 响应式布局断点
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  WIDE: 1600
} as const;

// 分页相关
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
  MAX_PAGES_SHOW: 5
} as const;

// 时间相关（毫秒）
export const TIME = {
  TOKEN_EXPIRE: 2 * 60 * 60 * 1000,      // token过期时间：2小时
  REFRESH_TOKEN_EXPIRE: 7 * 24 * 60 * 60 * 1000,  // 刷新token过期时间：7天
  TOKEN_REFRESH_AHEAD: 5 * 60 * 1000,    // token提前刷新时间：5分钟
  DEBOUNCE_WAIT: 300,                    // 防抖等待时间：300ms
  THROTTLE_WAIT: 500                     // 节流等待时间：500ms
} as const;

// 文件上传限制
export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,            // 最大文件大小：5MB
  IMAGE_MAX_SIZE: 2 * 1024 * 1024,      // 图片最大大小：2MB
  AVATAR_MAX_SIZE: 1 * 1024 * 1024,     // 头像最大大小：1MB
  CHUNK_SIZE: 1 * 1024 * 1024,          // 分片大小：1MB
  MAX_COUNT: 9                          // 最大上传数量：9
} as const;

// 请求相关
export const REQUEST = {
  TIMEOUT: 10 * 1000,                   // 请求超时：10秒
  MAX_RETRIES: 3,                       // 最大重试次数：3次
  RETRY_DELAY: 1000,                    // 重试延迟：1秒
  CONCURRENT_REQUESTS: 5                // 最大并发请求数：5
} as const;

// 缓存相关
export const CACHE = {
  MAX_AGE: 7 * 24 * 60 * 60 * 1000,    // 最大缓存时间：7天
  MAX_SIZE: 100,                        // 最大缓存条目数：100
  CHECK_PERIOD: 60 * 60 * 1000         // 缓存检查周期：1小时
} as const;

// UI相关
export const UI = {
  ANIMATION_DURATION: 300,              // 动画持续时间：300ms
  TOOLTIP_DELAY: 100,                   // 提示框延迟：100ms
  MODAL_Z_INDEX: 1000,                  // 模态框层级：1000
  DRAWER_WIDTH: 256,                    // 抽屉宽度：256px
  HEADER_HEIGHT: 64,                    // 头部高度：64px
  FOOTER_HEIGHT: 48,                    // 底部高度：48px
  SIDEBAR_WIDTH: 200,                   // 侧边栏宽度：200px
  COLLAPSED_SIDEBAR_WIDTH: 80           // 折叠侧边栏宽度：80px
} as const;

export default {
  BREAKPOINTS,
  PAGINATION,
  TIME,
  UPLOAD,
  REQUEST,
  CACHE,
  UI
}; 