import React, { useState, useEffect } from 'react';
import { VisitorInfo } from './types';
import { DataProvider, useDataStore } from './context/DataContext';
import { LoginOverlay } from './components/LoginOverlay';
import { Navbar } from './components/Navbar';
import { UserView } from './components/UserView';
import { LoadingScreen } from './components/LoadingScreen';
import { FeedbackModal } from './components/FeedbackModal';
import { ToastViewport } from './components/ToastViewport';

function AppContent() {
  const { isInitialLoading, isRefreshing, showToast } = useDataStore();
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [visitor, setVisitor] = useState<VisitorInfo | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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

  const handleLogout = () => {
    sessionStorage.removeItem('alumni_visitor_info');
    setVisitor(null);
    setIsFeedbackOpen(false);
    setIsLoginOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    setIsFeedbackOpen(false);
    showToast('Sudah terkirim');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#202940] text-[#CAAA98] font-sans selection:bg-[#CAAA98] selection:text-[#202940]">
      <LoadingScreen isInitialLoading={isInitialLoading} isRefreshing={isRefreshing} />
      <LoginOverlay isOpen={isLoginOpen} onLogin={handleLogin} />
      <Navbar
        visitor={visitor}
        onOpenLogin={handleOpenLogin}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onLogout={handleLogout}
      />
      <UserView visitor={visitor} />
      {visitor && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          visitor={visitor}
          onClose={() => setIsFeedbackOpen(false)}
          onSubmitted={handleFeedbackSubmitted}
        />
      )}
      <ToastViewport />
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
