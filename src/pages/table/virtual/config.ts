import type { ColumnType } from 'antd/es/table';

export interface DataType {
  id: number;
  name: string;
  age: number;
  email: string;
  address: string;
  status: string;
  description: string;
  tags: string[];
  department: string;
  salary: number;
  joinDate: string;
}

export const VIRTUAL_CONFIG = {
  ITEM_HEIGHT: 54,
  BUFFER_SIZE: 5,
  PAGE_SIZE: 50,
  TOTAL_COUNT: 1000,
};

export const generateData = (count: number): DataType[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    email: `user${index + 1}@example.com`,
    address: `Street ${Math.floor(Math.random() * 100)} Avenue`,
    status: Math.random() > 0.5 ? 'active' : 'inactive',
    description: `This is a long description for User ${index + 1} that might contain a lot of text to test how the virtual scroll handles long content.`,
    tags: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      (_, tagIndex) => `Tag ${tagIndex + 1}`
    ),
    department: `Department ${Math.floor(Math.random() * 5) + 1}`,
    salary: Math.floor(Math.random() * 50000) + 30000,
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
}; 