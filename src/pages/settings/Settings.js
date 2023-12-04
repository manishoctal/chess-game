import ErrorMessage from '../../components/ErrorMessage'
import React, { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { apiGet, apiPut } from '../../utils/apiFetch'
import pathObj from '../../utils/apiPath'
import useToastContext from 'hooks/useToastContext'
import OButton from 'components/reusable/OButton'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import OInputField from 'components/reusable/OInputField'
import helper from '../../utils/helpers'
import imageDefault from '../../assets/images/No-image-found.jpg'

import apiPath from '../../utils/apiPath'
import {
  CashbackLabel,
  LoyaltyPointLabel,
  TransactionFeesField,
  TransactionFeesLabel
} from './Constant'
import OImage from 'components/reusable/OImage'
import { Link } from 'react-router-dom'
import Credential from './Credential'
import formValidation from 'utils/formValidation'
import { preventMaxInput } from 'utils/validations'

const Settings = () => {
  const { logoutUser, user, updatePageName } = useContext(AuthContext)
  const manager = user?.permission?.find(e => e.manager === 'setting') ?? {}
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { isDirty, errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {}
  })
  const [settingChangeLoading, setSettingChangeLoading] = useState(false)
  const [activeNav, setActiveNav] = useState(0)
  const [pic] = useState(user?.profile_pic ?? imageDefault)
  const [viewShowModal, setViewShowModal] = useState(false)

  const [profile, setProfile] = useState()
  const notification = useToastContext()

  const handleSubmitForm = async data => {
    try {
      setSettingChangeLoading(true)
      data.conversion_rate = parseInt(data.conversion_rate)
      data.buysCoupon = parseInt(data.buysCoupon)
      data.giftCard = parseInt(data.giftCard)
      const res = await apiPut(pathObj.updateSettings, data)
      if (res.data.success === true) {
        getSettings()
        notification.success(res?.data?.message)
      } else {
        notification.error(res?.data?.message)
      }
    } catch (err) {
      console.error('err:', err)
    } finally {
      setSettingChangeLoading(false)
    }
  }
  const handleUserView = () => {
    setViewShowModal(true)
  }
  const getSettings = async () => {
    try {
      const res = await apiGet(pathObj.getSettings)
      if (res) {
        reset(res?.data?.results)
      }
    } catch (error) {
      console.error('error:', error)

      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  useEffect(() => {
    getSettings()
  }, [])
  const preventMax = e => {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10)
    }
  }
  const preventMaxValue = e => {
    if (e.target.value.length > 5) {
      e.target.value = e.target.value.slice(0, 5)
    }
  }
  const preventMaxHundred = e => {
    if (e.target.value > 100) {
      e.target.value = e.target.value.slice(0, 2)
    }
  }
  useEffect(() => {
    updatePageName(t('SETTINGS'))
  }, [])

  const navigateTab = index => [setActiveNav(index)]

  const handelStatusChange = async item => {
    try {
      const payload = {
        isActive: !item?.isActive
      }
      const path = `${apiPath.changeEmailStatus}/${item?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result.data.message)
        // getEmailTemplate()
      }
      // }
    } catch (error) {
      console.error('error in get all users list==>>>>', error.message)
    }
  }
  const codeValue = watch('admin_mail_id') ? watch('admin_mail_id') : ''

  return (
    <section className=''>
      <form>
        <section className='sm:px-8 px-4 py-4 '>
          <div className='border xl:w-full round'>
            <header className='border-b  py-2 px-4 bg-gray-100 rounded-t-md '>
              <div className='font-semibold'>Setting</div>
            </header>
            <div className='bg-white py-6 px-4  rounded-b-md'>
              <div className='mb-4  w-full' style={{ marginLeft: '15px' }}>
                <div className='justify-center flex items-center'>
                  <div className='relative w-24 h-24 '>
                    <OImage
                      src={pic}
                      fallbackUrl='/images/user.png'
                      className='w-24 h-24 border'
                      alt=''
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                  <div className='pl-6  w-full flex align-center'>
                    <div>
                      {(manager?.add || user?.role === 'admin') && (
                        <Link to='/change-password'>
                          {' '}
                          <OButton
                            label={<>Change Password</>}
                            type='button'
                            loading={settingChangeLoading}
                          />
                        </Link>
                      )}
                    </div>

                    <div className='  '>
                      {(manager?.add || user?.role === 'admin') && (
                        <OButton
                          label={<>View Login Credentials</>}
                          type='button'
                          // disabled
                          onClick={() => handleUserView()}
                          loading={settingChangeLoading}
                        />
                      )}
                    </div>
                  </div>

                  
                </div>
              </div>

              <main className='justify-center aline-center flex flex-wrap grid  lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4' />
            </div>
          </div>
        </section>
      </form>

      <div className='border xl:w-full round'>
        <header className='border-b  py-2 px-4 bg-gray-100 rounded-t-md '>
          <div className='font-semibold'>Global Setting</div>
        </header>
        <div className='bg-white py-6 px-4  rounded-b-md'>
          {/* <main className='justify-center flex flex-wrap xl:[&>*]:mr-14 sm:[&>*]:mr-7 2xl:[&>*]:mr-14  sm:px-0 px-4 xl:[&>*]:w-3/12 sm:[&>*]:w-3/5 '> */}
          <main className='justify-center flex flex-wrap grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4'>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='text'
                inputLabel={<>Admin email address</>}
                id='admin_mail_id'
                value={codeValue.toLowerCase()}
                maxLength={50}
                autoComplete='off'
                onInput={e => preventMaxInput(e, 50)}
                register={register('admin_mail_id', formValidation['email'])}
                placeholder=' '
              />
              <ErrorMessage message={errors?.admin_mail_id?.message} />
            </div>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                inputLabel={<>Min withdrawal amount to bank</>}
                id='witdraw_money_to_bank_limit'
                register={register('witdraw_money_to_bank_limit', {
                  required: {
                    value: true,
                    message: 'Please enter minimum withdrawal amount to bank.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage
                message={errors?.witdraw_money_to_bank_limit?.message}
              />
            </div>

            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>Referral Bonus for tourist</>}
                maxLength={40}
                id='referral_bonus'
                register={register('referral_bonus', {
                  required: {
                    value: true,
                    message: 'Please enter referral bonus.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.referral_bonus?.message} />
            </div>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>Referral Bonus for locals</>}
                maxLength={40}
                id='referral_bonus'
                register={register('referral_bonus', {
                  required: {
                    value: true,
                    message: 'Please enter referral bonus.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.referral_bonus?.message} />
            </div>
            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                inputLabel={<>UPC code referral amount</>}
                name='addMoneyLimitMin'
                register={register('addMoneyLimitMin', {
                  required: {
                    value: true,
                    message: 'Please enter minimum add money limit.'
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'Only digits are allowed.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=''
              />

              <ErrorMessage message={errors?.addMoneyLimitMin?.message} />
            </div>
            <div className='mb-4  w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                id='signin_bonus'
                inputLabel={<>Sign up bonus</>}
                register={register('signin_bonus', {
                  required: {
                    value: true,
                    message: 'Please enter sign up bonus.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.signin_bonus?.message} />
            </div>

            

            {/* <div className=' w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>Add money limit (maximum)</>}
                maxLength={40}
                id='addMoneyLimitMax'
                register={register('addMoneyLimitMax', {
                  required: {
                    value: true,
                    message: 'Please enter maximum add money limit.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.addMoneyLimitMax?.message} />
            </div>

            <div className='mb-4  w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                inputLabel={<>Transfer money limit (minimum)</>}
                id='transferMoneyLimitMin'
                register={register('transferMoneyLimitMin', {
                  required: {
                    value: true,
                    message: 'Please enter minimum transfer money limit.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.transferMoneyLimitMin?.message} />
            </div> */}

            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                id='payment'
                inputLabel={<>Transfer money limit (maximum)</>}
                maxLength={40}
                register={register('transferMoneyLimitMax', {
                  required: {
                    value: true,
                    message: 'Please enter maximum transfer money limit.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.transferMoneyLimitMax?.message} />
            </div>
          </main>
        </div>
      </div>

      {/* <div className='border xl:w-full round'>
        <header className='border-b  py-2 px-4 bg-gray-100 rounded-t-md '>
          <div className='font-semibold'>Loyalty points</div>
        </header>
        <div className='bg-white py-6 px-4  rounded-b-md'>
          <main className='justify-center flex flex-wrap grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4'>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='text'
                inputLabel={<>Number of loyalty points(Points)</>}
                id='conversion_point'
                maxLength={50}
                autoComplete='off'
                register={register('conversion_point', {
                  required: {
                    value: true,
                    message: 'Please enter loyalty point.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
              />
              <ErrorMessage message={errors?.conversion_point?.message} />
            </div>
            <div className='mb-4  w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                id='conversion_rate'
                inputLabel={<>Conversion rate of loyalty point(ALL)</>}
                register={register('conversion_rate', {
                  required: {
                    value: true,
                    message: 'Please enter conversion rate.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.conversion_rate?.message} />
            </div>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                inputLabel={<>Utility loyalty point(%)</>}
                id='utilityLoyaltyPoint'
                register={register('utilityLoyaltyPoint', {
                  required: {
                    value: true,
                    message: 'Please enter utilities loyalty point.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.utilityLoyaltyPoint?.message} />
            </div>

            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>Buy gift card</>}
                maxLength={40}
                id='giftCard'
                register={register('giftCard', {
                  required: {
                    value: true,
                    message: 'Please enter gift card.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.giftCard?.message} />
            </div>

            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                inputLabel={<>Buy coupons</>}
                name='buysCoupon'
                register={register('buysCoupon', {
                  required: {
                    value: true,
                    message: 'Please enter minimum add money limit.'
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'Only digits are allowed.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=''
              />

              <ErrorMessage message={errors?.buysCoupon?.message} />
            </div>

            <div className=' w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>NFC payment</>}
                maxLength={40}
                id='nfc_payment'
                register={register('nfc_payment', {
                  required: {
                    value: true,
                    message: 'Please enter nfc payment.'
                  },
                  maxLength: {
                    value: 40,
                    message: 'Max limit is 40 characters.'
                  },
                  min: {
                    value: 1,
                    message: 'Minimum value must is 1.'
                  }
                })}
                placeholder=' '
              />
              <ErrorMessage message={errors?.nfc_payment?.message} />
            </div>
          </main>
        </div>
      </div> */}
      {(manager?.add || user?.role === 'admin') && (
        <div className='text-center mt-4'>
          <OButton
            disabled={!isDirty && true}
            label={<>{t('O_UPDATE')}</>}
            type='submit'
            onClick={handleSubmit(handleSubmitForm)}
            loading={settingChangeLoading}
          />
        </div>
      )}

      {viewShowModal ? (
        <Credential setViewShowModal={setViewShowModal} email={user?.email} />
      ) : null}
      
    </section>
  )
}

export default Settings
