import React, { useState, useEffect } from 'react'
import { Modal, Input, Empty, List } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '@/types/menu'
import { observer } from 'mobx-react-lite'

const GlobalSearch: React.FC = observer(() => {
    const { ConfigStore, MenuStore } = useStore()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<MenuItem[]>([])

    // 搜索菜单项
    const searchInMenu = (items: MenuItem[], keyword: string): MenuItem[] => {
        let results: MenuItem[] = []
        items.forEach(item => {
            if (item.label?.toString().toLowerCase().includes(keyword.toLowerCase())) {
                results.push(item)
            }
            if (item.children) {
                results = results.concat(searchInMenu(item.children, keyword))
            }
        })
        return results
    }

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchValue(value)
        if (value) {
            const results = searchInMenu(MenuStore.menuList, value)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
    }

    // 处理选择
    const handleSelect = (item: MenuItem) => {
        navigate(item.key)
        ConfigStore.toggleSearchVisible(false)
        setSearchValue('')
        setSearchResults([])
    }

    // 监听 ESC 键关闭弹窗
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                ConfigStore.toggleSearchVisible(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [ConfigStore])
    console.log(ConfigStore.searchVisible)
    return (
        <Modal
            title="全局搜索"
            open={ConfigStore.searchVisible}
            onCancel={() => ConfigStore.toggleSearchVisible(false)}
            footer={null}
            width={520}
            destroyOnClose
        >
            <div className="py-4">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="搜索菜单..."
                    value={searchValue}
                    onChange={e => handleSearch(e.target.value)}
                    autoFocus
                />

                <div className="mt-4 max-h-80 overflow-auto">
                    {searchResults.length > 0 ? (
                        <List
                            dataSource={searchResults}
                            renderItem={item => (
                                <List.Item
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => handleSelect(item)}
                                >
                                    <div className="flex items-center">
                                        {item.icon}
                                        <span className="ml-2">{item.label}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : searchValue ? (
                        <Empty description="未找到匹配项" />
                    ) : null}
                </div>
            </div>
        </Modal>
    )
})

export default GlobalSearch 