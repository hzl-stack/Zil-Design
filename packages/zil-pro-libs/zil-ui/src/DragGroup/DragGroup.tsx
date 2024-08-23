import WrapButton from '@zil-design/wrap-antd/src/WrapButton';
import React, { ReactNode } from 'react';

interface IDragGroupValueEnumProps {
  label?: string | number | ReactNode;
  value: string | number | Record<any, any>;
  isDraggable?: boolean;
}

interface IDragGroupProps {
  valueEnum: IDragGroupValueEnumProps[];
  className?: string;
  style?: React.CSSProperties;
}

const DragGroup = (props: IDragGroupProps) => {
  const { valueEnum, className, style } = props;

  return (
    <div className={className} style={style}>
      {valueEnum?.map((record: IDragGroupValueEnumProps, index) => {
        return <WrapButton key={index}>{record?.label || ''}</WrapButton>;
      })}
    </div>
  );
};

export default DragGroup;
