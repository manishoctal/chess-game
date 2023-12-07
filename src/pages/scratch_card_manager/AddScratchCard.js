import ErrorMessage from 'components/ErrorMessage'
import { useForm } from 'react-hook-form'
import { apiPost } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import useToastContext from 'hooks/useToastContext'
import { useTranslation } from 'react-i18next'
import DynamicLabel from 'utils/DynamicLabel'
import ODatePicker from 'components/shared/datePicker/ODatePicker'
import { useState } from 'react'
import OInputField from 'components/reusable/OInputField'
import formValidation from 'utils/formValidation'
import dayjs from 'dayjs'

const AddScratchCard = ({ setShowModal, allScratchCard }) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onChange', shouldFocusError: true, defaultValues: {} })

  const [isLoading, setIsLoading] = useState(false)

  const notification = useToastContext()
  const [date, setDate] = useState()
  const [isValidityError, setIsValidityError] = useState(false)

  const handleSubmitForm = async data => {
    try {
      const path = apiPath.addScratchCard
      const payload = {
        ...data,
        expiryDate:  date ? dayjs(date).format('YYYY-MM-DD') : null,
        couponCode: data?.couponCode?.toUpperCase()
      }

      const result = await apiPost(path, payload)
      if (result?.data?.success === true) {
        notification.success(result?.data.message)
        allScratchCard()
        setShowModal(false)
      } else {
        notification.error(result?.data?.message)
      }
    } catch (error) {
      console.log('error:', error.message)
    }
  }

  const handleDateChange = dates => {
    setDate(dates)
    setIsValidityError(false)
  }

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='md:py-4 sm:px-2 sm:py-8 px-7'>
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]'>
              <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                <h3 className='text-xl font-semibold'>{t('ADD_NEW_COUPON')}</h3>
                <button
                  className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                  onClick={() => setShowModal(false)}
                >
                  <span className=' text-[#B8BBBF]  text-4xl ' title='Close'>
                    ×
                  </span>
                </button>
              </div>
              <div className='relative p-6 flex-auto'>
                <div className='grid grid-cols-2'>
                  <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                    <OInputField
                      wrapperClassName='relative z-0  w-full group'
                      name='couponCode'
                      inputLabel={
                        <>
                          {t('Coupon code')}
                          <span className='text-red-500'>*</span>
                        </>
                      }
                      type='text'
                      autoFocus
                      maxLength={15}
                      register={register(
                        'couponCode',
                        formValidation['couponCode']
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                    <OInputField
                      wrapperClassName='relative z-0   w-full group'
                      name='couponAmount'
                      inputLabel={
                        <>
                          {t('Coupon amount')}
                          <span className='text-red-500'>*</span>
                        </>
                      }
                      type='number'
                      maxLength={15}
                      register={register(
                        'couponAmount',
                        formValidation['couponAmount']
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                    <OInputField
                      wrapperClassName='relative z-0   w-full group'
                      name='rewardAmount'
                      inputLabel={
                        <>
                          {t('Reward amount')}
                          <span className='text-red-500'>*</span>
                        </>
                      }
                      type='number'
                      maxLength={15}
                      onKeyDown={e => {
                        if (['-', '+', 'e'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      register={register(
                        'rewardAmount',
                        formValidation['rewardAmount']
                      )}
                      errors={errors}
                    />
                  </div>

                  <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                    <OInputField
                      wrapperClassName='relative z-0   w-full group'
                      type='number'
                      name='numberOfUserCoupon'
                      id='numberOfUserCoupon'
                      inputLabel={
                        <>
                          {t('Number of user can use the coupon')}
                          <span className='text-red-500'>*</span>
                        </>
                      }
                      onKeyDown={e => {
                        if (['-', '+', 'e'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      register={register(
                        'numberOfUserCoupon',
                        formValidation['numberOfUserCoupon']
                      )}
                      errors={errors}
                    />
                  </div>
                  <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                    <div className='relative z-0  w-full group'>
                      <label
                        htmlFor='validity'
                        className='font-medium text-sm text-[#000] dark:text-gray-400  mb-2 block'
                      >
                        {t('Expiry date')}
                        <span className='text-red-500'>*</span>
                      </label>
                      <ODatePicker
                        name='validity'
                        id='validity'
                        value={date}
                        // disable={counponData !== undefined}
                        handleDateChange={handleDateChange}
                        minDate='today'
                      />

                      {isValidityError && (
                        <ErrorMessage message='Please select validity.' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                <button
                  className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setShowModal(false)}
                >
                  {t('O_BACK')}
                </button>

                {isLoading ? (
                  <div className='spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150'>
                    <div className='loading-spinner'></div>
                  </div>
                ) : (
                  <button
                    className='bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150'
                    type='submit'
                    onClick={handleSubmit(handleSubmitForm)}
                  >
                    {t('O_ADD')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}

export default AddScratchCard