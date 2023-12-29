import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AiFillEye } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import { isEmpty } from 'lodash'

import { NavLink } from 'react-router-dom'
import helpers from 'utils/helpers'
import ScratchCardUserView from './ScratchCardUserView'

const ScratchCardTable = ({ subAdmin, page, pageSize }) => {
  const { t } = useTranslation()
  const { updatePageName } = useContext(AuthContext)
  const [item, setItem] = useState('')

  const [viewShowModal, setViewShowModal] = useState(false)

  const handleUserView = item => {
    setItem(item)
    setViewShowModal(true)
  }
  useEffect(() => {
    updatePageName(t('SCRATCH_CARD_MANAGER'))
  }, [])

  return (
    <div className='p-3'>
      <div className='overflow-x-auto relative rounded-lg border'>
        <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
          <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
            <tr>
              <th scope='col' className='px-6 py-3 '>
                {t('S.NO')}</th>

              <th scope='col' className='px-6 py-3 '>{t('COUPON_CODE')}</th>

              <th scope='col' className='px-6 py-3 '>{t('COUPON_AMOUNT')} </th>
              <th scope='col' className='px-6 py-3 '> {t('REWARD_AMOUNT')}</th>
              <th scope='col' className='px-6 py-3 '>{t('EXPIRE_DATE')}</th>
              <th scope='col' className='py-3 px-6 text-center'>{t('O_ACTION')}</th>
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

                <td className='py-2 px-4 border-r dark:border-[#ffffff38] text-slate-900 font-bold'>{item?.couponCode}</td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>{helpers.formattedAmount(item?.couponAmount)}</td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                {helpers.formattedAmount(item?.rewardAmount)}
                </td>
                <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                  {dayjs(item?.expiryDate).format('DD MMM YYYY ')}
                </td>

                <td className='py-2 px-4 border-l'>
                  <div className=''>
                    <ul className='flex justify-center'>
                      <li className='px-2 py-2 hover:text-gradientTo'>
                        
                        {  helpers.ternaryCondition(item.isUsed,<button type='button' onClick={() => handleUserView(item)} title={t('VIEW_SCRATCH_CARD_HISTORY')}>
                            {' '}
                            <AiFillEye className='cursor-pointer w-5 h-5 text-slate-600' />
                          </button>,<span className='text-green-500'>{t('UNUSED')}</span>)}
                       
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
      {viewShowModal && (
        <ScratchCardUserView setViewShowModal={setViewShowModal} item={item} />
      )}
    </div>
  )
}

export default ScratchCardTable
