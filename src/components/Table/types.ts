import type { TableProps, TablePaginationConfig, TableColumnType as AntTableColumnType } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

export type ValueType = 'text' | 'select' | 'number' | 'date' | 'dateRange' | 'custom';

export interface TableColumnType<T = any> extends AntTableColumnType {
  title: string;
  dataIndex?: keyof T;
  key?: string;
  fixed?: 'left' | 'right';
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  hideInSearch?: boolean;
  valueType?: ValueType;
  valueEnum?: Record<string, { text: string; status?: string }>;
  search?: {
    transform?: (value: any) => any;
  };
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: string }[];
  filteredValue?: string[];
  filterMode?: 'menu' | 'tree';
  filterSearch?: boolean;
  ellipsis?: boolean | { showTitle?: boolean };
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sorter?: {
    field?: string;
    order?: 'ascend' | 'descend';
  };
  filters?: Record<string, FilterValue | null>;
  search?: Record<string, any>;
}

export interface EnhancedTableProps<T = any> {
  columns: TableColumnType<T>[];
  dataSource?: T[];
  loading?: boolean;
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  onRefresh?: () => void;
  cardProps?: {
    title?: React.ReactNode;
    extra?: React.ReactNode;
  };
  onChange?: TableProps<T>['onChange'];
} 