import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import dayjs from 'dayjs'
import StaticContentView from './StaticContentView'
import StaticContentList from './StaticContentList'
import AuthContext from 'context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'
import OSearch from 'components/reusable/OSearch'

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
      setCountryList(response)
     
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
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center mb-2 2xl:mb-0'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap '>
                  <div className='relative flex items-center mb-3'>
                  <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}  placeholder={t('SEARCH_BY_TITLE')}/>

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
            
          </div>
        </div>
      </div>
    
  )
}

export default StaticContent
