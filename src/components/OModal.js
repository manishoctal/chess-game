import React from 'react'
import { useTranslation } from 'react-i18next'
import OButton from './reusable/OButton'

const OModal = ({ Trigger, title, Content, apiButtonTitle }) => {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      {React.cloneElement(Trigger, {
        handleOpen
      })}

      {open && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-7xl'>
              {/* content */}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/* header */}
                <div className='flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t '>
                  <h3 className='text-xl font-semibold'>{t(title)}</h3>
                  <button
                    className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                    onClick={() => handleClose()}
                  >
                    <span
                      className=' text-[#B8BBBF]  text-4xl '
                      title='Close'
                    >
                      ×
                    </span>
                  </button>
                </div>
                {/* body */}
                <section className=' p-5'>
                  {React.cloneElement(Content, {})}
                </section>
                {/* footer */}
                <div className='flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                  <button
                    className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                    type='button'
                    onClick={() => handleClose()}
                  >
                    {t('O_BACK')}
                  </button>
                  {apiButtonTitle && (
                    <OButton
                      label={<>{t(apiButtonTitle)}</>}
                      type='button'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='opacity-25 fixed inset-0 z-40 bg-black' />
        </>
      )}
    </>
  )
}

export default OModal
