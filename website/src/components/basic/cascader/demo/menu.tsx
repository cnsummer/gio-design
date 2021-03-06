import React from 'react';
import CascaderMenu from '@gio-design/components/es/components/cascader/menu';

import '@gio-design/components/es/components/cascader/style/index.css';
import '@gio-design/components/es/components/input/style/index.css';

const dataSource = [
  { label: 'option A', value: 'a' },
  { label: 'option B', value: 'b', children: [{ label: 'B-1', value: 'b-1' }] },
  {
    label: 'option C',
    value: 'c',
    children: [
      { label: 'Option C-1', value: 'c-1' },
      {
        label: 'Option C-2',
        value: 'c-2',
        children: [
          { label: 'Option C-2-1', value: 'c-2-1' },
          { label: 'Option C-2-2', value: 'c-2-2', children: [{ label: 'Option C-2-2-1', value: 'c-2-2-1' }] },
        ],
      },
    ],
  },
];

const Basic = (): JSX.Element => {
  return (
    <CascaderMenu
      style={{ minHeight: 160 }}
      header={<div>header</div>}
      footer={<div>footer</div>}
      dataSource={dataSource}
      onSelect={console.log}
      autoFocus={false}
    />
  );
};

export default Basic;
