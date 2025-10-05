import React from 'react';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

interface FeatureWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onBack: () => void;
}

const FeatureWrapper: React.FC<FeatureWrapperProps> = ({ title, description, children, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors mb-6 group"
        aria-label="Back to dashboard"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="font-semibold text-sm">Back to Dashboard</span>
      </button>
      <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-[0_0_20px_#00000033]">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 max-w-3xl">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default FeatureWrapper;
