import { startCase } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

const SupportView = ({ setViewShowModal, item }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className='justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <form className='sm:py-4 sm:px-2 py-8 px-7'>
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px] max-h-[762px] overflow-y-scroll'>
              <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                <h3 className='text-xl font-semibold'>{t('O_VIEW_USER')}</h3>
                <button
                  className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                  onClick={() => setViewShowModal(false)}
                >
                  <span className=' text-[#B8BBBF]  text-4xl ' title='Close'>
                    ×
                  </span>
                </button>
              </div>
              <div className='relative p-6 flex-auto'>
                <div className=' border-2 rounded-md p-5'>
                  <div className='grid grid-cols-1 max-h-[400px] overflow-y-auto'>
                    <div className='mb-3'>
                      {/* <div className=''>
                        <strong>{t('FEEDBACK')}:</strong>
                      </div> */}
                      <div>
                        {startCase(item) }
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                <button
                  className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setViewShowModal(false)}
                >
                  {t('O_CLOSE')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}

export default SupportView
