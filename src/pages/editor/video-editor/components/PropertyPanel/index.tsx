import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

interface PropertyPanelProps {
  selectedClip: string | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedClip }) => {
  if (!selectedClip) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 font-medium border-b">属性</div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          请选择一个片段
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 font-medium border-b">属性</div>
      <div className="p-4">
        <Form layout="vertical">
          <Form.Item label="名称">
            <Input />
          </Form.Item>
          <Form.Item label="持续时间">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="音量">
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
          <Form.Item label="速度">
            <Select>
              <Select.Option value={0.5}>0.5x</Select.Option>
              <Select.Option value={1}>1x</Select.Option>
              <Select.Option value={1.5}>1.5x</Select.Option>
              <Select.Option value={2}>2x</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PropertyPanel; 