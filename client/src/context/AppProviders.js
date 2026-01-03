import React from 'react';
import { AppProvider } from './AppContext';

export const AppProviders = ({ children }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

