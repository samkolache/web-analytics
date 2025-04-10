'use client'
import React from 'react'
import SimpleMetric from './graphics/SimpleMetric'
import { useAnalytics } from '@/contexts/AnalyticsContext'

const UserExpInsights = () => {
  const { analyticsData } = useAnalytics();

  // Safe value getter
  const getSafeValue = (property, defaultValue = 0) => {
    if (!analyticsData) return defaultValue;
    return analyticsData[property] !== undefined ? analyticsData[property] : defaultValue;
  };

  // Format value as seconds if it exists
  const formatSeconds = (property, defaultText = "N/A") => {
    const value = getSafeValue(property);
    return value ? `${value.toFixed(2)}s` : defaultText;
  };

  // Format value for CLS (Cumulative Layout Shift)
  const formatCLS = (property, defaultText = "N/A") => {
    const value = getSafeValue(property);
    return value !== undefined ? value.toFixed(3) : defaultText;
  };

  // Determine status based on metrics
  const getStatus = () => {
    const blockingTime = getSafeValue('avgTotalBlockingTime');
    const interactionPaint = getSafeValue('avgInteractionToNextPaint');
    const layoutShift = getSafeValue('avgCumulativeLayoutShift');
    
    // Google Lighthouse thresholds
    const isTBTGood = blockingTime < 200;
    const isINPGood = interactionPaint < 200;
    const isCLSGood = layoutShift < 0.1;
    
    // Count how many metrics are good
    const goodCount = (isTBTGood ? 1 : 0) + (isINPGood ? 1 : 0) + (isCLSGood ? 1 : 0);
    
    if (goodCount === 3) return "Excellent";
    if (goodCount === 2) return "Good";
    if (goodCount === 1) return "Average";
    return "Poor";
  };

  // Get status color
  const getStatusColor = () => {
    const status = getStatus();
    switch (status) {
      case "Excellent": return "bg-green-500";
      case "Good": return "bg-blue-500";
      case "Average": return "bg-yellow-500";
      case "Poor": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg max-w-2xl p-8 m-6'>
      <div className='flex items-center justify-between mb-8 border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>User Experience Insights</h2>
        <span className={`px-3 py-1 ${getStatusColor()} text-white text-sm font-medium rounded-full`}>
          {getStatus()}
        </span>
      </div>
      <div className='flex gap-12'>
        <SimpleMetric 
          metric="Total Blocking Time" 
          score={formatSeconds('avgTotalBlockingTime')} 
          tooltip="Time during which the page is blocked from responding to user input. Lower is better." 
        />
        <SimpleMetric 
          metric="Interaction to Next Paint" 
          score={formatSeconds('avgInteractionToNextPaint')} 
          tooltip="Time from when a user interacts with the page to when the browser produces a frame that responds to that interaction. Lower is better." 
        />
        <SimpleMetric 
          metric="Cumulative Layout Shift" 
          score={formatCLS('avgCumulativeLayoutShift')} 
          tooltip="Measures visual stability - how much page content unexpectedly shifts during loading. Lower is better." 
        />
      </div>
    </div>
  )
}

export default UserExpInsights