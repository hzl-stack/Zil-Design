// import { useUpdateEffect } from '@zil-design/zil-sdk';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import React, { ReactNode, useRef, useState } from 'react';
import DragButton from './components/DragButton';
import './style.less';

interface IDragGroupValueEnumProps {
  label?: string | number | ReactNode;
  value: string | number | Record<any, any> | undefined;
  isDraggable?: boolean;
}

interface IDragGroupProps {
  initValueEnum: IDragGroupValueEnumProps[];
  className?: string;
  style?: React.CSSProperties;
  onChange?: (v: IDragGroupValueEnumProps[]) => void;
}

const DragGroup = (props: IDragGroupProps) => {
  const { initValueEnum, className, style } = props;
  const [changeValueEnum, setChangeValueEnum] = useState(initValueEnum);

  const sourceKey = useRef();
  const targetKey = useRef();

  // useUpdateEffect(() => {
  //   onChange?.(changeValueEnum);
  // }, [changeValueEnum]);

  return (
    <div
      className={classNames('zil-drag-group-container', className)}
      style={style}
      onDragStart={(e) => {
        e.stopPropagation();
        sourceKey.current = (e.target as any).dataset.key;
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
        targetKey.current = (e.target as any).dataset.key;
      }}
      onDragEnd={() => {
        const sourceIndex = changeValueEnum
          ?.map((_) => _.value)
          ?.indexOf(sourceKey.current);
        const targetIndex = changeValueEnum
          ?.map((_) => _.value)
          ?.indexOf(targetKey.current);

        console.log(sourceIndex, targetIndex, targetKey);

        if (
          sourceIndex !== -1 &&
          targetIndex !== -1 &&
          changeValueEnum[sourceIndex].isDraggable !== false &&
          changeValueEnum[targetIndex].isDraggable !== false
        ) {
          const cloneValue = cloneDeep(changeValueEnum);
          const temp = cloneValue[sourceIndex];
          cloneValue[sourceIndex] = cloneValue[targetIndex];
          cloneValue[targetIndex] = temp;
          setChangeValueEnum(cloneValue);
          console.log(changeValueEnum);
        }
      }}
    >
      {changeValueEnum?.map((record: IDragGroupValueEnumProps, index) => {
        return (
          <div
            key={index}
            data-key={record.value}
            className="zil-drag-group-button"
            draggable
            onDragOver={(e) => {
              if (record.isDraggable !== false) e.preventDefault();
            }}
          >
            <DragButton visible={record.isDraggable} />
            <div className="zil-drag-group-button-text">
              <div>{record?.label}</div>
              <div />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DragGroup;
