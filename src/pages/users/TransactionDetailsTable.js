import React, { useState } from 'react'
import { isEmpty, startCase } from 'lodash'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import obj from 'utils/helpers'
import QRCodeGenerator from 'components/QRCodeGenerator'

const TransactionDetailsTable = ({ transactions, page, userType }) => {
  const { t } = useTranslation()

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
                {t('Name of the Thai Local')}
              </th>
              <th scope='col' className='py-3 px-6'>
                {t('Account Balance')}
              </th>

              {userType === 'tourist' && (
                <>
                  <th scope='col' className='py-3 px-6 text-left'>
                    {t('Reference no.')}
                  </th>
                  <th scope='col' className='py-3 px-3'>
                    {t('Total payment')}
                  </th>
                  <th scope='col' className='py-3 px-3'>
                    {t('Transaction fees')}
                  </th>
                </>
              )}
              {userType === 'local' && (
                <>
                  <th scope='col' className='py-3 px-6 text-left'>
                    {t('Amount paid')}
                  </th>
                  <th scope='col' className='py-3 px-3'>
                    {t('Thai local reword')}
                  </th>
                </>
              )}
              <th scope='col' className='py-3 px-6 text-left'>
                {t('Name of the foreign tourist')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('Date of Request')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('QR Image received time')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('payment receipt proof time')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('Durations (In Seconds)')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('QR Code')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('Payment Receipt Image')}
              </th>
              <th scope='col' className='py-3 px-3'>
                {t('Payment proof bank')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('DATE')} & {t('TIME')}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0 &&
              transactions?.map((item, i) => (
                <tr
                  key={i}
                  className='bg-white border-b dark:bg-gray-800 dark:border-[#ffffff38]'
                >
                  <th
                    scope='row'
                    className='py-4 px-3 border-r font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
                  >
                    {i + 1 + 10 * (page - 1)}
                  </th>

                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.mobile || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                  {userType === 'tourist' && (
                    <>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {item?.refNumber ?? 'N/A'}
                      </td>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {item?.country || 'N/A'}
                      </td>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {item?.transactionFee ?? 'N/A'}
                      </td>
                    </>
                  )}
                  {userType === 'local' && (
                    <>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {item?.country || 'N/A'}
                      </td>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {item?.country || 'N/A'}
                      </td>
                    </>
                  )}
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {dayjs(item?.qrSendTime).format('hh:mm A') || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {dayjs(item?.paymentReceiptTime).format('hh:mm A') || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {obj.getSeconds(
                      item?.qrSendTime,
                      item?.paymentReceiptTime
                    ) ?? 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    <QRCodeGenerator qrCodeValue={item.qrCode} />
                  </td>
                  <td className='py-4 px-6 border-r flex justify-center'>
                    {item?.paymentReceiptImage ? (
                      <img
                        src={item?.paymentReceiptImage}
                        alt='image'
                        width='80'
                      />
                    ) : (
                      'NA'
                    )}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {item?.country || 'N/A'}
                  </td>
                </tr>
              ))}
            {isEmpty(transactions) ? (
              <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                <td
                  className='py-2 px-4 border-r dark:border-[#ffffff38]'
                  colSpan={14}
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

export default TransactionDetailsTable
