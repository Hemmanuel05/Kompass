import React, { useState, useMemo, useEffect } from 'react';
import { Feature } from './types';
import { FEATURES } from './constants';
import Dashboard from './components/Dashboard';
import FeatureWrapper from './components/shared/FeatureWrapper';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

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

  return (
    <div className="min-h-screen">
      <header className="py-8">
        <div
          className="text-center cursor-pointer group"
          onClick={() => handleSelectFeature(null)}
          aria-label="Go to dashboard"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold transition-transform group-hover:scale-105">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Kaito Kompass
            </span>
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        {!activeFeatureConfig ? (
          <Dashboard features={FEATURES} onSelectFeature={handleSelectFeature} />
        ) : (
          <FeatureWrapper
            title={activeFeatureConfig.title}
            description={activeFeatureConfig.description}
            onBack={() => handleSelectFeature(null)}
          >
            <activeFeatureConfig.component />
          </FeatureWrapper>
        )}
      </main>
    </div>
  );
};

export default App;
