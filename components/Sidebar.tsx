
import React from 'react';
import { Feature, FeatureConfig } from '../types';
import XIcon from './icons/XIcon';

interface SidebarProps {
  features: FeatureConfig[];
  activeFeature: Feature | null;
  onSelectFeature: (featureId: Feature | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ features, activeFeature, onSelectFeature, isOpen, setIsOpen }) => {
  return (
    <nav className={`fixed inset-y-0 left-0 w-72 bg-slate-900/70 backdrop-blur-lg border-r border-slate-700/50 p-4 flex flex-col h-screen z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center py-4 mb-6">
        <div 
          className="text-center cursor-pointer"
          onClick={() => onSelectFeature(null)}
        >
          <h1 className="text-3xl font-extrabold">
            <span className="text-gradient">Kaito Kompass</span>
          </h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white" aria-label="Close menu">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <ul className="flex-1 space-y-2 overflow-y-auto pr-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          return (
            <li key={feature.id}>
              <button
                onClick={() => onSelectFeature(feature.id)}
                className={`w-full flex items-center text-left p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mr-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                <span className="text-sm font-medium">{feature.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
