import React, { useContext, useEffect, useState } from 'react'
import { apiGet  } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Table from './Table'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import PageSizeList from 'components/PageSizeList'
import helpers from 'utils/helpers'
import OSearch from 'components/reusable/OSearch'
import { startCase } from 'lodash'
import { KYCStatusArray } from 'utils/constants'

function User () {
  const { t } = useTranslation()
  const { logoutUser, user, updatePageName } = useContext(AuthContext)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })

  const [users, setAllUser] = useState([])
  const [userType, setUserType] = useState('tourist')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete, setIsDelete] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

 

  const [filterData, setFilterData] = useState({
    isKYCVerified: '',
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort, setSort] = useState({
    sort_key: 'createdAt',
    sort_type: 'desc'
  })

  const getAllUser = async data => {
    try {
      const {
        category,
        startDate,
        endDate,
        searchkey,
        isKYCVerified
      } = filterData

      const payload = {
        page,
        pageSize: pageSize,
        userType,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchkey?.trim(),
        sortKey: sort?.sort_key,
        sortType: sort?.sort_type,
        isKYCVerified
      }

      const path = apiPath.getUsers
      const result = await apiGet(path, payload)

      if (result?.status === 200) {
        const response = result?.data?.results
        setAllUser(response?.docs)
        const resultStatus = result?.data?.success
        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus , response.page , null),
          perPageItem: helpers.ternaryCondition(resultStatus , response?.docs.length , null),
          totalItems: helpers.ternaryCondition(resultStatus , response.totalDocs , null),
          pageCount: helpers.ternaryCondition(resultStatus , response.totalPages , null)
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

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }
  const handleUserView = () => {
    updatePageName(` ${t('VIEW') + ' ' + t('USER_MANAGER')}`)
  }

  useEffect(() => {
    getAllUser()
  }, [page, filterData, sort, pageSize, userType])

  useEffect(() => {
    updatePageName(t('O_USERS'))
  }, [])

  const handleReset = () => {
    setFilterData({
      isKYCVerified: '',
      category: '',
      kycStatus: '',
      searchkey: '',
      startDate: '',
      endDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
    // setIsDelete(true)
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
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])
  const statusPage = e => {
    setFilterData({
      ...filterData,
      category: e.target.value,
      isFilter: true,
      isReset: false
    })
    setPage(1)
    setIsDelete(true)
  }
  const handleVerify = e => {
    setFilterData({
      ...filterData,
      isKYCVerified: e?.target?.value,
      isFilter: true,
      isReset: false
    })
    setPage(1)
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

  

  const manager = user?.permission?.find(e => e.manager === 'user_manager')

  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='flex justify-center items-center grid grid-cols-2 w-[500px]'>
            <button
              type='button'
              title= {t('FOREIGN_TOURIST')}
              className={`pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${userType==='tourist' && 'bg-[#000!important] text-white'}`}
              onClick={() => {setUserType('tourist');handleReset()}}
            >
              {t('FOREIGN_TOURIST')}
            </button>
            <button
              type='button'
              title= {t('THAI_LOCAL')}
              className={` pr-6 bg-white border border-1 border-[#000] text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center  text-black  sm:w-auto w-1/2 ${userType==='local'&& 'bg-[#000!important] text-white'}`}
              onClick={() => {setUserType('local');handleReset()}}
            >
              {t('THAI_LOCAL')}
            </button>
          </div>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3]  px-4 py-3 pt-5 flex flex-wrap justify-between'>
              <div className='flex flex-wrap items-center'>
                <div className='flex items-center lg:pt-0 pt-3 justify-center'> 
                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />

                  <div className='flex items-center mb-3 ml-3'>
                    <select
                      id='countries'
                      type='password'
                      name='floating_password'
                      className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                      placeholder=' '
                      value={filterData?.category}
                      onChange={statusPage}
                    >
                      <option defaultValue value=''>
                        {t('O_ALL')}
                      </option>
                      <option value='active'>{t('O_ACTIVE')}</option>
                      <option value='inactive'>{t('O_INACTIVE')}</option>
                    </select>
                  </div>

                  <div className='flex items-center mb-3 ml-3'>
                    <select
                      id='countries'
                      type=' password'
                      name='floating_password'
                      className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer'
                      placeholder=' '
                      value={filterData?.isKYCVerified}
                      onChange={e => handleVerify(e)}
                    >
                      <option defaultValue value=''>
                        {t('KYC_STATUS')}
                      </option>
                    
                     {KYCStatusArray.map(({key,value})=> <option key={key} value={value}>{startCase(key)}</option>)}
                    </select>
                  </div>

                  <button
                    type='button'
                    onClick={() => handleReset()}
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                    title= {t('O_RESET')}
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
                  <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}   placeholder={t('SEARCH_BY_KEYWORD')}/>
                  </div>
                </div>
              </div>
            </form>
            <Table
              users={users}
              user={user}
              getAllUser={getAllUser}
              
              handleUserView={handleUserView}
              page={page}
              setSort={setSort}
              sort={sort}
              setPage={setPage}
              pageSize={pageSize}
              userType={userType}
              manager={manager}
            />

            <div className='flex justify-between'>
            <PageSizeList  dynamicPage={dynamicPage} pageSize={pageSize}/>
              
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
export default User
