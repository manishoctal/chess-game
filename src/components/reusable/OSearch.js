import React from 'react'
import helpers from 'utils/helpers'

function OSearch({ searchTerm, setSearchTerm, placeholder,inputClass }) {
  return (
    <>
      <div className='absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none'>
        {helpers.ternaryCondition(!searchTerm, (
          <svg
            aria-hidden='true'
            className='w-4 h-4 text-[#A5A5A5] dark:text-gray-40'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        ), (
          ''
        ))}
      </div>
      <input
        type="search"
        id="default-search"
        className={`block w-full p-2 outline-none text-sm text-gray-900 2xl:min-w-[270px]  rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${inputClass||''}`}
        placeholder={placeholder}
        value={searchTerm}
        title=""
        required
        onChange={(e) => setSearchTerm(e?.target?.value)}
      />
    </>
  )
}

export default OSearch