import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import ViewPlayerCardTable from './ViewPlayerCardTable'
import PaginationCard from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePickerView from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeViewCard from 'components/PageSizeList'
import OSearchViewCard from 'components/reusable/OSearch'
import { BiReset, BiSolidFileExport } from 'react-icons/bi'
import helpers from 'utils/helpers'
import OReactSelect from 'components/reusable/OReactSelect'
import OBack from 'components/reusable/OBack'

function ViewPlayerCard() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const manager = user?.permission?.find(e => e.manager === 'player_card_manager') ?? {}

    const [viewPlayerCard, setViewPlayerCard] = useState({
       "docs": [
        {
          "_id": "66863648efe47221462a5896",
          "email": "abc@gmail.com",
          "userName": 'abhi',
          "orderId": 233,
          "userId": 12,
          "orderType": 'buy',
          "playerCardDetails": "virat kohli",
          "status": "saled",
          "createdAt": "2024-07-04T05:42:32.049Z",
          "currentPrice": 100,
          "profitLoss": 110,
          "transactionFee":20,
          "boughtPrice":80,
          "totalAmount":120,
          "quantity":30,
          "__v": 0
        },
        
      ]})
    const [page, setPage] = useState(1)

    const [paginationCardObj, setPaginationCardObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10
    })
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
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
    const viewAllPlayerCard = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData

            const payloadViewCard = {
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
            const result = await apiGet(path, payloadViewCard)
            const response = result?.data?.results
            const resultStatus = result?.data?.success
            setViewPlayerCard(response)
            setPaginationCardObj({
                ...paginationCardObj,
                page: resultStatus ? response.page : null,
                pageCount: resultStatus ? response.totalPages : null,
                perPageItem: resultStatus ? response?.docs.length : null,
                totalItems: resultStatus ? response.totalDocs : null
            })
        } catch (error) {
            console.error('error in get view player list==>>>>', error.message)
        }
    }

    useEffect(() => {
        // api call function
    }, [filterData, page, sort, pageSize])

    // get all wallet list end

    const handlePageClickView = event => {
        const newPage = event.selected + 1
        setPage(newPage)
    }

    const dynamicPage = e => {
        setPage(1)
        setPageSize(e.target.value)
    }

    const handleViewCardReset = () => {
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
        updatePageName(t('VIEW_PLAYER_CARD_MANAGER'))
    }, [])

    const handleDateChangeCard = (start, end) => {

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
            width: 170,
        }),
        control: (provided) => ({
            ...provided,
            height: 40,
            minHeight: 40,
        }),

    };

    const [formatData] = useState([{ label: 'Purchase', value: 'purchase' }, { label: 'Sell', value: 'sell' }])




    // Download csv function start 

    const onCsvDownloadPlayer = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData
            const payloadPlayerCsv = {
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
            const result = await apiGet(path, payloadPlayerCsv)
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
                <OBack/>
                <div className='px-3 py-4'>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearchViewCard searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_USER_ID_USER_NAME')} />
                                    </div>

                                    <ODateRangePickerView
                                        handleDateChange={handleDateChangeCard}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData}
                                        filterData={filterData}
                                    />

                                    <OReactSelect name='orderType' onChange={(e) => { setFilterData({ ...filterData, orderType: e }) }} options={formatData}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("ORDER_TYPE")}
                                            </span>
                                        } value={filterData?.orderType} style={customStyles} />

                                    <button
                                        type='button'
                                        onClick={handleViewCardReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        <BiReset size={18} /> {t('O_RESET')}
                                    </button>
                                </div>
                            </div>
                            <button
                                type='button'
                                title={t('EXPORT_CSV')}
                                className='bg-gradientTo text-sm flex gap-2 px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto '
                                onClick={onCsvDownloadPlayer}
                            >
                                <BiSolidFileExport size={18} />
                                {t('EXPORT_CSV')}
                            </button>

                        </form>

                        <ViewPlayerCardTable
                            playerCardView={viewPlayerCard?.docs}
                            viewAllPlayerCard={viewAllPlayerCard}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                        />

                        <div className='flex justify-between'>
                            <PageSizeViewCard dynamicPage={dynamicPage} pageSize={pageSize} />
                            {paginationCardObj?.totalItems ? (
                                <PaginationCard
                                    handlePageClick={handlePageClickView}
                                    options={paginationCardObj}
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

export default ViewPlayerCard
