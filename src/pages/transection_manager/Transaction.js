import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import TransactionTable from './TransactionTable'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'

function Transaction () {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const manager =
    user?.permission?.find(e => e.manager === 'transaction_manager') ?? {}
  const [artistVerification, setArtistVerification] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [userType, setUserType] = useState('tourist')

  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [filterData, setFilterData] = useState({
    category: 'foreignTourist',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortType: 'desc'
  })

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }
  const allTransaction = async data => {
    try {
      const { startDate, endDate } = filterData

      const payload = {
        page,
        pageSize,
        // status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,

        sortBy: sort.sortBy,
        sortType: sort.sortType,
        transactionType: userType
      }

      const path = apiPath.transactionList
      const result = await apiGet(path, payload)
      const response = result?.data?.results?.docs
      const resultStatus = result?.data?.success
      setArtistVerification(response)
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? result?.data?.results.page : null,
        pageCount: resultStatus ? result?.data?.results.totalPages : null,
        perPageItem: resultStatus ? response?.length : null,
        totalItems: resultStatus ? result?.data?.results.totalDocs : null
      })
    } catch (error) {
      console.error('error in get all sub admin list==>>>>', error.message)
    }
  }
  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  useEffect(() => {
    allTransaction()
  }, [filterData, page, sort, userType])

  const handleReset = () => {
    setFilterData({
      category: '',

      startDate: '',
      endDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
    setPageSize(10)
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

  return (
    <div>
      <div className='bg-[#F9F9F9]'>
        <div className='px-3 py-4'>
          <div className='flex justify-center items-center grid grid-cols-2 w-[500px]'>
            <button
              type='button'
              className={`pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${
                userType === 'tourist' && 'bg-[#000!important] text-white'
              }`}
              onClick={() => setUserType('tourist')}
            >
              {t('FOREIGN_TOURIST')}
            </button>
            <button
              type='button'
              className={` pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${
                userType === 'local' && 'bg-[#000!important] text-white'
              }`}
              onClick={() => setUserType('local')}
            >
              {t('THAI_LOCAL')}
            </button>
          </div>
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
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    {t('O_RESET')}
                  </button>
                </div>
              </div>
            </form>
            <TransactionTable
              artistVerification={artistVerification}
              allTransection={allTransaction}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              pageSize={pageSize}
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
      <></>
    </div>
  )
}

export default Transaction
