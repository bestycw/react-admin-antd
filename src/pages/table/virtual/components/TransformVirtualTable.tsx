import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Tag, Space, Tooltip } from 'antd';
import type { DataType } from '../config';
import { VIRTUAL_CONFIG } from '../config';

interface TransformVirtualTableProps {
  dataSource: DataType[];
  loading?: boolean;
}

const TransformVirtualTable: React.FC<TransformVirtualTableProps> = ({ dataSource, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const columns = [
    { title: 'ID', key: 'id', width: 80 },
    { title: '姓名', key: 'name', width: 120 },
    { title: '年龄', key: 'age', width: 80 },
    { title: '邮箱', key: 'email', width: 200 },
    { title: '状态', key: 'status', width: 100 },
    { title: '标签', key: 'tags', width: 200 },
    { title: '部门', key: 'department', width: 150 },
    { title: '薪资', key: 'salary', width: 120 },
    { title: '描述', key: 'description', width: 200 },
  ];

  useEffect(() => {
    if (containerRef.current) {
      setClientHeight(containerRef.current.clientHeight);
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setClientHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_CONFIG.ITEM_HEIGHT) - VIRTUAL_CONFIG.BUFFER_SIZE);
  const visibleCount = Math.ceil(clientHeight / VIRTUAL_CONFIG.ITEM_HEIGHT);
  const endIndex = Math.min(
    startIndex + visibleCount + 2 * VIRTUAL_CONFIG.BUFFER_SIZE,
    dataSource.length
  );
  const visibleData = dataSource.slice(startIndex, endIndex);
  const offsetY = startIndex * VIRTUAL_CONFIG.ITEM_HEIGHT;

  const renderCell = (record: DataType, key: keyof DataType) => {
    switch (key) {
      case 'status':
        return (
          <Tag color={record.status === 'active' ? 'success' : 'default'}>
            {record.status === 'active' ? '启用' : '禁用'}
          </Tag>
        );
      case 'tags':
        return (
          <Space>
            {record.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        );
      case 'salary':
        return `￥${record.salary.toLocaleString()}`;
      case 'description':
        return (
          <Tooltip title={record[key]}>
            <div className="truncate">{record[key]}</div>
          </Tooltip>
        );
      default:
        return record[key];
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const totalWidth = columns.reduce((acc, col) => acc + (typeof col.width === 'number' ? col.width : 0), 0);

  return (
    <div className="virtual-table-transform h-full border rounded">
      <div className="virtual-table-content" style={{ height: 'calc(100vh - 300px)' }}>
        {/* 表头 */}
        <div 
          className="flex bg-gray-50 border-b sticky top-0 z-10"
          style={{ minWidth: totalWidth }}
        >
          {columns.map(column => (
            <div
              key={column.key}
              className="px-4 py-3 font-medium truncate border-r last:border-r-0"
              style={{ width: column.width }}
            >
              {column.title}
            </div>
          ))}
        </div>

        {/* 表格内容 */}
        <div
          ref={containerRef}
          className="overflow-auto relative"
          style={{ height: 'calc(100% - 40px)' }}
          onScroll={handleScroll}
        >
          <div style={{ height: dataSource.length * VIRTUAL_CONFIG.ITEM_HEIGHT, minWidth: totalWidth }}>
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {visibleData.map((record, index) => (
                <div
                  key={record.id}
                  className={`flex border-b ${
                    (index + startIndex) % 2 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-50 transition-colors`}
                  style={{ height: VIRTUAL_CONFIG.ITEM_HEIGHT }}
                >
                  {columns.map(column => (
                    <div
                      key={column.key}
                      className="px-4 py-2 truncate border-r last:border-r-0 flex items-center"
                      style={{ width: column.width }}
                    >
                      {renderCell(record, column.key as keyof DataType)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformVirtualTable; 