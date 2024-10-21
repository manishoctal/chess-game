import React, { useState, createContext, useEffect, useCallback, useMemo } from 'react'

const ToastContext = createContext()

export default ToastContext
export const ToastContextProvider = ({ children }) => {
  const [hasToast, setToasts] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    let timer
    if (hasToast.length > 0) {
      timer = setTimeout(() => {
        setToasts(hasToastTemp => hasToastTemp.slice(1))
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      return () => clearTimeout(timer)
    }
  }, [hasToast])

  console.log("hasToast",hasToast)

  const success = useCallback(function (msg) {
    const toast = {
      id: 1,
      msg,
      className: 'green',
    };
    setToasts((prevToasts) => [...prevToasts, toast]); 
  }, [setToasts]);

  const error = useCallback(function (msg) {
    const toast = {
      id: 1,
      msg,
      className: 'red',
    };
    setToasts((prevToasts) => [...prevToasts, toast]); 
  }, [setToasts])

  const warning = useCallback(function (msg) {
    const toast = {
      id: 1,
      msg,
      className: 'orange',
    };
    setToasts((prevToasts) => [...prevToasts, toast]); 
  }, [setToasts])

  const info = useCallback(function (msg) {
    const toast = {
      id: 1,
      msg,
      className: 'blue',
    };
    setToasts((prevToasts) => [...prevToasts, toast]); 
  }, [setToasts])

  const notification = useMemo(() => ({
    success,
    error,
    warning,
    info,
  }), [success, error, warning, info]);

  console.log("hasToast",hasToast)

  return (
    <ToastContext.Provider value={notification}>
      {children}
      {
                hasToast.map((toast) => (
                  <div className='absolute z-50 right-4 top-2' key={toast?._id}>
                    <div id='toast-success' className='flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800' role='alert'>
                      <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-${toast.className}-500 bg-${toast.className}-100 rounded-lg dark:bg-${toast.className}-800 dark:text-${toast.className}-200`}>
                        <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' /></svg>
                        <span className='sr-only'>Check icon</span>
                      </div>
                      <div className='ml-3 text-sm font-normal'>{toast.msg}</div>
                      <button type='button' onClick={() => setToasts([])} className='ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700' data-dismiss-target='#toast-success' aria-label='Close'>
                        <span className='sr-only'>Close</span>
                        <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' /></svg>
                      </button>
                    </div>
                  </div>
                ))
            }
    </ToastContext.Provider>
  )
}
