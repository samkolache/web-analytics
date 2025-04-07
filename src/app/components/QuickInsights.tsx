import React from 'react'
import SimpleMetric from './graphics/SimpleMetric'


const QuickInsights = () => {
  return (
    <div className='bg-white rounded-lg shadow-lg max-w-2xl p-8 m-6'>
      <div className='flex items-center justify-between mb-8 border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Quick Insights</h2>
        <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Excellent</span>
      </div>
      <div className='flex gap-12'>
      <SimpleMetric metric = "Accessbility" score = "82" tooltip = "Score is out of 100. Higher scores mean better support for users with disabilities." />
      <SimpleMetric metric = "Best Practices" score = "78" tooltip = "Score is out of 100. Higher scores reflect better web standards for performance, security, and maintainability." />
      <SimpleMetric metric = "SEO" score = "75" tooltip = "Score is out of 100. Higher scores mean better search engine optimization for greater visibility."  />
      </div>
      
      

      
    </div>
  )
}

export default QuickInsights


