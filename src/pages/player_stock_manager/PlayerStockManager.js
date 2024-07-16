import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import PlayerStockTable from './PlayerStockManagerTable'
import PaginationCard from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePickerStock from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeListStock from 'components/PageSizeList'
import OSearchStock from 'components/reusable/OSearch'
import { BiReset } from 'react-icons/bi'
import helpers from 'utils/helpers'
import OReactSelect from 'components/reusable/OReactSelect'

function PlayerStockManager() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const manager = user?.permission?.find(e => e.manager === 'player_stock_manager') ?? {}

    const [playerStock, setPlayerStock] = useState({
        'docs': [
            {
                "_id": "66863648efe47221462a5896",
                "playerId":45,
                "playerImage": 'df',
                "playerStockPrice": 120,
                "formatType": 'T20I',
                "playerName": "virat kohli",
                "status": "active",
                "createdAt": "2024-07-04T05:42:32.049Z",
                "stockAvailable": 110,
                "playerRole": 'batsman',
                "playersTeam": 'India',
                "playerScore":[{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200},{match:'aa',score:200}],
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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterData, setFilterData] = useState({
        category: '',
        playerRole: '',
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
    const getAllplayerStock = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData

            const payloadStock = {
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
            const result = await apiGet(path, payloadStock)
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

    useEffect(() => {
        // api call function
    }, [filterData, page, sort, pageSize])

    // get all wallet list end

    const handlePageClickStock = event => {
        const newPage = event.selected + 1
        setPage(newPage)
    }

    const dynamicPageStock = e => {
        setPage(1)
        setPageSize(e.target.value)
    }

    const handleStockReset = () => {
        setFilterData({
            category: '',
            playerRole: '',
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


    const handleDateChangeStock = (start, end) => {
        setPage(1)
        setFilterData({
            ...filterData,
            startDate: start,
            endDate: end,
            isFilter: true
        })
    }


    useEffect(() => {
        updatePageName(t('PLAYER_STOCK_MANAGER'))
    }, [])

    // debounce search start


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

    const statusPageStock = e => {
        setPage(1)
        setFilterData({ ...filterData, category: e.target.value, isFilter: true })
      }

    const [playerRole] = useState([])



    return (
        <div>
            <div className='bg-[#F9F9F9] dark:bg-slate-900'>
                <div className='px-3 py-4'>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearchStock searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_PLAYER_NAME_ID_PLAYER_TEAM')} />
                                    </div>
                                    <ODateRangePickerStock
                                        handleDateChange={handleDateChangeStock}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData}
                                        filterData={filterData}
                                    />
                                    <div className='flex items-center mb-3 ml-3'>
                                        <select
                                            id='status'
                                            type=' status'
                                            name='status'
                                            className='block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
                                            placeholder=' '
                                            value={filterData?.category}
                                            onChange={e => statusPageStock(e)}
                                        >
                                            <option defaultValue value=''>
                                                {t('O_ALL')}
                                            </option>
                                            <option value='active'>{t('O_ACTIVE')}</option>
                                            <option value='inactive'>{t('O_INACTIVE')}</option>
                                        </select>
                                    </div>
                                    <OReactSelect name='playerRole' onChange={(e) => { setFilterData({ ...filterData, playerRole: e }) }} options={playerRole}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("PLAYER_ROLE")}
                                            </span>
                                        } value={filterData?.playerRole} style={customStyles} />

                                    <button
                                        type='button'
                                        onClick={handleStockReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        <BiReset size={18} /> {t('O_RESET')}
                                    </button>
                                </div>
                            </div>


                        </form>

                        <PlayerStockTable
                            playerStock={playerStock?.docs}
                            getAllplayerStock={getAllplayerStock}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                        />

                        <div className='flex justify-between'>
                            <PageSizeListStock dynamicPage={dynamicPageStock} pageSize={pageSize} />
                            {paginationStockObj?.totalItems ? (
                                <PaginationCard
                                    handlePageClick={handlePageClickStock}
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

export default PlayerStockManager
