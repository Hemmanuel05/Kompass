
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
      className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-start cursor-pointer transition-all duration-300 hover:-translate-y-1 group border border-slate-700/50 hover:border-cyan-400/50"
      onClick={onSelect}
    >
      <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-700 mb-4 transition-colors group-hover:border-cyan-400/50">
        <Icon className="w-7 h-7 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;