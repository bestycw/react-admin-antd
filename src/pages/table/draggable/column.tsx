import React, { useState } from 'react';
import {  Tag, message } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
import type { DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface DraggableColumnUser {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}
//TODO 拖拽时 表格会发生变化
const DraggableColumnTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<TableColumnType<DraggableColumnUser>[]>([
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ]);

  const [dataSource] = useState<DraggableColumnUser[]>([
    { id: 1, name: 'John Brown', age: 32, email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jim Green', age: 42, email: 'jim@example.com', status: 'inactive' },
    { id: 3, name: 'Joe Black', age: 32, email: 'joe@example.com', status: 'active' },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
    message.success('列排序成功');
  };

  const DraggableHeader = ({ column, index }: { column: TableColumnType<DraggableColumnUser>; index: number }) => (
    <Draggable draggableId={column.key || index.toString()} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            relative flex items-center h-full
            ${snapshot.isDragging ? 'shadow-lg z-50 bg-white rounded-sm' : ''}
          `}
          style={{
            ...provided.draggableProps.style,
            width: column.width,
            minWidth: column.width,
            maxWidth: column.width
          }}
        >
          <span className="flex-1 px-4 truncate">{column.title}</span>
          <div
            {...provided.dragHandleProps}
            className={`
              absolute inset-y-0 right-0 flex items-center px-2 cursor-move
              hover:bg-gray-50 transition-colors duration-200
              ${snapshot.isDragging ? 'bg-gray-50' : ''}
            `}
          >
            <MenuOutlined className="text-gray-400" />
          </div>
        </div>
      )}
    </Draggable>
  );

  const TableHeader = () => (
    <Droppable droppableId="column-headers" direction="horizontal">
      {(provided: DroppableProvided) => (
        <tr 
          ref={provided.innerRef} 
          {...provided.droppableProps}
          className="ant-table-row"
          style={{ display: 'table-row' }}
        >
          {columns.map((column, index) => (
            <th 
              key={column.key || index} 
              className="ant-table-cell" 
              style={{ 
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width,
                padding: '16px 8px',
                display: 'table-cell',
                verticalAlign: 'middle'
              }}
            >
              <DraggableHeader column={column} index={index} />
            </th>
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );

  const components = {
    header: {
      wrapper: TableHeader
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        columns={columns}
        dataSource={dataSource}
        hideSearch
        loading={loading}
        rowKey="id"
        components={components}
        cardProps={{
          title: '列拖拽排序表格',
        }}
      />
    </DragDropContext>
  );
};

export default DraggableColumnTable;

export const routeConfig = {
  title: '列拖拽',
  sort: 4,
}; 