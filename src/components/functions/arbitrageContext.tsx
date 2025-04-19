// src/context/ArbitrageContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ArbitrageData {
  oddsA: number;
  oddsB: number;
}

interface ArbitrageContextProps {
  data: ArbitrageData | null;
  setData: (data: ArbitrageData | null) => void;
}

const ArbitrageContext = createContext<ArbitrageContextProps | undefined>(undefined);

export const ArbitrageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ArbitrageData | null>(null);

  return (
    <ArbitrageContext.Provider value={{ data, setData }}>
      {children}
    </ArbitrageContext.Provider>
  );
};

export const useArbitrage = () => {
  const context = useContext(ArbitrageContext);
  if (!context) {
    throw new Error('useArbitrage must be used within an ArbitrageProvider');
  }
  return context;
};
