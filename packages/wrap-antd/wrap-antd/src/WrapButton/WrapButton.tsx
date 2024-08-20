import { Button } from '@Zil-Design/node_modules/antd/es/index';
import React, { ReactNode } from 'react';

interface IWrapButtonProps {
  children?: ReactNode | string | number;
}

const WrapButton = (props: IWrapButtonProps) => {
  const { children, ...rest } = props;

  return <Button {...rest}>{children}</Button>;
};

export default WrapButton;
