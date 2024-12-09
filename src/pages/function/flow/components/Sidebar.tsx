import React from 'react';
import { Card } from 'antd';
import { getIcon } from './data.tsx';

const nodeTypes = [
  {
    type: 'start',
    label: '开始节点',
    icon: 'start',
    description: '流程的起点',
  },
  {
    type: 'approval',
    label: '审批节点',
    icon: 'approval',
    description: '需要审批',
  },
  {
    type: 'form',
    label: '表单节点',
    icon: 'form',
    description: '填写表单',
  },
  {
    type: 'timer',
    label: '定时节点',
    icon: 'timer',
    description: '定时执行',
  },
  {
    type: 'branch',
    label: '分支节点',
    icon: 'branch',
    description: '条件分支',
  },
  {
    type: 'team',
    label: '团队节点',
    icon: 'team',
    description: '团队协作',
  },
];

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card title="节点类型" className="w-64">
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:border-blue-500 hover:shadow-md transition-all"
            onDragStart={(e) => onDragStart(e, node.type)}
            draggable
          >
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">{getIcon(node.icon)}</span>
              <div>
                <div className="font-medium text-sm">{node.label}</div>
                <div className="text-xs text-gray-500">{node.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Sidebar; 