import { Button } from '@Zil-Design/node_modules/antd/es/index';
import React from 'react';

const WrapButton = (props) => {
  const { children, ...rest } = props;

  return <Button {...rest}>{children}</Button>;
};

export default WrapButton;
