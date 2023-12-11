import AuthContext from 'context/AuthContext'
import dayjs from 'dayjs'
import { isEmpty, startCase } from 'lodash'
import Pagination from 'pages/Pagination'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiGet } from 'utils/apiFetch'
import pathObj from 'utils/apiPath'
import helper from 'utils/helpers'

const ScratchCardUsersTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, updatePageName } = useContext(AuthContext)
  const [scratchCardUser, setScratchCardUser] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [filterData, setFilterData] = useState({
    category: '',
    searchkey: '',
    startDate: '',
    endDate: '',
    isReset: false,
    isFilter: false
  })
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const [scratchCardId] = useState(location?.state)
  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }
  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const scratchCardHistory = async (data, pageNO) => {
    try {
      const { startDate, endDate, searchkey } = filterData

      const payload = {
        // page,
        // pageSize: pageSize,
      }

      const path = pathObj.scratchCardHistory + '/' + scratchCardId?.id
      const result = await apiGet(path, payload)
      const response = result?.data?.results
      const resultStatus = result?.data?.success
      setScratchCardUser(response?.docs)
      setPaginationObj({
        ...paginationObj,
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
    scratchCardHistory()
  }, [])

  return (
    <>
      <div className='p-3'>
        <div className='overflow-x-auto relative rounded-lg border'>
          <table className='w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 '>
            <thead className='text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  {t('S.NO')}
                </th>

                <th scope='col' className='py-3 px-6'>
                  {t('FOREIGN_TOURIST_NAME')}
                </th>

                <th scope='col' className='py-3 px-6'>
                  {t('TRANSACTION_AMOUNT')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('COUPON_CODE')}
                </th>
                <th scope='col' className='py-3 px-6'>
                  {t('DATE_AND_TIME')}
                </th>
              </tr>
            </thead>
            <tbody>
              {scratchCardUser?.map((item, i) => (
                <tr
                  key={i}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                >
                  <th
                    scope='row'
                    className='py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white'
                  >
                    {i + 1 + 10 * (page - 1)}
                  </th>

                  <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                    {startCase(item?.user?.firstName + item?.user?.lastName)}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                    {item?.scratchCardRecord?.couponAmount || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                    {item?.scratchCardRecord?.couponCode || 'N/A'}
                  </td>
                  <td className='py-2 px-4 border-r dark:border-[#ffffff38]'>
                    {helper.getDateAndTime(item?.createdAt)}
                  </td>
                </tr>
              ))}
              {isEmpty(scratchCardUser) ? (
                <tr className='bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700'>
                  <td className='py-4 px-6' colSpan={7}>
                    {t('O_NO_RECORD_FOUND')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      {scratchCardUser.length > 0 && (
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
          {paginationObj?.totalItems ? (
            <Pagination
              handlePageClick={handlePageClick}
              options={paginationObj}
              page={page}
            />
          ) : null}
        </div>
      )}
    </>
  )
}

export default ScratchCardUsersTable
