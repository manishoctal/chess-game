import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import NotificationTable from './NotificationTable'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import NotificationAdd from './NotificationAdd'
import ViewNotifications from './ViewNotifications'

function NotificationManager () {
  const { t } = useTranslation()
  const { logoutUser, notification, user } = useContext(AuthContext)
  const manager =
    user?.permission?.find(e => e.manager === 'notification_manager') ?? {}
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [categoryAdd, setCategoryAdd] = useState(false)
  const [viewShowModal, setViewShowModal] = useState(false)
  const [notifications, setAllNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [item, setItem] = useState('')

  const [filterData, setFilterData] = useState({
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort, setSort] = useState({
    sortKey: 'createdAt',
    sortType: 'desc'
  })

  // get all notification function-
  const getAllNotifications = async () => {
    try {
      const { startDate, endDate, searchkey } = filterData

      const payload = {
        page,
        pageSize,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey,
        sortBy: sort.sortKey,
        sortType: sort.sortType
      }

      const path = apiPath.notifications
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        const resultStatus = result?.data?.success
        setAllNotifications(response?.docs)
        setPaginationObj({
          ...paginationObj,
          page: resultStatus ? response.page : null,
          pageCount: resultStatus ? response.totalPages : null,
          perPageItem: resultStatus ? response?.docs.length : null,
          totalItems: resultStatus ? response.totalDocs : null
        })
      }
    } catch (error) {
      console.error('error ', error)
      setPaginationObj({})
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handelEdit = newItem => {
    setItem(newItem)
  }

  const handleUserView = newItem => {
    setItem(newItem)
    setViewShowModal(true)
  }
  const handleCategory = () => {
    setCategoryAdd(!categoryAdd)
  }
  useEffect(() => {
    getAllNotifications()
  }, [page, filterData, sort, pageSize])

  const handleReset = () => {
    setFilterData({
      category: '',
      searchkey: '',
      startDate: '',
      endDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
    // setIsDelete(true)
  }

  const handleDateChange = (start, end) => {
    setPage(1)
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true
    })
    // setIsDelete(true)
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  return (
    <div>
      <div className='bg-[#F9F9F9]'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />
                  <button
                    type='button'
                    onClick={handleReset}
                    title={t('O_RESET')}
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    {t('O_RESET')}
                  </button>
                </div>
              </div>

              <div className='2xl:ml-auto xl:ml-0 lg:pt-0 pt-2'>
                <label
                  htmlFor='default-search'
                  className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                >
                  {t('O_SEARCH')}
                </label>
                <div className='flex'>
                  {(manager?.add || user?.role === 'admin') && (
                    <button
                      title={t('ADD_NOTIFICATION')}
                      type='button'
                      className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                      onClick={() => handleCategory()}
                    >
                      + {t('ADD_NOTIFICATION')}
                    </button>
                  )}
                </div>
              </div>
            </form>
            <NotificationTable
              notifications={notifications}
              notification={notification}
              getAllNotifications={getAllNotifications}
              handelEdit={handelEdit}
              handleUserView={handleUserView}
              page={page}
              setSort={setSort}
              sort={sort}
              pageSize={pageSize}
              manager={manager}
              paginationObj={paginationObj}
            />

            {categoryAdd && (
              <NotificationAdd
                categoryAdd={categoryAdd}
                getAllNotifications={getAllNotifications}
                handleCategory={handleCategory}
              />
            )}

            <div className='flex justify-between'>
              <div className='flex items-center mb-3 ml-3'>
                <p className='w-[160px] -space-x-px pt-5 md:pb-5 pr-5 text-gray-500'>
                  Page Size
                </p>

                <select
                  id='countries'
                  type=' password'
                  name='floating_password'
                  className=' w-[100px] block p-2 px-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                  placeholder=''
                  value={pageSize}
                  onChange={e => dynamicPage(e)}
                >
                  <option value='10'>10</option>
                  <option value='20'>20</option>
                  <option value='50'>50</option>
                  <option value='100'>100</option>
                </select>
              </div>
              {paginationObj?.totalItems !== 0 && (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  page={page}
                />
              )}
            </div>

            {viewShowModal && (
              <ViewNotifications
                setViewShowModal={setViewShowModal}
                item={item}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotificationManager
