import { FormOutlined } from '@ant-design/icons';
import type { RouteConfig } from '@/types/route';

export const routeConfig: RouteConfig = {
    title: '表单页面',
    icon: <FormOutlined />,
    layout: true,
    auth: true,
    sort: 3
};