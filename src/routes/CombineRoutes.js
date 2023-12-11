import { useRoutes } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from 'context/AuthContext'
// routes
import MainRoutes from './MainRoutes'
import AdminRoutes from './AdminRoutes'

export default function CombineRoutes () {
  const { user } = useContext(AuthContext)

  const checkRoles = {
    admin: AdminRoutes,
    subAdmin: AdminRoutes
    // "company": CompanyRoutes
  }
  return useRoutes([user ? checkRoles[user?.role] : MainRoutes], process.env.BASENAME)
}
