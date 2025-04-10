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
    <div className='bg-white rounded-md space-y-4 max-w-xl p-10 flex flex-col items-center m-4'>
      <h2 className='text-2xl font-bold text-gray-800'>Core Performance Metrics</h2>
      <PerformanceScoreCircle 
        score={Math.round(getSafeValue('avgPerformanceScore', 0))} 
      />
      <div className='space-y-8'>
        <div className='flex gap-8'>
            <SimpleMetric 
              metric="First Contentful Paint" 
              score={formatSeconds('avgFirstContentfulPaint')}
              tooltip="How fast the first piece of content appears" 
            />
            <SimpleMetric 
              metric="Largest Contentful Paint" 
              score={formatSeconds('avgLargestContentfulPaint')}
              tooltip="Time for the largest content to load" 
            />
        </div>
        <div className='flex gap-8'>
            <SimpleMetric 
              metric="Speed Index" 
              score={formatSeconds('avgSpeedIndex')}
              tooltip="How quickly the visible content loads" 
            />
            <SimpleMetric 
              metric="Time to Interactive" 
              score={formatSeconds('avgTimeToInteractive')}
              tooltip="When the page becomes fully interactive" 
            />
        </div>
      </div>
    </div>
  )
}

export default CorePerformanceMetrics