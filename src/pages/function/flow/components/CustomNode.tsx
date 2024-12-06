import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { getIcon } from './data.tsx';

const CustomNode: React.FC<NodeProps> = memo(({ data }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md bg-white border-2 border-gray-200 hover:border-blue-500 transition-colors">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{getIcon(data.icon)}</span>
        <div>
          <div className="font-medium text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-500">{data.description}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
});

export default CustomNode; 