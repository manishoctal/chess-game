import React, { useState } from 'react'
import { apiPut, apiDelete } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import { isEmpty, startCase } from 'lodash'
import dayjs from 'dayjs'
import useToastContext from 'hooks/useToastContext'
import { AiFillEdit, AiFillDelete, AiFillEye } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { BsArrowUpShort } from 'react-icons/bs'
import helper from '../../utils/helpers'
import { NavLink } from 'react-router-dom'

const Table = ({
  users,
  getAllUser,
  handleUserView,
  user,
  manager,
  page,
  sort,
  setSort,
  toggleModalAddEdit
}) => {
  const { t } = useTranslation()
  const notification = useToastContext()

  const handelStatusChange = async item => {
    try {
      const payload = {
        status: item?.status === 'inactive' ? 'active' : 'inactive'
      }
      const path = `${apiPath.changeUserStatus}/${item?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result.data.message)
        getAllUser({ statusChange: 1 })
      }
      // }
    } catch (error) {
      console.log('error in get all users list==>>>>', error.message)
    }
  }

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='py-3 px-3'>
                {t('S.NO')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('NAME')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('DEPOSITE_AMOUNT')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('REFERENCE_NUMBER')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('BANK_RECEIPT')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('EARNED_MONEY')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('DATE')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('TIME')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 &&
              users?.map((item, i) => (
                <tr
                  key={i}
                  className='bg-white border-b dark:bg-gray-800 dark:border-[#ffffff38]'
                >
                  <th
                    scope='row'
                    className='py-4 px-3 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
                  >
                    {i + 1 + 10 * (page - 1)}
                  </th>
                  <td className='py-4 px-4 border-r dark:border-[#ffffff38] dark:border-[#ffffff38]'>
                    {item?.userId || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38] dark:border-[#ffffff38]'>
                    {item?.email || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38] dark:border-[#ffffff38] text-center'>
                    {item?.mobile || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38] dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                </tr>
              ))}
            {isEmpty(users) ? (
              <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                <td
                  className='py-2 px-4 border-r dark:border-[#ffffff38]'
                  colSpan={8}
                >
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

export default Table
