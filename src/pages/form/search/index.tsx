import React, { useCallback, useState, useMemo } from 'react';
import { 
    Card, 
    Form, 
    Input, 
    Select, 
    DatePicker, 
    Button, 
    Row, 
    Col, 
    Space,
    InputNumber,
    Radio,
    Checkbox,
    Cascader,
    TreeSelect,
    Switch
} from 'antd';
import { DownOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// import type { Dayjs } from 'dayjs';
import type { RouteConfig } from '@/types/route';
import type { FormInstance } from 'antd/es/form';
// import debounce from 'lodash/debounce';
import classNames from 'classnames';

const { RangePicker } = DatePicker;
// const { Option } = Select;

interface SearchField {
    label: string;
    name: string;
    type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'radio' | 'checkbox' | 'cascader' | 'treeSelect' | 'switch' | 'custom';
    required?: boolean;
    rules?: any[];
    options?: { label: string; value: any; children?: any[] }[];
    props?: Record<string, any>;
    render?: (form: FormInstance) => React.ReactNode;
}

const searchFields: SearchField[] = [
    {
        label: '关键词',
        name: 'keyword',
        type: 'input',
        props: {
            prefix: <SearchOutlined className="text-gray-400" />,
            allowClear: true
        }
    },
    {
        label: '状态',
        name: 'status',
        type: 'select',
        options: [
            { label: '全部', value: '' },
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
        ]
    },
    {
        label: '类型',
        name: 'type',
        type: 'radio',
        options: [
            { label: '全部', value: '' },
            { label: '类型A', value: 'A' },
            { label: '类型B', value: 'B' }
        ]
    },
    {
        label: '标签',
        name: 'tags',
        type: 'checkbox',
        options: [
            { label: '标签1', value: 'tag1' },
            { label: '标签2', value: 'tag2' },
            { label: '标签3', value: 'tag3' }
        ]
    },
    {
        label: '价格区间',
        name: 'price',
        type: 'number',
        props: {
            min: 0,
            max: 9999,
            precision: 2,
            prefix: '¥'
        }
    },
    {
        label: '分类',
        name: 'category',
        type: 'cascader',
        options: [
            {
                label: '分类1',
                value: 'cat1',
                children: [
                    { label: '子分类1', value: 'subcat1' },
                    { label: '子分类2', value: 'subcat2' }
                ]
            },
            {
                label: '分类2',
                value: 'cat2',
                children: [
                    { label: '子分类3', value: 'subcat3' },
                    { label: '子分类4', value: 'subcat4' }
                ]
            }
        ]
    },
    {
        label: '部门',
        name: 'department',
        type: 'treeSelect',
        props: {
            treeDefaultExpandAll: true,
            showSearch: true,
            treeNodeFilterProp: 'title'
        },
        options: [
            {
                label: '总部',
                value: 'HQ',
                children: [
                    { label: '研发部', value: 'RD' },
                    { label: '市场部', value: 'MK' }
                ]
            }
        ]
    },
    {
        label: '创建时间',
        name: 'createTime',
        type: 'dateRange'
    },
    {
        label: '是否推荐',
        name: 'isRecommended',
        type: 'switch'
    }
];

const DEFAULT_SHOW_ROWS = 1;
const ITEMS_PER_ROW = 3;

const SearchForm: React.FC = () => {
    const [form] = Form.useForm();
    const [expanded, setExpanded] = useState(false);

    const visibleFields = useMemo(() => {
        const defaultVisibleCount = DEFAULT_SHOW_ROWS * ITEMS_PER_ROW;
        return expanded ? searchFields : searchFields.slice(0, defaultVisibleCount);
    }, [expanded]);

    const handleSearch = useCallback((values: any) => {
        console.log('Search form values:', values);
    }, []);

    const handleReset = () => {
        form.resetFields();
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const renderFormItem = (field: SearchField) => {
        const commonProps = {
            ...(field.type !== 'switch' && {
                placeholder: field.type === 'select' ? `请选择${field.label}` : `请输入${field.label}`,
                allowClear: true,
            }),
            ...field.props
        };

        switch (field.type) {
            case 'input':
                return <Input {...commonProps} />;
            case 'select':
                return <Select {...commonProps} options={field.options} />;
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
            case 'radio':
                return <Radio.Group {...commonProps} options={field.options} />;
            case 'checkbox':
                return <Checkbox.Group {...commonProps} options={field.options} />;
            case 'cascader':
                return <Cascader {...commonProps} options={field.options} />;
            case 'treeSelect':
                return <TreeSelect {...commonProps} treeData={field.options} />;
            case 'switch':
                return <Switch checked={form.getFieldValue(field.name)} {...field.props} />;
            case 'custom':
                return field.render?.(form);
            default:
                return null;
        }
    };

    const showToggle = searchFields.length > DEFAULT_SHOW_ROWS * ITEMS_PER_ROW;

    return (
        <Card bodyStyle={{ padding: '12px 24px' }}>
            <Form
                form={form}
                name="search-form"
                onFinish={handleSearch}
                className="w-full"
            >
                <div className="transition-all duration-300 ease-in-out" style={{ 
                    maxHeight: expanded ? '1000px' : '200px',
                    overflow: 'hidden'
                }}>
                    <Row gutter={[16, 8]}>
                        {visibleFields.map((field) => (
                            <Col 
                                key={field.name}
                                xs={24} 
                                sm={12}
                                md={8}
                                lg={8}
                            >
                                <Form.Item
                                    label={field.label}
                                    name={field.name}
                                    rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : field.rules}
                                    className="mb-2"
                                >
                                    {renderFormItem(field)}
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </div>
                <Row>
                    <Col span={24} className="flex justify-end" style={{ marginTop: 12 }}>
                        <Space size="small">
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
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
        </Card>
    );
};

export default SearchForm; 
export const routeConfig: RouteConfig = {
    title: 'route.form.search',
    sort: 5,
};
