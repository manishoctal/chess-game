import React, { useContext, useEffect, useState } from 'react'
import { apiGet, apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import dayjs from 'dayjs'
import StaticContentView from './StaticContentView'
import StaticContentList from './StaticContentList'
import AuthContext from 'context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'
import OSearchStatic from 'components/reusable/OSearch'
import helpers from 'utils/helpers'
import useToastContext from 'hooks/useToastContext'
import { BiReset } from 'react-icons/bi'

const StaticContent = () => {
  const notification = useToastContext()
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
    sortBy: 'updatedAt',
    sortType: 'desc'
  })

  // edit content navigation function start
  const handleEdit = async item => {
    setCurrentItem(item)
    setCountryEdit(!countryEdit)
    const newContent = await Buffer.from(item.content, 'base64').toString(
      'ascii'
    )

    const newData = { ...item, content: newContent }
    navigate('/static-content/edit', { state: newData })
  }
  // edit content navigation function end


  // view content function start

  const handleView = item => {
    setCurrentItem(item)
    setCountryView(!countryView)
    if (item?.slug === 'faqs') {
      navigate('/static-content/faqs')
    } else {
      navigate('/static-content/view', { state: item })
    }
  }
  // view content function end


  const staticStatusPage = e => {
    setPage(1)
    setFilterData({ ...filterData, status: e.target.value, isFilter: true })
  }
  // get all static content start

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
        keyword: helpers.normalizeSpaces(searchkey),
        sortKey: sort.sortBy,
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

  // get all static content end


  const handleResetAll = () => {
    setFilterData({
      status: '',
      startDate: '',
      searchKey: '',
      endDate: '',
      isReset: true,
      isFilter: false
    })
    setPage(1)
    setSearchTerm('')

  }

  // debounce search function start

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
  // debounce search function end


  useEffect(() => {
    updatePageName(t('NAV_STATIC_CONTENTS'))
  }, [])

  const andOperator = (condition, text) => {
    return condition && text
  }



  //  status change start


  const handelStatusChangeStatic = async details => {
    try {
      const payload = {
        status: details?.status === 'inactive' ? 'active' : 'inactive',
        type: 'staticContent'
      }
      const path = `${apiPath.changeStatus}/${details?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result?.data?.message)
        getStaticContent()
      }
    } catch (error) {
      console.error('error in get all users list==>>>>', error.message)
    }
  }
  return (
    <div className='bg-[#F9F9F9] dark:bg-slate-900'>
      <div className='px-3 py-4'>
        <div className='bg-white border border-[#E9EDF9]  dark:border-[#ffffff38] rounded-lg dark:bg-slate-800'>
          <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
            <div className='col-span-2 flex flex-wrap  items-center mb-2 2xl:mb-0'>
              <div className='flex items-center lg:pt-0 pt-3 flex-wrap '>
                <div className='relative flex items-center mb-3'>
                  <OSearchStatic searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_TITLE')} />
                </div>
                {helpers.andOperator((manager?.add || manager?.edit || user?.role === 'admin'), <div className='flex items-center mb-3 ml-3'>
                  <select
                    id='status'
                    type=' status'
                    name='status'
                    className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                    placeholder=' '
                    value={filterData?.status}
                    onChange={e => staticStatusPage(e)}
                  >
                    <option defaultValue value=''>
                      {t('O_ALL')}
                    </option>
                    <option value='active'>{t('O_ACTIVE')}</option>
                    <option value='inactive'>{t('O_INACTIVE')}</option>
                  </select>
                </div>)}

                <button
                  type='button'
                  onClick={handleResetAll}
                  title={t('O_RESET')}
                  className='bg-gradientTo text-sm px-5 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto'
                >
                   <BiReset size={18} />{t('O_RESET')}
                </button>
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
            handelStatusChange={handelStatusChangeStatic}
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
