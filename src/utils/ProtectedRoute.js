import AuthContext from 'context/AuthContext'
import { isEmpty } from 'lodash'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute (props) {
  const { user } = useContext(AuthContext)
  return (
    <>{!isEmpty(user) ? <>{props?.children}</> : <Navigate to='/login' />}</>
  )
}

export default ProtectedRoute
