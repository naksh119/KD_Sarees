import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import AuthEntryPage from './pages/AuthEntryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import UserInfoPage from './pages/UserInfoPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CartPage from './pages/CartPage'
import FavoritesItem from './pages/FavoritesItem'

const isUserLoggedIn = () =>
  Boolean(localStorage.getItem('kd_sarees_token') && localStorage.getItem('kd_sarees_user'))
const isAdminLoggedIn = () =>
  localStorage.getItem('kd_sarees_admin_session') === 'true' && Boolean(localStorage.getItem('kd_sarees_admin_token'))

function GuestOnlyRoute({ children }) {
  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return isUserLoggedIn() ? <Navigate to="/profile" replace /> : children
}

function ProtectedUserRoute({ children }) {
  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return isUserLoggedIn() ? children : <Navigate to="/auth" replace />
}

function App() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/auth"
          element={
            <GuestOnlyRoute>
              <AuthEntryPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnlyRoute>
              <SignupPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestOnlyRoute>
              <ForgotPasswordPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestOnlyRoute>
              <ResetPasswordPage />
            </GuestOnlyRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <UserInfoPage />
            </ProtectedUserRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesItem />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route
            path="/auth"
            element={
              <GuestOnlyRoute>
                <AuthEntryPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage isPopup />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnlyRoute>
                <SignupPage isPopup />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestOnlyRoute>
                <ForgotPasswordPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestOnlyRoute>
                <ResetPasswordPage />
              </GuestOnlyRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      ) : null}
    </>
  )
}

export default App
