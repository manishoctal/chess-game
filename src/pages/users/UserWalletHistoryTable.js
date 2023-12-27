import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import helpers from 'utils/helpers'
import helper from 'utils/helpers'

const UserWalletHistoryTable = ({ users, page }) => {
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
                {t('Admin name')}
              </th>

              <th scope='col' className='py-3 px-6 '>
                {t('AMOUNT_ADDED')}
              </th>

              <th scope='col' className='py-3 px-6 '>
                {t('DATE')} & {t('TIME')}
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
                    className='py-4 px-3 border-r font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
                  >
                    {i + 1 + 10 * (page - 1)}
                  </th>

                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] '>
                    {`${item?.senderRecord?.firstName} ${item?.senderRecord?.lastName}`}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] '>
                  {helpers.formattedAmount(item?.transactionAmount)}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] '>
                    {helper.getDateAndTime(item?.createdAt) || 'N/A'}
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

export default UserWalletHistoryTable
