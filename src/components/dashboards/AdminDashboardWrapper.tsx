import { useState } from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';
import { PromptBankPage } from '../admin/PromptBankPage';
import { AwardsLibraryPage } from '../admin/AwardsLibraryPage';
import { ModelsRoutingPage } from '../admin/ModelsRoutingPage';

type AdminView = 'dashboard' | 'promptBank' | 'awardsLibrary' | 'modelsRouting';

interface AdminDashboardWrapperProps {
  onLogout: () => void;
}

export function AdminDashboardWrapper({ onLogout }: AdminDashboardWrapperProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const handleNavigateToPromptBank = () => {
    setCurrentView('promptBank');
  };

  const handleNavigateToAwardsLibrary = () => {
    setCurrentView('awardsLibrary');
  };

  const handleNavigateToModelsRouting = () => {
    setCurrentView('modelsRouting');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <AdminDashboardPage 
          onLogout={onLogout}
          onNavigateToPromptBank={handleNavigateToPromptBank}
          onNavigateToAwardsLibrary={handleNavigateToAwardsLibrary}
          onNavigateToModelsRouting={handleNavigateToModelsRouting}
        />
      )}

      {currentView === 'promptBank' && (
        <PromptBankPage 
          onBack={handleBackToDashboard}
          onLogout={onLogout}
        />
      )}

      {currentView === 'awardsLibrary' && (
        <AwardsLibraryPage 
          onBack={handleBackToDashboard}
          onLogout={onLogout}
        />
      )}

      {currentView === 'modelsRouting' && (
        <ModelsRoutingPage 
          onBack={handleBackToDashboard}
          onLogout={onLogout}
        />
      )}
    </>
  );
}
