import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Table as AntTable, Card, Space, Button, Tooltip, Form } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  [key: string]: any;
}

export interface ResponsiveTableProps<T> extends Omit<TableProps<T>, 'onChange'> {
  className?: string;
  searchForm?: React.ReactNode;
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
}

function Table<T extends object = any>(props: ResponsiveTableProps<T>) {
  const {
    className,
    searchForm,
    toolbarLeft,
    toolbarRight,
    onSearch,
    onReset,
    onRefresh,
    onChange,
    defaultParams,
    cardProps,
    loading,
    columns = [],
    scroll,
    ...restProps
  } = props;

  const [form] = Form.useForm();
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

  // 计算所有列的最小总宽度
  const minWidth = useMemo(() => {
    return columns.reduce((total, col) => total + ((col.width as number) || 150), 0);
  }, [columns]);

  // 处理表格变化
  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
      extra: TableCurrentDataSource<T>
    ) => {
      const params: TableParams = {
        pagination,
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== null)
        ),
        ...form.getFieldsValue(),
      };

      // 处理排序
      if ('field' in sorter && sorter.field && sorter.order) {
        params.sortField = sorter.field as string;
        params.sortOrder = sorter.order;
      }

      setTableParams(params);
      onChange?.(params);
    },
    [form, onChange]
  );

  // 处理搜索
  const handleSearch = useCallback(async () => {
    const values = await form.validateFields();
    const newParams = {
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
      ...values,
    };
    setTableParams(newParams);
    onSearch?.(values);
    onChange?.(newParams);
  }, [form, onSearch, onChange, tableParams]);

  // 处理重置
  const handleReset = useCallback(() => {
    form.resetFields();
    const newParams = {
      ...defaultParams,
      pagination: { ...tableParams.pagination, current: 1 },
    };
    setTableParams(newParams);
    onReset?.();
    onChange?.(newParams);
  }, [form, onReset, onChange, defaultParams, tableParams]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    onChange?.(tableParams);
    onRefresh?.();
  }, [onChange, onRefresh, tableParams]);

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
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            </Tooltip>
          )}
        </Space>
      </div>
    );
  };

  // 渲染搜索表单
  const renderSearchForm = () => {
    if (!searchForm) return null;

    return (
      <Form form={form} className="mb-4">
        <div className="flex flex-wrap gap-4">
          {searchForm}
          <Form.Item className="flex-none mb-0">
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    );
  };

  return (
    <Card
      {...cardProps}
      className={classNames('w-full', className)}
      bodyStyle={{ padding: '16px 24px' }}
    >
      {renderSearchForm()}
      {renderToolbar()}
      <div className="w-full overflow-auto">
        <AntTable<T>
          {...restProps}
          columns={columns}
          scroll={{ x: minWidth, ...scroll }}
          loading={loading}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
          className="w-full"
        />
      </div>
    </Card>
  );
}

export default Table; 