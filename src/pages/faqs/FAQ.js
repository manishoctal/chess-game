import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Table from './Table'
import AddFAQ from './AddFAQ'
import EditFAQ from './EditFAQ'
import Pagination from '../Pagination'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'

function Faq () {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const { logoutUser, user } = useContext(AuthContext)
  const manager = user?.permission?.find(e => e.manager === 'FAQ') ?? {}
  const [editShowModal, setEditShowModal] = useState(false)
  const [editView, setEditView] = useState()
  const [FAQs, setFAQS] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [item, setItem] = useState('')
  const [sort, setSort] = useState({
    sortBy: 'createdAt',
    sortType: 'desc'
  })

  const getAllFAQ = async () => {
    try {
      const payload = {
        page,
        pageSize: pageSize,
        sortKey: sort.sortBy,
        sortType: sort.sortType
      }

      const path = apiPath.getFAQs
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        const resultStatus = result?.data?.success
        setFAQS(response?.docs)
        setPaginationObj({
          ...paginationObj,
          pageCount: resultStatus ? response?.totalPages : null,
          perPageItem: resultStatus ? response?.docs.length : null,
          totalItems: resultStatus ? response?.totalDocs : null
        })
      }
    } catch (error) {
      console.error('error in get all FAQs list==>>>>', error.message)
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  const dynamicPage = e => {
    setPage(1)
    setPageSize(e.target.value)
  }

  const handlePageClick = event => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handelEdit = (items, type) => {
    setItem(items)
    setEditShowModal(true)
    setEditView(type)
  }
  useEffect(() => {
    getAllFAQ()
  }, [page, sort, pageSize])

  return (
    <div>
      <div className='bg-[#F9F9F9] dark:bg-slate-900'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]'>
            <div className=' border-b-[#E3E3E3] gap-2 px-4 py-4 '>
              {/* <div className="col-span-2 flex flex-wrap  items-center">
                <div
                  className="mr-3 mt--10"
                  onClick={() => navigator("/static-content")}
                >
                  <BsArrowLeftSquare
                    className="dark:text-white"
                    style={{ fontSize: 20, cursor: "pointer" }}
                  />
                </div>
              </div> */}
              <div className='2xl:ml-auto xl:ml-0 lg:pt-0 pt-2'>
                <div className='flex mt-2 justify-end'>
                  {(manager?.add || user?.role === 'admin') && (
                    <button
                      title={t('ADD_FAQS')}
                      className='bg-gradientTo flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                      onClick={() => setShowModal(true)}
                    >
                      + {t('ADD_FAQS')}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Table
              FAQs={FAQs}
              getAllFAQ={getAllFAQ}
              handelEdit={handelEdit}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              paginationObj={paginationObj}
              pageSize={pageSize}
            />

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
          </div>
        </div>
      </div>
      <>
        {showModal && (
          <AddFAQ setShowModal={setShowModal} getAllFAQ={getAllFAQ} />
        )}
        {editShowModal && (
          <EditFAQ
            setEditShowModal={setEditShowModal}
            getAllFAQ={getAllFAQ}
            item={item}
            viewType={editView}
          />
        )}
      </>
    </div>
  )
}

export default Faq
