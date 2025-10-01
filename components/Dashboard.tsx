
import React from 'react';
import FeatureCard from './FeatureCard';
import type { Feature, FeatureConfig } from '../types';

interface DashboardProps {
  features: FeatureConfig[];
  onSelectFeature: (featureId: Feature) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ features, onSelectFeature }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Kompass</span></h2>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
          A cyber-professional toolkit to navigate the crypto social landscape with precision and authenticity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard 
            key={feature.id} 
            feature={feature} 
            onSelect={() => onSelectFeature(feature.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;