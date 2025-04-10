'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define a proper interface for your analytics data
interface AnalyticsData {
  avgPerformanceScore: number;
  avgFirstContentfulPaint: number;
  avgSpeedIndex: number;
  avgLargestContentfulPaint: number;
  avgTimeToInteractive: number;
  avgAccessibility: number;
  avgBestPractices: number;
  avgSeo: number;
  avgTotalBlockingTime: number;
  avgInteractionToNextPaint: number;
  avgCumulativeLayoutShift: number;
  avgServerResponseTime: number;
  urlCount?: number;
}

interface AnalyticsContextType {
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData | null) => void;
}

// Create context with null as default value
const AnalyticsContext = createContext<AnalyticsContextType>({
  analyticsData: null,
  setAnalyticsData: () => {}
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  
  const setAnalyticsDataWithLog = (data: AnalyticsData | null) => {
    console.log("AnalyticsContext: Setting data:", data);
    setAnalyticsData(data);
  };

  // Debug data changes
  useEffect(() => {
    console.log("Analytics data in context updated:", analyticsData);
  }, [analyticsData]);

  return (
    <AnalyticsContext.Provider value={{ 
      analyticsData, 
      setAnalyticsData: setAnalyticsDataWithLog 
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}