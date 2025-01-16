import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_PORT, VITE_API_URL, VITE_API_PREFIX, VITE_PROXY, VITE_USE_CDN, VITE_USE_MOCK } = env

  return {
    base: mode === 'production' ? '/react-admin-antd/' : '/',
    plugins: [
      react(),
      // viteCompression({
      //   verbose: true,
      //   disable: false,
      //   threshold: 10240,
      //   algorithm: 'gzip',
      //   ext: '.gz',
      // }),
      // createHtmlPlugin({
      //   inject: {
      //     data: {
      //       title: env.VITE_APP_TITLE,
      //     },
      //   },
      //   minify: true,
      // }),
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
      // VITE_USE_CDN === 'true' && importToCDN({
      //   modules: [
      //     {
      //       name: 'react',
      //       var: 'React',
      //       path: 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
      //     },
      //     {
      //       name: 'react-dom',
      //       var: 'ReactDOM',
      //       path: 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
      //     },
      //     {
      //       name: 'antd',
      //       var: 'antd',
      //       path: 'https://cdn.jsdelivr.net/npm/antd@5.0.0/dist/antd.min.js',
      //       css: 'https://cdn.jsdelivr.net/npm/antd@5.0.0/dist/antd.min.css',
      //     },
      //   ],
      // }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'React Admin',
          short_name: 'React Admin',
          description: 'React Admin Template',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(js|css|png|jpg|jpeg|svg|gif)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets-cache'
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      // mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
    },
    server: {
      host: true,
      port: Number(VITE_PORT),
      open: true,
      cors: true,
      proxy: VITE_USE_MOCK === 'true' ? {} : {
        [VITE_API_PREFIX]: {
          target: VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_API_PREFIX}`), '')
        }
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096, // 4kb
      cssCodeSplit: true,
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      terserOptions: {
        compress: {
          drop_console: env.VITE_DROP_CONSOLE === 'true',
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true'
        }
      },
      rollupOptions: {
        output: {
          // 分包配置
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'antd-vendor': ['antd', '@ant-design/icons'],
            'chart-vendor': ['@ant-design/plots'],
            'utils-vendor': ['axios', 'dayjs', 'lodash'],
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: '[ext]/[name].[hash].[ext]',
        },
      },
      // 关闭 brotli 压缩大小报告
      brotliSize: false,
      // chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
    },
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       javascriptEnabled: true,
    //       modifyVars: {},
    //     },
    //   },
    //   devSourcemap: mode !== 'production',
    // },

  }
})
