import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import OfferAppliedTable from './OfferAppliedUser'
import Pagination from '../Pagination'
import dayjs from 'dayjs'
import ODateRangePicker from 'components/shared/datePicker/ODateRangePicker'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'
import PageSizeList from 'components/PageSizeList'
import OSearch from 'components/reusable/OSearch'
import AddEditOffer from './AddEditOffer'
import { Link } from 'react-router-dom'
function ViewOfferManager() {
    const { t } = useTranslation()
    const { user, updatePageName } = useContext(AuthContext)
    const [editShowModal, setEditShowModal] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [isDelete] = useState(false)
    const [editView, setEditView] = useState()
    const [sort, setSort] = useState({
        sortBy: 'createdAt',
        sortType: 'desc'
    })
    const [item, setItem] = useState()
    const manager = user?.permission?.find(e => e.manager === 'offer_manager') ?? {}
    const [subAdmin, setSubAdmin] = useState()
    const [page, setPage] = useState(1)
    const [filterData, setFilterData] = useState({
        category: '',
        searchKey: '',
        startDate: '',
        endDate: '',
        isReset: false,
        isFilter: false
    })
    const [viewPaginationObj, setPaginationViewObj] = useState({
        page: 1,
        pageCount: 1,
        pageRangeDisplayed: 10
    })
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    
    // get all offer list start
    const ViewallOfferList = async () => {
        try {
            const { category, startDate, endDate, searchKey } = filterData

            const payloadData = {
                page,
                pageSize: pageSize,
                status: category,
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
                keyword: searchKey,
                sortBy: sort.sortBy,
                sortType: sort.sortType
            }

            const path = apiPath.getBanner
            const result = await apiGet(path, payloadData)
            const response = result?.data?.results
            const resultStatus = result?.data?.success
            setSubAdmin(response)
            setPaginationViewObj({
                ...viewPaginationObj,
                page: resultStatus ? response.page : null,
                pageCount: resultStatus ? response.totalPages : null,
                perPageItem: resultStatus ? response?.docs.length : null,
                totalItems: resultStatus ? response.totalDocs : null
            })
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

    useEffect(() => {
        // api call function
        ViewallOfferList()
    }, [filterData, page, sort, pageSize])

    // get all offer list end

    const handlePageClick = event => {
        const newPage = event.selected + 1
        setPage(newPage)
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

    useEffect(() => {
        updatePageName(t('VIEW_OFFER_MANAGER'))
    }, [])



    
    const editViewBanner = async (type, data) => {
        setEditView(type)
        setItem(data)
        setEditShowModal(true)
    }

    const getTableData = (details) => {
        return <td className="py-2 px-4 border-r border dark:border-[#ffffff38] text-center">
            {details || 'N/A'}
        </td>
    }

    const getTableHeader = (name) => {
        return <th className='text-center py-3 px-6'>{t(name)}</th>
    }


    return (
        <div>
            <div className='bg-[#F9F9F9] dark:bg-slate-900'>
                <div className='px-3 py-4'>
                    <Link aria-current="page" className="mb-5 ml-4 block active" to='/offer-manager'><svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" strokeLinecap="square" strokeMiterlimit={10} strokeWidth={48} d="M244 400L100 256l144-144M120 256h292" /></svg></Link>
                    <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
                        <form className='border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3 justify-between'>
                            <div className='col-span-2 flex flex-wrap  items-center'>
                                <div className='flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0'>
                                    <div className='relative flex items-center mb-3'>
                                        <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t('SEARCH_BY_USER_ID_USE_NAME')} />
                                    </div>

                                    <ODateRangePicker
                                        handleDateChange={handleDateChange}
                                        isReset={filterData?.isReset}
                                        setIsReset={setFilterData}
                                    />
                                    <button
                                        type='button'
                                        onClick={handleReset}
                                        title={t('O_RESET')}
                                        className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                                    >
                                        {t('O_RESET')}
                                    </button>
                                </div>
                            </div>

                            <button
                                type='button'
                                title={t('EXPORT_CSV')}
                                className='bg-gradientTo text-sm px-8 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2'
                            >
                                {t('EXPORT_CSV')}
                            </button>
                        </form>
                        <div className='m-5'>
                            <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">

                                <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                                    <tr>
                                        {getTableHeader('OFFER_ID')}
                                        {getTableHeader('OFFER_CODE')}
                                        {getTableHeader('RESTRICTED_USES')}
                                        {getTableHeader('CASH_BONUS')}
                                        {getTableHeader('EXPIRY_DATE')}
                                        {getTableHeader('O_CREATED_AT')}
                                        {getTableHeader('O_STATUS')}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        {getTableData('')}
                                        {getTableData('')}

                                        <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center" style={{ width: '17%' }}>
                                            {'N/A'}
                                        </td>
                                        {getTableData('')}
                                        {getTableData('')}
                                        {getTableData('')}
                                        {getTableData('')}
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <OfferAppliedTable
                            subAdmin={subAdmin?.docs}
                            editViewBanner={editViewBanner}
                            page={page}
                            setSort={setSort}
                            sort={sort}
                            manager={manager}
                            pageSize={pageSize}
                        />

                        <div className='flex justify-between'>
                            <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                            {viewPaginationObj?.totalItems ? (
                                <Pagination
                                    handlePageClick={handlePageClick}
                                    options={viewPaginationObj}
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
                    setEditShowModal={setEditShowModal}
                    getAllFAQ={ViewallOfferList}
                    item={item}
                    viewType={editView}
                />
            )}
        </div>
    )
}

export default ViewOfferManager
