import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTH_HAS_ACCOUNT_KEY = 'kd_sarees_has_account'

export default function AuthEntryPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const hasAccount = localStorage.getItem(AUTH_HAS_ACCOUNT_KEY) === 'true'

    navigate(hasAccount ? '/login' : '/signup', { replace: true })
  }, [navigate])

  return null
}
