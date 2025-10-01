
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
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Welcome to your <span className="text-gradient">Kompass</span></h2>
        <p className="mt-2 text-lg text-slate-400">
          Select a tool below to communicate more clearly and engage authentically on X.
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