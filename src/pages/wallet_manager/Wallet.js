import React, { useContext, useEffect, useState } from 'react'
import { apiGet} from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import SubTable from './WalletTable'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeList from 'components/PageSizeList'
import OSearch from 'components/reusable/OSearch'
import BalanceEdit from './BalanceEdit'


function Wallet() {
  const { t } = useTranslation()
  const { user, updatePageName } = useContext(AuthContext)
  const [editShowModal, setEditShowModal] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const [editView, setEditView] = useState()
  const manager =
    user?.permission?.find(e => e.manager === 'wallet_manager') ?? {}
  const [subAdmin, setSubAdmin] = useState()
  const [page, setPage] = useState(1)
 
  const [paginationObj, setPaginationWalletObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [filterData, setFilterData] = useState({
    category: '',
    searchKey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortType: 'desc'
  })


  // get all wallet list start
  const allWalletList = async () => {
    try {
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
      setSubAdmin(response)
      setPaginationWalletObj({
        ...paginationObj,
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
    allWalletList()
  }, [filterData, page, sort, pageSize])

  // get all wallet list end

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

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
    updatePageName(t('WALLET_MANAGER'))
  }, [])
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
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

    // debounce search end
    



  const [item, setItem] = useState()
  const editViewBanner = async (type, data) => {
    setEditView(type)
    setItem(data)
    setEditShowModal(true)
  }



  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <div className='relative flex items-center mb-3'>
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_FULL_NAME_USER_IS_MOBILE_NO')} />
                  </div>

                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />


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


            </form>
            <SubTable
              subAdmin={subAdmin?.docs}
              allSubAdmin={allWalletList}
              editViewBanner={editViewBanner}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
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
      {editShowModal && (
        <BalanceEdit
          setEditShowModal={setEditShowModal}
          getAllFAQ={allWalletList}
          item={item}
          viewType={editView}
        />
      )}
    </div>
  )
}

export default Wallet
