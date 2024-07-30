import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import SubTable from './OfferTable'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeList from 'components/PageSizeList'
import OSearch from 'components/reusable/OSearch'
import AddEditOffer from './AddEditOffer'
import { BiReset } from 'react-icons/bi'
import { IoIosAdd } from 'react-icons/io'
import helpers from 'utils/helpers'


function OfferManager() {
  const { t } = useTranslation()
  const { user, updatePageName } = useContext(AuthContext)
  const [editShowModal, setEditShowOfferModal] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const [editView, setEditView] = useState()
  const manager = user?.permission?.find(e => e.manager === 'offer_manager') ?? {}

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


  const statusPage = (e) => {
    setFilterData({
      ...filterData,
      category: e.target.value,
      isFilter: true,
      isReset: false,
    });
    setPage(1);
  };

  // get all offer list start
  const allOfferList = async () => {
    try {
      const { category, startDate, endDate, searchKey } = filterData

      const payload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: helpers.normalizeSpaces(searchKey) || null,
        sortBy: sort.sortBy,
        sortType: sort.sortType
      }

      const path = apiPath.getAllOffer
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
    // api call function
    allOfferList()
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

  const handleOfferReset = () => {
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
    updatePageName(t('OFFER_MANAGER'))
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



  // add edit modal start
  const [item, setItem] = useState()
  const editViewBanner = async (type, data) => {
    setEditView(type)
    setItem(data)
    setEditShowOfferModal(true)
  }

  // add edit modal end

  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
              <div className='col-span-2 flex-wrap items-center'>
                <div className='flex items-center lg:pt-0 pt-3  justify-center mb-2 2xl:mb-0'>
                  <div className='relative flex items-center mb-3'>
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_OFFER_ID_OFFER_CODE')} />
                  </div>

                  <ODateRangePicker
                    handleDateChange={handleDateChange}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                  />

                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="countries"
                      type="password"
                      name="floating_password"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      value={filterData?.category}
                      onChange={statusPage}
                    >
                      <option defaultValue value="">
                        {t("O_ALL")}
                      </option>
                      <option value="active">{t("O_ACTIVE")}</option>
                      <option value="inactive">{t("O_INACTIVE")}</option>
                    </select>
                  </div>

                 
                  <button
                    type='button'
                    onClick={handleOfferReset}
                    title={t('O_RESET')}
                    className='bg-gradientTo text-sm px-6 mx-2 flex mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue'
                  >
                    <BiReset size={18} /> {t('O_RESET')}
                  </button>
                </div>
              </div>

              <div className='flex justify-end'>
                {(manager?.add || user?.role === "admin") && (<button
                  type='button'
                  title={t('ADD_OFFER')}
                  onClick={() => { setEditShowOfferModal(true); setEditView('add') }}
                  className='bg-gradientTo text-sm px-4 flex gap-2 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue'
                >
                  <IoIosAdd size={20} /> {t('ADD_OFFER')}
                </button>)}
              </div>
            </form>

            <SubTable
              subAdmin={subAdmin?.docs}
              allOfferList={allOfferList}
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
        <AddEditOffer
          setEditShowOfferModal={setEditShowOfferModal}
          getAllOfferData={allOfferList}
          offerDetails={item}
          viewType={editView}
        />
      )}
    </div>
  )
}

export default OfferManager
