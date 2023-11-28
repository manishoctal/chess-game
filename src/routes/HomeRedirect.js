import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

export const HomeRedirect = ({ to }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [])
}
