import AuthContext from 'context/AuthContext'
import useToastContext from 'hooks/useToastContext'
import MainLayout from 'layout/MainLayout'
import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const SharedLayout = ({ type }) => {
  const { user } = useContext(AuthContext)
  const notification = useToastContext()
  const location = useLocation()

  useEffect(() => {
    if (!user?.isPasswordSet && user?.role === 'subAdmin') {
      notification.error('Please change the password.')
    }
  }, [location?.pathname])

  if (!user?.isPasswordSet && user?.role === 'subAdmin') {
    // notification.error('Please change the password.')

    return (
      <>
        <Navigate to='/change-password' />
        <MainLayout>
          <Outlet />
        </MainLayout>
      </>
    )
  }

  return (
    <MainLayout type={type}>
      <Outlet />
    </MainLayout>
  )
}

export default SharedLayout
