import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Navigation state
  const [view, setView] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // File processing state
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  // PDF tools state
  const [activeTab, setActiveTab] = useState('merge');

  // AI/Document state
  const [aiRenaming, setAiRenaming] = useState(null);
  const [docInput, setDocInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Reset state when switching views
  useEffect(() => {
    setFiles([]);
    setProcessing(false);
    setProgress(0);
    setCompleted(false);
    setDocInput('');
    setAiOutput('');
    setLandingMenuOpen(false);
    if (view !== 'landing') {
      setSidebarOpen(false);
    }
  }, [view]);

  const value = {
    // Navigation
    view,
    setView,
    sidebarOpen,
    setSidebarOpen,
    landingMenuOpen,
    setLandingMenuOpen,
    theme,
    setTheme,

    // File processing
    files,
    setFiles,
    processing,
    setProcessing,
    progress,
    setProgress,
    completed,
    setCompleted,

    // PDF tools
    activeTab,
    setActiveTab,

    // AI/Document
    aiRenaming,
    setAiRenaming,
    docInput,
    setDocInput,
    aiOutput,
    setAiOutput,
    aiLoading,
    setAiLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

