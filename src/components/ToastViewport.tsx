import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useDataStore } from '../context/DataContext';

// Menampilkan toast dari DataContext (state-nya sudah ada, belum ada renderer).
export const ToastViewport: React.FC = () => {
  const { toasts, dismissToast } = useDataStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertTriangle : Info;
        const tone =
          toast.type === 'success'
            ? 'border-[#CAAA98]/40 text-[#CAAA98]'
            : toast.type === 'error'
              ? 'border-red-800/60 text-red-300'
              : 'border-[#9A8678]/50 text-[#CAAA98]';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl border bg-[#202940]/95 backdrop-blur-md shadow-2xl text-xs font-medium ${tone}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
