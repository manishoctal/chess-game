import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import PlayerCardTable from './PlayerCardTable'
import PaginationCard from '../Pagination'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeListCard from 'components/PageSizeList'
import { BiReset } from 'react-icons/bi'
import helpers from 'utils/helpers'
import OReactSelect from 'components/reusable/OReactSelect'
import EditLimitModal from './EditLimitModal'
import { isEmpty } from 'lodash'

function PlayerCardManager() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const manager = user?.permission?.find(e => e.manager === 'player_card_manager') ?? {}
    const [editShowLimitModal, setEditShowLimitModal] = useState(false)

    const [playerCard, setPlayerCard] = useState([])
    const [page, setPage] = useState(1)

    const [paginationCardObj, setPaginationCardObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10
    })
    const [filterData, setFilterData] = useState({
        category: '',
        formatType: '',
        playerRole: '',
        playerRanking: '',
        playerTeam: '',
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


    const [activeIndex, setActiveIndex] = useState(null);
    const [activeData, setActiveData] = useState(null);

    // get all offer list start
    const getAllPlayerCard = async () => {
        try {
            const { category, searchKey, playerRanking, playerTeam, playerRole, formatType } = filterData

            const payloadCard = {
                page,
                pageSize: pageSize,
                status: category,
                keyword: helpers.normalizeSpaces(searchKey) || null,
                sortBy: sort.sortBy,
                sortType: sort.sortType,
                format: helpers.orOperator(formatType?.value, null),
                rank: helpers.orOperator(playerRanking?.value, null),
                team: helpers.orOperator(playerTeam?.value, null),
                playerRole: helpers.orOperator(playerRole?.value, null)
            }

            const path = apiPath.getPlayerCardList
            const result = await apiGet(path, payloadCard)
            const response = result?.data?.results
            const resultStatus = result?.data?.success
            if (resultStatus) {
                setActiveIndex(null)
                setActiveData(null)
                setPlayerCard(response?.docs)
                setPaginationCardObj({
                    ...paginationCardObj,
                    page: resultStatus ? response.page : null,
                    pageCount: resultStatus ? response.totalPages : null,
                    perPageItem: resultStatus ? response?.docs.length : null,
                    totalItems: resultStatus ? response.totalDocs : null
                })
            }
        } catch (error) {
            console.error('error in get all sub admin list==>>>>', error.message)
        }
    }

    useEffect(() => {
        // api call function
        getAllPlayerCard()

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
            playerRole: '',
            playerRanking: '',
            playerTeam: '',
            startDate: '',
            searchKey: '',
            endDate: '',
            isReset: true,
            isFilter: false
        })
        setPage(1)
        setPageSize(10)
    }

    useEffect(() => {
        updatePageName(t('PLAYER_CARD_MANAGER'))
    }, [])


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
            height: 20,
            minHeight: 38,
        }),

    };

    const [formatData, setFormatData] = useState({})
    // get format list start
    const handleFormatOption = async (event) => {
        try {

            const path = apiPath.getMasterData;
            const result = await apiGet(path);
            if (result?.data?.success) {
                const formattedOption = [{ label: result?.data?.results?.formatType?.odi?.toUpperCase(), value: result?.data?.results?.formatType?.odi }, { label: result?.data?.results?.formatType?.t20?.toUpperCase(), value: result?.data?.results?.formatType?.t20 }, { label: result?.data?.results?.formatType?.test?.toUpperCase(), value: result?.data?.results?.formatType?.test }]
                const playerRanking = result?.data?.results?.playerRanking?.map((res) => { return { label: res, value: res } })
                const teamData = result?.data?.results?.teamData?.map((res) => { return { label: res?.team, value: res?._id } })
                const playerRole = Object?.entries(result?.data?.results?.playerRoles)?.map(([value, label]) => ({ label: label, value: label }));
                setFormatData({ formatType: formattedOption, playerRanking, teamData, playerRole })
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
    const handleAccordionClick = (index, item) => {
        setActiveIndex(activeIndex === index ? null : index);
        setActiveData(item)
    };

    return (
        <div>
            <div className='bg-[#F9F9F9] dark:bg-slate-900'>
                <div className='px-3 py-4'>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0 mt-3'>

                                    <OReactSelect name='playerRole' onChange={(e) => {setPage(1); setFilterData({ ...filterData, playerRole: e }) }} options={formatData?.playerRole}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("PLAYER_ROLE")}
                                            </span>
                                        } value={filterData?.playerRole} style={customStyles} />



                                    <OReactSelect name='formatType' onChange={(e) => {setPage(1); setFilterData({ ...filterData, formatType: e }) }} options={formatData?.formatType}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("FORMAT_TYPE")}
                                            </span>
                                        } value={filterData?.formatType} style={customStyles} />



                                    <OReactSelect name='playerRanking' onChange={(e) => {setPage(1); setFilterData({ ...filterData, playerRanking: e }) }} options={formatData?.playerRanking}
                                        placeholder={
                                            <span className='text-[14px]'>
                                                {t("PLAYER_RANKING")}
                                            </span>
                                        } value={filterData?.playerRanking} style={customStyles} disable={isEmpty(filterData?.formatType)} />

                                    <OReactSelect name='playerTeam' onChange={(e) => {setPage(1); setFilterData({ ...filterData, playerTeam: e }) }} options={formatData?.teamData}
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
                            playerCard={playerCard}
                            getAllPlayerCard={getAllPlayerCard}
                            editCardLimit={editCardLimit}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                            handleAccordionClick={handleAccordionClick}
                            activeData={activeData}
                            setActiveData={setActiveData}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
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
