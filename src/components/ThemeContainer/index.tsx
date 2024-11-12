import React from 'react';
import { useStore } from '@/store';
import classNames from 'classnames';
import '@/styles/theme-style.scss';

interface ThemeContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeContainer: React.FC<ThemeContainerProps> = ({
  children,
  className,
  style,
}) => {
  const { ConfigStore } = useStore();
  console.log('主题变化了')
  return (
    <div 
      className={classNames(
        'theme-container',
        `theme-${ConfigStore.themeStyle}`,
        ConfigStore.isDarkMode ? 'dark' : '',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}; 