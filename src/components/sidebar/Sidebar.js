import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import Documents from '../reusable/icons/Documents'
import { GiCartwheel } from 'react-icons/gi'
import Dashboard from '../../assets/images/sidebar_icon1.svg'
import SubAdmin from '../../assets/images/subadmin_manager.svg'
import Logout from '../../assets/images/logout.svg'
import { useTranslation } from 'react-i18next'
import logoImage from '../../assets/images/Vector.png'
import { AiFillSetting, AiOutlineMail } from 'react-icons/ai'

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

  const andOperator = (condition, text) => {
    return condition && text
  }

  if (!user) {
    <></>
  }

  return (
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
          <img
            src={logoImage}
            className='inline max-w-[187px]'
            alt=''
            style={{ filter: 'brightness(0) invert(1)' }}
          />
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
            <img
              src={Dashboard}
              title={t('NAV_DASHBOARD')}
              className='max-w-[18px]'
              alt=''
            />
          )}
          {andOperator(
            checkSidebarPermission('user_manager'),
            generateNavLink(
              '/users',
              'USER_MANAGER',
              <img
                src={SubAdmin}
                className='max-w-[18px]'
                title={t('USER_MANAGER')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('transaction_manager'),
            generateNavLink(
              '/transactions',
              'NAV_TRANSACTION_MANAGER',
              <img
                src={SubAdmin}
                className='max-w-[18px]'
                title={t('NAV_TRANSACTION_MANAGER')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('subAdmin_manager'),
            generateNavLink(
              '/sub-admin-manager',
              'SUB_ADMIN_MANAGERS',
              <img
                src={SubAdmin}
                className='max-w-[18px]'
                title={t('SUB_ADMIN_MANAGERS')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('notification_manager'),
            generateNavLink(
              '/notification_manager',
              'NOTIFICATION_MANAGER',
              <GiCartwheel
                style={{ fontSize: '20px' }}
                title={t('NOTIFICATION_MANAGER')}
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('scratch_card_manager'),
            generateNavLink(
              '/scratch-card-manager',
              'SCRATCH_CARD_MANAGER',
              <GiCartwheel
                style={{ fontSize: '20px' }}
                title={t('SCRATCH_CARD_MANAGER')}
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('settings'),
            generateNavLink(
              '/setting',
              'SETTINGS',
              <AiFillSetting
                style={{ fontSize: '20px' }}
                title={t('SETTINGS')}
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('static_page_management'),
            generateNavLink(
              '/static-content',
              'NAV_STATIC_CONTENTS',
              <Documents />
            )
          )}

          {checkSidebarPermission('FAQ') &&
            generateNavLink('/faqs', 'NAV_FAQS', <Documents />)}

          {andOperator(
            checkSidebarPermission('email_manager'),
            generateNavLink(
              '/email-manager',
              'EMAIL_MANAGER',
              <AiOutlineMail
                style={{ fontSize: '20px' }}
                title={t('EMAIL_MANAGER')}
              />
            )
          )}
          {andOperator(
            checkSidebarPermission('feedback_manager'),
            generateNavLink(
              '/feedback-manager',
              'FEEDBACK_MANAGER',
              <AiOutlineMail
                style={{ fontSize: '20px' }}
                title={t('FEEDBACK_MANAGER')}
              />
            )
          )}

          <Link
            onClick={handleLogout}
            className='flex items-center px-4 lg:px-7 py-4 hover:bg-sideBarNavActiveColor hover:text-gradientTo'
          >
            <span className='mr-2'>
              <img
                src={Logout}
                className='max-w-[18px]'
                title={t('NAV_LOGOUT')}
                alt='logout'
              />
            </span>
            {t('NAV_LOGOUT')}
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
