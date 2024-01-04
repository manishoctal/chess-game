import OImage from 'components/reusable/OImage'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import defaultImage from '../../assets/images/No-image-found.jpg'
import checkIcon from '../../assets/images/check.png'
import { startCase, capitalize } from 'lodash'
import { IoArrowBackSharp } from 'react-icons/io5'
import helpers from 'utils/helpers'
import firstNameIcon from '../../assets/icons/icon/name-icon.svg'
import balanceIcon from '../../assets/icons/icon/balance.svg'
import emailIcon from '../../assets/icons/icon/email.svg'
import mobileIcon from '../../assets/icons/icon/mobile.svg'
import timeIcon from '../../assets/icons/icon/time.svg'
import refferalCodeIcon from '../../assets/icons/icon/refferalCode.svg'
import genderIcon from '../../assets/icons/icon/gender.svg'
import dobIcon from '../../assets/icons/icon/dob.svg'
import upcCodeIcon from '../../assets/icons/icon/upcCode.svg'
import locationIcon from '../../assets/icons/icon/location.svg'
import cityIcon from '../../assets/icons/icon/city.svg'
import buildingIcon from '../../assets/icons/icon/building.svg'
import bonusIcon from '../../assets/icons/icon/bonus.svg'
import useToastContext from 'hooks/useToastContext'
import apiPath from 'utils/apiPath'
import { apiPut } from 'utils/apiFetch'




const UserView = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [item] = useState(location?.state)
  const navigate = useNavigate()
  const notification = useToastContext()
  const [kycSection, setKycSection] = useState(null);

  const approveAndReject = async data => {
    try {
      const payload = {
        status: data
      }
      const path = apiPath.approveAndRejectKyc + '/' + item._id
      const result = await apiPut(path, payload)
      if (result?.data?.success) {
        notification.success(result?.data.message)
        navigate('/users')
      } else {
        notification.error(result?.data?.message)
      }
    } catch (error) {
      console.error('error:', error.message)
    }
  }
  const kycDocSection = async () => {
    if (item?.kycRecord?.isApproved === 'pending') {
      try {
        const result = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              <div className="flex items-center justify-center p-6">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => approveAndReject('approved')}
                >
                  {t('APPROVE')}
                </button>

                <button
                  className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="submit"
                  onClick={() => approveAndReject('rejected')}
                >
                  {t('REJECT')}
                </button>
              </div>
            );
          }, 0);
        });

        setKycSection(result);
      } catch (error) {
        console.error('Error in kycDocSection:', error);
        setKycSection(null);
      }
    }
    else {
      setKycSection(null);
    }
  };

  const renderApprovalStatus = () => {
    const kycRecord = item?.kycRecord;

    if (!kycRecord) {
      return null;
    }
    const { isApproved } = kycRecord
    if (isApproved === 'approved') {
      return <img src={checkIcon} alt='' className='absolute right-[-10px] top-[-10px]' />;
    }
    else {
      return null;
    }
  };

  useEffect(() => {
    renderApprovalStatus()
    kycDocSection();
  }, [item?.kycRecord?.isApproved]);

  return (
    <div className='p-5 dark:bg-slate-900'>
      <Link to='/users' className='mb-5 ml-4 block'>
        <IoArrowBackSharp />
      </Link>

      {item?.userType === 'tourist' && (
        <div className='mt-10'>
          <div className='items-center flex '>
            <div className='mr-5 flex '>
              <figure className='overflow-hidden rounded-full inline-block  border border-2 mb-5'>
                <OImage
                  className='w-[100px] h-[100px] inline'
                  src={item?.profilePic || defaultImage}
                  fallbackUrl={defaultImage}
                  alt=''
                />
              </figure>
              {item?.verificationStatus === 'verified' && (
                <span>
                  <img
                    alt=''
                    src={item?.verificationStatus === 'verified' && checkIcon}
                  />
                </span>
              )}
            </div>

            <div className='grid grid-cols-4 bg-[#F2F2F2] rounded-lg p-4 w-[70%] mr-4 px-8'>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={firstNameIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className=' text-[#5 C5C5C] block'>
                      {t('FAMILY_NAME')}
                    </span>
                    <strong>
                      {' '}
                      {helpers.ternaryCondition(
                        item?.familyName,
                        startCase(item?.familyName),
                        'N/A'
                      )}
                    </strong>
                  </figcaption>
                </div>
              </div>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={firstNameIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className=' text-[#5 C5C5C] block'>
                      {t('FIRST_NAME')}
                    </span>
                    <strong>
                      {' '}
                      {helpers.ternaryCondition(
                        item?.firstName,
                        startCase(item?.firstName),
                        'N/A'
                      )}
                    </strong>
                  </figcaption>
                </div>
              </div>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={emailIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className='block text-[#5 C5C5C]'>
                      {t('EMAIL_ADDRESS')}
                    </span>
                    <strong>
                      {helpers.ternaryCondition(
                        item?.email,
                        item?.email,
                        'N/A'
                      )}
                    </strong>
                  </figcaption>
                </div>
              </div>
              <div className='col-span-2 ps-20'>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={mobileIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className='block text-[#5 C5C5C]'>
                      {t('O_MOBILE_NUMBER')}
                    </span>
                    <strong>{`+${item?.countryCode} ${item?.mobile}`}</strong>
                  </figcaption>
                </div>
              </div>
            </div>

            <div className='bg-[#000] rounded-lg p-4 '>
              <div className='flex items-center'>
                <figure className='mr-3'>
                  <img src={balanceIcon} alt='' />
                </figure>
                <figcaption className='text-white'>
                  <span className='block'>
                    {helpers.formattedAmount(item?.walletAmount)}
                  </span>
                  <span className='text-sm'>{t('AVAILABLE_BALANCE')}</span>
                </figcaption>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-5'>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-6 ps-3'>
              <ul>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={timeIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('REGISTERED_DATE')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.createdAt,
                            dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A'),
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={refferalCodeIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('USERS_REFERRAL_CODE')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.referralCode,
                            item?.referralCode,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={genderIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('GENDER')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.gender,
                            startCase(item?.gender),
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={dobIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('USER_DOB')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.dob,
                            dayjs(item?.dob).format('D MMM YYYY'),
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={upcCodeIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('UPC_CODE')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.upcCode,
                            item?.upcCode,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-6 ps-3'>
              <ul>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={locationIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('NATIONALITY')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.nationality,
                            item?.nationality,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={cityIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('COUNTRY_OF_LIVING')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.countryOfLiving,
                            startCase(item?.countryOfLiving),
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={buildingIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('CITIES_VISITED_IN_THAILAND')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.cityVisited?.length > 0,
                            item?.cityVisited?.join(', '),
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={buildingIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('CITIES_GOING_TO_VISIT_IN_THAILAND')}
                        </span>
                        <strong>
                          {item?.cityPlanning?.length > 0
                            ? item?.cityPlanning?.join(', ')
                            : 'N/A'}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={bonusIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('BONUS_AMOUNT')}
                        </span>
                        <strong>{item?.bonusAmount || 0}</strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-12'>
              <span className='block text-center pb-3'>{t('KYC_DOCUMENT')}</span>
              <div className='relative'>
                <figure className='inline-block overflow-hidden border mb-3 w-full h-[200px]'>
                  <OImage
                    src={item?.kycRecord?.docImageFront || defaultImage}
                    className='w-full h-full object-contain inline '
                    alt=''
                    fallbackUrl={defaultImage}
                  />
                </figure>
                {renderApprovalStatus()}
              </div>
              <div className='relative'>
                <figure className='inline-block overflow-hidden border mb-3 w-full h-[200px]'>
                  <OImage
                    src={item?.kycRecord?.docImageBack || defaultImage}
                    className='w-full h-full object-contain inline '
                    alt=''
                    fallbackUrl={defaultImage}
                  />

                </figure>
                {renderApprovalStatus()}
              </div>
              <span className="block text-center">{t('DOCUMENT_NUMBER')}: <b>{helpers.ternaryCondition(item?.kycRecord?.docNumber, item?.kycRecord?.docNumber, 'N/A')}</b></span>
              {kycSection}
              <span className="block text-center mt-4" >{t('KYC_STATUS')}: <b>{helpers.ternaryCondition(item?.kycRecord?.isApproved, capitalize(startCase(item?.kycRecord?.isApproved)), 'Kyc not uploaded yet')}</b></span>
            </div>
          </div>
        </div>
      )}
      {item?.userType === 'local' && (
        <div className='mt-10'>
          <div className='flex items-center'>
            <div className='flex mr-5'>
              <figure className='inline-block overflow-hidden rounded-full border border-2 mb-5'>
                <OImage
                  src={item?.profilePic || defaultImage}
                  className='w-[100px] h-[100px] inline'
                  fallbackUrl={defaultImage}
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

            <div className='grid grid-cols-4 bg-[#F2F2F2] rounded-lg p-4 w-[70%] mr-4 px-8 flex justify-between'>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={firstNameIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className='block text-[#5 C5C5C]'>
                      {t('NAME')}
                    </span>
                    <strong>
                      {' '}
                      {helpers.ternaryCondition(
                        item?.firstName,
                        startCase(item?.firstName),
                        'N/A'
                      )}
                    </strong>
                  </figcaption>
                </div>
              </div>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={emailIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className='block text-[#5 C5C5C]'>
                      {t('EMAIL_ADDRESS')}
                    </span>
                    <strong>
                      {helpers.ternaryCondition(
                        item?.email,
                        item?.email,
                        'N/A'
                      )}
                    </strong>
                  </figcaption>
                </div>
              </div>
              <div>
                <div className='flex items-center'>
                  <figure className='bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                    <img src={mobileIcon} alt='' />
                  </figure>
                  <figcaption className='w-[calc(100%_-_41px)]'>
                    <span className='block text-[#5 C5C5C]'>
                      {t('O_MOBILE_NUMBER')}
                    </span>
                    <strong>{`+${item?.countryCode} ${item?.mobile}`}</strong>
                  </figcaption>
                </div>
              </div>
            </div>

            <div className='bg-[#000] rounded-lg p-4 '>
              <div className='flex items-center'>
                <figure className='mr-3'>
                  <img src={balanceIcon} alt='' />
                </figure>
                <figcaption className='text-white'>
                  <span className='block'>
                    {helpers.formattedAmount(item?.walletAmount)}
                  </span>
                  <span className='text-sm'>{t('AVAILABLE_BALANCE')}</span>
                </figcaption>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-5'>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-6 ps-3'>
              <ul>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={cityIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('NATIONALITY_ID')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.nationalityId,
                            item?.nationalityId,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={locationIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('ADDRESS')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.address,
                            item?.address,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-6 ps-3'>
              <ul>
                <div>
                  <li className='mb-4'>
                    <div className='flex items-center'>
                      <figure className='bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3'>
                        <img src={dobIcon} alt='' />
                      </figure>
                      <figcaption className='w-[calc(100%_-_41px)]'>
                        <span className='block text-[#5C5C5C]'>
                          {t('USER_DOB')}
                        </span>
                        <strong>
                          {helpers.ternaryCondition(
                            item?.dob,
                            item?.dob,
                            'N/A'
                          )}
                        </strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className='border border-1 border-[#E1DEDE] rounded-md p-12'>
              <span className='block text-center pb-3'>{t('KYC_DOCUMENT')}</span>
              <div className='relative'>
                <figure className='inline-block overflow-hidden border mb-3 w-full h-[200px]'>
                  <OImage
                    src={item?.kycRecord?.docImageFront || defaultImage}
                    className='w-full h-full object-contain inline '
                    alt=''
                    fallbackUrl={defaultImage}
                  />

                </figure>
                {renderApprovalStatus()}
              </div>
              <div className='relative'>
                <figure className='inline-block overflow-hidden border mb-3 w-full h-[200px]'>
                  <OImage
                    src={item?.kycRecord?.docImageBack || defaultImage}
                    className='w-full h-full object-contain inline '
                    alt=''
                    fallbackUrl={defaultImage}
                  />
                </figure>
                {renderApprovalStatus()}
              </div>
              <span className="block text-center" >{t('DOCUMENT_NUMBER')}: <b>{helpers.ternaryCondition(item?.kycRecord?.docNumber, item?.kycRecord?.docNumber, 'N/A')}</b></span>
              {kycSection}
              <span className="block text-center mt-4" >{t('KYC_STATUS')}: <b>{helpers.ternaryCondition(item?.kycRecord?.isApproved, capitalize(startCase(item?.kycRecord?.isApproved)), 'Kyc not uploaded yet')}</b></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserView
