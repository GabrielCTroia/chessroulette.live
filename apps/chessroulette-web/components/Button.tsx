import React from 'react';
import { PropsWithChildren, useMemo } from 'react';

export type ButtonProps = PropsWithChildren<{
  type?: 'primary' | 'secondary' | 'clear';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>;

const classes = {
  md: 'p-3 px-5 rounded-xl',
  lg: '',
  sm: 'p-1 px-2 text-sm rounded-lg',
  primary: 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold',
  clear:
    'dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-gray-300 text-gray-600 font-bold dark:bg-slate-800 bg-slate-100',
  secondary: '',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  disabled,
  onClick,
  className,
  size = 'md',
}) => {
  return (
    <button
      className={`hover:cursor-pointer ${classes[type]} ${classes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
