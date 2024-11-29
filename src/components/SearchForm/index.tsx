import React, { useCallback, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Space, InputNumber } from 'antd';
import { DownOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// import type { Dayjs } from 'dayjs';
import type { FormInstance } from 'antd/es/form';
import classNames from 'classnames';

const { RangePicker } = DatePicker;

export interface TableColumnType {
    title: string | React.ReactNode;
    dataIndex?: string;
    key?: string;
    valueType?: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'custom';
    hideInSearch?: boolean;
    hideInTable?: boolean;
    width?: number | string;
    fixed?: 'left' | 'right' | boolean;
    required?: boolean;
    rules?: any[];
    fieldProps?: Record<string, any>;
    valueEnum?: Record<string | number, { text: string; status?: string }>;
    render?: (...args: any[]) => React.ReactNode;
    renderFormItem?: (form: FormInstance) => React.ReactNode;
    search?: {
        transform?: (value: any) => any;
    };
    [key: string]: any;
}

interface SearchFormProps {
    columns: TableColumnType[];
    onSearch: (values: any) => void;
    onReset?: () => void;
    loading?: boolean;
    form?: FormInstance;
    defaultCollapsed?: boolean;
    showCollapseButton?: boolean;
}

const DEFAULT_SHOW_ROWS = 1;
const ITEMS_PER_ROW = 3;

const SearchForm: React.FC<SearchFormProps> = ({
    columns,
    onSearch,
    onReset,
    loading,
    form: propForm,
    defaultCollapsed = true,
    showCollapseButton = true,
}) => {
    const [form] = Form.useForm();
    const finalForm = propForm || form;
    const [expanded, setExpanded] = useState(!defaultCollapsed);

    const searchColumns = columns.filter(col => !col.hideInSearch);
    const visibleColumns = expanded 
        ? searchColumns 
        : searchColumns.slice(0, DEFAULT_SHOW_ROWS * ITEMS_PER_ROW);

    const renderFormItem = (column: TableColumnType) => {
        if (column.renderFormItem) {
            return column.renderFormItem(finalForm);
        }

        const { valueType = 'text', fieldProps = {}, valueEnum } = column;

        const commonProps = {
            placeholder: valueType === 'select' ? `请选择${column.title}` : `请输入${column.title}`,
            allowClear: true,
            ...fieldProps,
        };

        switch (valueType) {
            case 'select':
                return (
                    <Select
                        {...commonProps}
                        options={
                            valueEnum
                                ? Object.entries(valueEnum).map(([value, { text }]) => ({
                                    label: text,
                                    value,
                                }))
                                : fieldProps.options || []
                        }
                    />
                );
            case 'date':
                return <DatePicker {...commonProps} style={{ width: '100%' }} />;
            case 'dateRange':
                return (
                    <RangePicker
                        {...commonProps}
                        style={{ width: '100%' }}
                        placeholder={['开始日期', '结束日期']}
                    />
                );
            case 'number':
                return <InputNumber {...commonProps} style={{ width: '100%' }} />;
            default:
                return <Input {...commonProps} />;
        }
    };

    const handleSearch = async () => {
        try {
            const values = await finalForm.validateFields();
            // 处理数据转换
            const transformedValues = searchColumns.reduce((acc, column) => {
                if (!column.dataIndex) return acc;
                const value = values[column.dataIndex];
                if (value !== undefined && value !== '') {
                    acc[column.dataIndex] = column.search?.transform
                        ? column.search.transform(value)
                        : value;
                }
                return acc;
            }, {} as Record<string, any>);
            
            onSearch(transformedValues);
        } catch (error) {
            console.error('Search form validation failed:', error);
        }
    };

    const handleReset = () => {
        finalForm.resetFields();
        onReset?.();
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const showToggle = showCollapseButton && searchColumns.length > DEFAULT_SHOW_ROWS * ITEMS_PER_ROW;

    return (
        <Form form={finalForm} className="mb-4">
            <div className="transition-all duration-300 ease-in-out" style={{ 
                maxHeight: expanded ? '1000px' : '200px',
                overflow: 'hidden'
            }}>
                <Row gutter={[16, 8]}>
                    {visibleColumns.map((column) => (
                        <Col 
                            key={column.dataIndex}
                            xs={24} 
                            sm={12}
                            md={8}
                            lg={8}
                        >
                            <Form.Item
                                label={column.title}
                                name={column.dataIndex}
                                rules={column.required ? [{ required: true, message: `请输入${column.title}` }] : column.rules}
                                className="mb-2"
                            >
                                {renderFormItem(column)}
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </div>
            <Row>
                <Col span={24} className="flex justify-end" style={{ marginTop: 12 }}>
                    <Space size="small">
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            loading={loading}
                            icon={<SearchOutlined />}
                        >
                            搜索
                        </Button>
                        <Button onClick={handleReset} icon={<ReloadOutlined />}>
                            重置
                        </Button>
                        {showToggle && (
                            <Button
                                type="link"
                                onClick={toggleExpand}
                                className="px-0"
                            >
                                <span className="flex items-center">
                                    {expanded ? '收起' : '展开'}
                                    <span className={classNames(
                                        'transition-transform duration-300 inline-flex ml-1',
                                        { 'rotate-180': expanded }
                                    )}>
                                        <DownOutlined />
                                    </span>
                                </span>
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};

export default SearchForm; 