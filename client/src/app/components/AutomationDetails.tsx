import React from 'react'


const CorePerformanceMetrics = () => {
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
            <span className="text-gray-800 font-medium truncate">https://www.countypets.com/</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Date Tested</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-800 font-medium">April 4, 2025 • 03:55 UTC</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-gray-500">Server Response Time</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-gray-800 font-medium">80 ms</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">Excellent</span>
          </div>
        </div>

      </div>
      
      

      
    </div>
  )
}

export default CorePerformanceMetrics


