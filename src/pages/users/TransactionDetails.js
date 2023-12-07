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

function TransactionDetails () {
  const { t } = useTranslation()
  const { logoutUser, user, updatePageName } = useContext(AuthContext)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [, setEditShowModal] = useState(false)

  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [item, setItem] = useState('')
  const [isDelete, setIsDelete] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
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
        keyword: searchkey?.trim()
        ,userId,
        userType
      }

      const path = apiPath.getUserTransaction
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        // const resultStatus = result?.data?.success
        // setTransactions(response?.docs)
        setTransactions(response)
        // setPaginationObj({
        //   ...paginationObj,
        //   page: resultStatus ? response?.page : null,
        //   pageCount: resultStatus ? response?.totalPages : null,
        //   perPageItem: resultStatus ? response?.docs.length : null,
        //   totalItems: resultStatus ? response.totalDocs : null
        // })
      }
    } catch (error) {
      console.log('error ', error)
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

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handelEdit = items => {
    setItem(items)
    setEditShowModal(true)
  }

  useEffect(() => {
    getTransactionDetails();
  }, [page, filterData, pageSize])

  useEffect(() => {
    const pageName =userType==='local' ? t('TRANSACTION_DETAILS_LOCAL'):t('TRANSACTION_DETAILS_TOURIST')
    updatePageName(pageName)
  }, [])

  const handleReset = () => {
    setFilterData({
      category: '',
      kycStatus: '',
      searchkey: '',
      startDate: '',
      endDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
    setIsDelete(true)
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
    setIsDelete(true)
  }

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  const manager = user?.permission?.find(e => e.manager === 'transactions_managers')

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
                    <div className='absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none'>
                      {!searchTerm ? (
                        <svg
                          aria-hidden='true'
                          className='w-4 h-4 text-[#A5A5A5] dark:text-gray-40'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                          />
                        </svg>
                      ) : (
                        ''
                      )}
                    </div>
                    <input
                      type='search'
                      id='default-search'
                      className='block w-full p-2 outline-none text-sm text-gray-900 2xl:min-w-[250px] xl:min-w-[300px] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder={t('SEARCH_BY_KEYWORD')}
                      value={searchTerm}
                      title=''
                      required
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
            <TransactionDetailsTable
              transactions={transactions}
              page={page}
              userType={userType}
            />

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