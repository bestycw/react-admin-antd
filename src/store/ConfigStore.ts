import { makeAutoObservable } from 'mobx'

type ThemeStyle = 'mac' | 'win'

class ConfigStore {
  // 界面风格
  themeStyle: ThemeStyle = 'mac'
  // 暗色模式
  isDarkMode: boolean = false
  // 主题色
  primaryColor: string = '#1890ff'

  constructor() {
    makeAutoObservable(this)
  }

  setThemeStyle = (style: ThemeStyle) => {
    this.themeStyle = style
  }

  toggleTheme = () => {
    this.themeStyle = this.themeStyle === 'mac' ? 'win' : 'mac'
  }

  toggleDarkMode = () => {
    this.isDarkMode = !this.isDarkMode
    // 更新 HTML 的 data-theme 属性
    document.documentElement.classList.toggle('dark', this.isDarkMode)
  }

  setPrimaryColor = (color: string) => {
    this.primaryColor = color
    // 更新 CSS 变量
    document.documentElement.style.setProperty('--primary-color', color)
    // 生成不同透明度的变体
    const rgb = this.hexToRgb(color)
    if (rgb) {
      document.documentElement.style.setProperty('--primary-color-hover', this.adjustBrightness(color, 10))
      document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }
  }

  // 辅助函数：将十六进制颜色转换为 RGB
  private hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // 辅助函数：调整颜色亮度
  private adjustBrightness = (hex: string, percent: number) => {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const adjust = (value: number) => {
      return Math.min(255, Math.max(0, Math.round(value * (1 + percent / 100))))
    }

    return `#${[
      adjust(rgb.r).toString(16).padStart(2, '0'),
      adjust(rgb.g).toString(16).padStart(2, '0'),
      adjust(rgb.b).toString(16).padStart(2, '0')
    ].join('')}`
  }
}

export default new ConfigStore()
