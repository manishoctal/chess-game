import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import helpers from '../../utils/helpers'
import QRCodeGenerator from 'components/QRCodeGenerator'

const ReportsTable = ({ users, page, userType, pageSize }) => {
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
                {helpers?.ternaryCondition(userType==='tourist', t('FOREIGN_TOURIST_NAME'),t('LOCAL_NAME'))}
              </th>

              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>
                {helpers?.ternaryCondition(userType==='tourist', t('LOCAL_NAME'),t('FOREIGN_TOURIST_NAME'))}
                  </div>
              </th>
              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>{t('DURATION')}(Seconds)</div>
              </th>
              {helpers.andOperator( userType==='local',<th scope='col' className='py-3 px-6'>
                <div className='text-left'>{t('Cost to foreign tourist')}</div>
              </th>)}
              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>{t('Thai local reward')}</div>
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('Amount paid')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('Date')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('QR image received')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('Payment proof time')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('QR code')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('Payment proof bank')}
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
                    className='py-4 px-3 border-r  font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
                  >
                    {i + 1 + pageSize * (page - 1)}
                  </th>
                  <td className='py-4 px-4 border-r  dark:border-[#ffffff38] font-bold text-slate-900'>
                    {helpers.ternaryCondition(
                     userType==='tourist' ,
                      item?.tourist?.firstName,
                      item?.local?.firstName
                    )}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] font-bold text-slate-900'>
                    {helpers.ternaryCondition(
                       userType==='tourist',
                      item?.local?.firstName,
                      item?.tourist?.firstName,
                    )}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left font-bold text-slate-900'>
                    {helpers.getSeconds(
                      item?.local?.createdAt,
                      item?.local?.updatedAt
                      
                    )}
                  </td>
                    {helpers.andOperator(
                      userType==='local',
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left font-bold text-slate-900'>
                    {  0}
                      </td>
                     
                     
                    )}
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left font-bold text-slate-900'>
                    {helpers.ternaryCondition(
                      item?.local?.walletAmount,
                      item?.local?.walletAmount,
                      0
                    )}
                  </td>

                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left'>
                    {helpers.ternaryCondition(item?.amount, item?.amount, 0)}
                  </td>

                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                    {helpers.ternaryCondition(
                      item?.updatedAt,
                      helpers.getDateAndTime(item?.updatedAt),
                      'N/A'
                    )}
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                  {helpers.ternaryCondition(
                      item?.updatedAt,
                      helpers.getDateAndTime(item?.updatedAt),
                      'N/A'
                    )}
                  </td>

                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(
                      item?.updatedAt,
                      helpers.getDateAndTime(item?.updatedAt),
                      'N/A'
                    )}
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  <QRCodeGenerator qrCodeValue={item?.qrCodeString} />
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(item?.paymentProof , (
                      <img
                        src={item?.paymentProof}
                        alt='image'
                        width='80'
                      />
                    ) , (
                      'NA'
                    ))}
                  </td>
                </tr>
              ))}
            {helpers.ternaryCondition(
              isEmpty(users),
              <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                <td
                  className='py-2 px-4 border-r dark:border-[#ffffff38]'
                  colSpan={13}
                >
                  {t('O_NO_RECORD_FOUND')}
                </td>
              </tr>,
              null
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReportsTable
