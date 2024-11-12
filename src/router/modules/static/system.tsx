import {
  // DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { CoRouteObject } from '@/types/route';
import { lazy } from 'react';

const User = lazy(() => import('../../../pages/System/User'))
const Role = lazy(() => import('../../../pages/System/Role'))
const systemRoute: CoRouteObject = 

  {
    path: '/system',
    meta: {
      title: '系统管理',
      icon: <SettingOutlined />,
    },
    children: [
      {
        path: '/system/user',
        meta: {
          title: '用户管理',
          icon: <UserOutlined />,
        },
        element: <User />,
        // lazy: () => import('@/pages/System/User'),
      },
      {
        path: '/system/role',
        meta: {
          title: '角色管理',
          icon: <TeamOutlined />,
        },
        element: <Role />,
        // lazy: () => import('@/pages/System/Role'),
      },
    ],
  }
;

export default systemRoute; 