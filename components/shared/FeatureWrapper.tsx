
import React from 'react';

interface FeatureWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FeatureWrapper: React.FC<FeatureWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-[0_0_20px_#00000033]">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 max-w-3xl">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default FeatureWrapper;