"use client"
import React from 'react'
import PerformanceScoreCircle from './graphics/PerformanceScoreCircle'
import SimpleMetric from './graphics/SimpleMetric'
import { useAnalytics } from '@/contexts/AnalyticsContext'


const CorePerformanceMetrics = () => {
  const { analyticsData } = useAnalytics();

  return (
    <div className='bg-white rounded-md space-y-4 max-w-xl p-10 flex flex-col items-center m-4'>
      <h2 className='text-2xl font-bold text-gray-800'>Core Performance Metrics</h2>
      <PerformanceScoreCircle />
      <div className='space-y-8'>
        <div className='flex gap-8'>
            <SimpleMetric metric = "First Contentful Paint" 
            score = {analyticsData ? `${analyticsData.avgFirstContentfulPaint.toFixed(2)}s` : "N/A"}
            tooltip = "How fast the first piece of content appears" 
            />
            <SimpleMetric metric = "Largest Contentful Paint" 
            score = {analyticsData ? `${analyticsData.avgLargestContentfulPaint.toFixed(2)}s` : "N/A"}
            tooltip = "Time for the largest content to load" 
            />
        </div>
        <div className='flex gap-8'>
            <SimpleMetric metric = "Speed Index" 
            score = {analyticsData ? `${analyticsData.avgSpeedIndex.toFixed(2)}s` : "N/A"}
            tooltip = "How quickly the visible content loads" 
            />
            <SimpleMetric metric = "Time to Interactive" 
            score = {analyticsData ? `${analyticsData.avgTimeToInteractive.toFixed(2)}s` : "N/A"}
            tooltip = "When the page becomes fully interactive" 
            />
        </div>
        
      </div>
    </div>
  )
}

export default CorePerformanceMetrics



{/* <div>
        <h2 className="text-3xl">Core Performance Metrics</h2>
        
        <SimpleMetric metric = "First Contetful Paint" 
        score = "1.4 s" 
        tooltip = "How fast the first piece of content appears" 
        />
        
        
      
      </div> */}