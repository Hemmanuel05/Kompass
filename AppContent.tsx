import React, { useState, useMemo, useEffect } from 'react';
import { Feature } from './types';
import { FEATURES } from './constants';
import Dashboard from './components/Dashboard';
import FeatureWrapper from './components/shared/FeatureWrapper';
import LogOutIcon from './components/icons/LogOutIcon';
import { getCurrentUser } from './services/authService';

interface AppContentProps {
  onLogout: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onLogout }) => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const user = getCurrentUser();

  const handleSelectFeature = (featureId: Feature | null) => {
    setActiveFeature(featureId);
  };

  useEffect(() => {
    // Scroll to top when feature changes
    window.scrollTo(0, 0);
  }, [activeFeature]);

  const activeFeatureConfig = useMemo(() => {
    if (!activeFeature) return null;
    return FEATURES.find(f => f.id === activeFeature);
  }, [activeFeature]);

  const ActiveComponent = activeFeatureConfig?.component;

  return (
    <div className="min-h-screen">
      <header className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div
          className="text-center cursor-pointer group"
          onClick={() => handleSelectFeature(null)}
          aria-label="Go to dashboard"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold transition-transform group-hover:scale-105 inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Kaito Kompass
            </span>
          </h1>
        </div>
        <div className="absolute top-0 right-4 sm:right-6 lg:right-8 h-full flex items-center">
            <button 
                onClick={onLogout} 
                className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Logout"
            >
                <LogOutIcon className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        {!activeFeatureConfig || !ActiveComponent ? (
          <Dashboard features={FEATURES} onSelectFeature={handleSelectFeature} />
        ) : (
          <FeatureWrapper
            title={activeFeatureConfig.title}
            description={activeFeatureConfig.description}
            onBack={() => handleSelectFeature(null)}
          >
            <ActiveComponent user={user} />
          </FeatureWrapper>
        )}
      </main>
    </div>
  );
};

export default AppContent;
