import OImage from 'components/reusable/OImage'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import defaultImage from '../../assets/images/No-image-found.jpg'
import { HiBadgeCheck } from 'react-icons/hi'
import checkIcon from '../../assets/images/check.png'
import { startCase } from 'lodash'
import { IoArrowBackSharp } from 'react-icons/io5'

const UserView = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [item] = useState(location?.state)
  const [age, setAge] = useState(null)

  const calculateAge = () => {
    const dobDate = new Date(item?.dob)
    const today = new Date()
    let ageDiff = today.getFullYear() - dobDate.getFullYear()
    setAge(item?.dob ? ageDiff : '')
  }

  useEffect(() => {
    // calculateAge();
  }, [])

  return (
    <>
      <div className='p-5 dark:bg-slate-900'>
        <Link to='/users' className='mb-5 ml-4 block'>
          <IoArrowBackSharp />
        </Link>

        <div className='flex'>
          <figure className='inline-block overflow-hidden rounded-full border border-2 mb-5'>
            <OImage
              src={item?.profilePic || defaultImage}
              className='w-[100px] h-[100px] inline'
              alt=''
            />
          </figure>
          {item?.verificationStatus === 'verified' && (
            <span>
              <img
                src={item?.verificationStatus === 'verified' && checkIcon}
                alt=''
              />
            </span>
          )}
        </div>

        <div className='grid grid-cols-3 dark:text-white'>
          <div>
            <ul>
              <li className='mb-3'>
                {' '}
                <strong>{t('FIRST_NAME')}: </strong>
                {item?.firstName || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('EMAIL_ADDRESS')}: </strong>
                {item?.email || 'N/A'}
              </li>

              <li className='mb-3'>
                <strong>{t('REGISTERED_DATE')}: </strong>{' '}
                {dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A') || 'N/A'}{' '}
              </li>
              <li className='mb-3'>
                <strong>{t('Referral code')}: </strong>
                {item?.referralCode || 'N/A'}
              </li>
            </ul>
          </div>

          <div>
            <ul>
              <li className='mb-3'>
                <strong> {t('UPC code')}: </strong>
                {item?.country || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('GENDER')}: </strong>
                {startCase(item?.gender) || 'N/A'}
              </li>

              <li className='mb-3 mr-2'>
                <strong>{t('NATIONALITY')}: </strong>
                {item?.tags?.map(element => element?.name)?.join(', ') || 'N/A'}
              </li>
              <li className='mb-3 mr-2'>
                <strong>
                  {t('Top up amounts details with date and time')}:{' '}
                </strong>
                {item?.tags?.map(element => element?.name)?.join(', ') || 'N/A'}
              </li>
            </ul>
          </div>

          <div>
            <ul>
              <li className='mb-3'>
                <strong>{t('Country')}: </strong>
                {startCase(item?.country) || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong> {t('KYC Document')}: </strong>
                {startCase(item?.subscription) || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong> {t('Cities visited in Thailand')}: </strong>
                {startCase(item?.verificationStatus) || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('Cities going to visit in Thailand')}: </strong>
                {startCase(item?.registrationType) || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('Bonus Amount')}: </strong>
                {startCase(item?.registrationType) || 'N/A'}
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className='mb-3'>
                <strong>{t('O_MOBILE_NUMBER')} : </strong> {'+'}{' '}
                {item?.countryCode} {item?.mobile || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('USER_DOB')}: </strong>
                {item?.dob ? (
                  <>{dayjs(item?.dob).format('DD MMMM YYYY') || 'N/A'}</>
                ) : (
                  'N/A'
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserView
