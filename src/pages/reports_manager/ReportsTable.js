import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import helpers from '../../utils/helpers'
import QRCodeGenerator from 'components/QRCodeGenerator'
import { useState } from 'react'
import ViewImage from './ViewImage'

const ReportsTable = ({ users, page, userType, pageSize }) => {
  const { t } = useTranslation()
  const [viewShowModal, setViewShowModal] = useState(false)
  const [imageView, setImageView] = useState('')


  const handleUserView = (element,type) => {
    setImageView({image:element,type})
    setViewShowModal(true)
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
                {helpers?.ternaryCondition(userType==='tourist', t('FOREIGN_TOURIST_NAME'),t('LOCAL_NAME'))}
              </th>

              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>
                {helpers?.ternaryCondition(userType==='tourist', t('LOCAL_NAME'),t('FOREIGN_TOURIST_NAME'))}
                  </div>
              </th>
              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>{t('DURATION')} {t('SECONDS')}</div>
              </th>
              <th scope='col' className='py-3 px-6'>
                <div className='text-left'>{t('THAI_LOCAL_REWARD')}</div>
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('AMOUNT_PAID')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('DATE')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('QR_IMAGE_RECEIVED')}
              </th>

              <th scope='col' className='py-3 px-6 text-left'>
                {t('PAYMENT_PROOF_TIME')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('QR_CODE')}
              </th>
              <th scope='col' className='py-3 px-6 text-left'>
                {t('PAYMENT_PROOF_BANK')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 &&
              users?.map((item, i) => (
                <tr
                  key={users?._id}
                  className='bg-white border-b dark:bg-gray-800 dark:border-[#ffffff38]'
                >
                  <th
                    scope='row'
                    className='py-4 px-3 border-r  font-medium text-gray-900  dark:text-white dark:border-[#ffffff38]'
                  >
                    {i + 1 + pageSize * (page - 1)}
                  </th>
                  <td className='py-4 px-4 border-r  dark:border-[#ffffff38] font-bold text-slate-900 dark:text-slate-400'>
                    {helpers.ternaryCondition(
                     userType==='tourist' ,
                      item?.tourist?.firstName,
                      item?.local?.firstName
                    )}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] font-bold text-slate-900 dark:text-slate-400'>
                    {helpers.ternaryCondition(
                       userType==='tourist',
                      item?.local?.firstName,
                      item?.tourist?.firstName,
                    )}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center font-bold text-slate-900 dark:text-slate-400'>
                    {helpers.getSeconds(
                      item?.createdAt,
                      item?.acceptedAt

                    )}
                  </td>
                    {helpers.andOperator(
                      userType==='local',
                  // <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center font-bold text-slate-900 dark:text-slate-400'>
                  //   {  0}
                  //     </td>
                    )}
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center font-bold text-slate-900 dark:text-slate-400'>
                  {helpers.formattedAmount(item?.rewardAmount)}
                  </td>
                  <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.formattedAmount(item?.amount)}
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                    {helpers.ternaryCondition(
                      item?.createdAt,
                      helpers.getDateAndTime(item?.createdAt),
                      'N/A'
                    )}
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                  {helpers.ternaryCondition(
                      item?.createdAt,
                      helpers.getDateAndTime(item?.createdAt),
                      'N/A'
                    )}
                  </td>

                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(
                      item?.acceptedAt,
                      helpers.getDateAndTime(item?.acceptedAt),
                      'N/A'
                    )}
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  <button type='button' onClick={()=>handleUserView(item?.qrCodeString,'QR')}>

                  <QRCodeGenerator qrCodeValue={item?.qrCodeString} />
                  </button>
                  </td>
                  <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                  {helpers.ternaryCondition(item?.paymentProof , (
                    <button type='button' onClick={()=>handleUserView(item?.paymentProof,'image')}>
                      <img
                        src={item?.paymentProof}
                        alt=''
                      className='h-[70px] w-[70px] object-cover'

                      />
                      </button>
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
      {viewShowModal && (
        <ViewImage setViewShowModal={setViewShowModal} item={imageView} />
      )}
    </div>
  )
}

export default ReportsTable
