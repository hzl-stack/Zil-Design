import React from 'react';
import DragGroup from '../../packages/zil-pro-libs/zil-ui/src/DragGroup';

const DragGroupDemo = () => {
  return (
    <DragGroup
      valueEnum={[
        { label: '篮球', value: 'basketball' },
        { label: '足球', value: 'football' },
      ]}
    />
  );
};

export default DragGroupDemo;
