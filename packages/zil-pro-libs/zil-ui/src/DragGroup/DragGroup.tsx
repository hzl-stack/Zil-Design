import { useUpdateEffect } from '@zil-design/zil-sdk';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import React, { ReactNode, useRef, useState } from 'react';
import trash from './assets/trash.svg';
import DragButton from './components/DragButton';
import './style.less';

export interface IDragGroupValueEnumProps {
  /**
   * 按钮文本
   */
  label?: string | number | ReactNode;
  /**
   * 按钮唯一标识
   */
  value: string | number | Record<any, any> | undefined;
  /**
   * 是否可以拖拽
   * @default true
   */
  isDraggable?: boolean;
  /**
   * 是否可以删除
   * @default true
   */
  allowDelete?: boolean;
}

export interface IDragGroupProps {
  /**
   * 初始值
   */
  initValueEnum: IDragGroupValueEnumProps[];
  /**
   * 类名
   */
  className?: string;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 拖动、删除等操作的回调事件，回调参数为变化后的值
   * @param v
   * @returns
   */
  onChange?: (v: IDragGroupValueEnumProps[]) => void;
}

const DragGroup = (props: IDragGroupProps) => {
  const { initValueEnum, className, style, onChange } = props;
  const [changeValueEnum, setChangeValueEnum] = useState(initValueEnum);

  const sourceKey = useRef();
  const targetKey = useRef();

  useUpdateEffect(() => {
    onChange?.(changeValueEnum);
  }, [changeValueEnum]);

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
            <div
              className="zil-drag-group-button-text"
              onDragEnd={(e) => {
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                onDragEnd={(e) => {
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.stopPropagation();
                }}
              >
                {record?.label}
              </div>
              {record?.allowDelete !== false && (
                <div
                  className="zil-drag-group-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChangeValueEnum(
                      changeValueEnum?.filter(
                        (cur) => cur.value !== record.value,
                      ),
                    );
                  }}
                >
                  <img src={trash} alt="" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DragGroup;
