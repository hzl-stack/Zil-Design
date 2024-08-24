import {
  IDragGroupProps,
  IDragGroupValueEnumProps,
} from '@zil-design/zil-ui/src/DragGroup/DragGroup';
import React from 'react';

export function DragGroup(props: IDragGroupProps) {
  console.log('DragGroup', props);

  return <div>{JSON.stringify(props)}</div>;
}

export function DragGroupValueEnum(props: IDragGroupValueEnumProps) {
  return <div>{JSON.stringify(props)}</div>;
}
