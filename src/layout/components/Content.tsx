import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
// import { ThemeContainer } from '@/components/ThemeContainer'
// import { useStore } from '../../store'

const { Content: AntContent } = Layout

const Content = observer(() => {
    // const {  ConfigStore } = useStore()
    // const [settingOpen, setSettingOpen] = useState(false)
    // const isDynamic = ConfigStore.themeStyle === 'dynamic'
    // console.log('isDynamic',isDynamic)
  return (
    <AntContent className="flex-1">
      <div className="mx-auto w-full max-w-screen-2xl h-[calc(100vh-80px)]">
        <div className="theme-style h-full overflow-auto mt-0">
          <div className="p-6 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </AntContent>
  )
})

export default Content 