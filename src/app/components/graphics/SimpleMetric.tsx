import React, {useState} from 'react'
import Info from '@mui/icons-material/Info';

const SimpleMetric = ({metric, score, tooltip}) => {

    const [showTooltip, setShowTooltip] = useState(false)



  return (
    <div className=' rounded-md shadow-md p-4 flex flex-col justify-center items-center gap-3 w-64 bg-gray-50  relative'>
      <h3 className='font-bold text-lg border-b pb-2 w-full text-center'>{metric}</h3>
      <p className='text-xl font-semibold'>{score}</p>
      <div 
      className='absolute right-3 bottom-3 cursor-pointer'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      >
        <Info style={{ fontSize: 20 }} className='text-[#2963F9] ' />
        {showTooltip && (
            <div className="absolute top-12 right-0 bg-white text-black text-xs rounded-md  p-3 w-48 shadow-lg z-10">
                {tooltip}
            <div className="absolute -top-1 right-2 w-2 h-2 bg-white rotate-45"></div>
        </div>
        )}
      </div>
      
      
    </div>
  )
}

export default SimpleMetric
