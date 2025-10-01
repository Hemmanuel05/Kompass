
import React from 'react';

interface FeatureWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FeatureWrapper: React.FC<FeatureWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default FeatureWrapper;
