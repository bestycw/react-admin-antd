import React, { useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Tag, Space, Tooltip } from 'antd';
import type { DataType } from '../config';
import { VIRTUAL_CONFIG } from '../config';

interface WindowVirtualTableProps {
  dataSource: DataType[];
  loading?: boolean;
}

const WindowVirtualTable: React.FC<WindowVirtualTableProps> = ({ dataSource, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(400);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.getBoundingClientRect().height;
        if (height > 0 && height !== containerHeight) {
          setContainerHeight(height);
        }
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const columns = [
    { title: 'ID', key: 'id', width: '80px' },
    { title: '姓名', key: 'name', width: '120px' },
    { title: '年龄', key: 'age', width: '80px' },
    { title: '邮箱', key: 'email', width: '200px' },
    { title: '状态', key: 'status', width: '100px' },
    { title: '标签', key: 'tags', width: '200px' },
    { title: '部门', key: 'department', width: '150px' },
    { title: '薪资', key: 'salary', width: '120px' },
    { title: '描述', key: 'description', width: 'auto' },
  ];

  const Row = ({ index, style }: any) => {
    const record = dataSource[index];
    return (
      <div 
        className={`flex border-b ${index % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}
        style={style}
      >
        <div className="px-4 py-2 truncate" style={{ width: '80px' }}>{record.id}</div>
        <div className="px-4 py-2 truncate" style={{ width: '120px' }}>{record.name}</div>
        <div className="px-4 py-2 truncate" style={{ width: '80px' }}>{record.age}</div>
        <div className="px-4 py-2 truncate" style={{ width: '200px' }}>{record.email}</div>
        <div className="px-4 py-2" style={{ width: '100px' }}>
          <Tag color={record.status === 'active' ? 'success' : 'default'}>
            {record.status === 'active' ? '启用' : '禁用'}
          </Tag>
        </div>
        <div className="px-4 py-2 truncate" style={{ width: '200px' }}>
          <Space>
            {record.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>
        <div className="px-4 py-2 truncate" style={{ width: '150px' }}>{record.department}</div>
        <div className="px-4 py-2 truncate" style={{ width: '120px' }}>￥{record.salary.toLocaleString()}</div>
        <div className="px-4 py-2 flex-1">
          <Tooltip title={record.description}>
            <div className="truncate">{record.description}</div>
          </Tooltip>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div ref={containerRef} className="virtual-table-window h-full flex flex-col">
      {/* 表头 */}
      <div className="flex bg-gray-50 border-b">
        {columns.map(column => (
          <div
            key={column.key}
            className="px-4 py-3 font-medium truncate"
            style={{ width: column.width }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* 表格内容 */}
      <div className="flex-1">
        <List
          height={(containerHeight - 48) || 400}
          itemCount={dataSource.length}
          itemSize={VIRTUAL_CONFIG.ITEM_HEIGHT}
          width="100%"
          overscanCount={5}
        >
          {Row}
        </List>
      </div>
    </div>
  );
};

export default WindowVirtualTable; 