import React, { useContext, useEffect, useState } from 'react'
import { apiGet  } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import ReportsTable from './ReportsTable'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import PageSizeList from 'components/PageSizeList'
import helpers from 'utils/helpers'
import OSearch from 'components/reusable/OSearch'

function Report () {
  const { t } = useTranslation()
  const { logoutUser,  updatePageName } = useContext(AuthContext)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })

  const [users, setAllUser] = useState([])
  const [userType, setUserType] = useState('tourist')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

 

  const [filterData, setFilterData] = useState({
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort] = useState({
    sort_key: 'createdAt',
    sort_type: 'desc'
  })

  const getAllReports = async () => {
    try {
      const {
        category,
        startDate,
        endDate,
        searchkey,
      } = filterData
      const payload = {
        page,
        pageSize: pageSize,
        userType,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        status: category,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey?.trim(),
        sortKey: sort?.sort_key,
        sortType: sort?.sort_type,
      }

      const path = apiPath.getReports
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        setAllUser(response?.docs)
        const resultStatus = result?.data?.success
        setPaginationObj({
          ...paginationObj,page: helpers.ternaryCondition(resultStatus , response.page , null), perPageItem: helpers.ternaryCondition(resultStatus , response?.docs.length , null),
          totalItems: helpers.ternaryCondition(resultStatus , response.totalDocs , null),pageCount: helpers.ternaryCondition(resultStatus , response.totalPages , null)
        })
      }
    } catch (error) {
      console.error('error ', error)
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
      setPaginationObj({})
    }
  }
  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
    setAllUser([])
  }
  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }
  useEffect(() => {
    getAllReports()
  }, [page, filterData, sort, pageSize, userType])
  useEffect(() => {
    updatePageName(t('REPORT_MANAGER'))
  }, [])

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
  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='flex justify-center items-center grid grid-cols-2 w-[500px]'>
            <button   type='button' title= {t('FOREIGN_TOURIST')}  className={`pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${userType==='tourist' && 'bg-[#000!important] text-white'}`} onClick={() => {setUserType('tourist');handleReset()}}
            >
            {t('FOREIGN_TOURIST')}
            </button>
            <button type='button'  title= {t('THAI_LOCAL')} className={` pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${userType==='local'&& 'bg-[#000!important] text-white'}`} onClick={() => {setUserType('local');handleReset()}}
            >
            {t('THAI_LOCAL')}
            </button>
          </div>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap justify-between'>
              <div className='flex flex-wrap items-center'>
                <div className='flex items-center lg:pt-0 pt-3 justify-center'> 
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData}/>
                  <button type='button' onClick={() => handleReset()}  className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2' title= {t('O_RESET')}
                  >
                    {t('O_RESET')}
                  </button>
                </div>
              </div>
              <div className='flex items-center md:justify-end px-4'>
                <label
                  htmlFor='default-search' className='mb-2 font-medium text-sm  text-gray-900 sr-only'
                >  {t('O_SEARCH')}
                </label>
                <div className='flex'>
                  <div className='relative'>
                  <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_KEYWORD')}/>
                  </div>
                </div>
              </div>
            </form>
            <ReportsTable users={users} page={page} pageSize={pageSize} userType={userType}/>
            <div className='flex justify-between'>
            <PageSizeList  dynamicPage={dynamicPage} pageSize={pageSize}/>       
              {paginationObj?.totalItems ? ( <Pagination handlePageClick={handlePageClick} options={paginationObj} page={page}/>) : null}
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}
export default Report
