'use client';

import React from 'react';

const LoadingIndicator = ({ message = "Loading analytics data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-lg shadow-md">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-700 text-lg">{message}</p>
    </div>
  );
};

export default LoadingIndicator;