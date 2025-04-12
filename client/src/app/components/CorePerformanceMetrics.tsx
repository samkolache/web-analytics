"use client"
import React from 'react'
import PerformanceScoreCircle from './graphics/PerformanceScoreCircle'
import SimpleMetric from './graphics/SimpleMetric'
import { useAnalytics } from '@/contexts/AnalyticsContext'

const CorePerformanceMetrics = () => {
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

  return (
    <div className='bg-white rounded-md shadow-md p-3 sm:p-4 lg:p-6 flex flex-col items-center max-w-full w-full'>
      <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-2'>Core Performance Metrics</h2>
      <PerformanceScoreCircle 
        score={Math.round(getSafeValue('avgPerformanceScore', 0))} 
      />
      <div className='w-full grid grid-cols-2 gap-2 sm:gap-3'>
        <SimpleMetric 
          metric="First Content Paint" 
          score={formatSeconds('avgFirstContentfulPaint')}
          tooltip="First content appears" 
        />
        <SimpleMetric 
          metric="Largest Content Paint" 
          score={formatSeconds('avgLargestContentfulPaint')}
          tooltip="Largest content loads" 
        />
        <SimpleMetric 
          metric="Speed Index" 
          score={formatSeconds('avgSpeedIndex')}
          tooltip="Visible content loads" 
        />
        <SimpleMetric 
          metric="Time to Interactive" 
          score={formatSeconds('avgTimeToInteractive')}
          tooltip="Page becomes interactive" 
        />
      </div>
    </div>
  )
}

export default CorePerformanceMetrics