import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function Credential ({ setViewShowModal, email }) {
  const { register, setValue } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {
      email
    }
  })

  const closeModal = () => {
    setViewShowModal(false)
  }

  useEffect(() => {
    const decipher = salt => {
      const textToChars = text => text.split('').map(c => c.charCodeAt(0))
      const applySaltToChar = code =>
        textToChars(salt).reduce((a, b) => a ^ b, code)
      return encoded =>
        encoded
          ?.match(/.{1,2}/g)
          ?.map(hex => parseInt(hex, 16))
          ?.map(applySaltToChar)
          ?.map(charCode => String.fromCharCode(charCode))
          .join('')
    }
    const myDecipher = decipher('mySecretSalt')
    setValue('password', myDecipher(window.localStorage.getItem('pass')))
  }, [])

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px]'>
            <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
              <h3 className='text-xl font-semibold'>Login Credential</h3>
              <button
                className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                onClick={() => closeModal()}
              >
                <span className=' text-[#B8BBBF]  text-4xl ' title='Close'>
                  ×
                </span>
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <div className=''>
                <div>
                  <div className='sm:py-4 sm:px-2 py-8 px-7 grid grid-cols-2 gap-4'>
                    <div className='relative z-0  w-full group'>
                      <input
                        type='text'
                        name='email'
                        id='email'
                        disabled
                        className='block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'
                        placeholder=' '
                        {...register('email', {})}
                      />
                      <label
                        htmlFor='email'
                        className='peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                      >
                        Admin email
                      </label>
                    </div>
                    <div className='relative z-0   w-full group'>
                      <input
                        type='text'
                        name='password'
                        id='password'
                        className='block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'
                        placeholder=' '
                        required
                        disabled
                        {...register('password', {
                          required: true
                        })}
                      />
                      <label
                        htmlFor='password'
                        className='peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-2 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                      >
                        Password
                      </label>
                    </div>
                  </div>
                </div>
                <div />
              </div>
            </div>
            <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
              <button
                className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                type='button'
                onClick={() => setViewShowModal(false)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}
