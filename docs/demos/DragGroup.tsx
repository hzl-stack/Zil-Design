/**
 * title: 拖拽组demo
 */

import DragGroup from '@zil-design/zil-ui/src/DragGroup/DragGroup';
import React, { useState } from 'react';

const DragGroupDemo = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <DragGroup
        initValueEnum={[
          { label: '篮球', value: 'basketball' },
          { label: '足球', value: 'football' },
          { label: '橄榄球', value: 'rugby', isDraggable: false },
          { label: '乒乓球', value: 'table-tennis', allowDelete: false },
        ]}
        onChange={(v) => {
          setValue(JSON.stringify(v, null, 2));
        }}
      />
      <br />
      <pre style={{ fontSize: 14, fontWeight: 400 }}>
        <div style={{ fontWeight: 'bold' }}>此处为拖拽后的值：</div>
        <br />
        {value}
      </pre>
    </>
  );
};

export default DragGroupDemo;
