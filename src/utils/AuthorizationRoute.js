import AuthContext from 'context/AuthContext'
import { isEmpty } from 'lodash'
import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { permissionsMap } from './checkPermissions'

function AuthorizationRoute (props) {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  const checkPermission = () => {
    if (!user) {
      return false
    }
    const localPermissions = [...user?.permission]
    if (user?.permission.length === 0) {
      return true
    }
    for (let i = 0; i < localPermissions?.length; i++) {
      const pm = permissionsMap?.[localPermissions?.[i]?.manager]
      if (location?.pathname.includes(pm)) {
        return localPermissions[i].view
      }
    }
    return false
  }

  return (
    <>
      {
        !isEmpty(user) ? (<> {checkPermission() ? (<>{props?.children}</>) : (<Navigate to='/' />)}</>) : (<Navigate to='/login' />)
      }
    </>
  )
}

export default AuthorizationRoute
