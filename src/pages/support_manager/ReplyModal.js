import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useToastContext from 'hooks/useToastContext'
import ErrorMessage from 'components/ErrorMessage'
import { useTranslation } from 'react-i18next'
import { apiPost } from 'utils/apiFetch'
import pathObj from 'utils/apiPath'

const ReplyModal = ({ setIsReply, item, getSupportRequest }) => {
  const { t } = useTranslation()
  const notification = useToastContext()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {}
  })
  const [addMerchantLoading, setAddMerchantLoading] = useState(false)

  const onSubmit = async data => {
    setAddMerchantLoading(true)
    try {
      const payload = {
        ...data,
        email: item?.user?.email,
        userId:item?.user?._id,
        
      }
      const res = await apiPost(pathObj.sendFeedbackEmail, payload)
      if (res?.data?.success === true) {
        notification.success(res?.data?.message)
        getSupportRequest()
        setIsReply(false)
      } else {
        notification.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err:', err)
    } finally {
      setAddMerchantLoading(false)
    }
  }
  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='md:py-4 sm:px-2 sm:py-8 px-7'>
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px]'>
              <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                <h3 className='text-xl font-semibold'>{t('Reply')}</h3>
                <button
                  className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                  onClick={() => setIsReply(false)}
                >
                  <span className=' text-[#B8BBBF]  text-4xl '>×</span>
                </button>
              </div>
              <div className='relative p-6 flex-auto'>
                <div className='grid sm:grid-cols-1'>
                  <div className='md:py-4 sm:px-2 sm:py-8 px-7'>
                    <div className='relative z-0 w-full group'>
                      <textarea
                        type='text'
                        name='replyMessage'
                        id='replyMessage'
                        autocomplete='off'
                        className='block py-4 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer'
                        placeholder=''
                        {...register('replyMessage', {
                          required: 'Please enter message.',

                          validate: value => {
                            return value.trim()
                              ? true
                              : 'White spaces not allowed.'
                          }
                        })}
                      />
                      <label
                        for='replyMessage'
                        className='peer-focus:font-normal absolute text-sm text-[#A5A5A5] dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-3 bg-white p-1 z-10 origin-[2] peer-focus:left-0 peer-focus:text-[#A5A5A5] peer-focus:text-lg peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8'
                      >
                        {t('O_MESSAGE')}
                        <span className='text-red-500'>*</span>
                      </label>
                      <ErrorMessage message={errors?.message?.message} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                <button
                  className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setIsReply(false)}
                >
                  {t('O_CLOSE')}
                </button>
                <button
                  className='bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150'
                  type='submit'
                  onClick={handleSubmit(onSubmit)}

                  // onClick={(e) => handleSubmit(e)}
                >
                  {addMerchantLoading
                    ? (
                      <div className='spinner-container'>
                        <div className='loading-spinner' />
                      </div>
                      )
                    : (
                      <>{t('O_SEND')}</>
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}

export default ReplyModal
