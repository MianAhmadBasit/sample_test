import { Check, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex items-start justify-between gap-3 bg-[#252525] text-[#F8F5EF] px-4 py-3.5 rounded-lg shadow-lg border border-white/10 transition-all duration-200"
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="mt-0.5 shrink-0 text-[#A6B49A]" aria-hidden="true">
              {toast.variant === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug tracking-[0.01em] truncate">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-[#E8DED2]/85 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-[#E8DED2]/70 hover:text-white p-1 -mr-1 -mt-1 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
