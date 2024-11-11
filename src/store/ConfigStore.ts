import { makeAutoObservable } from 'mobx'

class ConfigStore {
  isDarkMode = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.loadConfig()
    this.applyTheme()
  }

  private loadConfig() {
    const config = localStorage.getItem('theme')
    if (config) {
      this.isDarkMode = config === 'dark'
    } else {
      // 根据系统主题设置默认值
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light')
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode
    this.applyTheme()
  }
}

export default new ConfigStore()
