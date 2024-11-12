import React from 'react';
import { useStore } from '@/store';
import classNames from 'classnames';
import '@/styles/theme-style.scss';

interface ThemeContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemeContainer: React.FC<ThemeContainerProps> = ({ children, className }) => {
  const { ConfigStore } = useStore();
  
  return (
    <div className={classNames(
      'theme-container',
      `theme-${ConfigStore.themeStyle}`,
      ConfigStore.isDarkMode ? 'dark' : '',
      className
    )}>
      {children}
    </div>
  );
}; 