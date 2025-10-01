
import React from 'react';
import MenuIcon from './icons/MenuIcon';

interface MobileHeaderProps {
    onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 h-16 lg:hidden">
            <button 
              onClick={() => window.location.reload()} 
              className="text-center"
              aria-label="Go to dashboard"
            >
                <h1 className="text-xl font-extrabold">
                    <span className="text-gradient">Kaito Kompass</span>
                </h1>
            </button>
            <button onClick={onMenuClick} className="text-slate-200 hover:text-cyan-400 p-2" aria-label="Open menu">
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>
    );
}

export default MobileHeader;
