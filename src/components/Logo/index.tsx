import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/store';
import logo from '@/assets/logo.png';
import getGlobalConfig from '@/config/GlobalConfig';

interface LogoProps {
    collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = observer(({ collapsed }) => {
    const { ConfigStore } = useStore();

    return (
        <div className="flex items-center gap-2 px-4 py-3">
            <img 
                src={logo} 
                alt="logo" 
                className="w-8 h-8"
                style={{ 
                    filter: `drop-shadow(0 0 2px ${ConfigStore.currentPresetColor})`
                }} 
            />
            {!collapsed && (
                <span 
                    className="text-lg font-semibold truncate transition-colors"
                    style={{ color: ConfigStore.currentPresetColor }}
                >
                   {getGlobalConfig('AdminName')}
                </span>
            )}
        </div>
    );
});

export default Logo; 