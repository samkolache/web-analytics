'use client';
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const AutomationDetails = () => {
  const { analyticsData } = useAnalytics();
  const [testUrl, setTestUrl] = useState('');
  const [testDate, setTestDate] = useState('');

  // Safe value getter
  const getSafeValue = (property, defaultValue = 0) => {
    if (!analyticsData) return defaultValue;
    return analyticsData[property] !== undefined ? analyticsData[property] : defaultValue;
  };

  // Format server response time with ms
  const formatResponseTime = () => {
    const value = getSafeValue('avgServerResponseTime');
    return value ? `${value.toFixed(0)} ms` : "N/A";
  };

  // Get status based on response time
  const getResponseTimeStatus = () => {
    const responseTime = getSafeValue('avgServerResponseTime');
    
    if (responseTime <= 100) return "Excellent";
    if (responseTime <= 300) return "Good";
    if (responseTime <= 600) return "Average";
    return "Poor";
  };

  // Get color based on status
  const getStatusColor = () => {
    const status = getResponseTimeStatus();
    switch (status) {
      case "Excellent": return "bg-green-100 text-green-600";
      case "Good": return "bg-blue-100 text-blue-600";
      case "Average": return "bg-yellow-100 text-yellow-600";
      case "Poor": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  // Listen for localStorage changes from Modal component
  useEffect(() => {
    // Try to get URL from localStorage
    const storedUrl = localStorage.getItem('analyzedUrl');
    if (storedUrl) {
      setTestUrl(storedUrl);
    }

    // Set current date and time when analytics data changes
    if (analyticsData) {
      const now = new Date();
      
      // Format: April 4, 2025 • 03:55 UTC
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      };
      
      setTestDate(now.toLocaleDateString('en-US', options));
    }
  }, [analyticsData]);

  return (
    <div className='bg-white rounded-lg shadow-lg max-w-2xl p-8 m-6'>
      <div className='flex items-center justify-between mb-8 border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Automation Details</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">Desktop</span>
      </div>
      <div className='flex flex-col gap-6'>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">URL Tested</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-800 font-medium truncate">{testUrl || "No URL tested yet"}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Date Tested</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-800 font-medium">{testDate || "Not tested yet"}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Server Response Time</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-gray-800 font-medium">{formatResponseTime()}</span>
            <span className={`ml-2 px-2 py-1 ${getStatusColor()} text-xs font-medium rounded`}>
              {getResponseTimeStatus()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationDetails;