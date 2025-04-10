'use client'
import React, { createContext, useState, useContext } from 'react';

const AnalyticsContext = createContext();

// In AnalyticsContext.tsx
export function AnalyticsProvider({ children }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  
  const setAnalyticsDataWithLog = (data) => {
    console.log("AnalyticsContext: Setting data:", data);
    setAnalyticsData(data);
  };

  return (
    <AnalyticsContext.Provider value={{ analyticsData, setAnalyticsData: setAnalyticsDataWithLog }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}