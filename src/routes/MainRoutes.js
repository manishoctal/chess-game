import ForgotPassword from 'pages/auth/ForgotPassword'
import ResetPassword from 'pages/auth/ResetPassword'
import Login from 'pages/Login'
import { HomeRedirect } from './HomeRedirect'

const MainRoutes = {

  // All common routes
  path: '/',
  children: [
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password/:resetToken',
      element: <ResetPassword />
    },
    {
      path: '*',
      element: <HomeRedirect to='/' />
    }

  ]
}

export default MainRoutes
