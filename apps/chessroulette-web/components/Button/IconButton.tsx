import React from 'react';
import { Ensure } from '@xmatter/util-kit';
import { Icon } from '../Icon';
import { Button, ButtonProps, buttonIconClasses } from './Button';

export type IconButtonProps = Ensure<Omit<ButtonProps, 'children'>, 'icon'>;

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconKind,
  ...props
}) => {
  return (
    <Button {...props}>
      <Icon name={icon} kind={iconKind} className={props.size ? buttonIconClasses[props.size] : ''} />
    </Button>
  );
};
