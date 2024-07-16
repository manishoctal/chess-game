import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import ViewPlayerStockTable from './ViewStockManagerTable'
import PaginationCard from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePickerViewStock from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeListViewStock from 'components/PageSizeList'
import OSearchStock from 'components/reusable/OSearch'
import { BiReset } from 'react-icons/bi'
import helpers from 'utils/helpers'
import OReactSelectViewStock from 'components/reusable/OReactSelect'
import { FaFileDownload } from 'react-icons/fa'

function ViewScoreManager() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const manager = user?.permission?.find(e => e.manager === 'player_stock_manager') ?? {}
    const [playerStock, setPlayerStock] = useState({
        'docs': [
            {
                "_id": "66863648efe47221462a5896",
                "orderId": 45,
                "email": 'abc@yopmail.com',
                "playerStockPrice": 120,
                "currentPlayerStockPrice": 130,
                "shareCount": 30,
                "totalAmount": 400,
                "totalProfitLoss": 100,
                "playerName": "virat kohli",
                "userName": 'vk01',
                "status": "active",
                "createdAt": "2024-07-04T05:42:32.049Z",
                "orderType": "sell",
                "__v": 0
            },
        ]
    })
    const [page, setPage] = useState(1)

    const [paginationStockObj, setPaginationStockObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10
    })
    const [debouncedSearchTermViewStock, setdebouncedSearchTermViewStock] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterData, setFilterData] = useState({
        category: '',
        orderType: '',
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


    // get all offer list start
    const viewAllplayerStock = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData

            const payloadViewStock = {
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
            const result = await apiGet(path, payloadViewStock)
            const response = result?.data?.results
            const resultStatus = result?.data?.success
            setPlayerStock(response)
            setPaginationStockObj({
                ...paginationStockObj,
                page: resultStatus ? response.page : null,
                pageCount: resultStatus ? response.totalPages : null,
                perPageItem: resultStatus ? response?.docs.length : null,
                totalItems: resultStatus ? response.totalDocs : null
            })
        } catch (error) {
            console.error('error in get all sub admin list==>>>>', error.message)
        }
    }



    const handlePageClickViewStock = event => {
        const newPage = event.selected + 1
        setPage(newPage)
    }


    useEffect(() => {
        // api call function
    }, [filterData, page, sort, pageSize])

    // get all wallet list end

    const dynamicPageStock = e => {
        setPage(1)
        setPageSize(e.target.value)
    }

    const handleViewStockReset = () => {
        setFilterData({
            category: '',
            orderType: '',
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


    const handleDateChangeViewStock = (start, end) => {
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
                searchKey: debouncedSearchTermViewStock || '',
                isFilter: !!debouncedSearchTermViewStock
            })
            setPage(1)
        }
    }, [debouncedSearchTermViewStock])

    useEffect(() => {
        updatePageName(t('VIEW_PLAYER_STOCK_MANAGER'))
    }, [])


    // debounce search end

    const customStylesViewStock = {
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
            width: 170,
        }),
        control: (provided) => ({
            ...provided,
            height: 40,
            minHeight: 40,
        }),

    };


    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setdebouncedSearchTermViewStock(searchTerm)
        }, 500)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [searchTerm])


    const [orderType] = useState([])


    // Download csv function start 

    const onDownLoadStatement = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData
            const payloadStock = {
                page,
                pageSize: pageSize,
                status: category,
                startDate: startDate ? helpers.getFormattedDate(startDate) : null,
                endDate: endDate ? helpers.getFormattedDate(endDate) : null,
                keyword: searchKey,
                sortBy: sort.sortBy,
                sortType: sort.sortType
            }
            const path = apiPath.downloadCsv
            const result = await apiGet(path, payloadStock)
            if (result?.data?.success) {
                helpers.downloadFile(result?.data?.results?.file_path)
            }
        } catch (error) {
            console.error('error in  export  csv list==>>>>', error.message)
        }

    }

    // Download csv function end 


    return (
        <div>
            <div className='bg-[#F9F9F9] dark:bg-slate-900'>
                <div className='px-3 py-4'>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearchStock searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_ORDER_ID_USER_NAME_EMAIL')} />
                                    </div>
                                    <ODateRangePickerViewStock
                                        handleDateChange={handleDateChangeViewStock}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData}
                                        filterData={filterData}
                                    />

                                    <OReactSelectViewStock name='orderType' onChange={(e) => { setFilterData({ ...filterData, orderType: e }) }} options={orderType}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("ORDER_TYPE")}
                                            </span>
                                        } value={filterData?.orderType} style={customStylesViewStock} />

                                    <button
                                        type='button'
                                        onClick={handleViewStockReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        <BiReset size={18} /> {t('O_RESET')}
                                    </button>
                                </div>
                            </div>
                            <button
                                type='button'
                                title={t('DOWNLOAD_STATEMENT')}
                                className='bg-gradientTo text-sm flex gap-2 px-5 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto '
                                onClick={onDownLoadStatement}
                            >
                                <FaFileDownload size={17} />
                                {t('DOWNLOAD_STATEMENT')}
                            </button>
                        </form>

                        <ViewPlayerStockTable
                            playerStock={playerStock?.docs}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                            viewAllplayerStock={viewAllplayerStock}

                        />

                        <div className='flex justify-between'>
                            <PageSizeListViewStock dynamicPage={dynamicPageStock} pageSize={pageSize} />
                            {paginationStockObj?.totalItems ? (
                                <PaginationCard
                                    handlePageClick={handlePageClickViewStock}
                                    options={paginationStockObj}
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

export default ViewScoreManager
