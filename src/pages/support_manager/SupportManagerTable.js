import { isEmpty, startCase } from 'lodash'
import dayjs from 'dayjs'
import { AiFillEye } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { BsArrowUpShort } from 'react-icons/bs'
import { useContext, useState } from 'react'
import ReplyModal from './ReplyModal'
import AuthContext from 'context/AuthContext'
import { FaReply } from 'react-icons/fa'

const SupportManagerTable = ({
  notifications,
  paginationObj,
  sort,
  setSort,
  manager,
  getSupportRequest
}) => {
  const { t } = useTranslation()
  const [isReply, setIsReply] = useState(false)
  const [replyUser, setReplyUser] = useState('')
  const { user } = useContext(AuthContext)
  const handleReply = item => {
    setReplyUser(item)
    setIsReply(true)
  }
  return (
    <>
      <div className='p-3'>
        <div className='overflow-x-auto relative rounded-lg border'>
          <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
            <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  {t('S.NO')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('NAME')}
                </th>

                {/* <th scope='col' className='py-3 px-6'>
                  {t('O_EMAIL')}
                </th> */}

                <th scope='col' className='py-3 px-6'>
                  {t('FEEDBACK')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('O_STATUS')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('O_ACTION')}
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications &&
                notifications?.map((item, i) => (
                  <tr
                    key={i}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  >
                    <th
                      scope='row'
                      className='py-4 px-6 border-r font-medium text-gray-900  dark:text-white'
                    >
                      {i + 1 + 10 * (paginationObj?.page - 1)}
                    </th>
                    <td className='py-4 px-6 border-r'>
                      {`${item?.user?.firstName} ${item?.user?.lastName}`|| 'N/A'}
                      <br/>
                      {item?.user?.email || 'N/A'}{' '}
                      <br/>
                      {startCase(item?.user?.userType) || 'N/A'}{' '}
                    </td>

                    {/* <td className='py-4 px-6 border-r'>
                      {item?.user?.email || 'N/A'}{' '}
                    </td> */}

                    <td className='py-4 px-6 border-r'>
                      {startCase(item?.feedback) || 'N/A'}
                    </td>
                    <td className='py-4 px-6 border-r '>
                      {item?.replied?'Replied' :'Not replied'}
                    </td>
                    <td className='py-4 px-6 border-l'>
                      <div className=''>
                        <ul className='flex justify-center'>
                          {(manager?.add || user?.role === 'admin') && (
                            <>
                              <li
                                disabled={
                                  item?.replied === false ? false : true
                                }
                                className={
                                  item?.replied === false
                                    ? 'px-2 py-2 hover:bg-white hover:text-LightBlue'
                                    : ''
                                }
                                onClick={() => handleReply(item)}
                              >
                                {item?.replied === false ? (
                                  <button title={t('reply')}>
                                    {' '}
                                    <FaReply className='cursor-pointer w-5 h-5 text-slate-600' />{' '}
                                  </button>
                                 ) : null} 
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              {isEmpty(notifications) && (
                <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                  <td className='py-4 px-6 border-r' colSpan={6}>
                    {t('O_NO_RECORD_FOUND')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isReply ? <ReplyModal setIsReply={setIsReply} item={replyUser} getSupportRequest={getSupportRequest} /> : null}
    </>
  )
}

export default SupportManagerTable
