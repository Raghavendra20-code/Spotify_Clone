import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'

function TextWithHover({ displayText, active, target}) {
  return (
    <Link to = {target}>
      <div className='flex items-center justify-start cursor-pointer'>
          <div 
          className={`${active?"text-white":"text-gray-500"} text-lg font-semibold hover:text-white `}>
              {displayText}
          </div>
      </div>
    </Link>
  )
}

export default TextWithHover
