import Home from 'pages/Home'
import SharedLayout from 'utils/SharedLayout'
import { useTranslation } from 'react-i18next'
import SubAdmin from 'pages/sub_admin/SubAdmin'
import SubAdd from 'pages/sub_admin/SubAdd'
import StaticContent from 'pages/static_Contents/StaticContent'
import AddStaticContent from 'pages/static_Contents/AddStaticContent'
import EditStaticContent from 'pages/static_Contents/EditStaticContent'
import StaticContentView from 'pages/static_Contents/StaticContentView'
import NotificationManager from 'pages/notification_manager/NotificationManager'
import Profile from 'pages/profile/Profile'
import ChangePassword from 'pages/auth/ChangePassword'
import Sidebar from 'components/sidebar/Sidebar'
import BellNotifications from 'pages/notification_manager/BellNotifications'
import Faq from 'pages/faqs/FAQ'
import EmailTemplate from 'pages/email_template_manager/EmailTemplate'
import AddEditEmail from 'pages/email_template_manager/AddEditEmail'
import Settings from 'pages/settings/Settings'
import Login from 'pages/Login'
import User from 'pages/users/User'
import UserView from 'pages/users/UserView'
import ReportAbuse from 'pages/report_abuse_manager/ReportAbuse'
import NotificationAdd from 'pages/notification_manager/NotificationAdd'

const UseChange = ({ data }) => {
  const { t } = useTranslation()
  return t(data)
}

const AdminRoutes = {
  // All common routes
  path: '/',
  element: <SharedLayout type={<Sidebar />} />,
  children: [
    {
      path: '/dashboard',
      element: <Home />,
      name: (
        <>
          <UseChange data='NAV_DASHBOARD' />
        </>
      )
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/sub-admin-manager',
      element: <SubAdmin />,
      name: (
        <>
          <UseChange data='SUB_ADMIN_MANAGERS' />
        </>
      )
    },
    {
      path: '/users',
      element: <User />,
      name: (
        <>
          <UseChange data='USER_MANAGER' />
        </>
      )
    },

    {
      path: '/users/view',
      element: <UserView />,
      name: (
        <>
          <UseChange data='USER_MANAGER' />
        </>
      )
    },

    {
      path: '/sub-admin-manager/add',
      element: <SubAdd />,
      name: (
        <>
          <UseChange data='SUB_ADMIN_MANAGERS' />
        </>
      )
    },

    {
      path: '/report_abuse_manager',
      element: <ReportAbuse />,
      name: (
        <>
          <UseChange data='REPORTS_MANAGER' />
        </>
      )
    },

    {
      path: '/email-manager',
      element: <EmailTemplate />,
      name: (
        <>
          <UseChange data='EMAIL_TEMPLATE_MANAGER' />
        </>
      )
    },
    {
      path: '/email-manager/add',
      element: <AddEditEmail />,
      name: (
        <>
          <UseChange data='EMAIL_TEMPLATE_MANAGER' />
        </>
      )
    },
    {
      path: '/email-manager/edit',
      element: <AddEditEmail />,
      name: (
        <>
          <UseChange data='EMAIL_TEMPLATE_MANAGER' />
        </>
      )
    },

    {
      path: '/StaticContent',
      element: <StaticContent />,
      name: (
        <>
          <UseChange data='NAV_STATIC_CONTENTS' />
        </>
      )
    },
    {
      path: '/StaticContent/add',
      element: <AddStaticContent />,
      name: (
        <>
          <UseChange data='NAV_STATIC_CONTENTS' />
        </>
      )
    },
    {
      path: '/StaticContent/edit',
      element: <EditStaticContent />,
      name: (
        <>
          <UseChange data='NAV_STATIC_CONTENTS' />
        </>
      )
    },
    {
      path: '/StaticContent/view',
      element: <StaticContentView />,
      name: (
        <>
          <UseChange data='NAV_STATIC_CONTENTS' />
        </>
      )
    },

    {
      path: '/notification_manager',
      element: <NotificationManager />,
      name: (
        <>
          <UseChange data='NOTIFICATION_MANAGER' />
        </>
      )
    },

    {
      path: '/notification_manager/add',
      element: <NotificationAdd />,
      name: (
        <>
          <UseChange data='NOTIFICATION_MANAGER' />
        </>
      )
    },
    {
      path: '/faqs',
      element: <Faq />,
      name: (
        <>
          <UseChange data='FAQS' />
        </>
      )
    },
    {
      path: '/setting',
      element: <Settings />,
      name: (
        <>
          <UseChange data='SETTINGS' />
        </>
      )
    },
    {
      path: '/profile',
      element: <Profile />,
      name: (
        <>
          <UseChange data='NAV_EARNING_MANAGER' />
        </>
      )
    },
    {
      path: '/change-password',
      element: <ChangePassword />,
      name: (
        <>
          <UseChange data='NAV_EARNING_MANAGER' />
        </>
      )
    },
    {
      path: '/notification-list',
      element: <BellNotifications />,
      name: (
        <>
          <UseChange data='O_NOTIFICATION' />
        </>
      )
    },
    {
      path: '/',
      element: <Home />,
      name: (
        <>
          <UseChange data='NAV_DASHBOARD' />
        </>
      )
    }
  ]
}

export default AdminRoutes
