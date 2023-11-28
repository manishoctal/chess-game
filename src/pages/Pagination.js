import React from 'react'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
const Pagination = (props) => {
  const { t } = useTranslation()
  const { handlePageClick, options = { perPageItem: '', pageCount: 1, totalItems: 0, pageRangeDisplayed: 10 }, isDelete = false, page = 1 } = props
  if (options.totalItems === 0 || options.totalItems === undefined) {
    return <></>
  }
  return (
    <div className='md:flex md:justify-end'>
      <p className='-space-x-px pt-5 md:pb-5 pr-5 text-gray-500'>{t('O_TOTAL')} {options.totalItems} {t('O_RECORDS')}</p>
      <nav aria-label='Page navigation example'>
        <ReactPaginate
          breakLabel='...'
          nextLabel={t('O_NEXT')}
          onPageChange={handlePageClick}
          pageRangeDisplayed={options.pageRangeDisplayed}
          pageCount={options.pageCount}
          previousLabel={t('O_PREVIOUS')}
          renderOnZeroPageCount='null'
          className='inline-flex -space-x-px pt-5 pb-5 pr-5 flex-wrap justify-center '
          activeClassName='pagination-active'
          previousLinkClassName='px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          nextLinkClassName='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          pageLinkClassName='px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          activeLinkClassName='pagination-active'
          forcePage={isDelete ? 1 : page - 1}
        />
      </nav>
    </div>
  )
}

export default Pagination
