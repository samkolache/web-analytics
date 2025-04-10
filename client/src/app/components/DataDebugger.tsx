'use client';

import React from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const DataDebugger = () => {
  const { analyticsData } = useAnalytics();

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg max-w-lg z-50 text-xs overflow-auto max-h-96">
      <h3 className="font-bold mb-2">Analytics Data Debug View</h3>
      {analyticsData ? (
        <pre>{JSON.stringify(analyticsData, null, 2)}</pre>
      ) : (
        <p className="text-red-500">No analytics data available</p>
      )}
    </div>
  );
};

export default DataDebugger;