import React, { useState, useCallback } from 'react'
import { Card, Radio, Space, Button, message } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import CodeEditor from '@/components/CodeEditor'
import type { RadioChangeEvent } from 'antd'

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'SQL', value: 'sql' }
]

const themes = [
  { label: '深色', value: 'vs-dark' },
  { label: '浅色', value: 'light' }
]

const CodeEditorPage: React.FC = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')

  const handleLanguageChange = (e: RadioChangeEvent) => {
    setLanguage(e.target.value)
  }

  const handleThemeChange = (e: RadioChangeEvent) => {
    setTheme(e.target.value)
  }

  const handleSave = useCallback((value: string) => {
    message.success('代码已保存')
    console.log('保存的代码:', value)
  }, [])

  const handleFormat = useCallback(() => {
    // 可以调用编辑器的格式化方法
    message.success('代码已格式化')
  }, [])

  return (
    <div className="p-6">
      <Card title="代码编辑器" className="shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <span>语言：</span>
            <Radio.Group value={language} onChange={handleLanguageChange}>
              {languages.map(lang => (
                <Radio.Button key={lang.value} value={lang.value}>
                  {lang.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Space>
          <Space>
            <span>主题：</span>
            <Radio.Group value={theme} onChange={handleThemeChange}>
              {themes.map(t => (
                <Radio.Button key={t.value} value={t.value}>
                  {t.label}
                </Radio.Button>
              ))}
            </Radio.Group>
            <Button onClick={handleFormat}>格式化代码</Button>
          </Space>
        </div>

        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          theme={theme}
          height={600}
          onSave={handleSave}
        />
      </Card>
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