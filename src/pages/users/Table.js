import React, { useState } from 'react'
import { apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import { isEmpty, startCase } from 'lodash'
import dayjs from 'dayjs'
import useToastContext from 'hooks/useToastContext'
import { AiFillEdit, AiFillEye } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { BsArrowUpShort } from 'react-icons/bs'
import helper from '../../utils/helpers'
import { NavLink } from 'react-router-dom'
import UserEdit from './Edit'
import { GiTakeMyMoney } from 'react-icons/gi'
import { MdHistory } from 'react-icons/md'
import AddAmount from './AddAmount'

const Table = ({
  users,
  getAllUser,
  handleUserView,
  user,
  manager,
  page,
  sort,
  setSort,
  userType,
  pageSize
}) => {
  const { t } = useTranslation()
  const notification = useToastContext()

  const [editShowModal, setEditShowModal] = useState(false)
  const [editItem, setEditItem] = useState('')
  const [isAmountModal, setIsAmountModal] = useState(false)
  const [addAmountUser,setAddAmountUser]= useState('')

  const handelStatusChange = async item => {
    try {
      const payload = {
        status: item?.status === 'inactive' ? 'active' : 'inactive',
        type: 'user'
      }
      const path = `${apiPath.changeStatus}/${item?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result.data.message)
        getAllUser({ statusChange: 1 })
      }
      // }
    } catch (error) {
      console.error('error in get all users list==>>>>', error.message)
    }
  }
  const handelKYCStatus = async item => {
    try {
      const payload = {
        status: item?.isKYCVerified === 0 ? 'active' : 'inactive'
      }
      const path = `${apiPath.changeUserStatus}/${item?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result.data.message)
        getAllUser({ statusChange: 1 })
      }
      // }
    } catch (error) {
      console.error('error in get all users list==>>>>', error.message)
    }
  }

  const handelEdit = item => {
    setEditItem(item)
    setEditShowModal(!editShowModal)
  }
  return (
    <>
      <div className='p-3'>
        <div className='overflow-x-auto relative rounded-lg border'>
          <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
            <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
              <tr>
                <th scope='col' className='py-3 px-3'>
                  {t('S.NO')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {userType === 'local' ? t('NAME') : t('FIRST_NAME')}
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 cursor-pointer'
                  onClick={() => {
                    if (sort.sort_key === 'email' && sort.sort_type === 'asc') {
                      setSort({
                        sort_key: 'email',
                        sort_type: 'desc'
                      })
                    } else {
                      setSort({
                        sort_key: 'email',
                        sort_type: 'asc'
                      })
                    }
                  }}
                >
                  <div className='flex justify-left'>
                    <span>{t('O_EMAIL_ID')}</span>
                    <span>
                      {sort.sort_key === 'email' &&
                        sort.sort_type === 'asc' && (
                          <BsArrowUpShort className='w-4 h-4' />
                        )}
                      {sort.sort_key === 'email' &&
                        sort.sort_type === 'desc' && (
                          <BsArrowUpShort className='w-4 h-4 rotate-180' />
                        )}
                    </span>
                  </div>
                </th>
                <th scope='col' className='py-3 px-6'>
                  <div className='text-left'>{t('O_MOBILE_NUMBER')}</div>
                </th>
                {userType === 'local' && (
                  <th scope='col' className='py-3 px-6 text-left'>
                    {t('AVAILABLE_BALANCE')}
                  </th>
                )}
                {userType === 'tourist' && (
                  <th scope='col' className='py-3 px-6 text-left'>
                    {t('UPC_CODE')}
                  </th>
                )}
                {userType === 'tourist' && (
                  <th scope='col' className='py-3 px-6 text-left'>
                    {t('REFERRAL_CODE')}
                  </th>
                )}
                <th scope='col' className='py-3 px-6 text-left'>
                  {t('KYC_STATUS')}
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 cursor-pointer'
                  onClick={() => {
                    if (
                      sort.sort_key === 'createdAt' &&
                      sort.sort_type === 'asc'
                    ) {
                      setSort({
                        sort_key: 'createdAt',
                        sort_type: 'desc'
                      })
                    } else {
                      setSort({
                        sort_key: 'createdAt',
                        sort_type: 'asc'
                      })
                    }
                  }}
                >
                  <div className='flex justify-start'>
                    <span>{t('O_CREATED_AT')}</span>
                    <span>
                      {sort.sort_key === 'createdAt' &&
                        sort.sort_type === 'asc' && (
                          <BsArrowUpShort className='w-4 h-4' />
                        )}
                      {sort.sort_key === 'createdAt' &&
                        sort.sort_type === 'desc' && (
                          <BsArrowUpShort className='w-4 h-4 rotate-180' />
                        )}
                    </span>
                  </div>
                </th>
                {(manager?.add ||
                  user?.permission?.length === 0) && (
                  <>
                    <th scope='col' className='py-3 px-6 text-left'>
                      {t('O_STATUS')}
                    </th>
                  </>
                )}
                <th scope='col' className='py-3 px-6 text-left'>
                  {t('O_ACTION')}
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
                    <td className='py-4 px-4 border-r  dark:border-[#ffffff38]'>
                      {userType === 'local' ?`${item?.firstName} ${item?.lastName}`: item?.firstName || 'N/A'}
                    </td>
                    <td className='py-2 px-4 border-r  dark:border-[#ffffff38]'>
                      {item?.email || 'N/A'}
                    </td>
                    <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left'>
                      {item?.mobile || 'N/A'}
                    </td>
                    {userType === 'local' && (
                      <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-left'>
                        {item?.wallet_amount || 'N/A'}
                      </td>
                    )}
                    {userType === 'tourist' && (
                      <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                        {item?.upcCode|| 'N/A'}
                      </td>
                    )}
                    {userType === 'tourist' && (
                      <td className='py-4 px-3 border-r  dark:border-[#ffffff38] '>
                        {item?.referralCode || 'N/A'}
                      </td>
                    )}

                    <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                      {startCase(item?.isKycApproved) || 'N/A'}
                    </td>
                    <td className='py-4 px-3 border-r  dark:border-[#ffffff38] text-center'>
                      {dayjs(item?.createdAt).format('DD-MM-YYYY hh:mm A') ||
                        'N/A'}
                    </td>
                    {(manager?.add ||
                      user?.permission?.length === 0) && (
                      <>
                        <td className='py-2 px-4 border-r  dark:border-[#ffffff38] text-center'>
                          <label
                            className='inline-flex relative items-center cursor-pointer'
                            title={`${
                              item?.status === 'active' ? 'Active' : 'Inactive'
                            }`}
                          >
                            <input
                              type='checkbox'
                              className='sr-only peer'
                              checked={item?.status === 'active'}
                              onChange={e =>
                                helper.alertFunction(
                                  `Are you sure you want to ${
                                    e.target.checked ? 'active' : 'inactive'
                                  } user ?`,
                                  item,
                                  handelStatusChange
                                )
                              }
                            />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                          </label>
                        </td>
                      </>
                    )}
                    <td className='py-2 px-4 border-l'>
                      <div className=''>
                        <div className='flex justify-center items-center'>
                        
                            <NavLink
                              onClick={() => handleUserView(item)}
                              to='/users/view'
                              state={{...item,userType}}
                              title={t('O_VIEW')}
                              className='px-2 py-2'
                            >
                              <AiFillEye className='cursor-pointer w-5 h-5 text-slate-600 dark:hover:text-white hover:text-blue-700' />{' '}
                            </NavLink>
                        

                          {(manager?.add || user?.role === 'admin') &&
                            userType === 'local' && (
                              <div onClick={() => handelEdit(item)}>
                                <AiFillEdit
                                  className='text-green text-lg cursor-pointer  text-slate-600'
                                  title='Edit user'
                                />
                              </div>
                            )}
                           {(manager?.add || user?.role === 'admin') && ( <div onClick={()=>{setIsAmountModal(true);setAddAmountUser(item)}}>
                            <GiTakeMyMoney
                              className='text-green text-lg cursor-pointer  text-slate-600'
                              title='Add amount'
                            />
                          </div>)}
                          <div>
                            <NavLink to='/transactionDetails' state={{userType,userId:item?._id}}>
                              <MdHistory
                                className='text-green text-lg cursor-pointer  text-slate-600'
                                title='Transaction details'
                              />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              {isEmpty(users) ? (
                <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                  <td
                    className='py-2 px-4 border-r dark:border-[#ffffff38]'
                    colSpan={13}
                  >
                    {t('O_NO_RECORD_FOUND')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editShowModal && (
        <UserEdit
          item={editItem}
          setEditShowModal={setEditShowModal}
          getAllUser={getAllUser}
        />
      )}

      {isAmountModal && <AddAmount addAmountUser={addAmountUser} getAllUser={getAllUser} setIsAmountModal={setIsAmountModal} userType={userType}/>}
    </>
  )
}

export default Table
