import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
   <>
   
   
   {/* <Head>
      <title>404 - Page Not Found</title>
    </Head> */}
<section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
    <div className="px-4 mx-auto max-w-screen-xl lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
<div className='max-w-[211px] m-auto mt-4'>
<Link to="/dashboard" className="text-center block text-lg bg-gradientTo px-6 gap-2 mb-3 py-3 rounded-lg border border-transparent text-white hover:bg-DarkBlue">Back to Homepage</Link>
</div>
            </div>   
    </div>
</section>
   </>
  )
}

export default NotFound