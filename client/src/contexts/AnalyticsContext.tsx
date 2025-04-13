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
  analysisId?: string;
  status?: string;
}

interface AnalyticsContextType {
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetAnalyticsData: () => void; // Add this to the interface
}

// Create context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  analyticsData: null,
  setAnalyticsData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  resetAnalyticsData: () => {} // Add default implementation
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const setAnalyticsDataWithLog = (data: AnalyticsData | null) => {
    console.log("AnalyticsContext: Setting data:", data);
    setAnalyticsData(data);
  };

  // Move the function inside the component
  const resetAnalyticsData = () => {
    localStorage.removeItem('lastAnalysisData');
    localStorage.removeItem('lastAnalysisId');
    localStorage.removeItem('analyzedUrl');
    setAnalyticsData(null);
    console.log("Analytics data has been reset");
  };

  // Load previously saved analytics data on initial render
  useEffect(() => {
    // First try to get the most recent analysis data from localStorage
    const savedData = localStorage.getItem('lastAnalysisData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading saved analytics data:", parsedData);
        setAnalyticsData(parsedData);
      } catch (error) {
        console.error("Error parsing saved analytics data:", error);
      }
    } else {
      // If no saved data exists, check if there's a previous analysis ID
      const lastAnalysisId = localStorage.getItem('lastAnalysisId');
      
      if (lastAnalysisId) {
        // Fetch the data for this analysis ID
        const fetchAnalysisData = async () => {
          try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8000/api/analysis-status/${lastAnalysisId}`);
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.status === 'complete' && data.avgPerformanceScore !== undefined) {
                console.log("Fetched previous analysis data:", data);
                setAnalyticsData(data);
                
                // Save the data to localStorage for future reference
                localStorage.setItem('lastAnalysisData', JSON.stringify(data));
              }
            }
          } catch (error) {
            console.error("Error fetching previous analysis:", error);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchAnalysisData();
      }
    }
  }, []);

  // Debug data changes
  useEffect(() => {
    console.log("Analytics data in context updated:", analyticsData);
  }, [analyticsData]);

  return (
    <AnalyticsContext.Provider value={{ 
      analyticsData, 
      setAnalyticsData: setAnalyticsDataWithLog,
      isLoading,
      setIsLoading,
      resetAnalyticsData // Include the function in the context
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}