import React, { useContext  } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import { isEmpty, startCase } from 'lodash'
import {
  BsArrowUpShort,
  BsHandThumbsDown,
  BsHandThumbsUp
} from 'react-icons/bs'
import apiPath from 'utils/apiPath'
import { apiPost, apiPut } from 'utils/apiFetch'
import useToastContext from 'hooks/useToastContext'
import classNames from 'classnames'
import helpers from 'utils/helpers'
import { currency } from 'utils/constants'

const RewardWithdrawalRequestTable = ({
  subAdmin,
  page,
  sort,
  setSort,
  manager,
  pageSize,
  getAllRewardWithdrawalRequest
}) => {
  const { t } = useTranslation()

  const { user } = useContext(AuthContext)
  const notification = useToastContext()
  const handelStatusChange = async newItem => {
    try {
      const payload = {
        status: newItem?.status,
        rewardRequestId:newItem?._id
      }
     
      let path;
      if(newItem?.status==='accepted'){
        path = apiPath.acceptRewardRequest
        const result = await apiPost(path, payload)
        if (result?.status === 200) {
          notification.success(result.data.message)
          getAllRewardWithdrawalRequest()
        }
      } else{
       
        path = apiPath.rejectRewardRequest
        const result = await apiPost(path, payload)
        if (result?.status === 200) {
          notification.success(result.data.message)
          getAllRewardWithdrawalRequest()
        }
      }
     
    } catch (error) {
      console.error('error in get all sub admin list==>>>>', error.message)
    }
  }

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='py-3 px-6'>  {t('S.NO')} </th>
              
              <th scope='col' className='py-3 px-6'>{t('Thai local name')}</th>
              <th scope='col' className='py-3 px-6'>{t('Amount')}</th>
              <th scope='col' className='py-3 px-6 text-center'>{t('O_STATUS')}</th>
              <th scope='col' className='py-3 px-6 cursor-pointer text-right'onClick={() => {
                  if (sort.sortBy === 'createdAt' && sort.sortType === 'asc') {
                    setSort({
                      sortBy: 'createdAt',
                      sortType: 'desc'
                    })
                  } else {
                    setSort({
                      sortBy: 'createdAt',
                      sortType: 'asc'
                    })
                  }
                }}
              >
                <div className='flex justify-start'>
                  <span>{t('O_CREATED_AT')} </span>
                  <span>
                    {sort.sortBy === 'createdAt' && sort.sortType === 'asc' && (
                      <BsArrowUpShort className='w-4 h-4' />
                    )}
                    {sort.sortBy === 'createdAt' &&
                      sort.sortType === 'desc' && (
                        <BsArrowUpShort className='w-4 h-4 rotate-180' />
                      )}
                  </span>
                </div>
              </th>
              {(manager?.add || manager?.edit || user?.role === 'admin') && ( <th scope='col' className='py-3 px-6 text-center'> {t('O_ACTION')}</th>)}
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
                  {i + 1 + pageSize * (page - 1)}
                </th>
                {/* <td className="py-2 px-4 border-r dark:border-[#ffffff38]">
                  {item?._id}
                </td> */}
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {startCase(
                    item?.userDetail?.firstName +
                      ' ' +
                      item?.userDetail?.lastName
                  )}
                </td>

                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {`${item?.amount} ${currency}`}
                </td>

                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {startCase(item?.status)}
                </td>

                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A')}
                </td>

                {(manager?.add || user?.role === 'admin') && (
                  <td className='text-center'>
                    {item?.status === 'pending' && (
                      <>
                        <button
                          title={t('O_ACCEPT')}
                          type='button'
                          onClick={() =>
                            helpers.alertFunction(
                              'Are you sure you want to accept the request?',
                              {
                                _id: item?._id,
                                status: 'accepted'
                              },
                              handelStatusChange
                            )
                          }
                          className='animate-bounce text-lg border border-transparent text-green-600 hover:text-green-900'
                        >
                          <BsHandThumbsUp />
                        </button>
                        <button
                          title={t('O_REJECT')}
                          type='button'
                          onClick={() =>
                            helpers.alertFunction(
                              'Are you sure you want to reject the request?',
                              {
                                _id: item?._id,
                                status: 'rejected'
                              },
                              handelStatusChange
                            )
                          }
                          className='animate-bounce text-lg border border-transparent text-red-600 hover:text-red-900'
                        >
                          <BsHandThumbsDown />
                        </button>
                      </>
                    )}

                    {item?.status !== 'pending' && (
                      <span
                        className={classNames('', {
                          'text-green-600': item?.status === 'accepted',
                          'text-red-600': item?.status === 'rejected'
                        })}
                      >
                        {startCase(item?.status)}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {isEmpty(subAdmin) ? (
              <tr className='bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700'>
                <td className='py-4 px-6' colSpan={6}>
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

export default RewardWithdrawalRequestTable
