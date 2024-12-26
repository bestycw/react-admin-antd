import React from 'react';
import { Node, Edge } from 'reactflow';
import {
  UserOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FileOutlined,
  FormOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BranchesOutlined,
} from '@ant-design/icons';

export interface NodeData {
  label: string;
  description: string;
  icon: string;
}

// 创建一个图标映射对象
const iconMap: Record<string, typeof UserOutlined> = {
  start: UserOutlined,
  approval: LoadingOutlined,
  form: FormOutlined,
  timer: ClockCircleOutlined,
  branch: BranchesOutlined,
  team: TeamOutlined,
  default: FileOutlined,
};

export const getNodeData = (type: string): NodeData => {
  switch (type) {
    case 'start':
      return {
        label: '开始',
        description: '流程开始节点',
        icon: 'start',
      };
    case 'approval':
      return {
        label: '审批',
        description: '等待审批',
        icon: 'approval',
      };
    case 'form':
      return {
        label: '表单',
        description: '填写表单',
        icon: 'form',
      };
    case 'timer':
      return {
        label: '定时',
        description: '定时执行',
        icon: 'timer',
      };
    case 'branch':
      return {
        label: '分支',
        description: '条件分支',
        icon: 'branch',
      };
    case 'team':
      return {
        label: '团队',
        description: '团队协作',
        icon: 'team',
      };
    default:
      return {
        label: '节点',
        description: '默认节点',
        icon: 'default',
      };
  }
};

export const getIcon = (iconType: string) => {
  const IconComponent = iconMap[iconType] || iconMap.default;
  return React.createElement(IconComponent);
};

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: getNodeData('start'),
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: getNodeData('approval'),
  },
];

export const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    type: 'smoothstep',
    animated: true,
  },
]; 