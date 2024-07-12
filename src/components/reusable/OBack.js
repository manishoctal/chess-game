import React from 'react'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const OBack = () => {
  return (
    <div className='flex active px-8 py-4'>
    <Link aria-current="page" className="" to={-1}>
      <FaCircleArrowLeft size={27} />
    </Link>
  </div>
  )
}

export default OBack