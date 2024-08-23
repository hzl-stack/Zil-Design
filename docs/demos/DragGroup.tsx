import DragGroup from '@zil-design/zil-ui/src/DragGroup/DragGroup';
import React from 'react';

const DragGroupDemo = () => {
  return (
    <DragGroup
      initValueEnum={[
        { label: '篮球', value: 'basketball' },
        { label: '足球', value: 'football' },
      ]}
    />
  );
};

export default DragGroupDemo;
