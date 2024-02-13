import React from 'react';
import { PropsWithChildren } from 'react';
import * as SolidIcons from '@heroicons/react/16/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';
import { Icon, IconProps } from './Icon';

export type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'type'
> &
  PropsWithChildren<{
    type?: 'primary' | 'secondary' | 'clear' | 'custom';
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    isActive?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    icon?: keyof typeof SolidIcons | keyof typeof OutlineIcons;
    iconKind?: IconProps['kind'];
    bgColor?: BgColor;
  }>;

type BgColor =
  | 'purple'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'yellow'
  | 'orange'
  | 'slate'
  | 'gray'
  | 'red'; // Add more colors

const getButtonColors = (color: BgColor) => ({
  initial: `bg-${color}-500`,
  hover: `bg-${color}-600`,
  active: `bg-${color}-800`,
});

const toStringColors = (p: {
  initial: string;
  hover: string;
  active: string;
}) => `${p.initial} hover:${p.hover} active:${p.active}`;

const classes = {
  md: 'p-3 px-5 rounded-xl',
  lg: '',
  sm: 'p-1 px-2 text-sm rounded-lg',
  xs: 'p-1 px-2 text-xs rounded-md',
  primary: `text-white font-bold ${toStringColors(getButtonColors('indigo'))}`,
  clear: `text-gray-300 font-bold ${getButtonColors('slate').active} hover:${
    getButtonColors('slate').hover
  }`,
  secondary: `${toStringColors(getButtonColors('slate'))}`,
  custom: '',
};

const typeToColors: {
  [k in NonNullable<Exclude<ButtonProps['type'], 'custom'>>]: BgColor;
} = {
  primary: 'indigo',
  secondary: 'slate',
  clear: 'slate',
  // custom: 'slate',
  // custom: '',
};

const iconClasses = {
  lg: 'h-6 w-6',
  md: 'h-5 w-5',
  sm: 'h-4 w-4',
  xs: 'h-3 w-3',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  disabled,
  isActive,
  onClick,
  className,
  size = 'md',
  icon,
  iconKind,
  bgColor,
  ...props
}) => {
  return (
    <button
      className={`hover:cursor-pointer ${classes[type]} ${classes[size]} ${
        disabled ? 'bg-slate-400 hover:bg-slate-400' : ''
      } flex items-center justify-center gap-1 ${className} ${
        bgColor ? getButtonColors(bgColor) : ''
      } ${
        isActive && type !== 'custom'
          ? getButtonColors(bgColor || typeToColors[type]).active
          : ''
      }`}
      onClick={onClick}
      disabled={disabled === true}
      {...props}
    >
      {icon && (
        <Icon kind={iconKind} name={icon} className={iconClasses[size]} />
      )}
      {children}
    </button>
  );
};
