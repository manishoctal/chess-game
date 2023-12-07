import React, { useContext, useState, useEffect } from 'react'
import { apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import dayjs from 'dayjs'
import useToastContext from 'hooks/useToastContext'
import { AiFillEdit, AiFillDelete, AiFillEye } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { BsArrowUpShort } from 'react-icons/bs'
import AuthContext from 'context/AuthContext'
import { isEmpty, startCase } from 'lodash'
import helper from '../../utils/helpers'

import { useNavigate } from 'react-router-dom'

const ScratchCardTable = ({ subAdmin, page,ScratchCardUsersTable,setScratchCardUsersTable }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updatePageName } = useContext(AuthContext)

  useEffect(() => {
    updatePageName(t('SUB_ADMIN_MANAGERS'))
  }, [])

  return (
    !ScratchCardUsersTable&&<>
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='py-3 px-6'>
                {t('S.NO')}
              </th>

              <th scope='col' className='py-3 px-6'>
                {t('COUPON_CODE')}
              </th>

              <th scope='col' className='py-3 px-6'>
                {t('COUPON_AMOUNT')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('REWARD_AMOUNT')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('EXPIRE_DATE')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('NUMBER_OF_USER_CAN_USE_COUPON')}
              </th>

              <th scope='col' className='py-3 px-6 text-center'>
                {t('O_ACTION')}
              </th>
            </tr>
          </thead>
          <tbody>
            {subAdmin?.map((item, i) => (
              <tr
                key={i}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
              >
                <th
                  scope='row'
                  className='py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white'
                >
                  {i + 1 + 10 * (page - 1)}
                </th>

                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.couponCode}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.couponAmount || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.rewardAmount || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                {dayjs(item?.expiryDate).format("DD MMM YYYY ")}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.numberOfUserCoupon || 'N/A'}
                </td>

                <td className='py-2 px-4 border-l'>
                  <div className=''>
                    <ul className='flex justify-center'>
                      <li
                        onClick={() =>
                            setScratchCardUsersTable(true)
                        }
                        className='px-2 py-2 hover:text-gradientTo'
                      >
                        <a title={t('VIEW')}>
                          {' '}
                          <AiFillEye className='cursor-pointer w-5 h-5 text-slate-600' />
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(subAdmin) ? (
              <tr className='bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700'>
                <td className='py-4 px-6' colSpan={7}>
                  {t('O_NO_RECORD_FOUND')}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
    {ScratchCardUsersTable&& <ScratchCardUsersTable/>}
    </>
  )
}

export default ScratchCardTable
