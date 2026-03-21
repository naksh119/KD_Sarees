import { Navigate, Outlet } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'kd_sarees_admin_session'
const ADMIN_TOKEN_KEY = 'kd_sarees_admin_token'

function hasAdminAccess() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true' && Boolean(localStorage.getItem(ADMIN_TOKEN_KEY))
}

export default function AdminRoute() {
  if (!hasAdminAccess()) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
