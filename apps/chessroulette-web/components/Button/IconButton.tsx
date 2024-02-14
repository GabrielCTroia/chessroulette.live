import React from 'react';
import { Ensure } from '@xmatter/util-kit';
import { Icon } from '../Icon';
import { Button, ButtonProps } from './Button';

export type IconButtonProps = Ensure<Omit<ButtonProps, 'children'>, 'icon'>;

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconKind,
  ...props
}) => {
  return (
    <Button {...props}>
      <Icon name={icon} kind={iconKind} className="w-5 h-5" />
    </Button>
  );
};
