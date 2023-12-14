import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import dayjs from 'dayjs'
import StaticContentView from './StaticContentView'
import StaticContentList from './StaticContentList'
import Pagination from '../Pagination'
import AuthContext from 'context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'

const StaticContent = () => {
  const { user, updatePageName } = useContext(AuthContext)
  const navigate = useNavigate()
  const ternaryCondition = (condition, first, second) => {
    return condition ? first : second
  }
  const manager =
    user?.permission?.find(e => e.manager === 'static_page_management') ?? {}
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [countryList, setCountryList] = useState([])
  const [countryEdit, setCountryEdit] = useState(false)
  const [currentItem, setCurrentItem] = useState('')
  const [countryView, setCountryView] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [filterData, setFilterData] = useState({
    status: '',
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

  const handleEdit = async item => {
    setCurrentItem(item)
    setCountryEdit(!countryEdit)
    const newContent = await Buffer.from(item.content, 'base64').toString(
      'ascii'
    )

    const newData = { ...item, content: newContent }
    navigate('/static-content/edit', { state: newData })
  }
  const handleView = item => {
    setCurrentItem(item)
    setCountryView(!countryView)
    if (item?.slug === 'faqs') {
      navigate('/static-content/faqs')
    } else {
      navigate('/static-content/view', { state: item })
    }
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const getStaticContent = async () => {
    try {
      const { status, startDate, endDate, searchkey } = filterData

      const payload = {
        page,
        pageSize: 10,
        status,
        startDate: ternaryCondition(
          startDate,
          dayjs(startDate).format('YYYY-MM-DD'),
          null
        ),
        endDate: ternaryCondition(
          endDate,
          dayjs(endDate).format('YYYY-MM-DD'),
          null
        ),
        keyword: searchkey?.trim(),
        sortBy: sort.sortBy,
        sortType: sort.sortType
      }
      const path = apiPath.getStaticContent
      const result = await apiGet(path, payload)
      const response = result?.data?.results
      const resultStatus = result?.data?.success

      setCountryList(response?.docs)
      setPaginationObj({
        ...paginationObj,
        page: ternaryCondition(resultStatus, response.page, null),
        pageCount: ternaryCondition(resultStatus, response.totalPages, null),
        perPageItem: ternaryCondition(
          resultStatus,
          response?.docs.length,
          null
        ),
        totalItems: ternaryCondition(resultStatus, response.totalDocs, null)
      })
    } catch (error) {
      console.error('error in get all country list==>>>>', error.message)
    }
  }

  useEffect(() => {
    getStaticContent()
  }, [page, filterData, sort])

  
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
    updatePageName(t('NAV_STATIC_CONTENTS'))
  }, [])

  const andOperator = (condition, text) => {
    return condition && text
  }

  return (
    <>
      {' '}
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center mb-2 2xl:mb-0'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap '>
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
                      placeholder={t('SEARCH_BY_TITLE')}
                      value={searchTerm}
                      title=''
                      required
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                 
                </div>
              </div>
             
            </form>
            <StaticContentList
              countryList={countryList}
              getStaticContent={getStaticContent}
              page={page}
              handleEdit={handleEdit}
              handleView={handleView}
              currentItem={currentItem}
              countryView={countryView}
              setSort={setSort}
              sort={sort}
              manager={manager}
            />
            {andOperator(
              countryView,
              <StaticContentView
                countryView={countryView}
                currentItem={currentItem}
                handleView={handleView}
              />
            )}

            {andOperator(
              countryEdit,
              <staticContentEdit
                handleEdit={handleEdit}
                currentItem={currentItem}
                getStaticContent={getStaticContent}
              />
            )}
            {andOperator(
              paginationObj?.totalItems,
              <Pagination
                handlePageClick={handlePageClick}
                options={paginationObj}
                page={page}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StaticContent
