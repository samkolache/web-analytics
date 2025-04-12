'use client';
import React from 'react';
import CorePerformanceMetrics from "./components/CorePerformanceMetrics";
import AutomationDetails from "./components/AutomationDetails";
import QuickInsights from "./components/QuickInsights";
import UserExpInsights from "./components/UserExpInsights";
import LoadingIndicator from "./components/LoadingIndicator";
import { useAnalytics } from '@/contexts/AnalyticsContext';

export default function Home() {
  const { analyticsData, isLoading } = useAnalytics();

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoadingIndicator message="Loading website analytics data..." />
      </div>
    );
  }

  // Show empty state when no data is available
  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Website Performance Analyzer</h2>
          <p className="text-gray-600 mb-6">
            Click the "Run Analytics" button in the navbar to analyze a website and view performance metrics.
          </p>
          <div className="w-16 h-16 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-sm text-gray-500">
            Performance metrics will appear here after analysis is complete.
          </div>
        </div>
      </div>
    );
  }

  // Show analytics data when available
  return (
    <>
      <div className="flex min-h-full flex-wrap">
        <div className="flex flex-wrap items-center">
          <AutomationDetails />
          <CorePerformanceMetrics />
        </div>
        <div className="flex flex-col">
          <QuickInsights />
          <UserExpInsights />
        </div>
      </div>
    </>
  );
}