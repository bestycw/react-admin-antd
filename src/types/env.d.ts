/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: 'development' | 'test' | 'production'
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESC: string
  readonly VITE_PORT: string
  readonly VITE_API_URL: string
  readonly VITE_API_PREFIX: string
  readonly VITE_UPLOAD_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_USE_MOCK: string
  readonly VITE_USE_PWA: string
  readonly VITE_USE_HTTPS: string
  readonly VITE_DEV_TOOLS: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_DROP_DEBUGGER: string
  readonly VITE_USE_CDN: string
  readonly VITE_CDN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 