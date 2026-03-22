import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3da2]/40"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <FaEyeSlash className="h-4 w-4" aria-hidden /> : <FaEye className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  )
}
