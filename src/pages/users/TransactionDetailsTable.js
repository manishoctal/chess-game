import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import helpers from 'utils/helpers'
import QRCodeGenerator from 'components/QRCodeGenerator'

const TransactionDetailsTable = ({
  transactions,
  page,
  userType,
  pageSize
}) => {
  const { t } = useTranslation()

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='py-3 px-3'> {t('S.NO')} </th>
              <th scope='col' className='py-3 px-6'>  {t('Name of the Thai Local')} </th>
              <th scope='col' className='py-3 px-6'> {t('Account Balance')} </th>
              {userType === 'tourist' && (
                <>
                  <th scope='col' className='py-3 px-6 text-left'> {t('Reference no.')} </th>
                  <th scope='col' className='py-3 px-3'> {t('Total payment')} </th>
                </>
              )}
              {userType === 'local' && (
                <>
                  <th scope='col' className='py-3 px-6 text-left'> {t('Amount paid')} </th>
                  <th scope='col' className='py-3 px-3'> {t('Thai local reword')} </th>
                </>
              )}
              <th scope='col' className='py-3 px-6 text-left'> {t('Name of the foreign tourist')}  </th>
              <th scope='col' className='py-3 px-3'> {t('Date of Request')}  </th>
              <th scope='col' className='py-3 px-3'>  {t('QR Image received time')} </th>
              <th scope='col' className='py-3 px-3'> {t('payment receipt proof time')} </th>
              <th scope='col' className='py-3 px-3'>  {t('Durations (In Seconds)')} </th>
              <th scope='col' className='py-3 px-3'> {t('QR Code')}  </th>
              <th scope='col' className='py-3 px-3'> {t('Payment Receipt Image')} </th>
              <th scope='col' className='py-3 px-3'>  {t('Payment proof bank')} </th>
              <th scope='col' className='py-3 px-6 text-left'> {t('DATE')} & {t('TIME')}  </th>
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
                    {i + 1 + pageSize * (page - 1)}
                  </th>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {helpers.ternaryCondition(item?.local?.firstName,item?.local?.firstName , 'N/A')}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.formattedAmount(item?.local?.walletAmount)}  
                  </td>
                  {userType === 'tourist' && (
                    <>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                        {helpers.ternaryCondition(
                          item?.referenceNumber,
                          item?.referenceNumber,
                          'N/A'
                        )}
                      </td>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                      {helpers.formattedAmount(item?.amount)}
                      </td>
                      
                    </>
                  )}
                  {userType === 'local' && (
                    <>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                      {helpers.formattedAmount(item?.amount)}
                      </td>
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                      {helpers.formattedAmount(item?.local?.rewardAmount)}
                      </td>
                    </>
                  )}
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {helpers.ternaryCondition(item?.tourist?.firstName,item?.tourist?.firstName , 'N/A')}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {helpers.ternaryCondition(item?.createdAt,helpers.getDateAndTime(item?.createdAt) , 'N/A')}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(item?.acceptedAt,helpers.getDateAndTime(item?.acceptedAt) , 'N/A')}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {helpers.ternaryCondition(item?.paymentReceiptTime,dayjs(item?.paymentReceiptTime).format('hh:mm A') , 'N/A')}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                    {helpers.getSeconds(
                      item?.createdAt,
                      item?.acceptedAt
                    ) ?? 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center  '>
                    <QRCodeGenerator qrCodeValue={item.qrCodeString} />
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
                  {helpers.ternaryCondition(item?.paymentProof , (
                      <img
                        src={item?.paymentProof}
                        alt=''
                      className='h-[80px] w-[80px] object-cover'

                      />
                    ) , (
                      'NA'
                    ))}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(item?.createdAt,helpers.getDateAndTime(item?.createdAt) , 'N/A')}

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
