import React, { createContext, useContext, useState, ReactNode } from 'react';

type StatusContextType = {
  criticalStatus: boolean;
  setCriticalStatus: (value: boolean) => void;
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [criticalStatus, setCriticalStatus] = useState(false);

  return (
    <StatusContext.Provider value={{ criticalStatus, setCriticalStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};