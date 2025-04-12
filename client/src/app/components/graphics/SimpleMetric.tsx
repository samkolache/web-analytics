import React, {useState} from 'react'
import Info from '@mui/icons-material/Info';

const SimpleMetric = ({metric, score, tooltip}) => {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
      <div className='rounded-md shadow-md p-2 sm:p-3 flex flex-col justify-center items-center gap-2 w-full max-w-xs bg-gray-50 relative'>
        <h3 className='font-bold text-sm sm:text-base lg:text-lg border-b pb-1 w-full text-center'>{metric}</h3>
        <p className='text-base sm:text-lg lg:text-xl font-semibold'>{score}</p>
        <div 
          className='absolute right-2 bottom-2 cursor-pointer'
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info style={{ fontSize: 16 }} className='text-[#2963F9]' />
          {showTooltip && (
              <div className="absolute bottom-full right-0 mb-2 bg-white text-black text-xs rounded-md p-2 w-40 shadow-lg z-10">
                  {tooltip}
              <div className="absolute -bottom-1 right-2 w-2 h-2 bg-white rotate-45"></div>
          </div>
          )}
        </div>
      </div>
    )
}

export default SimpleMetric