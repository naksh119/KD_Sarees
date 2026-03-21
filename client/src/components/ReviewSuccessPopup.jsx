import { useMemo } from 'react';

const CONFETTI_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

export default function ReviewSuccessPopup({
  isOpen,
  onClose,
  message = 'Thank you for your feedback',
  description = 'Your review has been submitted successfully.',
  variant = 'success',
  extraFooter = null,
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          id: i,
          left: 50 + side * (8 + (i % 7) * 5),
          xDrift: side * (10 + (i % 6) * 8),
          delay: (i % 6) * 0.08,
          duration: 1.5 + (i % 5) * 0.18,
          rotate: 90 + (i % 9) * 25,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
      }),
    []
  );

  if (!isOpen) return null;

  const isError = variant === 'error';
  const iconWrapperClass = 'mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600';
  const buttonClass = isError
    ? 'mt-5 rounded-md bg-[#c4a77d] px-5 py-2 text-sm font-semibold text-[#2c1810] transition-colors hover:bg-[#b8956a]'
    : 'mt-5 rounded-md bg-[#c4a77d] px-5 py-2 text-sm font-semibold text-[#2c1810] transition-colors hover:bg-[#b8956a]';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close success popup"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        role="status"
        aria-live="polite"
        className="relative z-[121] w-full max-w-xs overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl"
      >
        {!isError ? (
          <div className={iconWrapperClass}>
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : null}

        <h3 className="text-lg font-bold text-slate-900">{message}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>

        {extraFooter ? <div className="mt-4">{extraFooter}</div> : null}

        <button
          type="button"
          onClick={onClose}
          className={buttonClass}
        >
          Close
        </button>

        {!isError ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {pieces.map((piece) => (
              <span
                key={piece.id}
                className="confetti-fountain-piece"
                style={{
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  '--x-drift': `${piece.xDrift}px`,
                  '--rotate-start': `${piece.rotate}deg`,
                  backgroundColor: piece.color,
                }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <style>{`
        .confetti-fountain-piece {
          position: absolute;
          bottom: -10px;
          width: 7px;
          height: 14px;
          border-radius: 2px;
          opacity: 0;
          animation-name: confetti-fountain-burst;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }
        @keyframes confetti-fountain-burst {
          0% {
            transform: translate(0, 0) scale(0.85) rotate(var(--rotate-start));
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          45% {
            transform: translate(calc(var(--x-drift) * 0.45), -75px) scale(1) rotate(140deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x-drift), -210px) scale(0.95) rotate(310deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
