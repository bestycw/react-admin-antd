import React, { useState, useCallback, useEffect } from 'react'
import { Card, Select, Space, Button, message, theme } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import CodeEditor from '@/components/CodeEditor'
import { useStore } from '@/store'
import type { SelectProps } from 'antd'

// 语言选项配置
const languages: SelectProps['options'] = [
  {
    label: '常用语言',
    options: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'HTML', value: 'html' },
      { label: 'CSS', value: 'css' },
      { label: 'JSON', value: 'json' },
    ]
  },
  {
    label: '后端语言',
    options: [
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'C++', value: 'cpp' },
      { label: 'Go', value: 'go' },
      { label: 'PHP', value: 'php' },
    ]
  },
  {
    label: '数据库',
    options: [
      { label: 'SQL', value: 'sql' },
      { label: 'MongoDB', value: 'mongodb' },
    ]
  },
  {
    label: '标记语言',
    options: [
      { label: 'Markdown', value: 'markdown' },
      { label: 'XML', value: 'xml' },
      { label: 'YAML', value: 'yaml' },
    ]
  }
]

const themes = [
  { label: '深色', value: 'vs-dark' },
  { label: '浅色', value: 'light' }
]

const CodeEditorPage: React.FC = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const { token } = theme.useToken()
  const { ConfigStore } = useStore()

  // 监听系统主题变化
  useEffect(() => {
    const theme = ConfigStore.isDarkMode ? 'vs-dark' : 'light'
    setEditorTheme(theme)
  }, [ConfigStore.isDarkMode])

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleThemeChange = (value: 'vs-dark' | 'light') => {
    setEditorTheme(value)
    // 同步更新系统主题
    ConfigStore.setDarkMode(value === 'vs-dark')
  }

  const handleSave = useCallback((value: string) => {
    message.success('代码已保存')
    console.log('保存的代码:', value)
  }, [])

  const handleFormat = useCallback(() => {
    message.success('代码已格式化')
  }, [])

  return (
    <div className="p-6">
      <Card 
        title="代码编辑器" 
        className="shadow-md"
        style={{
          backgroundColor: ConfigStore.isDarkMode ? '#1e1e1e' : '#ffffff',
          color: ConfigStore.isDarkMode ? '#ffffff' : '#000000'
        }}
      >
        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <Space size="middle">
            <div className="flex items-center gap-2">
              <span style={{ color: ConfigStore.isDarkMode ? '#ffffff' : '#666666' }}>
                语言：
              </span>
              <Select
                value={language}
                onChange={handleLanguageChange}
                options={languages}
                style={{ width: 160 }}
                popupMatchSelectWidth={false}
                className="min-w-[160px]"
                dropdownStyle={{
                  backgroundColor: ConfigStore.isDarkMode ? '#1e1e1e' : '#ffffff'
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: ConfigStore.isDarkMode ? '#ffffff' : '#666666' }}>
                主题：
              </span>
              <Select
                value={editorTheme}
                onChange={handleThemeChange}
                options={themes}
                style={{ width: 100 }}
                dropdownStyle={{
                  backgroundColor: ConfigStore.isDarkMode ? '#1e1e1e' : '#ffffff'
                }}
              />
            </div>
          </Space>
          <Space>
            <Button 
              type="primary" 
              onClick={handleFormat}
              style={{ 
                backgroundColor: token.colorPrimary,
                borderColor: token.colorPrimary 
              }}
            >
              格式化代码
            </Button>
          </Space>
        </div>

        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          theme={editorTheme}
          height={600}
          onSave={handleSave}
          options={{
            fontSize: 14,
            fontFamily: 'Fira Code, Consolas, Monaco, monospace',
            minimap: {
              enabled: true,
              maxColumn: 80,
              renderCharacters: false
            },
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
        />
      </Card>
      <style>{`
        .ant-select-dropdown {
          max-height: 400px;
          background-color: ${ConfigStore.isDarkMode ? '#1e1e1e' : '#ffffff'};
        }
        .ant-select-item {
          font-family: 'Fira Code', Consolas, Monaco, monospace;
          color: ${ConfigStore.isDarkMode ? '#ffffff' : '#000000'};
        }
        .ant-select-item-group {
          color: ${token.colorPrimary};
          font-weight: 600;
        }
        .ant-select-item:hover {
          background-color: ${ConfigStore.isDarkMode ? '#2d2d2d' : '#f5f5f5'};
        }
        .ant-select-item-option-selected {
          background-color: ${ConfigStore.isDarkMode ? '#3c3c3c' : '#e6f7ff'};
        }
        .ant-select-selection-item {
          font-family: 'Fira Code', Consolas, Monaco, monospace;
          color: ${ConfigStore.isDarkMode ? '#ffffff' : '#000000'};
        }
      `}</style>
    </div>
  )
}

export default CodeEditorPage

export const routeConfig = {
  title: '代码编辑器',
  icon: <CodeOutlined />,
  layout: true,
  auth: true,
} 