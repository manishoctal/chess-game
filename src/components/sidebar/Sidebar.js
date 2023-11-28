import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import Documents from '../reusable/icons/Documents'
import { GiPlatform, GiCartwheel } from 'react-icons/gi'
import Dashboard from '../../assets/images/sidebar_icon1.svg'
import SubAdmin from '../../assets/images/subadmin_manager.svg'
import Support from '../../assets/images/support_manager.svg'
import Logout from '../../assets/images/logout.svg'
import { useTranslation } from 'react-i18next'
import logoImage from '../../assets/images/Vector.png'
import { HiOutlineUser } from 'react-icons/hi'
import { MdOutlineSubscriptions } from 'react-icons/md'
import { AiFillSetting, AiOutlineMail } from 'react-icons/ai'
import { PiArticleFill } from 'react-icons/pi'

const classNames = require('classnames')

const Sidebar = () => {
  const { t } = useTranslation()
  const { logoutUser, user, sidebarStatus, updatePageName } =
    useContext(AuthContext)

  const generateNavLink = (to, label, icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'flex items-center px-4 lg:px-7 py-4 hover:bg-sideBarNavActiveColor hover:text-gradientTo',
          {
            'bg-white': isActive,
            'text-black': isActive,
            active: isActive
          }
        )
      }
      onClick={() => updatePageName(t(label))}
    >
      {icon && <span className='mr-2'>{icon}</span>}
      {t(label)}
    </NavLink>
  )

  const handleLogout = () => {
    if (window.confirm('Are you sure to logout?')) {
      logoutUser()
    }
  }

  const checkSidebarPermission = arg => {
    if (!user) {
      return false
    }
    const localPermissions = [...user?.permission]

    if (user?.permission?.length === 0) {
      return true
    }
    const perIndex = localPermissions?.findIndex(item => item?.manager === arg)
    if (perIndex < 0) {
      return false
    }
    if (localPermissions?.[perIndex]?.view) {
      return true
    }

    return false
  }

  if (!user) {
    ;<></>
  }

  return (
    <>
      {' '}
      <div
        className={`sidebar lg:block z-10  ${
          sidebarStatus === 'open' ? 'block' : 'sidebarHide'
        } bg-gradient-to-t from-gradpurple to-gradientFrom w-[220px] xl:w-[280px] fixed h-full overflow-y-auto`}
        // onClick={handleSidebar}
      >
        <div className='text-sideBarNavColor'>
          <Link
            to='/dashboard'
            onClick={() => updatePageName('Dashboard')}
            className='px-2 py-6 w-full text-center flex justify-center'
          >
            <img src={logoImage} className='inline max-w-[187px]' alt='' />
          </Link>
          <div className='profile text-center'>
            <small className='block text-sm'>Welcome</small>
            <strong className='block text-lg overflow-hidden text-ellipsis px-2 whitespace-nowrap '>
              {user?.firstName + ' ' + user?.lastName}
            </strong>
          </div>

          <nav className='pt-4 pb-5 flex flex-col justify-center font-normal text-xs overflow-y-auto'>
            {/* {checkSidebarPermission("dashboard") && ( */}
            {generateNavLink(
              '/dashboard',
              'NAV_DASHBOARD',
              <img src={Dashboard} className='max-w-[18px]' alt='' />
            )}

            {checkSidebarPermission('users_managers') &&
              generateNavLink(
                '/users',
                'USER_MANAGER',
                <img src={SubAdmin} className='max-w-[18px]' alt='' />
              )}

            {checkSidebarPermission('subAdmin_manager') &&
              generateNavLink(
                '/sub-admin-manager',
                'SUB_ADMIN_MANAGERS',
                <img src={SubAdmin} className='max-w-[18px]' alt='' />
              )}

            {checkSidebarPermission('stickers') &&
              generateNavLink(
                '/stickers',
                'STICKERS',
                <PiArticleFill style={{ fontSize: '20px' }} />
              )}

            {checkSidebarPermission('reports_manager') &&
              generateNavLink(
                '/report_abuse_manager',
                'REPORTS_MANAGER',
                <GiCartwheel style={{ fontSize: '20px' }} />
              )}

            {checkSidebarPermission('gift_manager') &&
              generateNavLink(
                '/gift-manager',
                'GIFT_MANAGER',
                <GiPlatform style={{ fontSize: '20px' }} />
              )}

            {checkSidebarPermission('settings') &&
              generateNavLink(
                '/setting',
                'SETTINGS',
                <AiFillSetting style={{ fontSize: '20px' }} />
              )}

            {checkSidebarPermission('static_page_management') &&
              generateNavLink(
                '/StaticContent',
                'NAV_STATIC_CONTENTS',
                <Documents />
              )}

            {checkSidebarPermission('faq_manager') &&
              generateNavLink('/faqs', 'NAV_FAQS', <Documents />)}

            {checkSidebarPermission('email_manager') &&
              generateNavLink(
                '/email-manager',
                'EMAIL_TEMPLATE_MANAGER',
                <AiOutlineMail style={{ fontSize: '20px' }} />
              )}

            <Link
              onClick={handleLogout}
              className='flex items-center px-4 lg:px-7 py-4 hover:bg-sideBarNavActiveColor hover:text-gradientTo'
            >
              <span className='mr-2'>
                <img src={Logout} className='max-w-[18px]' alt='logout' />
              </span>
              {t('NAV_LOGOUT')}
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
