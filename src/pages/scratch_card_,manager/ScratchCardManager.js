import React, { useContext, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import { useNavigate } from 'react-router-dom'
import useToastContext from 'hooks/useToastContext'
import ScratchCardTable from './ScratchCardTable'
import AddScratchCard from './AddScratchCard'

function ScratchCardManager () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const notification = useToastContext()
  const { user, updatePageName } = useContext(AuthContext)
  const manager =
    user?.permission?.find(e => e.manager === 'subAdmin_manager') ?? {}
  const [subAdmin, setSubAdmin] = useState()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filterData, setFilterData] = useState({
    category: '',
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

  const [ScratchCardUsersTable, setScratchCardUsersTable] = useState(false)

  const allScratchCard = async (data, pageNO) => {
    try {
      const { startDate, endDate, searchkey } = filterData

      const payload = {
        page,
        pageSize: pageSize,

        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey,
        sortBy: sort.sortBy,
        sortType: sort.sortType
      }

      const path = apiPath.addScratchCard
      const result = await apiGet(path, payload)
      const response = result?.data?.results
      const resultStatus = result?.data?.success
      setSubAdmin(response)
      setPaginationObj({
        ...paginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null
      })
    } catch (error) {
      console.log('error in get all sub admin list==>>>>', error.message)
    }
  }
  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  useEffect(() => {
    allScratchCard()
  }, [filterData, page, sort, pageSize])

  const handelStatusChange = async item => {
    try {
      const payload = {
        status: item?.status === 'inactive' ? 'active' : 'inactive',
        type: 'subAdmin'
      }
      const path = `${apiPath.changeStatus}/${item?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result.data.message)
        allScratchCard({ statusChange: 1 })
      }
      // }
    } catch (error) {
      console.log('error in get all users list==>>>>', error.message)
    }
  }

 

  const handleReset = () => {
    setFilterData({
      searchkey: '',
      startDate: '',
      endDate: '',
      isReset: true,
      isFilter: false
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
      isFilter: true
    })
  }

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchkey: debouncedSearchTerm || '',
        isFilter: !!debouncedSearchTerm
      })
      setPage(1)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])
  useEffect(() => {
    updatePageName(t('SCRATCH_CARD_MANAGER'))
  }, [])

  return (<>
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <div className='relative flex items-center mb-3'>
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
                      placeholder={t('SEARCH_BY_NAME')}
                      value={searchTerm}
                      title=''
                      required
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>

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
              <div className='flex items-center justify-end px-4 ms-auto mb-3'>
                {(manager?.add || user?.role === 'admin') && (
                  <button
                    title={t('ADD_NEW')}
                    type='button'
                    className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                    onClick={setShowModal}
                  >
                    + {t('ADD_NEW')}
                  </button>
                )}
              </div>
            </form>
           <ScratchCardTable subAdmin={subAdmin?.docs} page={page} ScratchCardUsersTable={ScratchCardUsersTable} setScratchCardUsersTable={setScratchCardUsersTable}/>
          

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
    {
      showModal&&
      <AddScratchCard setShowModal ={setShowModal} allScratchCard={allScratchCard}/>
    }
    </>
  )
}

export default ScratchCardManager
