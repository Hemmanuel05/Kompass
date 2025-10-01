
import React, { useState, useMemo } from 'react';
import { Feature } from './types';
import { FEATURES } from './constants';
import Dashboard from './components/Dashboard';
import FeatureWrapper from './components/shared/FeatureWrapper';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';

interface AppContentProps {
  onLogout: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onLogout }) => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectFeature = (featureId: Feature | null) => {
    setActiveFeature(featureId);
    setIsSidebarOpen(false); // Close sidebar on selection
  };

  const activeFeatureConfig = useMemo(() => {
    if (!activeFeature) return null;
    return FEATURES.find(f => f.id === activeFeature);
  }, [activeFeature]);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar 
        features={FEATURES}
        activeFeature={activeFeature}
        onSelectFeature={handleSelectFeature}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={onLogout}
      />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pt-20 lg:pt-8">
          {!activeFeatureConfig ? (
            <Dashboard features={FEATURES} onSelectFeature={handleSelectFeature} />
          ) : (
            <FeatureWrapper 
              title={activeFeatureConfig.title}
              description={activeFeatureConfig.description}
            >
              <activeFeatureConfig.component />
            </FeatureWrapper>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppContent;
