import React, { useCallback, useState, useMemo } from 'react';
import { Table as AntTable, Card, Space, Button, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';
import SearchForm, { TableColumnType } from '../SearchForm';

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
  [key: string]: any;
}

export interface EnhancedTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: TableColumnType[];
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
  onSearch?: (values: any) => void;
  onReset?: () => void;
  onRefresh?: () => void;
  defaultParams?: TableParams;
  onChange?: (params: TableParams) => void;
  cardProps?: {
    title?: React.ReactNode;
    extra?: React.ReactNode;
  };
  loading?: boolean;
  hideSearch?: boolean;
  searchConfig?: {
    defaultCollapsed?: boolean;
    showCollapseButton?: boolean;
  };
}

function Table<T extends object = any>(props: EnhancedTableProps<T>) {
  const {
    columns: rawColumns,
    toolbarLeft,
    toolbarRight,
    onSearch,
    onReset,
    onRefresh,
    onChange,
    defaultParams,
    cardProps,
    loading,
    hideSearch = false,
    searchConfig,
    ...restProps
  } = props;

  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`,
    },
    ...defaultParams,
  }));

  // 转换列配置为Table列配置
  const columns = useMemo(() => {
    return rawColumns
      .filter(col => !col.hideInTable)
      .map(col => ({
        ...col,
        render: col.render || undefined,
      }));
  }, [rawColumns]);

  // 计算表格最小宽度
  const minWidth = useMemo(() => {
    return columns.reduce((total, col) => {
      const width = typeof col.width === 'number' ? col.width : 150;
      return total + width;
    }, 0);
  }, [columns]);

  // 处理表格变化
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: any
    ) => {
      const params: TableParams = {
        ...tableParams,
        pagination,
        filters,
      };

      if (sorter.field && sorter.order) {
        params.sortField = sorter.field as string;
        params.sortOrder = sorter.order;
      }

      setTableParams(params);
      onChange?.(params);
    },
    [onChange, tableParams]
  );

  // 处理搜索
  const handleSearch = useCallback(
    (values: any) => {
      const newParams = {
        ...tableParams,
        ...values,
        pagination: { ...tableParams.pagination, current: 1 },
      };
      setTableParams(newParams);
      onSearch?.(values);
      onChange?.(newParams);
    },
    [onChange, onSearch, tableParams]
  );

  // 处理重置
  const handleReset = useCallback(() => {
    const newParams = {
      ...defaultParams,
      pagination: { ...tableParams.pagination, current: 1 },
    };
    setTableParams(newParams);
    onReset?.();
    onChange?.(newParams);
  }, [defaultParams, onChange, onReset, tableParams]);

  // 渲染工具栏
  const renderToolbar = () => {
    if (!toolbarLeft && !toolbarRight && !onRefresh) return null;

    return (
      <div className="flex justify-between items-center mb-4">
        <Space>{toolbarLeft}</Space>
        <Space>
          {toolbarRight}
          {onRefresh && (
            <Tooltip title="刷新">
              <Button icon={<ReloadOutlined />} onClick={() => onRefresh()} />
            </Tooltip>
          )}
        </Space>
      </div>
    );
  };

  return (
    <Card
      {...cardProps}
      className={classNames('w-full', props.className)}
      bodyStyle={{ padding: '16px 24px' }}
    >
      {!hideSearch && (
        <SearchForm
          columns={rawColumns}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
          defaultCollapsed={searchConfig?.defaultCollapsed}
          showCollapseButton={searchConfig?.showCollapseButton}
        />
      )}
      {renderToolbar()}
      <div className="w-full overflow-auto">
        <AntTable<T>
          {...restProps}
          columns={columns}
          loading={loading}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
          scroll={{ x: minWidth }}
          className="w-full"
        />
      </div>
    </Card>
  );
}

export default Table; 