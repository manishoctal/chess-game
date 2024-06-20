import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import Dashboard from '../../assets/images/sidebar_icon1.svg'
import SubAdmin from '../../assets/images/sub-admin-manager.svg'
import userManager from '../../assets/images/user-manager.svg'
import rewardWithdrawalRequest from '../../assets/images/reward-withdrawal-request.svg'
import notificationManager from '../../assets/images/Notification-manager.svg'
import manageStaticContents from '../../assets/images/manage-static-contents.svg'
import globalSettings from '../../assets/images/global-settings.svg'
import faqs from '../../assets/images/faqs.svg'
import emailManager from '../../assets/images/email-manager.svg'
import Logout from '../../assets/images/logout.svg'
import { useTranslation } from 'react-i18next'
import logoImage from '../../assets/images/logo-admin.png'
import Swal from 'sweetalert2'

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
    Swal.fire({
      html: "<b>Are you sure you want to logout?</b>",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
      }
    });


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
      className={`sidebar lg:block z-10   ${sidebarStatus === 'open' ? 'block' : 'sidebarHide'
        } bg-gradient-to-t from-gradpurple to-gradientFrom w-[220px] xl:w-[280px] fixed h-full overflow-y-auto`}
    >
      <div className='text-sideBarNavColor'>
        <Link
          to='/dashboard'
          onClick={() => updatePageName('Dashboard')}
          className={`px-2 py-8 w-full text-center flex justify-center ${sidebarStatus === 'open' ? 'showToggle' : ''}`}
        >
          <img
            src={logoImage}
            className='inline max-w-[187px]'
            alt=''
          />
        </Link>
        <div className='profile text-center'>
          <small className='block text-sm'>Welcome</small>
          <strong className='block text-lg overflow-hidden text-ellipsis px-2 whitespace-nowrap '>
            {user?.firstName + ' ' + user?.lastName}
          </strong>
        </div>

        <nav className='pt-4 pb-5 flex flex-col justify-center font-normal text-xs overflow-y-auto'>
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
            checkSidebarPermission('user_manager'),
            generateNavLink(
              '/users',
              'USER_MANAGER',
              <img
                src={userManager}
                className='max-w-[18px]'
                title={t('USER_MANAGER')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('banner_manager'),
            generateNavLink(
              '/banner-manager',
              'BANNER_MANAGER',
              <img
                src={rewardWithdrawalRequest}
                title={t('BANNER_MANAGER')}
                className='max-w-[18px]'
                alt=''
              />
            )
          )}
  
          {andOperator(
            checkSidebarPermission('email_manager'),
            generateNavLink(
              '/email-manager',
              'EMAIL_MANAGER',
              <img
                src={emailManager}
                className='max-w-[18px]'
                title={t('EMAIL_MANAGER')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('notification_manager'),
            generateNavLink(
              '/notification_manager',
              'NOTIFICATION_MANAGER',
              <img
                src={notificationManager}
                className='max-w-[18px]'
                title={t('NOTIFICATION_MANAGER')}
                alt=''
              />
            )
          )}

          {andOperator(
            checkSidebarPermission('static_page_management'),
            generateNavLink(
              '/static-content',
              'NAV_STATIC_CONTENTS',
              <img
                src={manageStaticContents}
                className='max-w-[18px]'
                title={t('NAV_STATIC_CONTENTS')}
                alt=''
              />
            )
          )}
          {checkSidebarPermission('FAQ') &&
            generateNavLink(
              '/faqs',
              'NAV_FAQS',
              <img
                src={faqs}
                className='max-w-[18px]'
                title={t('NAV_FAQS')}
                alt=''
              />
            )}

          {andOperator(
            checkSidebarPermission('settings'),
            generateNavLink(
              '/setting',
              'SETTINGS',
              <img
                src={globalSettings}
                className='max-w-[18px]'
                title={t('SETTINGS')}
                alt=''
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
