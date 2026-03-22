export default function ConfirmPopup({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation popup"
        className="absolute inset-0 bg-black/45"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-[101] w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#c4a77d] px-4 py-2 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
