import React from 'react'
import Loader from 'components/shared/loader'

const OButton = ({
  label,
  disabled = false,
  type,
  loading,
  onClick,
  extraClasses,
  style,
  title
}) => {
  return (
    <button
      className={`${disabled === false
        ? 'bg-gradientTo hover:bg-DarkBlue cursor-pointer '
        : 'bg-blue-300 '
        }  text-white  font-normal active:bg-slate-100 text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150
      ${extraClasses} `}
      style={style}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <span className='flex items-center'>
        {label}
        {loading &&
          <Loader />}
      </span>
    </button>
  )
}

export default OButton
