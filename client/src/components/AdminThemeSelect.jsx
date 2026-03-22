import { useEffect, useRef, useState } from 'react'

const triggerClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base sm:py-2.5 sm:text-sm text-left flex items-center justify-between gap-2 transition focus:border-[#191970] focus:outline-none focus:ring-1 focus:ring-[#191970]/35'

const optionClass =
  'w-full px-3 py-2.5 text-sm text-left text-[#2c1810] transition-colors hover:bg-[#c4a77d]/18 focus:bg-[#c4a77d]/18 focus:outline-none'

const optionSelectedClass = 'bg-[#c4a77d]/28 font-medium hover:bg-[#c4a77d]/32'

/**
 * Custom dropdown for admin forms — avoids native select OS blue highlight.
 * Styling matches admin theme (gold accent #c4a77d, text #2c1810, focus #191970).
 */
export default function AdminThemeSelect({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  emptyStateLabel = 'No options available',
  disabled = false,
  id,
  allowEmpty = true,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const selected = options.find((o) => o.value === value)
  const selectedLabel = selected?.label ?? ''
  const showPlaceholder = allowEmpty ? !value || value === '' : !selectedLabel
  const hasOptions = options.length > 0
  const isBlocked = disabled || !hasOptions

  const displayText = !hasOptions
    ? emptyStateLabel
    : showPlaceholder
      ? placeholder
      : selectedLabel || String(value)

  const handlePick = (next) => {
    if (disabled) return
    onChange(next)
    setOpen(false)
  }

  const toggle = () => {
    if (isBlocked) return
    setOpen((o) => !o)
  }

  const onKeyDown = (e) => {
    if (isBlocked) return
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={isBlocked}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${triggerClass} ${isBlocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={showPlaceholder && hasOptions ? 'text-gray-500' : 'text-gray-900'}>{displayText}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#2c1810] transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && hasOptions && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {allowEmpty && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ''}
                className={`${optionClass} ${value === '' ? optionSelectedClass : ''}`}
                onClick={() => handlePick('')}
              >
                {placeholder}
              </button>
            </li>
          )}
          {options.map((opt) => (
            <li key={String(opt.value)} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                className={`${optionClass} ${value === opt.value ? optionSelectedClass : ''}`}
                onClick={() => handlePick(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
