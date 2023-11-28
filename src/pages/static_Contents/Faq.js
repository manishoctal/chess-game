import React, { useContext, useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiFetch'
import apiPath from '../../utils/apiPath'
import Table from './Table'
import AddFaq from './AddFaq'
import EditFAQ from './EditFAQ'
import Pagination from '../Pagination'
import { useTranslation } from 'react-i18next'
import AuthContext from 'context/AuthContext'

function FAQ () {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10
  })
  const { logoutUser, user } = useContext(AuthContext)
  const manager = user?.permission?.find(e => e.manager === 'faqs') ?? {}
  const [editshowModal, setEditShowModal] = useState(false)
  const [FAQs, setFAQS] = useState([])
  const [page, setPage] = useState(1)
  const [item, setItem] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [isDelete, setIsDelete] = useState(false)
  const [sort, setSort] = useState({
    sort_key: 'createdAt',
    sort_type: 'desc'
  })

  const getAllFAQ = async (payload) => {
    try {
      if (payload?.deletePage) {
        payload = {
          page,
          limit: pageSize
        }
        if (!(FAQs?.length > 1)) {
          setPage(page - 1)
          setIsDelete(true)
          setPaginationObj({ ...paginationObj, page: page - 1 })
        }
      } else {
        payload = {
          page,
          pageSize,
          sort_key: sort.sort_key,
          sort_type: sort.sort_type
        }
        setIsDelete(false)
      }

      const path = apiPath.getFAQs
      const result = await apiGet(path, payload)
      if (result?.status === 200) {
        const response = result?.data?.results
        const resultStatus = result?.data?.success
        setFAQS(response?.docs)
        setPaginationObj({
          ...paginationObj,
          pageCount: resultStatus ? response.totalPages : null,
          perPageItem: resultStatus ? response?.docs.length : null,
          totalItems: resultStatus ? response.totalDocs : null
        })
      }
    } catch (error) {
      console.log('error in get all FAQs list==>>>>', error.message)
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser()
      }
    }
  }

  const handlePageClick = (event) => {
    const newPage = event.selected + 1
    setPage(newPage)
  }

  const handelEdit = (items) => {
    setItem(items)
    setEditShowModal(true)
  }
  useEffect(() => {
    getAllFAQ()
  }, [page, sort, pageSize])

  const pageSizeCall = (value) => {
    setPageSize(value)
  }

  return (
    <div>
      <div className='bg-[#F9F9F9]'>
        <div className='px-3 py-4'>
          <div className='bg-white border border-[#E9EDF9] rounded-lg'>
            <div className=' border-b-[#E3E3E3] grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid lg:grid-cols-1 gap-2 px-4 '>
              <div className='col-span-2 flex flex-wrap  items-center'>fdsafas</div>
              <div className='2xl:ml-auto xl:ml-0 lg:pt-0 pt-2'>
                <div className='flex mt-2'>
                  {(manager?.add ||
                    user?.role === 'admin') && (
                      <button
                        title={t('FAQS_ADD_FAQS')}
                        className='bg-LightBlue flex text-sm px-8 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap'
                        onClick={() => setShowModal(true)}
                      >
                        + {t('FAQS_ADD_FAQS')}
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
            />
            {paginationObj?.totalItems
              ? (<Pagination
                  handlePageClick={handlePageClick}
                  options={paginationObj}
                  isDelete={isDelete}
                  page={page}
                  setPageSize={pageSizeCall}
                  pageSize={pageSize}
                 />)
              : null}
          </div>
        </div>
      </div>
      <>
        {
          showModal
            ? (
              <AddFaq setShowModal={setShowModal} getAllFAQ={getAllFAQ} />)
            : null
        }
        {
          editshowModal
            ? (
              <EditFAQ
                setEditShowModal={setEditShowModal}
                getAllFAQ={getAllFAQ}
                item={item}
              />)
            : null
        }
      </>
    </div>
  )
}

export default FAQ
