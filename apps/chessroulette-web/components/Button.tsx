import React from 'react';
import { PropsWithChildren } from 'react';
import * as Icons from '@heroicons/react/16/solid';

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
    size?: 'sm' | 'md' | 'lg';
    icon?: keyof typeof Icons;
  }>;

const classes = {
  md: 'p-3 px-5 rounded-xl',
  lg: '',
  sm: 'p-1 px-2 text-sm rounded-lg',
  primary: 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold',
  clear:
    'dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-gray-300 text-gray-600 font-bold dark:bg-slate-800 bg-slate-100',
  secondary: '',
  custom: '',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  disabled,
  onClick,
  className,
  size = 'md',
  icon,
  ...props
}) => {
  const Icon = icon ? Icons[icon] : null;

  return (
    <button
      className={`hover:cursor-pointer ${classes[type]} ${classes[size]} ${
        disabled ? 'bg-slate-400 hover:bg-slate-400' : ''
      } flex items-center justify-center gap-1 ${className}`}
      onClick={onClick}
      disabled={disabled === true}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5 inline" />}
      {children}
    </button>
  );
};
