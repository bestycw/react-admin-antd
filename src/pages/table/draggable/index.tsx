import React, { useState, useCallback, useRef } from 'react';
import { Button, Tag, message } from 'antd';
import { DragOutlined } from '@ant-design/icons';
import Table from '@/components/Table';
import type { TableColumnType } from '@/components/Table/types';
import type { DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.scss';

interface DraggableUser {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
  sort: number;
}

interface BodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  index: number;
}

const DraggableBodyRow = ({ index, ...restProps }: BodyRowProps) => {
  return (
    <Draggable draggableId={restProps['data-row-key'].toString()} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const style = {
          ...provided.draggableProps.style,
          ...restProps.style,
        };
        return (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...restProps}
            style={style}
            className={`
              ${restProps.className || ''} 
              ${snapshot.isDragging ? 'dragging' : ''} 
              ${snapshot.draggingOver ? 'drop-over-downward' : ''} 
              ${snapshot.isDropAnimating ? 'drop-over-upward' : ''}
            `.trim()}
          />
        );
      }}
    </Draggable>
  );
};

const DraggableTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DraggableUser[]>([
    { id: 1, name: 'John Brown', age: 32, email: 'john@example.com', status: 'active', sort: 1 },
    { id: 2, name: 'Jim Green', age: 42, email: 'jim@example.com', status: 'inactive', sort: 2 },
    { id: 3, name: 'Joe Black', age: 32, email: 'joe@example.com', status: 'active', sort: 3 },
  ]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const items = Array.from(dataSource);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const newData = items.map((item, index) => ({
      ...item,
      sort: index + 1,
    }));
    console.log(newData);
    setDataSource(newData);
    message.success('排序成功');
  };

  const components = {
    body: {
      wrapper: (props: any) => (
        <Droppable droppableId="table-body">
          {(provided: DroppableProvided) => (
            <tbody {...props} ref={provided.innerRef} {...provided.droppableProps}>
              {props.children}
              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      ),
      row: (props: any) => {
        return <DraggableBodyRow index={props['data-index']} {...props} />;
      },
    },
  };

  const columns: TableColumnType<DraggableUser>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      fixed: 'left',
      hideInSearch: true,
      render: (sort: number) => (
        <div className="drag-handle">
          <DragOutlined style={{ cursor: 'move', color: '#999', marginRight: 8 }} />
          {sort}
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      valueType: 'text',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' }
      },
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        components={components}
        rowKey="id"
        onRow={(record, index) => ({
          'data-index': index,
          style: { cursor: 'move' },
        })}
        cardProps={{
          title: '拖拽排序表格',
        }}
        pagination={false}
      />
    </DragDropContext>
  );
};

export default DraggableTable;

export const routeConfig = {
  title: '拖拽排序表格',
  sort: 3,
}; 