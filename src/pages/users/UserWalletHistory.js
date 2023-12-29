import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import UserWalletHistoryTable from './UserWalletHistoryTable'
import { useLocation } from 'react-router-dom'
import PageSizeList from 'components/PageSizeList'
import helpers from 'utils/helpers'
import OSearch from 'components/reusable/OSearch'

function UserWalletHistory () {
  const { t } = useTranslation()
  const { logoutUser, updatePageName } = useContext(AuthContext)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })

  const [users, setWalletHistory] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const location = useLocation()
  const [userId] = useState(location?.state?.userId)
  const [filterData, setFilterData] = useState({
    verificationStatus: '',
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })

  const getWalletHistory = async () => {
    try {
      const { category, startDate, endDate, searchkey } = filterData

      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey?.trim(),
        receiverId: userId
      }

      const path = apiPath.listAddMoneyToUserWallet
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        const resultStatus = result?.data?.success
        setWalletHistory(response?.docs)
        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          pageCount: helpers.ternaryCondition(
            resultStatus,
            response.totalPages,
            null
          ),
          perPageItem: helpers.ternaryCondition(
            resultStatus,
            response?.docs.length,
            null
          ),
          totalItems: helpers.ternaryCondition(
            resultStatus,
            response.totalDocs,
            null
          )
        })
      }
    } catch (error) {
      console.error('error ', error)
      setPaginationObj({})
      if (error.response.status === 409 || error.response.status === 401) {
        logoutUser()
      }
    }
  }

  const dynamicPage = e => {
    setPageSize(e.target.value)
    setPage(1)
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handleReset = () => {
    setFilterData({
      isReset: true,
      isFilter: false,
      verificationStatus: '',
      category: '',
      kycStatus: '',
      startDate: '',
      endDate: '',
      searchkey: ''
    })
    setPage(1)
    setSearchTerm('')
    setPageSize(10)
  }

  useEffect(() => {
    getWalletHistory()
  }, [filterData, pageSize, page])

  useEffect(() => {
    updatePageName(t('USER_WALLET_HISTORY_ADMIN_AMOUNT'))
  }, [])

  const handleDateChange = (start, end) => {
    setPage(1)
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
      isReset: false
    })
  }

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else if (searchTerm || !filterData?.isReset) {
      setPage(1)
      setFilterData({
        ...filterData,
        isReset: false,
        searchkey: debouncedSearchTerm ? debouncedSearchTerm : '',
        isFilter: debouncedSearchTerm ? true : false
      })
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  return (
    <div>
      <div className='dark:bg-slate-900 bg-[#F9F9F9] '>
        <div className=' py-4 px-3'>
          <div className='border bg-white  border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className=' flex border-b border-b-[#E3E3E3]  px-4 py-3 pt-5  flex-wrap justify-between'>
              <div className='flex-wrap flex  items-center'>
                <div className='pt-3 flex items-center lg:pt-0  justify-center'>
                  <ODateRangePicker
                    setIsReset={setFilterData}
                    isReset={filterData?.isReset}
                    handleDateChange={handleDateChange}
                  />

                  <button
                    onClick={() => handleReset()}
                    type='button'
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    {t('O_RESET')}
                  </button>
                </div>
              </div>
              <div className='flex items-center md:justify-end px-4'>
                <label
                  htmlFor='default-search'
                  className='mb-2 text-sm font-medium text-gray-900 sr-only'
                >
                  {t('O_SEARCH')}
                </label>
                <div className='flex'>
                  <div className='relative'>
                  <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}   placeholder={t('SEARCH_BY_KEYWORD')}/>

                  </div>
                </div>
              </div>
            </form>
            <UserWalletHistoryTable users={users} page={page} />

            <div className='flex justify-between'>
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationObj?.totalItems ? (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  isDelete={isDelete}
                  page={page}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserWalletHistory
