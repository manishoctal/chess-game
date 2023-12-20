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
import imageDefault from '../../assets/images/No-image-found.jpg'

import OImage from 'components/reusable/OImage'
import { Link } from 'react-router-dom'
import Credential from './Credential'
import formValidation from 'utils/formValidation'
import { preventMaxInput } from 'utils/validations'

const Settings = () => {
  const { logoutUser, user, updatePageName } = useContext(AuthContext)
  const manager = user?.permission?.find(e => e.manager === 'settings') ?? {}
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    watch,

    formState: { isDirty, errors }
  } = useForm({
    mode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {}
  })
  const [settingChangeLoading, setSettingChangeLoading] = useState(false)
  const [pic] = useState(user?.profilePic ?? imageDefault)
  const [viewShowModal, setViewShowModal] = useState(false)

  const notification = useToastContext()

  const handleSubmitForm = async data => {
    try {
      setSettingChangeLoading(true)

      const res = await apiPut(pathObj.getSettings, data)
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

  useEffect(() => {
    updatePageName(t('SETTINGS'))
  }, [])

  const codeValue = watch('email') ? watch('email') : ''

  return (
    <section className=''>
      <form>
        <section className='sm:px-8 px-4 py-4 '>
          <div className='border xl:w-full round'>
            <header className='border-b  py-2 px-4 bg-gray-100 rounded-t-md '>
              <div className='font-semibold'>{t('SETTING')}</div>
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
                            label={<>{t('CHANGE_PASSWORD')}</>}
                            type='button'
                            loading={settingChangeLoading}
                            title={t('CHANGE_PASSWORD')}
                          />
                        </Link>
                      )}
                    </div>

                    <div className='  '>
                      <OButton
                        label={<>{t('VIEW_LOGIN_CREDENTIALS')}</>}
                        type='button'
                        // disabled
                        onClick={() => handleUserView()}
                        loading={settingChangeLoading}
                        title={t('VIEW_LOGIN_CREDENTIALS')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <main className='justify-center aline-center  flex-wrap grid  lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4' />
            </div>
          </div>
        </section>
      </form>

      <div className='border xl:w-full round'>
        <header className='border-b  py-2 px-4 bg-gray-100 rounded-t-md '>
          <div className='font-semibold'>{t('SETTINGS')}</div>
        </header>
        <div className='bg-white py-6 px-4  rounded-b-md'>
          <main className='justify-center  flex-wrap grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4'>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='text'
                inputLabel={<>{t('ADMIN_EMAIL_ADDRESS')}</>}
                id='email'
                value={codeValue.toLowerCase()}
                maxLength={50}
                autoComplete='off'
                onInput={e => preventMaxInput(e, 50)}
                register={register('email', formValidation['email'])}
                placeholder=' '
                disable={manager?.add === false}
              />
              <ErrorMessage message={errors?.email?.message} />
            </div>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                maxLength={40}
                disable={manager?.add === false}
                inputLabel={<>{t('MIN_WITHDRAWAL_AMOUNT_TO_BANK')}</>}
                id='minWithdrawAmountToBank'
                register={register('minWithdrawAmountToBank', {
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
                message={errors?.minWithdrawAmountToBank?.message}
              />
            </div>

            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                type='number'
                wrapperClassName='relative z-0  w-full group'
                disable={manager?.add === false}
                inputLabel={<>{t('REFERRAL_BONUS_FOR_TOURIST')}</>}
                maxLength={40}
                id='referralBonusTourist'
                register={register('referralBonusTourist', {
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
              <ErrorMessage message={errors?.referralBonusTourist?.message} />
            </div>
            <div className='relative z-0 mb-6 w-full group'>
              <OInputField
                type='number'
                disable={manager?.add === false}
                wrapperClassName='relative z-0  w-full group'
                inputLabel={<>{t('REFERRAL_BONUS_FOR_LOCALS')}</>}
                maxLength={40}
                id='referralBonusLocals'
                register={register('referralBonusLocals', {
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
              <ErrorMessage message={errors?.referralBonusLocals?.message} />
            </div>
            <div className='w-full'>
              <OInputField
                type='number'
                maxLength={40}
                inputLabel={<>{t('UPC_CODE_REFERRAL_AMOUNT')}</>}
                wrapperClassName='relative z-0  w-full group'
                name='upcCodeReferralAmount'
                disable={manager?.add === false}
                register={register('upcCodeReferralAmount', {
                  required: {
                    value: true,
                    message: 'Please enter upc code referral amount.'
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

              <ErrorMessage message={errors?.upcCodeReferralAmount?.message} />
            </div>
            <div className='mb-4  w-full'>
              <OInputField
                type='number'
                id='signupBonus'
                maxLength={40}
                wrapperClassName='relative z-0  w-full group'
                disable={manager?.add === false}
                inputLabel={<>{t('SIGN_UP_BONUS')}</>}
                register={register('signupBonus', {
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
              <ErrorMessage message={errors?.signupBonus?.message} />
            </div>

            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                id='payment'
                type='number'
                disable={manager?.add === false}
                inputLabel={<>{t('TRANSFER_MONEY_LIMIT_MAXIMUM')}</>}
                maxLength={40}
                register={register('maxTransferMoneyLimit', {
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
              <ErrorMessage message={errors?.maxTransferMoneyLimit?.message} />
            </div>
            <div className='w-full'>
              <OInputField
                inputLabel={<>{t('NEGATIVE_AMOUNT_MAXIMUM_LIMIT')}</>}
                wrapperClassName='relative z-0  w-full group'
                type='number'
                id='payment'
                disable={manager?.add === false}
                maxLength={40}
                register={register('negativeAmountMaxLimit', {
                  required: {
                    value: true,
                    message: 'Please enter negative amount maximum limit.'
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
              <ErrorMessage message={errors?.negativeAmountMaxLimit?.message} />
            </div>
            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                id='payment'
                disable={manager?.add === false}
                inputLabel={
                  <>
                    {t('MINIMUM_THRESHOLD_AMOUNT_FOR_EARNING_REWARD_REQUEST')}
                  </>
                }
                type='number'
                maxLength={40}
                register={register(
                  'mimThresholdAmountForEarningRewardRequest',
                  {
                    required: {
                      value: true,
                      message: 'Please enter minimum threshold amount.'
                    },
                    maxLength: {
                      value: 40,
                      message: 'Max limit is 40 characters.'
                    },
                    min: {
                      value: 1,
                      message: 'Minimum value must is 1.'
                    }
                  }
                )}
                placeholder=' '
              />
              <ErrorMessage
                message={
                  errors?.mimThresholdAmountForEarningRewardRequest?.message
                }
              />
            </div>
            <div className='w-full'>
              <OInputField
                wrapperClassName='relative z-0  w-full group'
                type='number'
                inputLabel={<>{t('TIME_TO_LOG_ACTIVE_USERS_ON_THE_APP')}</>}
                maxLength={40}
                disable={manager?.add === false}
                id='payment'
                register={register('timeLogForActiveUsers', {
                  required: {
                    value: true,
                    message:
                      'Please enter time to log active users  on the app.'
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
              <ErrorMessage message={errors?.timeLogForActiveUsers?.message} />
            </div>
          </main>
        </div>
      </div>
      {(manager?.add || user?.role === 'admin') && (
        <div className='text-center mt-4'>
          <OButton
            disabled={!isDirty}
            label={<>{t('O_UPDATE')}</>}
            type='submit'
            onClick={handleSubmit(handleSubmitForm)}
            loading={settingChangeLoading}
            title={t('O_UPDATE')}
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
