import MainLayout from 'layout/MainLayout'
import React from 'react'
import { Outlet } from 'react-router-dom'

const SharedLayout = ({ type }) => {
  return (
    <MainLayout type={type}>
      <Outlet />
    </MainLayout>
  )
}

export default SharedLayout
