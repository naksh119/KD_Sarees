const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9]{10,15}$/
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/

export const normalizeName = (value = '') => value.replace(/\s+/g, ' ').trim()
export const normalizeEmail = (value = '') => value.trim().toLowerCase()
export const normalizePhone = (value = '') => value.replace(/[\s-]/g, '').trim()

export const isValidName = (name) => NAME_REGEX.test(normalizeName(name))
export const isValidEmail = (email) => EMAIL_REGEX.test(normalizeEmail(email))
export const isValidPhone = (phone) => PHONE_REGEX.test(normalizePhone(phone))
export const isStrongPassword = (password = '') => STRONG_PASSWORD_REGEX.test(password)

export const validateSignupForm = ({ name, email, password, confirmPassword }) => {
  const normalizedName = normalizeName(name)
  const normalizedEmail = normalizeEmail(email)

  if (!isValidName(normalizedName)) {
    return 'Enter a valid full name (2-60 letters; spaces and . \' - allowed).'
  }

  if (!isValidEmail(normalizedEmail)) {
    return 'Enter a valid email address.'
  }

  if (!isStrongPassword(password)) {
    return 'Password must be 8-64 characters with uppercase, lowercase, number, and special character.'
  }

  if (password !== String(confirmPassword || '')) {
    return 'Password and confirm password must match.'
  }

  return ''
}

export const validateLoginForm = ({ identifier, password }) => {
  const id = String(identifier || '').trim()

  if (!id || (!isValidEmail(id) && !isValidPhone(id))) {
    return 'Enter a valid email or mobile number.'
  }

  if (!isStrongPassword(password)) {
    return 'Password format is invalid.'
  }

  return ''
}
