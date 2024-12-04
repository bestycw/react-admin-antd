import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import DictUtil from '@/utils/dict';

interface DictSelectProps extends Omit<SelectProps, 'options'> {
  dictCode: string;
}

const DictSelect: React.FC<DictSelectProps> = ({ dictCode, ...props }) => {
  const [options, setOptions] = useState<{ label: string; value: string; }[]>([]);

  useEffect(() => {
    const loadDict = async () => {
      const items = await DictUtil.getDict(dictCode);
      setOptions(items.map(item => ({
        label: item.itemLabel,
        value: item.itemValue
      })));
    };
    loadDict();
  }, [dictCode]);

  return <Select options={options} {...props} />;
};

export default DictSelect; 