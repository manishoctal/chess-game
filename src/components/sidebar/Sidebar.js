import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import Documents from '../reusable/icons/Documents'
import { GiCartwheel } from 'react-icons/gi'
import Dashboard from '../../assets/images/sidebar_icon1.svg'
import SubAdmin from '../../assets/images/sub-admin-manager.svg'
import userManager from '../../assets/images/user-manager.svg'
import transactionManager from '../../assets/images/transaction-manager.svg'
import scratchcCard from '../../assets/images/scratchc-card.svg'
import rewardWithdrawalRequest from '../../assets/images/reward-withdrawal-request.svg'
import reportManager from '../../assets/images/report-manager.svg'
import notificationManager from '../../assets/images/Notification-manager.svg'
import manageStaticContents from '../../assets/images/manage-static-contents.svg'
import globalSettings from '../../assets/images/global-settings.svg'
import feedbackManager from '../../assets/images/feedback-manager.svg'
import faqs from '../../assets/images/faqs.svg'
import emailManager from '../../assets/images/email-manager.svg'
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
    ;<></>
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
                src={userManager}
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
                src={transactionManager}
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
              <img
                src={notificationManager}
                className='max-w-[18px]'
                title={t('NOTIFICATION_MANAGER')}
                alt=''
              />
            )
          )}
          {andOperator(
            checkSidebarPermission('scratch_card_manager'),
            generateNavLink(
              '/scratch-card-manager',
              'SCRATCH_CARD_MANAGER',
              <img
                src={scratchcCard}
                className='max-w-[18px]'
                title={t('SCRATCH_CARD_MANAGER')}
                alt=''
              />
            )
          )}
          {andOperator(
            checkSidebarPermission('feedback_manager'),
            generateNavLink(
              '/feedback-manager',
              'FEEDBACK_MANAGER',
              <img
                src={feedbackManager}
                className='max-w-[18px]'
                title={t('FEEDBACK_MANAGER')}
                alt=''
              />
            )
          )}
          {andOperator(
            checkSidebarPermission('report_manager'),
            generateNavLink(
              '/report-manager',
              'REPORT_MANAGER',
              <img
                src={reportManager}
                className='max-w-[18px]'
                title={t('REPORT_MANAGER')}
                alt=''
              />
            )
          )}
          {andOperator(
            checkSidebarPermission('reward_withdrawal_request'),
            generateNavLink(
              '/reward-withdrawal-request',
              'REWARD_WITHDRAWAL_REQUEST',
              <img
                src={rewardWithdrawalRequest}
                className='max-w-[18px]'
                title={t('REWARD_WITHDRAWAL_REQUEST')}
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
