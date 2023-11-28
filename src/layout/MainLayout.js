import React, { useContext } from 'react'
import TopNavBar from '../components/TopNavBar'
import Loader from './Loader'
import Toast from './Toast'
import AuthContext from 'context/AuthContext'

function MainLayout ({ children, type }) {
  const { sidebarStatus } = useContext(AuthContext)
  return (
    <div className='main_wrap'>
      <Loader />
      <Toast />
      {type}
      <div className={`right_panel  ${sidebarStatus === 'open' ? 'xl:ml-[280px] lg:ml-[220px] ml-0' : ''
          }  `}>
        <TopNavBar />
        {children}
      </div>
    </div>
  )
}

export default MainLayout
