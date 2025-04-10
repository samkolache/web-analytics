'use client'
import React from 'react'
import SimpleMetric from './graphics/SimpleMetric'
import { useAnalytics } from '@/contexts/AnalyticsContext'

const QuickInsights = () => {
  const { analyticsData } = useAnalytics();

  // Safe value getter
  const getSafeValue = (property, defaultValue = 0) => {
    if (!analyticsData) return defaultValue;
    return analyticsData[property] !== undefined ? analyticsData[property] : defaultValue;
  };

  // Get score with rounding
  const getScore = (property) => {
    const value = getSafeValue(property);
    return value ? Math.round(value).toString() : "N/A";
  };

  // Determine status based on accessibility score
  const getStatus = () => {
    const accessibilityScore = getSafeValue('avgAccessibility');
    const seoScore = getSafeValue('avgSeo');
    const bestPracticesScore = getSafeValue('avgBestPractices');
    
    // Calculate average of the three scores
    const averageScore = (accessibilityScore + seoScore + bestPracticesScore) / 3;
    
    if (averageScore >= 90) return "Excellent";
    if (averageScore >= 70) return "Good";
    if (averageScore >= 50) return "Average";
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
        <h2 className='text-2xl font-bold text-gray-800'>Quick Insights</h2>
        <span className={`px-3 py-1 ${getStatusColor()} text-white text-sm font-medium rounded-full`}>
          {getStatus()}
        </span>
      </div>
      <div className='flex gap-12'>
        <SimpleMetric 
          metric="Accessibility" 
          score={getScore('avgAccessibility')} 
          tooltip="Score is out of 100. Higher scores mean better support for users with disabilities." 
        />
        <SimpleMetric 
          metric="Best Practices" 
          score={getScore('avgBestPractices')} 
          tooltip="Score is out of 100. Higher scores reflect better web standards for performance, security, and maintainability." 
        />
        <SimpleMetric 
          metric="SEO" 
          score={getScore('avgSeo')} 
          tooltip="Score is out of 100. Higher scores mean better search engine optimization for greater visibility."  
        />
      </div>
    </div>
  )
}

export default QuickInsights