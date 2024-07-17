import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import PlayerCardTable from './PlayerCardTable'
import PaginationCard from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePickerCard from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeListCard from 'components/PageSizeList'
import OSearchCard from 'components/reusable/OSearch'
import { BiReset } from 'react-icons/bi'
import helpers from 'utils/helpers'
import OReactSelect from 'components/reusable/OReactSelect'
import EditLimitModal from './EditLimitModal'

function PlayerCardManager() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const manager = user?.permission?.find(e => e.manager === 'player_card_manager') ?? {}
    const [editShowLimitModal, setEditShowLimitModal] = useState(false)

    const [playerCard, setPlayerCard] = useState({'docs':[
        {
          "_id": "66863648efe47221462a5896",
          "email": "abc@gmail.com",
          "userName": 'abhi',
          "": 233,
          "availableCard": 12,
          "formatType": 'T20I',
          "playerName": "virat kohli",
          "status": "saled",
          "createdAt": "2024-07-04T05:42:32.049Z",
          "gender": 'male',
          "playerPrice": 110,
          "playerImage":'dfdf',
          "playerRole":'batsman',
          "totalCards":1020,
          "ranking":1,
          "playersTeam":'RCB',
          "__v": 0
        },
        
      ]
      })
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


    

    // get all offer list start
    const getAllPlayerCard = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData

            const payloadCard = {
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
            const result = await apiGet(path, payloadCard)
            const response = result?.data?.results
            const resultStatus = result?.data?.success
            setPlayerCard(response)
            setPaginationCardObj({
                ...paginationCardObj,
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

    const handlePageClick = event => {
        const newPage = event.selected + 1
        setPage(newPage)
    }

    const dynamicPage = e => {
        setPage(1)
        setPageSize(e.target.value)
    }

    const handleCardReset = () => {
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
        updatePageName(t('PLAYER_CARD_MANAGER'))
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

    const [formatData, setFormatData] = useState([])
    // get format list start
    const handleFormatOption = async (event) => {
        try {
            const payload = {
                keyword: event
            };
            const path = apiPath.getFormatList;
            const result = await apiGet(path, payload);
            if (result?.data?.success) {
                const formattedOption = [{ label: result?.data?.results?.odi?.toUpperCase(), value: result?.data?.results?.odi }, { label: result?.data?.results?.t20?.toUpperCase(), value: result?.data?.results?.t20 }, { label: result?.data?.results?.test?.toUpperCase(), value: result?.data?.results?.test }]
                setFormatData(formattedOption)
            }

        } catch (error) {
            console.error("error ", error);
        }
    };

    useEffect(() => {
        handleFormatOption()
    }, [])

    // add edit modal start
    const [cardLimitEdit, setCardLimitEdit] = useState()
    const editCardLimit = async (data) => {
        setCardLimitEdit(data)
        setEditShowLimitModal(true)
    }

    // add edit modal end

    return (
        <div>
            <div className='bg-[#F9F9F9] dark:bg-slate-900'>
                <div className='px-3 py-4'>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearchCard searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_PLAYER_NAME_PLAYER_ROLE')} />
                                    </div>

                                    <ODateRangePickerCard
                                        handleDateChange={handleDateChangeCard}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData}
                                        filterData={filterData}
                                    />

                                    <OReactSelect name='formatType' onChange={(e) => { setFilterData({ ...filterData, formatType: e }) }} options={formatData}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("FORMAT_TYPE")}
                                            </span>
                                        } value={filterData?.formatType} style={customStyles} />



                                    <OReactSelect name='playerRanking' onChange={(e) => { setFilterData({ ...filterData, playerRanking: e }) }} options={formatData}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("PLAYER_RANKING")}
                                            </span>
                                        } value={filterData?.playerRanking} style={customStyles} />

                                    <OReactSelect name='playerTeam' onChange={(e) => { setFilterData({ ...filterData, playerTeam: e }) }} options={formatData}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("PLAYER_TEAM")}
                                            </span>
                                        } value={filterData?.playerTeam} style={customStyles} />

                                    <button
                                        type='button'
                                        onClick={handleCardReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        <BiReset size={18} /> {t('O_RESET')}
                                    </button>
                                </div>
                            </div>


                        </form>

                        <PlayerCardTable
                            playerCard={playerCard?.docs}
                            getAllPlayerCard={getAllPlayerCard}
                            editCardLimit={editCardLimit}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                        />

                        <div className='flex justify-between'>
                            <PageSizeListCard dynamicPage={dynamicPage} pageSize={pageSize} />
                            {paginationCardObj?.totalItems ? (
                                <PaginationCard
                                    handlePageClick={handlePageClick}
                                    options={paginationCardObj}
                                    isDelete={isDelete}
                                    page={page}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {editShowLimitModal && (
                <EditLimitModal
                    setEditShowLimitModal={setEditShowLimitModal}
                    cardLimitEdit={cardLimitEdit}
                    getAllPlayerCard={getAllPlayerCard}
                />
            )}
        </div>
    )
}

export default PlayerCardManager
