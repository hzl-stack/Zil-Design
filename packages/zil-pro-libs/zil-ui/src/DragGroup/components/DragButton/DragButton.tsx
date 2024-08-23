import classNames from 'classnames';
import React from 'react';
import dragPer from '../../assets/drag-per.svg';
import './style.less';

interface IDragButtonProps {
  className?: string;
  style?: React.CSSProperties;
  visible?: boolean;
}

const DragButton = (props: IDragButtonProps) => {
  const { className, visible = true, style } = props;
  return (
    <div
      style={{
        ...style,
        ...(visible ? {} : { visibility: 'hidden' }),
      }}
      className={classNames('zil-drag-button-per-svg-container', className)}
    >
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
      <img src={dragPer} alt="" draggable={false} />
    </div>
  );
};

export default DragButton;
