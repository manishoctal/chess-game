import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import TransactionDetailsTable from './TransactionDetailsTable'
import { useLocation } from 'react-router-dom'
import PageSizeList from 'components/PageSizeList'
import OSearch from 'components/reusable/OSearch'

function TransactionDetails () {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchkey: debouncedSearchTerm ? debouncedSearchTerm : '',
        isFilter: debouncedSearchTerm ? true : false
      })
      setPage(1)
    }
  }, [debouncedSearchTerm])
  const { t } = useTranslation()
  const { logoutUser, updatePageName } = useContext(AuthContext)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })

  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const location = useLocation()
  const [userType] = useState(location?.state?.userType)
  const [userId] = useState(location?.state?.userId)

  const [filterData, setFilterData] = useState({
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })

  const getTransactionDetails = async data => {
    try {
      const { category, startDate, endDate, searchkey } = filterData

      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey?.trim(),
        userId,
        userType
      }

      const path = apiPath.getUserTransaction
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results?.docs
        setTransactions(response)
      }
    } catch (error) {
      console.error('error ', error)
      setPaginationObj({})
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  useEffect(() => {
    getTransactionDetails()
  }, [page, filterData, pageSize])

  useEffect(() => {
    const pageName =
      userType === 'local'
        ? t('TRANSACTION_DETAILS_LOCAL')
        : t('TRANSACTION_DETAILS_TOURIST')
    updatePageName(pageName)
  }, [])

  const handleReset = () => {
    setFilterData({
      isFilter: false,
      category: '',
      kycStatus: '',
      searchkey: '',
      startDate: '',
      endDate: '',
      isReset: true
    })
    setPage(1)
    setSearchTerm('')
    setPageSize(10)
  }
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

  
  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap justify-between'>
              <div className='flex flex-wrap items-center'>
                <div className='flex items-center lg:pt-0 pt-3 justify-center'>
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />

                  <button
                    type='button'
                    onClick={() => handleReset()}
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
            <TransactionDetailsTable
              transactions={transactions}
              page={page}
              userType={userType}
              pageSize={pageSize}
            />

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
export default TransactionDetails
