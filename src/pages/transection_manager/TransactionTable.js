import React from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { isEmpty, startCase } from 'lodash'
import helpers from 'utils/helpers'

const TransactionTable = ({ artistVerification, page, userType, pageSize }) => {
  const { t } = useTranslation()

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th className='px-5 py-3 ' scope='col'>
                #
              </th>
              <th className='px-5 py-3 ' scope='col'>{t('FIRST_NAME')}</th>
              <th className='px-5 py-3 ' scope='col'>{t('USER_ID')}</th>
              <th className='px-5 py-3 ' scope='col'>{t('TRANSACTION_ID')}</th>
              {userType === 'tourist' && (
                <>
                  <th className='px-5 py-3 ' scope='col'>{t('TRANSACTION_AMOUNT')}</th>
                </>
              )}
              {userType === 'local' && (
                <>
                  <th scope='col' className='px-5 py-3 '> {t('TRANSACTION_AMOUNT')}</th>
                  <th scope='col' className='px-5 py-3 '>{t('REWARD_AMOUNT')}</th>
                  <th scope='col' className='px-5 py-3 '>{t('MODE_OF_PAYMENT')}</th>
                </>
              )}
              <th scope='col' className='py-3 px-5 text-center'>{t('O_CREATED_AT')}</th>
            </tr>
          </thead>
          <tbody>
            {artistVerification?.map((item, i) => (
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
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {startCase(item?.user?.firstName) || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.user?.userId || 'N/A'}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {item?.transactionId || 'N/A'}
                </td>
                <td
                 className="py-2 px-4 border-r dark:border-[#ffffff38]"
                  // className={`py-2 px-4 border-r dark:border-[#ffffff38] ${item?.transactionAmount < 0 ? 'text-red-600' : 'text-green-500'
                    // }`}
                >{helpers.formattedAmount(item?.transactionAmount)}</td>
                {userType === 'local' && (
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>{helpers.formattedAmount(item?.user?.scratchCardDetail?.rewardAmount)}</td>
                )}
                {userType === 'local' && (
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38] '>
                    {startCase(item?.transactionType) || 'N/A'}
                  </td>
                )}
                <td className='py-2 px-4 border-r dark:border-[#ffffff38] text-center'>
                  {dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A')}
                </td>
              </tr>
            ))}
            {isEmpty(artistVerification) ? (
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

export default TransactionTable
