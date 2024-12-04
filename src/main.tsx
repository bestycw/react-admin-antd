import './locales/i18n'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

// 根据环境变量判断是否使用 mock 数据
if (import.meta.env.VITE_USE_MOCK === 'true') {
  console.log('使用 mock 数据');
  const modules = import.meta.glob('../mock/**/*.ts')
  Object.keys(modules).forEach(async (key) => {
    await modules[key]()
  })
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
