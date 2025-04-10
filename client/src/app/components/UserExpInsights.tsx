import React from 'react'
import SimpleMetric from './graphics/SimpleMetric'


const UserExpInsights = () => {
  return (
    <div className='bg-white rounded-lg shadow-lg max-w-2xl p-8 m-6'>
      <div className='flex items-center justify-between mb-8 border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>User Experience Insights</h2>
        <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Poor</span>
      </div>
      <div className='flex gap-12'>
        <SimpleMetric metric = "Total Blocking Time" score = "1.4 s" tooltip = "When the page becomes fully interactive" />
        <SimpleMetric metric = "Interaction to Next Paint" score = "1.4 s" tooltip = "When the page becomes fully interactive" />
        <SimpleMetric metric = "Cumulative Layout Shift" score = "1.4 s" tooltip = "When the page becomes fully interactive" />
      </div>
      
      

      
    </div>
  )
}

export default UserExpInsights


