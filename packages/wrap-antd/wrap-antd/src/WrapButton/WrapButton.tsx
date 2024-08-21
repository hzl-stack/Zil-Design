import { Button } from '@zil-design/base-antd';
import React, { ReactNode } from 'react';

interface IWrapButtonProps {
  children?: ReactNode | string | number;
}

const WrapButton = (props: IWrapButtonProps) => {
  const { children, ...rest } = props;

  return <Button {...rest}>{children}</Button>;
};

export default WrapButton;
