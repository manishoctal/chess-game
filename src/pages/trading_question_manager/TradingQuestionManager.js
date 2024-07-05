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


  const [tradingData, setTradingData] = useState({
    "docs": [
      {
        "_id": "668392ad2eb7b8e01a396484",
        "matchId": "wwwe",
        "matchName": "Ind vs Aus",
        "formatType": "T20I",
        "matchStatus": "live",
        "startDate": "2024-07-02T05:39:57.233Z",
        "endDate": "2024-07-02T05:40:06.056Z",
        "questionsCount": 12,
        "status": "active",
        "__v": 0
      },

    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  })
  const [page, setPage] = useState(1)
  const [paginationTradingObj, setPaginationTradingObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [debouncedSearchTerm1, setDebouncedSearchTerm1] = useState('')
  const [isInitialized1, setIsInitialized1] = useState(false)
  const [searchTerm1, setSearchTerm1] = useState('')
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
    sortBy: 'createdAt',
    sortType: 'desc'
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

  // get all trading question list start
  const allTradingQuestionList = async () => {
    try {
      const { category, startDate, endDate, searchKey } = filterData

      const questionPayload = {
        page,
        pageSize: pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        keyword: searchKey,
        sortBy: sort.sortBy,
        sortType: sort.sortType
      }

      const path = apiPath.getAllOffer
      const result = await apiGet(path, questionPayload)
      const responseData = result?.data?.results
      const resultStatus = result?.data?.success
      setTradingData(responseData)
      setPaginationTradingObj({
        ...paginationTradingObj,
        page: resultStatus ? responseData.page : null,
        pageCount: resultStatus ? responseData.totalPages : null,
        perPageItem: resultStatus ? responseData?.docs.length : null,
        totalItems: resultStatus ? responseData.totalDocs : null
      })
    } catch (error) {
      console.error('error in get all sub admin list==>>>>', error.message)
    }
  }

  useEffect(() => {
    // api call function
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



  // debounce function for dropdown search start

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm1(searchTerm1?.trim());
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm1]);

  const handleSearchFormatOption = async (event) => {
    try {
      const payload = {
        keyword: event
      };
      const path = apiPath.searchUsers;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const formattedOption = result?.data?.results?.map((res) => { return ({ label: `${res?.name + ',' + '(' + res?.email + ')'}`, value: res?._id }) })
        setFormatSuggestion(formattedOption)

      }

    } catch (error) {
      console.error("error ", error);
    }
  };


  useEffect(() => {
    if (!isInitialized1) {
      setIsInitialized1(true);
    } else if (searchTerm1) {
      handleSearchFormatOption(debouncedSearchTerm1)
    }
  }, [debouncedSearchTerm1]);

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

                    <Select
                      className='border-1 rounded-lg border-[#DFDFDF]'
                      name="formatType"
                      inputValue={searchTerm1}
                      onInputChange={(value) => setSearchTerm1(value)}
                      placeholder={
                        <span className='text-[14px]'>
                          {t("SEARCH_FORMAT_TYPE")}
                        </span>
                      }
                      options={formatSuggestion}
                      defaultValue={t("SELECT_USERS")}
                      onChange={(e) => { setFilterData({ ...filterData, formatType: e }) }}
                      styles={customStyles}
                      value={filterData?.formatType}

                    />
                  </div>
                  <button
                    type='button'
                    onClick={handleResetTrading}
                    title={t('O_RESET')}
                    className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                  >
                    {t('O_RESET')}
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
