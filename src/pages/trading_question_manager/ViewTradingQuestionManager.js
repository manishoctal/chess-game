import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import ViewTradingQuestionTable from './ViewTradingQuestionTable'
import PaginationViewTrading from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePickerViewTrading from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeListViewTrading from 'components/PageSizeList'
import OSearchViewTradingQuestion from 'components/reusable/OSearch'
import AddQuestion from './AddQuestion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import helpers from 'utils/helpers'
import { isEmpty, startCase } from 'lodash'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BiReset } from 'react-icons/bi'
import { IoIosAdd } from 'react-icons/io'

function ViewTradingQuestionManager() {
    const { t } = useTranslation()
    const router = useNavigate()
    const { state } = useLocation()
    const { user, updatePageName } = useContext(AuthContext)
    const [editShowModal, setEditShowModal] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const [sort, setSort] = useState({
        sortBy: 'createdAt',
        sortType: 'desc'
    })

    useEffect(() => {
        if (isEmpty(state)) {
            router('/trading-question-manager')
        }
    }, [state])
    const manager = user?.permission?.find(e => e.manager === 'trading_question_manager') ?? {}
    const [viewTradingData, setViewTradingData] = useState()
    const [page, setPage] = useState(1)
    const [filterData, setFilterData] = useState({
        status: '',
        searchKey: '',
        startDate: '',
        endDate: '',
        isReset: false,
        isFilter: false
    })
    const [viewTradingPaginationObj, setPaginationViewTradingObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10
    })
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // get all view trading question start
    const ViewallTradingQuestionsList = async () => {
        try {
            const { status, startDate, endDate, searchKey } = filterData

            const payloadTrading = {
                matchId: state?.matchId,
                page,
                pageSize: pageSize,
                status: status,
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
                keyword: helpers.normalizeSpaces(searchKey),
                sortBy: sort.sortBy,
                sortType: sort.sortType
            }

            const path = apiPath.tradingQuestionList
            const result = await apiGet(path, payloadTrading)
            const responseTrading = result?.data?.results
            const resultStatus = result?.data?.success
            if (resultStatus) {
                setViewTradingData(responseTrading)
                setPaginationViewTradingObj({
                    ...viewTradingPaginationObj,
                    page: resultStatus ? responseTrading.page : null,
                    pageCount: resultStatus ? responseTrading.totalPages : null,
                    perPageItem: resultStatus ? responseTrading?.docs.length : null,
                    totalItems: resultStatus ? responseTrading.totalDocs : null
                })
            }
        } catch (error) {
            console.error('error in get all sub admin list==>>>>', error.message)
        }
    }

    const dynamicPage = e => {
        setPage(1)
        setPageSize(e.target.value)
    }

    const handleReset = () => {
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
        setPageSize(10)
    }

    useEffect(() => {
        // api call function
        ViewallTradingQuestionsList()
    }, [filterData, page, sort, pageSize])

    // get view trading question list end

    const handlePageClickTrading = event => {
        const newPage = event.selected + 1
        setPage(newPage)
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
        updatePageName(t('VIEW_TRADING_QUESTION_MANAGER'))
    }, [])


    const handleDateChangeViewTrading = (start, end) => {
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




    const AddTradingQuestion = async () => {
        setEditShowModal(true)
    }
    const statusPageViewTrading = (e) => {
        setFilterData({
            ...filterData,
            status: e.target.value,
            isFilter: true,
            isReset: false,
        });
        setPage(1);
    };

    const getTableHeaderViewTrading = (name) => {
        return <th className='text-center py-3 px-6'>{t(name)}</th>
    }

    const getTableDataViewTrading = (details, inputClass) => {
        return <td className={`py-2 px-4 border-r border dark:border-[#ffffff38] text-center font-semibold ${inputClass || ''}`}>
            {details || 'N/A'}
        </td>
    }


    return (
        <div>
            <div className='dark:bg-slate-900 bg-[#F9F9F9]'>
                <div className='px-3 py-4'>
                    <div className='flex active mb-5 ml-4 '>
                        <Link aria-current="page" className="" to={-1}>
                            <FaCircleArrowLeft size={27} />
                        </Link>
                    </div>
                    <div className='m-5'>
                        <table className="text-left text-[#A5A5A5] w-full text-xs dark:text-gray-400 ">
                            <thead className="bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 text-xs text-gray-900 border border-[#E1E6EE]  dark:border-[#ffffff38]">
                                <tr>
                                    {getTableHeaderViewTrading('MATCH_NAME')}
                                    {getTableHeaderViewTrading('FORMAT_TYPE')}
                                    {getTableHeaderViewTrading('START_DATE')}
                                    {getTableHeaderViewTrading('QUESTIONS')}
                                    {getTableHeaderViewTrading('STATUS_OF_MATCH')}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    {getTableDataViewTrading(startCase(state?.matchName) || 'N/A')}
                                    {getTableDataViewTrading(startCase(state?.formatType) || 'N/A')}
                                    {getTableDataViewTrading(helpers?.getDateAndTime(state?.startDate))}
                                    {getTableDataViewTrading(state?.questionsCount || '0')}
                                    {getTableDataViewTrading(startCase(state?.matchStatus), helpers.getMatchStatus(state?.matchStatus))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearchViewTradingQuestion searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_QUESTION')} />
                                    </div>
                                    <ODateRangePickerViewTrading
                                        handleDateChange={handleDateChangeViewTrading}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData} />

                                    <div className="flex items-center mb-3 ml-3">
                                        <select
                                            id="status"
                                            type="status"
                                            name="status"
                                            className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                                            placeholder=" "
                                            value={filterData?.status}
                                            onChange={statusPageViewTrading}
                                        >
                                            <option defaultValue value="">{t("O_ALL")}</option>
                                            <option value="active">{t("O_ACTIVE")}</option>
                                            <option value="inactive">{t("O_INACTIVE")}</option>
                                        </select>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={handleReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        <BiReset size={18} /> {t('O_RESET')}
                                    </button>
                                </div>
                            </div>
                            <div>
                                {(manager?.add || manager?.edit || user?.role === "admin") && (<button
                                    type='button'
                                    title={t('ADD_QUESTIONS')}
                                    onClick={AddTradingQuestion}
                                    className='bg-gradientTo text-sm px-4 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                >
                                    <IoIosAdd color='white' size={20} />{t('ADD_QUESTIONS')}
                                </button>)}
                            </div>
                        </form>
                        <ViewTradingQuestionTable
                            viewTradingData={viewTradingData?.docs}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                            ViewallTradingQuestionsList={ViewallTradingQuestionsList}
                        />
                        <div className='flex justify-between'>
                            <PageSizeListViewTrading dynamicPage={dynamicPage} pageSize={pageSize} />
                            {viewTradingPaginationObj?.totalItems ? (
                                <PaginationViewTrading
                                    handlePageClick={handlePageClickTrading}
                                    options={viewTradingPaginationObj}
                                    isDelete={isDelete}
                                    page={page} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {editShowModal && (
                <AddQuestion
                    setEditShowTradingModal={setEditShowModal}
                    ViewallTradingQuestionsList={ViewallTradingQuestionsList}
                    stateData={state}
                />
            )}
        </div>
    )
}

export default ViewTradingQuestionManager
