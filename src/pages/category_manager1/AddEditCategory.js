import React, { useState } from 'react'
import { apiPost, apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import { useForm } from 'react-hook-form'
import useToastContext from 'hooks/useToastContext'
import { useTranslation } from 'react-i18next'
import OInputField from 'components/reusable/OInputField'
import { preventMaxInput } from 'utils/validations'
import formValidation from '../../utils/formValidation'

const AddEditCategory = ({ onClose, allCategory, item, type }) => {
  const { t } = useTranslation()
  const notification = useToastContext()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: item?.name,
      amount: item?.amount,
      discountPercentage: item?.discountPercentage,
      planValidity: item?.planValidity,
      description: item?.description
    }
  })

  const renderButtonContent = () => {
    if (isLoading) {
      return (
        <div className='spinner-container bg-LightBlue text-black active:bg-emerald-600 font-normal text-sm px-8 ml-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'>
          <div className='loading-spinner' />
        </div>
      );
    } else {
      const buttonText = type === 'edit' ? t('O_EDIT') : t('O_ADD');
      return (
        <button
          type='submit'
          className='bg-gradientTo text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
        >
          {buttonText}
        </button>
      );
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      setIsLoading(true)
      let path
      console.log('add', type)
      if (type === 'add') {
        path = apiPath.categoryAllList
        const result = await apiPost(path, data)
        if (result.data.success) {
          allCategory()
          onClose()
          notification.success(result?.data.message)
        } else {
          notification.success(result?.data.message)
        }
      } else if (type === 'edit') {
        path = apiPath.categoryAllList + '/' + item._id
        const result = await apiPut(path, data)
        if (result.data.success) {
          allCategory()
          onClose()
          notification.success(result?.data.message)
        } else {
          notification.success(result?.data.message)
        }
      }
    } catch (error) {
      console.log('error in get all users list==>>>>', error)
      // notification.error(error.message)
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='md:py-3 sm:px-2 sm:py-8 px-7'>
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]'>
              <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                <h3 className='text-xl font-semibold'>{type === 'edit' ? 'Edit' : 'Add'} category</h3>
                <button className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none' onClick={onClose}><span className=' text-[#B8BBBF]  text-4xl ' title='Close'>×</span></button>
              </div>
              <form onSubmit={handleSubmit(handleSubmitForm)} method='post' className=''>

                <div className='p-4'>
                  <div className='relative flex-auto'>
                    <div className='grid grid-cols-1'>
                      <div className='relative z-0  w-full group md:py-3 sm:py-3 px-2'>
                        <OInputField
                          wrapperClassName='relative z-0  w-full group'
                          name='name'
                          inputLabel={<>{t('CATEGORY_NAME')}<span className='text-red-500'>*</span></>}
                          type='text'
                          maxLength={500}
                        // preventDecimal
                          onInput={(e) => preventMaxInput(e, 500)}
                          register={register('name', formValidation.categoryName)}
                          errors={errors}
                        />
                      </div>

                    </div>
                  </div>

                </div>
                <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                  <button
                    className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                    type='button'
                    onClick={onClose}
                  >
                    {t('O_BACK')}
                  </button>

                  {renderButtonContent()}
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}

export default AddEditCategory
