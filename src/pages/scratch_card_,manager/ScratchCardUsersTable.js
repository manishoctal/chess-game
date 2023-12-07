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

const ScratchCardUsersTable = ({ subAdmin, page }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updatePageName } = useContext(AuthContext)
  const [scratchCardUser,setScratchCardUser]=useState('')

  const scratchCardHistory = async (data, pageNO) => {
    try {
      const { startDate, endDate, searchkey } = filterData

      const payload = {
        // page,
        // pageSize: pageSize,

      }

      const path = apiPath.scratchCardHistory
      const result = await apiGet(path, payload)
      const response = result?.data?.results
      const resultStatus = result?.data?.success
      (response.docs)
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null
      })
    } catch (error) {
      console.log('error in get all sub admin list==>>>>', error.message)
    }
  }
  useEffect(() => {
    
    scratchCardHistory()
  }, [])

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='py-3 px-6'>
                {t('S.NO')}
              </th>

              <th scope='col' className='py-3 px-6'>
                {t('FOREIGN_TOURIST_NAME')}
              </th>

              <th scope='col' className='py-3 px-6'>
                {t('COUPON_AMOUNT')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('TRANSACTION_AMOUNT')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('COUPON_CODE')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('DATE_AND_TIME')} & 
              </th>

             
            </tr>
          </thead>
          <tbody>
            {scratchCardUser?.map((item, i) => (
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
                  {startCase(item?.firstName + ' ' + item?.lastName)}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.email || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.countryCode || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.mobile || 'N/A'}
                </td>
              </tr>
            ))}
            {isEmpty(scratchCardUser) ? (
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
  )
}

export default ScratchCardUsersTable
