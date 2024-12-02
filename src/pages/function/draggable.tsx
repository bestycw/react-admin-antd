import React, { useState } from 'react';
import { Card, Tabs, Badge } from 'antd';
import {
  OrderedListOutlined,
  AppstoreOutlined,
  MenuOutlined,
  SwapOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import {
  DndContext,
  // closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

// 添加新的类型定义
interface TreeItem {
  id: string;
  title: string;
  children?: TreeItem[];
  color?: string;
}

interface NestedItem {
  id: string;
  title: string;
  items?: NestedItem[];
  color?: string;
}

// interface DraggableItem {
//   id: string;
//   content: string;
// }

// interface DraggableListProps {
//   items: DraggableItem[];
//   setItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
// }

// 生成示例数据
const generateItems = (count: number) => 
  Array.from({ length: count }, (_, index) => ({
    id: `${index + 1}`,
    title: `项目 ${index + 1}`,
    description: `这是项目 ${index + 1} 的描述文本`,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

// 生成树形数据
const generateTreeItems = (): TreeItem[] => [
  {
    id: '1',
    title: '部门 A',
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    children: [
      { 
        id: '1-1', 
        title: '团队 1',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        children: [
          { id: '1-1-1', title: '成员 1', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
          { id: '1-1-2', title: '成员 2', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
        ]
      },
      { 
        id: '1-2', 
        title: '团队 2',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        children: [
          { id: '1-2-1', title: '成员 3', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
          { id: '1-2-2', title: '成员 4', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
        ]
      },
    ]
  },
  {
    id: '2',
    title: '部门 B',
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    children: [
      { 
        id: '2-1', 
        title: '团队 3',
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        children: [
          { id: '2-1-1', title: '成员 5', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
          { id: '2-1-2', title: '成员 6', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
        ]
      }
    ]
  }
];

// 生成嵌套数据
const generateNestedItems = (): NestedItem[] => [
  {
    id: 'group1',
    title: '分组 1',
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    items: [
      { id: '1', title: '项目 1', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
      { id: '2', title: '项目 2', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
    ]
  },
  {
    id: 'group2',
    title: '分组 2',
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    items: [
      { id: '3', title: '项目 3', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
      { id: '4', title: '项目 4', color: `hsl(${Math.random() * 360}, 70%, 50%)` },
    ]
  }
];

const DraggablePage: React.FC = () => {
  const [verticalItems, setVerticalItems] = useState<any[]>(generateItems(6));
  const [horizontalItems, setHorizontalItems] = useState(generateItems(8));
  const [gridItems, setGridItems] = useState(generateItems(12));
  const [kanbanItems, setKanbanItems] = useState({
    todo: generateItems(4),
    inProgress: generateItems(3),
    done: generateItems(5),
  });
  const [treeItems, setTreeItems] = useState<TreeItem[]>(generateTreeItems());
  const [nestedItems, setNestedItems] = useState<NestedItem[]>(generateNestedItems());

  useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <div>
      <Card title="拖拽排序示例" className="shadow-md">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: (
                <span className="flex items-center gap-2">
                  <OrderedListOutlined />
                  垂直列表
                </span>
              ),
              children: <VerticalList items={verticalItems} setItems={setVerticalItems} />
            },
            {
              key: '2',
              label: (
                <span className="flex items-center gap-2">
                  <SwapOutlined />
                  水平列表
                </span>
              ),
              children: <HorizontalList items={horizontalItems} setItems={setHorizontalItems} />
            },
            {
              key: '3',
              label: (
                <span className="flex items-center gap-2">
                  <AppstoreOutlined />
                  网格布局
                </span>
              ),
              children: <GridLayout items={gridItems} setItems={setGridItems} />
            },
            {
              key: '4',
              label: (
                <span className="flex items-center gap-2">
                  <MenuOutlined />
                  看板视图
                </span>
              ),
              children: <KanbanBoard items={kanbanItems} setItems={setKanbanItems} />
            },
            {
              key: '5',
              label: (
                <span className="flex items-center gap-2">
                  <UnorderedListOutlined />
                  树形拖拽
                </span>
              ),
              children: <TreeDraggable items={treeItems} setItems={setTreeItems} />
            },
            {
              key: '6',
              label: (
                <span className="flex items-center gap-2">
                  <AppstoreOutlined />
                  嵌套拖拽
                </span>
              ),
              children: <NestedDraggable items={nestedItems} setItems={setNestedItems} />
            }
          ]}
        />
      </Card>
    </div>
  );
};

// 垂直列表组件
const VerticalList = ({ items, setItems }: { items: any[]; setItems: (items: any[]) => void }) => {
  return (
    <DndContext onDragEnd={({ active, over }) => {
      if (over && active.id !== over.id) {
        setItems((items: any[]) => {
          const oldIndex = items.findIndex((item: any) => item.id === active.id);
          const newIndex = items.findIndex((item: any) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-12 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// 水平列表组件
const HorizontalList = ({ items, setItems }: { items: any[]; setItems: (items: any[]) => void }) => {
  return (
    <DndContext onDragEnd={({ active, over }) => {
      if (over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item: any) => item.id === active.id);
          const newIndex = items.findIndex((item: any) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="flex-shrink-0 w-48 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div 
                className="h-2 rounded-full mb-3" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// 网格布局组件
const GridLayout = ({ items, setItems }: { items: any[]; setItems: (items: any[]) => void }) => {
  return (
    <DndContext onDragEnd={({ active, over }) => {
      if (over && active.id !== over.id) {
        setItems((items: any[]) => {
          const oldIndex = items.findIndex((item: any) => item.id === active.id);
          const newIndex = items.findIndex((item: any) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow aspect-square flex flex-col"
            >
              <div 
                className="flex-1 rounded-lg mb-3" 
                style={{ backgroundColor: item.color, opacity: 0.1 }} 
              />
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// 看板视图组件
interface KanbanBoardProps {
  items: {
    todo: any[];
    inProgress: any[];
    done: any[];
  };
  setItems: (items: any) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ items, setItems }) => {
  const columns = [
    { id: 'todo', title: '待办', items: items.todo },
    { id: 'inProgress', title: '进行中', items: items.inProgress },
    { id: 'done', title: '已完成', items: items.done },
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <div className="mb-4 font-medium flex items-center gap-2">
            <span>{column.title}</span>
            <Badge count={column.items.length} style={{ backgroundColor: '#52c41a' }} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <DndContext onDragEnd={({ active, over }) => {
              if (over && active.id !== over.id) {
                setItems((prev: any) => {
                  const newItems = { ...prev };
                  const oldIndex = column.items.findIndex((item: any) => item.id === active.id);
                  const newIndex = column.items.findIndex((item: any) => item.id === over.id);
                  newItems[column.id] = arrayMove(column.items, oldIndex, newIndex);
                  return newItems;
                });
              }
            }}>
              <SortableContext items={column.items} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {column.items.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      <div 
                        className="h-1 rounded-full mt-2" 
                        style={{ backgroundColor: item.color }} 
                      />
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      ))}
    </div>
  );
};

// 树形拖拽组件
const TreeDraggable: React.FC<{
  items: TreeItem[];
  setItems: (items: TreeItem[]) => void;
}> = ({ items, setItems }) => {
  const renderItem = (item: TreeItem, level: number = 0) => (
    <SortableContext key={item.id} items={item.children?.map(child => child.id) || []}>
      <div className={`ml-${level * 6}`}>
        <SortableItem
          id={item.id}
          className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-2"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-6 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span>{item.title}</span>
          </div>
        </SortableItem>
        {item.children && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    </SortableContext>
  );

  return (
    <DndContext onDragEnd={({ active, over }) => {
      if (over && active.id !== over.id) {
        // 处理树形数据的拖拽逻辑
        // 这里需要递归查找和更新数据
      }
    }}>
      <div className="space-y-2">
        {items.map(item => renderItem(item))}
      </div>
    </DndContext>
  );
};

// 嵌套拖拽组件
const NestedDraggable: React.FC<{
  items: NestedItem[];
  setItems: (items: NestedItem[]) => void;
}> = ({ items, setItems }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map(group => (
        <div key={group.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="font-medium mb-4 flex items-center gap-2">
            <div 
              className="w-2 h-6 rounded-full" 
              style={{ backgroundColor: group.color }} 
            />
            {group.title}
          </div>
          <DndContext onDragEnd={({ active, over }) => {
            if (over && active.id !== over.id) {
              // 处理组内排序和组间拖拽
              setItems(items.map(g => {
                if (g.id === group.id) {
                  return {
                    ...g,
                    items: g.items?.map(item => ({
                      ...item,
                      // 更新排序逻辑
                    }))
                  };
                }
                return g;
              }));
            }
          }}>
            <SortableContext items={group.items?.map(item => item.id) || []}>
              <div className="space-y-2">
                {group.items?.map((item: NestedItem) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-6 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      {item.title}
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  );
};

// Add this component definition before your list components
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children, className }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={className}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition
      }}
    >
      {children}
    </div>
  );
};

export default DraggablePage;

export const routeConfig = {
  title: '拖拽排序',
  icon: <MenuOutlined />,
  layout: true,
  auth: true,
}; 