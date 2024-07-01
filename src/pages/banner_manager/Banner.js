import React, { useContext, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPut } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import SubTable from './BannerTable'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import useToastContext from 'hooks/useToastContext'
import PageSizeList from 'components/PageSizeList'
import OSearch from 'components/reusable/OSearch'
import BannerAdd from './BannerAdd'
import EditBanner from './BannerEdit'
import helpers from 'utils/helpers'


function Banner() {
  const { t } = useTranslation()
  const notification = useToastContext()
  const { user, updatePageName } = useContext(AuthContext)
  const [showModal, setAddShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete, setIsDelete] = useState(false)
  const [editShowModal, setEditShowModal] = useState(false)
  const [editView, setEditView] = useState()
  const manager =
    user?.permission?.find(e => e.manager === 'banner_manager') ?? {}
  const [bannerData, setAllBanner] = useState()

  const [bannerPaginationObj, setBannerbannerPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortType: 'desc'
  })
  const [filterData, setFilterData] = useState({
    category: '',
    searchKey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })

  // get all banner function start
  const getAllBanner = async (data) => {
    try {
      if (data?.deletePage && bannerData?.docs?.length <= 1) {
        setPage(page - 1);
        setIsDelete(true);
      } else {
        setIsDelete(false);
      }
      const { category, startDate, endDate, searchKey } = filterData
      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchKey,
        sortBy: sort.sortBy,
        sortType: sort.sortType
      }

      const path = apiPath.getBanner
      const result = await apiGet(path, payload)
      const response = result?.data?.results
      const resultStatus = result?.data?.success
      setAllBanner(response)
      setBannerbannerPaginationObj({
        ...bannerPaginationObj,
        page: resultStatus ? response.page : null,
        pageCount: resultStatus ? response.totalPages : null,
        perPageItem: resultStatus ? response?.docs.length : null,
        totalItems: resultStatus ? response.totalDocs : null
      })
    } catch (error) {
      console.error('error in get all sub admin list==>>>>', error.message)
    }
  }

  useEffect(() => {
    getAllBanner()
  }, [filterData, page, sort, pageSize])

  // get all banner function end

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }



  // banner status change function start

  const handelStatusChange = async details => {
    try {
      const payload = {
        status: details?.status === 'inactive' ? 'active' : 'inactive',
        type: 'banner'
      }
      const path = `${apiPath.changeStatus}/${details?._id}`
      const result = await apiPut(path, payload)
      if (result?.status === 200) {
        notification.success(result?.data?.message)
        getAllBanner({ statusChange: 1 })
      }
    } catch (error) {
      console.error('error in get all users list==>>>>', error.message)
    }
  }


  // banner status change function end

  // banner delete change function start

  const handelDelete = async details => {
    try {
      const path = apiPath.bannerDelete + '/' + details?._id
      const result = await apiDelete(path)
      if (result?.status === 200) {
        notification.success(result?.data?.message)
        getAllBanner({ deletePage: 1 })
      }
    } catch (error) {
      console.error('error in get all FAQs list==>>>>', error.message)
    }
  }

  // banner delete change function end





  const statusPage = e => {
    setPage(1)
    setFilterData({ ...filterData, category: e.target.value, isFilter: true })
  }




  const [item, setItem] = useState()
  const editViewBanner = async (type, data) => {
    setEditView(type)
    setItem(data)
    setEditShowModal(true)
  }

  // debounce search start

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchKey: debouncedSearchTerm || '',
        isFilter: !!debouncedSearchTerm
      })
      setPage(1)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    updatePageName(t('BANNER_MANAGER'))
  }, [])

  const handleReset = () => {
    setFilterData({
      category: '',
      startDate: '',
      searchKey: '',
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
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  // debounce search end






  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <div className='relative flex items-center mb-3'>
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_BANNER_ID')} />
                  </div>

                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />
                  {helpers.andOperator((manager?.add || manager?.edit || user?.role === 'admin'), <div className='flex items-center mb-3 ml-3'>
                    <select
                      id='countries'
                      type=' password'
                      name='floating_password'
                      className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                      placeholder=' '
                      value={filterData?.category}
                      onChange={e => statusPage(e)}
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
                    onClick={handleReset}
                    title={t('O_RESET')}
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    {t('O_RESET')}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-end px-4 ms-auto mb-3'>
                {(manager?.add || user?.role === 'admin') && (
                  <button
                    title={t('ADD_BANNER')}
                    type='button'
                    className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                    onClick={() => setAddShowModal(true)}
                  >
                    + {t('ADD_BANNER')}
                  </button>
                )}
              </div>
            </form>
            <SubTable
              allBanner={bannerData?.docs}
              allbannerData={getAllBanner}
              handelDelete={handelDelete}
              editViewBanner={editViewBanner}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              handelStatusChange={handelStatusChange}
              pageSize={pageSize}
            />

            <div className='flex justify-between'>
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {bannerPaginationObj?.totalItems ? (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={bannerPaginationObj}
                  isDelete={isDelete}
                  page={page}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>


      {showModal && (
        <BannerAdd setAddShowModal={setAddShowModal} getAllFAQ={getAllBanner} />
      )}
      {editShowModal && (
        <EditBanner
          setEditShowModal={setEditShowModal}
          getAllFAQ={getAllBanner}
          item={item}
          viewType={editView}
        />
      )}
    </div>
  )
}

export default Banner
