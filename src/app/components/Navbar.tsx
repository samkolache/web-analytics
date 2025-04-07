import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav>
      <div className='flex justify-between items-center py-2 px-8 border-b border-black'>
        <Image 
        src = "./ClearMetrics.svg"
        width={150}
        height={150}
        alt='logo'
        />
        <div className='flex gap-4 items-center'>
            <ul className='flex gap-2'>
                <li className='text-lg'>Overview</li>
                <li className='text-lg'>Detailed Reports</li>
            </ul>
            <button className='px-4 py-2 bg-[#2963F9] text-white rounded-md font-medium'>Run Analytics</button>
        </div>
        
      </div>
    </nav>
  )
}

export default Navbar
