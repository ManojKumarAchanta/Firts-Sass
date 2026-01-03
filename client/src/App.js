import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProcessingToast } from './components/ProcessingToast';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ImageToolsPage } from './pages/ImageToolsPage';
import { PdfToolsPage } from './pages/PdfToolsPage';
import { DocToolsPage } from './pages/DocToolsPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const { view, theme } = useApp();

  if (view === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 font-sans flex ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />

      <main className="flex-1 md:ml-64 transition-all">
        <Header />

        {/* Dynamic Content */}
        <div className="p-4 md:p-8 min-h-[calc(100vh-64px)] bg-gray-50/50">
          {view === 'dashboard' && <DashboardPage />}
          {view === 'tool-image' && <ImageToolsPage />}
          {view === 'tool-pdf' && <PdfToolsPage />}
          {view === 'tool-doc' && <DocToolsPage />}
          {view === 'history' && <HistoryPage />}
        </div>
      </main>

      <ProcessingToast />
    </div>
  );
}

export default App;
