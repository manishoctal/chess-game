import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import SupportManagerTable from './SupportManagerTable'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import PageSizeList from 'components/PageSizeList'

function SupportManager () {
  const { t } = useTranslation()
  const { logoutUser, notification, user, updatePageName } =
    useContext(AuthContext)
  const manager =
    user?.permission?.find(e => e.manager === 'feedback_manager') ?? {}
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [notifications, setAllNotifications] = useState([])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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

  const statusPage = e => {
    setPage(1)
    setFilterData({ ...filterData, category: e.target.value, isFilter: true })
  }
  const getSupportRequest = async data => {
    try {
      const { startDate, endDate, searchkey ,category} = filterData

      const payload = {
        page,
        pageSize,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey,
        sortBy: sort.sortKey,
        sortType: sort.sortType,
        isReplied:category
      }

      const path = apiPath.supportRequest
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


  useEffect(() => {
    getSupportRequest()
  }, [page, filterData, sort, pageSize])

  const handleReset = () => {
    setFilterData({
      category: '',
      searchkey: '',
      endDate: '',
      startDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
  }

  const handleDateChange = (start, end) => {
    setPage(1)
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true
    })
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  useEffect(() => {
    updatePageName(t('FEEDBACK_MANAGER'))
  }, [])
  return (
    <div>
      <div className='bg-[#F9F9F9]'>
        <div className='dark:bg-gray-900 p-5'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-gray-800'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />
                  <div className='flex items-center mb-3 ml-3'>
                    <select
                      id='countries'
                      type=' password'
                      name='floating_password'
                      className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                      placeholder=' '
                      value={filterData?.category}
                      onChange={e => statusPage(e)}
                    >
                      <option defaultValue value=''>
                        {t('O_ALL')}
                      </option>
                      <option value={true}>{t('Replied')}</option>
                      <option value={false}>{t('Not replied')}</option>
                    </select>
                  </div>
                  <button
                    type='button'
                    onClick={handleReset}
                    title= {t('O_RESET')}
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
              </div>
            </form>
            <SupportManagerTable
              notifications={notifications}
              notification={notification}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              paginationObj={paginationObj}
              getSupportRequest={getSupportRequest}
              pageSize={pageSize}
            />

            <div className='flex justify-between'>
            <PageSizeList  dynamicPage={dynamicPage} pageSize={pageSize}/>
              {paginationObj?.totalItems !== 0 && (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  page={page}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SupportManager
