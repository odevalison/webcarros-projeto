import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'
import { Navigate, Outlet } from 'react-router-dom'

export const Private = () => {
  const { isSigned, loadingAuth } = useContext(AuthContext)

  if (loadingAuth) {
    return <div></div>
  } else if (!isSigned) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}
