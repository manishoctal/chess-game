import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import TradingQuestionTable from './TradingQuestionTable'
import TradingPagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import TradingPageSizeList from 'components/PageSizeList'
import Select from "react-select";
import OSearchTradingQuestion from 'components/reusable/OSearch'
import { BiReset } from 'react-icons/bi'
import helpers from 'utils/helpers'
  function TradingQuestionManager() {
  const { t } = useTranslation()
  const { user, updatePageName } = useContext(AuthContext)
  const [pageSize, setPageSize] = useState(10)
  const [isDelete] = useState(false)
  const manager = user?.permission?.find(e => e.manager === 'trading_question_manager') ?? {}
  const customStyles = {
    option: (provided) => ({
      ...provided,
      fontSize: '13px',
      zIndex: 999
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
    }),
    container: (provided) => ({
      ...provided,
      width: 200,
    }),
    control: (provided) => ({
      ...provided,
      height: 40,
      minHeight: 40,
    }),

  };

  const [tradingData, setTradingData] = useState({})
  const [page, setPage] = useState(1)
  const [paginationTradingObj, setPaginationTradingObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formatSuggestion, setFormatSuggestion] = useState([])
  const [filterData, setFilterData] = useState({
    category: '',
    formatType: '',
    searchKey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [sort, setSort] = useState({
    sortBy: '',
    sortType: ''
  })


  const statusPageTrading = (e) => {
    setFilterData({
      ...filterData,
      category: e.target.value,
      isFilter: true,
      isReset: false,
    });
    setPage(1);
  };

  function toStartCase(str) {
    return str?.replace(/\w\S*/g, (txt) => {
      return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase();
    });
  }
  // get all trading question list start
  const allTradingQuestionList = async () => {
    try {
      const { category, startDate, endDate, searchKey,matchStatus } = filterData

      const questionPayload = {
        page,
        pageSize: pageSize,
        status: helpers.orOperator(category,null),
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword:helpers.orOperator(helpers.normalizeSpaces(searchKey),null),
        sortKey: helpers.orOperator(sort.sortBy,null),
        matchStatus,
        sortType: helpers.orOperator(sort.sortType,null),
        formatType: toStartCase(filterData?.formatType?.value) || null

      }

      const path = apiPath.getMatchList
      const result = await apiGet(path, questionPayload)
      const responseData = result?.data?.results
      const resultStatus = result?.data?.success
      if (resultStatus) {
        setTradingData(responseData)
        setPaginationTradingObj({
          ...paginationTradingObj,
          page: resultStatus ? responseData?.page : null,
          pageCount: resultStatus ? responseData?.totalPages : null,
          perPageItem: resultStatus ? responseData?.docs?.length : null,
          totalItems: resultStatus ? responseData?.totalDocs : null
        })
      }
    } catch (error) {
      console.error('error in get all trading question list==>>>>', error.message)
    }
  }

  useEffect(() => {
    // api call function
    allTradingQuestionList()
  }, [filterData, page, sort, pageSize])

  // get all trading question list end

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  const handleResetTrading = () => {
    setFilterData({
      category: '',
      matchStatus:'',
      formatType: '',
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

  const handleDateChangeTradingQuestion = (start, end) => {

    setPage(1)
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true
    })
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
    updatePageName(t('TRADING_QUESTION_MANAGER'))
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])

  // debounce search end



  // function for format dropdown start

  const handleSearchFormatOption = async (event) => {
    try {
      const payload = {
        keyword: event
      };
      const path = apiPath.getFormatList;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const formattedOption = [{ label: result?.data?.results?.odi?.toUpperCase(), value: result?.data?.results?.odi }, { label: result?.data?.results?.t20?.toUpperCase(), value: result?.data?.results?.t20 }, { label: result?.data?.results?.test?.toUpperCase(), value: result?.data?.results?.test }]
        setFormatSuggestion(formattedOption)
      }

    } catch (error) {
      console.error("error ", error);
    }
  };


  useEffect(() => {
    handleSearchFormatOption()
  }, []);

  // debounce function for dropdown search end

  return (
    <div>
    
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
              <div className='col-span-2 flex flex-wrap  items-center'>
                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                  <div className='relative flex items-center mb-3'>
                    <OSearchTradingQuestion searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_MATCH_ID_MATCH_NAME')} />
                  </div>
                  <ODateRangePicker
                    handleDateChange={handleDateChangeTradingQuestion}
                    isReset={filterData?.isReset}
                    setIsReset={setFilterData}
                    filterData={filterData}
                  />
                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="countries"
                      type="password"
                      name="floating_password"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      value={filterData?.category}
                      onChange={statusPageTrading}
                    >
                      <option defaultValue value="">
                        {t("O_ALL")}
                      </option>
                      <option value="active">{t("O_ACTIVE")}</option>
                      <option value="inactive">{t("O_INACTIVE")}</option>
                    </select>
                  </div>

                  <div className="flex items-center mb-3 ml-3">
                    <select
                      id="matchStatus"
                      type="matchStatus"
                      name="matchStatus"
                      className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                      placeholder=" "
                      value={filterData?.matchStatus}
                      onChange={(e)=>{setFilterData({...filterData,matchStatus:e?.target?.value});setPage(1)}}
                    >
                      <option defaultValue value="">
                        {t("MATCH_STATUS")}
                      </option>
                      <option value="cancelled">{t("CANCELLED")}</option>
                      <option value="completed">{t("FINISHED")}</option>
                      <option value="live">{t("LIVE")}</option>
                      <option value="upcoming">{t("NOT_STARTED")}</option>
                    </select>
                  </div>
                  <div className="flex items-center mb-3 ml-3">

                    <Select
                      className='border-1 rounded-lg border-[#DFDFDF]'
                      name="formatType"
                      placeholder={
                        <span className='text-[14px]'>
                          {t("SELECT_FORMAT_TYPE")}
                        </span>
                      }
                      options={formatSuggestion}
                      onChange={(e) => { setFilterData({ ...filterData, formatType: e }) }}
                      styles={customStyles}
                      value={filterData?.formatType}

                    />
                  </div>
                  <button
                    type='button'
                    onClick={handleResetTrading}
                    title={t('O_RESET')}
                    className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                     <BiReset size={18} />{t('O_RESET')}
                  </button>
                </div>
              </div>
            </form>

            <TradingQuestionTable
              tradingData={tradingData?.docs}
              allTradingQuestionList={allTradingQuestionList}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              pageSize={pageSize}
            />

            <div className='flex justify-between'>
              <TradingPageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationTradingObj?.totalItems ? (
                <TradingPagination
                  handlePageClick={handlePageClick}
                  options={paginationTradingObj}
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

export default TradingQuestionManager
