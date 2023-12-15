import React from 'react'
import { useTranslation } from 'react-i18next'

const ViewNotifications = ({ setViewShowModal, item }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto  inset-0 z-50 outline-none focus:outline-none fixed'>
        <div className='my-6  relative w-auto mx-auto max-w-3xl'>
          <form className=' px-7 sm:py-4 sm:px-2 py-8'>
            <div className='rounded-lg border-0  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px]'>
              <div className=' border-b flex items-center justify-between p-5 border-solid border-slate-200 rounded-t'>
                <h3 className='font-semibold text-xl '>{t('O_VIEW_USER')}</h3>
                <button
                  onClick={() => setViewShowModal(false)}
                  className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                >
                  <span title='Close' className=' text-[#B8BBBF]  text-4xl ' >
                    ×
                  </span>
                </button>
              </div>
              <div className='p-6  relative flex-auto'>
                <div className='rounded-md border-2  p-5'>
                  <div className=' grid-cols-2 grid  '>
                    <div className='mb-3'>
                      <div className=''>
                        <strong>{t('O_TITLE')}:</strong>
                      </div>
                      <div>{item?.title}</div>
                    </div>
                    <div className='mb-3'>
                      <div className=''>
                        <strong>{t('O_TITLE') + t('O_ARABIC')}:</strong>
                      </div>
                      <div>{item?.titleAr}</div>
                    </div>
                    <div className='mb-3'>
                      <div className=''>
                        <strong>{t('O_SEND_TO')}:</strong>
                      </div>
                      <div>{item?.sendTo}</div>
                    </div>
                    {item?.sendTo === 'specific' && (
                      <div className='mb-3'>
                        <div className=''>
                          <strong>{t('O_USERS')}:</strong>
                        </div>
                        <div>
                          {item?.sendTo === 'specific'
                            ? item?.userData
                                ?.map(e => {
                                  return `${e?.firstName} ${e?.lastName}`
                                })
                                ?.join(', ')
                            : 'N/A'}
                          .
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='mb-4 mt-2'>
                    <strong>{t('O_MESSAGE')}:</strong>
                  </div>
                  <div className='break-all'>{item?.description}</div>
                  <div className='mb-4 mt-2'>
                    <strong>{t('O_MESSAGE') + t('O_ARABIC')}:</strong>
                  </div>
                  <div className='break-all'>{item?.descriptionAr}</div>
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

export default ViewNotifications
