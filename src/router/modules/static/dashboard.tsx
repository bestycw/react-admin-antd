import { lazy } from "react";
import { CoRouteObject } from "../../../types/route";
import { DashboardOutlined } from "@ant-design/icons";
// import React from "react";
/* eslint-disable react-refresh/only-export-components */
const Dashboard = lazy(() => import('../../../pages/dashboard'))


const dashboardRoute: CoRouteObject =  {
    path: '/dashboard',
    meta: {
      title: '仪表盘',
      icon: <DashboardOutlined />,
    },
    element: <Dashboard />,
    // lazy: () => import('@/pages/Dashboard'),
  }
export default dashboardRoute