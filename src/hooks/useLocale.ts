import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

interface UseLocaleResult {
  // 当前语言
  currentLang: string
  // 切换语言
  changeLang: (lang: string) => void
  // 翻译函数
  t: (key: string) => string
}

/**
 * 国际化 hook
 * @returns {UseLocaleResult} 返回国际化相关的方法和状态
 */
export const useLocale = (): UseLocaleResult => {
  const { t, i18n } = useTranslation()

  // 初始化时从 localStorage 读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  // 监听语言变化，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('language', i18n.language)
  }, [i18n.language])

  // 切换语言
  const changeLang = (lang: string) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang)
    }
  }

  return {
    currentLang: i18n.language,
    changeLang,
    t
  }
}

export default useLocale 