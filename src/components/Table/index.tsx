// import React from 'react';
import { Table as AntTable } from 'antd';
import type { TableProps } from 'antd';
import classNames from 'classnames';

export interface ResponsiveTableProps<T> extends TableProps<T> {
  className?: string;
}

function Table<T extends object = any>(props: ResponsiveTableProps<T>) {
  const {
    className,
    scroll,
    columns = [],
    ...restProps
  } = props;

  // 计算所有列的最小总宽度
  const minWidth = columns.reduce((total, col) => total + (col.width as number || 150), 0);

  return (
    <div className={classNames('w-full overflow-auto', className)}>
      <AntTable<T>
        {...restProps}
        columns={columns}
        scroll={{ x: minWidth, ...scroll }}
        className="w-full"
      />
    </div>
  );
}

export default Table; 