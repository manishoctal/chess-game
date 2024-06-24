import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Table from './Table'
import AddEditFAQ from './EditFAQ'
import Pagination from '../Pagination'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeList from 'components/PageSizeList'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import helpers from 'utils/helpers'
function Faq() {
  const { t } = useTranslation()
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const { logoutUser, user } = useContext(AuthContext)
  const manager = user?.permission?.find(e => e.manager === 'FAQ') ?? {}
  const [editShowModal, setEditShowModal] = useState(false)
  const [editView, setEditView] = useState()
  const [FAQs, setFAQS] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [item, setItem] = useState('')
  const [isDelete,setIsDelete] = useState(false)
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortType: 'desc'
  })

  const [filterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
    status: '',
    isReset: false,
    isFilter: false,
  });

// get all faq function start
  const getAllFAQ = async (data) => {
    try {

      if ( data?.deletePage &&  FAQs?.length <= 1) {
        setPage(page - 1);
        setIsDelete(true);
      } else {
        setIsDelete(false);
      }
      const payload = {
        page,
        pageSize: pageSize,
        sortKey: sort.sortBy,
        sortType: sort.sortType,
        status: filterData?.status || null,
        startDate: helpers.getFormattedDate(filterData?.startDate),
        endDate: helpers.getFormattedDate(filterData?.endDate)
      }

  
      const path = apiPath.getFAQs
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        const resultStatus = result?.data?.success
        setFAQS(response?.docs)
        setPaginationObj({
          ...paginationObj,
          pageCount: resultStatus ? response?.totalPages : null,
          perPageItem: resultStatus ? response?.docs.length : null,
          totalItems: resultStatus ? response?.totalDocs : null
        })
      }
    } catch (error) {
      console.error('error in get all FAQs list==>>>>', error.message)
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }
// get all faq function end

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handelEdit = (items, type) => {
    setItem(items)
    setEditShowModal(true)
    setEditView(type)
  }
  useEffect(() => {
    getAllFAQ()
  }, [page, sort, pageSize, filterData])




  const handleDashboardDateChange = (start, end) => {
    setPage(1)
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
      isReset: false,
    });
  };


  const handleResetDashboard = () => {
    setPage(1)
    setFilterData({
      startDate: "",
      endDate: "",
      status: '',
      isReset: true,
      isFilter: false,
    });
  };
  const statusPage = (e) => {
    setFilterData({
      ...filterData,
      status: e.target.value,
      isFilter: true,
      isReset: false,
    });
    setPage(1);
  };

  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <div className=' border-b-[#E3E3E3] gap-2 px-4 py-4'>
              <div className='2xl:ml-auto xl:ml-0 lg:pt-0 pt-2'>
                <div className='flex mt-2 justify-between'>
                  <div className="flex flex-wrap items-center mt-3">
                    <div className="flex items-center lg:pt-0 pt-3 justify-center">
                      <ODateRangePicker handleDateChange={handleDashboardDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                      <div className="flex items-center mb-3 ml-3">
                        <select
                          id="countries"
                          type="password"
                          name="floating_password"
                          className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                          placeholder=" "
                          value={filterData?.status}
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
                        type="button"
                        onClick={() => handleResetDashboard()}
                        className="bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
                        title={t("O_RESET")}
                      >
                        {t("O_RESET")}
                      </button>
                    </div>
                  </div>

                  <div>
                    {(manager?.add || user?.role === 'admin') && (
                      <button
                        title={t('ADD_FAQS')}
                        className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                        onClick={() => {  setItem(''); setEditShowModal(true);setEditView('add')}}
                      >
                        + {t('ADD_FAQS')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Table
              FAQs={FAQs}
              getAllFAQ={getAllFAQ}
              handelEdit={handelEdit}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              paginationObj={paginationObj}
              pageSize={pageSize}
            />

            <div className='flex justify-between'>
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationObj?.totalItems !== 0 && (
                <Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  page={page}
                  isDelete={isDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {editShowModal && (
        <AddEditFAQ
          setEditShowModal={setEditShowModal}
          getAllFAQ={getAllFAQ}
          item={item}
          viewType={editView}
        />
      )}

    </div>
  )
}

export default Faq
