import OImage from 'components/reusable/OImage'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import defaultImage from '../../assets/images/No-image-found.jpg'
import checkIcon from '../../assets/images/check.png'
import { startCase } from 'lodash'
import { IoArrowBackSharp } from 'react-icons/io5'

const UserView = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [item] = useState(location?.state)

  return (
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

      <div className=' dark:text-white'>
        <ul className='columns-3'>
          {item?.userType === 'tourist' && (
            <>
              <li className='mb-3'>
                {' '}
                <strong>{t('FIRST_NAME')}: </strong>
                {startCase(item?.firstName) || 'N/A'}
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

              <li className='mb-3'>
                <strong> {t('UPC code')}: </strong>
                {item?.upcCode || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('GENDER')}: </strong>
                {startCase(item?.gender) || 'N/A'}
              </li>

              <li className='mb-3 mr-2'>
                <strong>{t('NATIONALITY')}: </strong>
                {item?.nationality || 'N/A'}
              </li>
              <li className='mb-3 mr-2'>
                <strong>{t('Country of living')}: </strong>
                {startCase(item?.countryOfLiving) || 'N/A'}
              </li>

              <li className='mb-3'>
                <strong> {t('KYC Document')}: </strong>
                {startCase(item?.passport) || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong> {t('Cities visited in Thailand')}: </strong>
                {item?.cityVisited?.length > 0
                  ? item?.cityVisited?.join(', ')
                  : 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('Cities going to visit in Thailand')}: </strong>
                {item?.cityPlanning?.length > 0
                  ? item?.cityPlanning?.join(', ')
                  : 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('Bonus Amount')}: </strong>
                {item?.bonusAmount || 0}
              </li>
            </>
          )}

          {item?.userType === 'local' && (
            <>
              <li className='mb-3'>
                {' '}
                <strong>{t('Name')}: </strong>
                {`${item?.firstName} ${item?.lastName}` || 'N/A'}
              </li>
              <li className='mb-3'>
                <strong>{t('Nationality Id ')}: </strong>
                {item?.nationalityId || 'N/A'}
              </li>

              <li className='mb-3'>
                <strong>{t('Address')}: </strong>
                {item?.address || 'N/A'}
              </li>
            </>
          )}

          <li className='mb-3'>
            <strong>{t('O_MOBILE_NUMBER')} : </strong> {'+'} {item?.countryCode}{' '}
            {item?.mobile || 'N/A'}
          </li>
          <li className='mb-3'>
            <strong>{t('USER_DOB')}: </strong>
            {item?.dob ? (
              <>{dayjs(item?.dob).format('DD MMMM YYYY') || 'N/A'}</>
            ) : (
              'N/A'
            )}
          </li>
          <li className='mb-3'>
            <strong>{t('Available balance')}: </strong>
            {item?.walletAmount || 0}
          </li>
          <li className='mb-3 flex column'>
            <strong className='mr-3'>{t('KYC Document')}: </strong>

            <figure className='inline-block overflow-hidden rounded-full border border-2 mb-5'>
              <OImage
                src={item?.kycImage || defaultImage}
                className='w-[100px] h-[100px] inline'
                alt=''
              />
            </figure>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserView
