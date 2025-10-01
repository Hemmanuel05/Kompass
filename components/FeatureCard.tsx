
import React from 'react';
import type { FeatureConfig } from '../types';

interface FeatureCardProps {
  feature: FeatureConfig;
  onSelect: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onSelect }) => {
  const Icon = feature.icon;

  return (
    <div 
      className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-start cursor-pointer transition-all duration-300 group border border-slate-700/50 hover:border-cyan-400/70 hover:shadow-[0_0_20px_#06b6d44D] hover:-translate-y-2"
      onClick={onSelect}
    >
      <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-700 mb-4 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:bg-slate-700/50 group-hover:shadow-[0_0_15px_#06b6d480]">
        <Icon className="w-7 h-7 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;