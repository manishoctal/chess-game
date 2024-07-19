import { useTranslation } from 'react-i18next'
import helpers from 'utils/helpers'
const ViewWalletBalance = ({ setIsAmountModal, viewBalance }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className='justify-center items-center  overflow-x-hidden flex overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <form >
          <div className='relative w-auto my-6 mx-auto max-w-3xl'>
            <div className='overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col min-w-[352px] bg-white outline-none focus:outline-none'>
              <div className=' flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900'>
                <h3 className='text-xl font-semibold dark:text-white flex items-center'>
                  {t('VIEW_WALLET_AMOUNT')}
                </h3>
                <button
                  className=' ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none'
                  onClick={() => setIsAmountModal(false)}
                >
                  <button type='button'
                    title={t('CLOSE')}
                    className='hover:text-blue-700 transition duration-150 ease-in-out'
                    data-bs-toggle='tooltip'>
                    <span className=' text-[#B8BBBF]  text-4xl '>×</span>
                  </button>
                </button>
              </div>

              <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 gap-5 flex'>
                <label>{t('BONUS_AMOUNT')}:</label>
                <b>{helpers.formattedAmount(viewBalance?.bonusAmount) || 0}</b>
              </div>
              <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 flex gap-5 flex'>
                <label>{t('DEPOSIT_AMOUNT')}:</label>
                <b>{helpers.formattedAmount(viewBalance?.depositAmount) || 0}</b>
              </div>
              <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 gap-5 flex'>
                <label>{t('WINNING_AMOUNT')}:</label>
                <b>{helpers.formattedAmount(viewBalance?.winningAmount) || 0}</b>
              </div>

              <div className='dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b'>
                <button
                  className='text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setIsAmountModal(false)}
                >
                  {t('CLOSE')}
                </button>

              </div>
            </div>
          </div>
        </form>


      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black' />
    </>
  )
}

export default ViewWalletBalance
