import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StudyProvider } from './contexts/StudyContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { TimerPage } from './components/timer/TimerPage';
import { ChecklistPage } from './components/checklist/ChecklistPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Navbar, DesktopSidebar } from './components/layout/Navbar';
import { Subject } from './types';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (data) {
      setSelectedSubject(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'timer':
        return <TimerPage onNavigate={handleNavigate} />;
      case 'checklist':
        return selectedSubject ? (
          <ChecklistPage subject={selectedSubject} onNavigate={handleNavigate} />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        );
      case 'analytics':
        return <AnalyticsPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <DesktopSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="md:ml-64 pb-16 md:pb-0">
        {renderCurrentPage()}
      </div>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <StudyProvider>
          <AppContent />
        </StudyProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;