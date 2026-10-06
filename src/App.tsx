import React, { useState, useEffect } from 'react';
import { VisitorInfo } from './types';
import { DataProvider, useDataStore } from './context/DataContext';
import { LoginOverlay } from './components/LoginOverlay';
import { Navbar } from './components/Navbar';
import { UserView } from './components/UserView';
import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { isInitialLoading, isRefreshing } = useDataStore();
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [visitor, setVisitor] = useState<VisitorInfo | null>(null);

  useEffect(() => {
    const savedVisitor = sessionStorage.getItem('alumni_visitor_info');
    if (savedVisitor) {
      try {
        const parsed = JSON.parse(savedVisitor);
        setVisitor(parsed);
        setIsLoginOpen(false);
      } catch (err) {
        console.error('Failed to parse visitor info', err);
      }
    }
  }, []);

  const handleLogin = (info: VisitorInfo) => {
    setVisitor(info);
    sessionStorage.setItem('alumni_visitor_info', JSON.stringify(info));
    setIsLoginOpen(false);
  };

  const handleOpenLogin = () => setIsLoginOpen(true);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#202940] text-[#CAAA98] font-sans selection:bg-[#CAAA98] selection:text-[#202940]">
      <LoadingScreen isInitialLoading={isInitialLoading} isRefreshing={isRefreshing} />
      <LoginOverlay isOpen={isLoginOpen} onLogin={handleLogin} />
      <Navbar visitor={visitor} onOpenLogin={handleOpenLogin} />
      <UserView visitor={visitor} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
