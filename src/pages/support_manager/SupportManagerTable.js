import { isEmpty, startCase } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import ReplyModal from './ReplyModal'
import AuthContext from 'context/AuthContext'
import { FaReply } from 'react-icons/fa'
import SupportView from './SupportView'
import helpers from 'utils/helpers'
import { AiFillEye } from 'react-icons/ai'

const SupportManagerTable = ({
  notifications,
  paginationObj,
  manager,
  getSupportRequest,
  pageSize
}) => {
  const { t } = useTranslation()
  const [isReply, setIsReply] = useState(false)
  const [replyUser, setReplyUser] = useState('')
  const { user } = useContext(AuthContext)
  const [supportView, setSupportView] = useState('')
  const [viewShowModal, setViewShowModal] = useState(false)
  const handleUserView = element => {
    setSupportView(element)
    setViewShowModal(true)
  }

  const handleReply = element => {
    setReplyUser(element)
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
                <th scope='col' className='py-3 px-6'>
                  {t('FEEDBACK')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('O_STATUS')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('O_CREATED_AT')}
                </th>
                {(manager?.add || user?.role === 'admin') && (
                  <th scope='col' className='py-3 px-6'>
                    {t('O_ACTION')}
                  </th>
                )}
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
                      {i + 1 + pageSize * (paginationObj?.page - 1)}
                    </th>
                    <td className='py-4 px-6 border-r'>
                      <div>
                        <p className='text-sm font-bold text-slate-950 leading-none'>
                          {helpers.getFullName(
                            item?.user?.firstName,
                            item?.user?.lastName
                          )}{' '}
                          ({startCase(item?.user?.userType) ?? ''})
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {item?.user?.email ?? ''}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {`+${item?.user?.countryCode} ${item?.user?.mobile}`}
                        </p>
                      </div>
                    </td>

                    <td className='py-4 px-6 border-r w-[500px]'>
                      <div className='line-clamp-2'>
                        {helpers.ternaryCondition(
                          item?.feedback,
                          startCase(item?.feedback),
                          'N/A'
                        )}
                      </div>

                      {item?.feedback.length > 223 && (
                        <button
                          type='button'
                          onClick={() => handleUserView(item?.feedback)}
                          className='bg-black inline-block mt-2 rounded-md text-white p-2 py-1'
                        >
                          Read More
                        </button>
                      )}
                    </td>
                    <td className='py-4 px-6 border-r '>
                      {helpers.ternaryCondition(
                        item?.replied,
                        'Replied',
                        'Not replied'
                      )}
                    </td>
                    <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                    {helpers.getDateAndTime(item?.createdAt)}
                </td>
                    {(manager?.add || user?.role === 'admin') && (
                      <td className='py-2 px-2 border-l'>
                        <div className=''>
                          <ul className='flex justify-center'>
                            <li className='px-2 py-2 hover:bg-white hover:text-LightBlue'>
                              {helpers.ternaryCondition(
                                item?.replied === false,
                                <button
                                  title={t('reply')}
                                  disabled={helpers.ternaryCondition(
                                    item?.replied === false,
                                    false,
                                    true
                                  )}
                                  
                                  onClick={() => handleReply(item)}
                                >
                                  {' '}
                                  <FaReply className='cursor-pointer w-5 h-5 text-slate-600' />{' '}
                                </button>,
                                <button
                                type='button'
                                onClick={() => handleUserView(item.replyMessage)}
                                title= {t('O_VIEW')}
                              >
                                 <AiFillEye className='cursor-pointer w-5 h-5 text-slate-600' />{' '}
                              </button>
                              )}
                            </li>
                          </ul>
                        </div>
                      </td>
                    )}
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

      {isReply ? (
        <ReplyModal
          setIsReply={setIsReply}
          item={replyUser}
          getSupportRequest={getSupportRequest}
        />
      ) : null}

      {viewShowModal && (
        <SupportView setViewShowModal={setViewShowModal} item={supportView} />
      )}
    </>
  )
}

export default SupportManagerTable
