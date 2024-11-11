import { makeAutoObservable } from 'mobx'

type NavMode = 'horizontal' | 'vertical' | 'mix'

class ConfigStore {
  isDarkMode = false
  isCompactMode = false
  primaryColor = '#1890ff'
  navMode: NavMode = 'horizontal'
  isTabMode = true
  isFixedHeader = true

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.loadConfig()
  }

  private loadConfig() {
    const config = localStorage.getItem('siteConfig')
    if (config) {
      const parsedConfig = JSON.parse(config)
      Object.assign(this, parsedConfig)
    }
  }

  private saveConfig() {
    localStorage.setItem('siteConfig', JSON.stringify({
      isDarkMode: this.isDarkMode,
      isCompactMode: this.isCompactMode,
      primaryColor: this.primaryColor,
      navMode: this.navMode,
      isTabMode: this.isTabMode,
      isFixedHeader: this.isFixedHeader,
    }))
  }

  setDarkMode(value: boolean) {
    this.isDarkMode = value
    this.saveConfig()
  }

  setCompactMode(value: boolean) {
    this.isCompactMode = value
    this.saveConfig()
  }

  setPrimaryColor(value: string) {
    this.primaryColor = value
    this.saveConfig()
  }

  setNavMode(value: NavMode) {
    this.navMode = value
    this.saveConfig()
  }

  setTabMode(value: boolean) {
    this.isTabMode = value
    this.saveConfig()
  }

  setFixedHeader(value: boolean) {
    this.isFixedHeader = value
    this.saveConfig()
  }
}

export default new ConfigStore()
