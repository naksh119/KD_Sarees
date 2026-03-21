import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const AUTH_HAS_ACCOUNT_KEY = 'kd_sarees_has_account'

export default function AuthEntryPage() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hasAccount = localStorage.getItem(AUTH_HAS_ACCOUNT_KEY) === 'true'

    navigate(hasAccount ? '/login' : '/signup', {
      replace: true,
      state: location.state,
    })
  }, [location.state, navigate])

  return null
}
