import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import { isEmpty, startCase } from 'lodash'
import { useTranslation } from 'react-i18next'
import Pagination from 'pages/Pagination'
import AuthContext from 'context/AuthContext'
import helper from 'utils/helpers'
import { BsArrowUpShort } from 'react-icons/bs'
import dayjs from 'dayjs'

const BellNotifications = () => {
  const { updatePageName, logoutUser } = useContext(AuthContext)
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterData] = useState({
    startDate: '',
    endDate: ''
  })

  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageSize,
    pageCount: 5,
    pageRangeDisplayed: 10
  })
  const [sort, setSort] = useState({
    sortKey: 'createdAt',
    sortType: 'desc'
  })

  const getNotifications = async () => {
    try {
      const { startDate, endDate } = filterData
      const payload = {
        page,
        pageSize,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        sortBy: sort.sortKey,
        sortType: sort.sortType
      }
      const result = await apiGet(apiPath.getBellNotification, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        setUsers(response?.docs)
        setPaginationObj({
          ...paginationObj,
          page: response.page,
          pageCount: response.totalPages,
          perPageItem: response?.docs.length,
          totalItems: response.totalDocs
        })
      }
    } catch (error) {
      console.error('error ', error)
      setPaginationObj({})
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }
  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  useEffect(() => {
    getNotifications()
    updatePageName(t('O_NOTIFICATION'))
  }, [page, pageSize, sort])

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  return (
    <>
      <div className='p-3'>
        {/* <div className='font-semibold py-3'>{t('O_NOTIFICATION')}</div> */}

        <div className='overflow-x-auto relative rounded-lg border'>
          <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
            <thead className='text-xs text-gray-900 border border-[#E1E6EE] uppercase bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                {t('S.NO')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  <div className='flex items-center'>{t('O_TITLE')}</div>
                </th>
                <th scope='col' className='py-3 px-6'>
                  <div className='flex items-center'>{t('O_MESSAGE')}</div>
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 cursor-pointer'
                  onClick={() => {
                    if (
                      sort.sortKey === 'createdAt' &&
                      sort.sortType === 'asc'
                    ) {
                      setSort({
                        sortKey: 'createdAt',
                        sortType: 'desc'
                      })
                    } else {
                      setSort({
                        sortKey: 'createdAt',
                        sortType: 'asc'
                      })
                    }
                  }}
                >
                  <div className='flex justify-end'>
                    <span>{t('O_CREATED_AT')}</span>
                    <span>
                      {sort.sortKey === 'createdAt' &&
                        sort.sortType === 'asc' && (
                          <BsArrowUpShort className='w-4 h-4' />
                        )}
                      {sort.sortKey === 'createdAt' &&
                        sort.sortType === 'desc' && (
                          <BsArrowUpShort className='w-4 h-4 rotate-180' />
                        )}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users?.map((item, i) => (
                  <tr
                    key={i}
                    className='even:bg-gray-50 odd:bg-white bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  >
                    <th
                      scope='row'
                      className='py-4 px-6 border-r font-medium text-gray-900  dark:text-white'
                    >
                      {i + 1 + 10 * (paginationObj?.page - 1)}
                    </th>
                    <td className='py-4 px-6 border-r'>
                      {startCase(item?.title)}
                    </td>
                    <td className='py-4 px-6 border-r'>{item?.description}</td>
                    <td className='py-4 px-6 border-r'>
                      {helper.dateFormat(item?.createdAt)}
                    </td>
                  </tr>
                ))}
              {isEmpty(users) && (
                <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700'>
                  <td className='py-4 px-6 border-r' colSpan={4}>
                    {t('O_NO_RECORD_FOUND')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex justify-between'>
        <div className='flex items-center mb-3 ml-3'>
          <p className='w-[160px] -space-x-px pt-5 md:pb-5 pr-5 text-gray-500'>
            Page Size
          </p>

          <select
            id='countries'
            type=' password'
            name='floating_password'
            className=' w-[100px] block p-2 px-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer'
            placeholder=''
            value={pageSize}
            onChange={e => dynamicPage(e)}
          >
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
        </div>
        {paginationObj?.totalItems !== 0 && (
          <Pagination
            handlePageClick={handlePageClick}
            options={paginationObj}
            page={page}
          />
        )}
      </div>
    </>
  )
}

export default BellNotifications
