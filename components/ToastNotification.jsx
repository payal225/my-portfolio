'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X, Radio } from 'lucide-react';
import { toastManager } from '../lib/toastManager';
import { soundEngine } from '../lib/soundEffects';

export default function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(({ action, toast, id }) => {
      if (action === 'add') {
        setToasts((prev) => [...prev, toast]);
        soundEngine.playSuccess();

        // Auto remove after duration
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration || 4000);
      } else if (action === 'remove') {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="hud-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`hud-toast-item toast-${toast.type}`}>
          <div className="toast-icon-wrapper">
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} color="#00f7ff" />
            ) : toast.type === 'warn' ? (
              <AlertCircle size={18} color="#ec4899" />
            ) : (
              <Info size={18} color="#a855f7" />
            )}
          </div>
          <div className="toast-content">
            <div className="toast-header-row">
              <span className="toast-title">{toast.title}</span>
              <span className="toast-tag">
                <Radio size={10} className="pulse-cyan" />
                <span>ONLINE</span>
              </span>
            </div>
            {toast.message && <p className="toast-message">{toast.message}</p>}
          </div>
          <button
            onClick={() => toastManager.dismiss(toast.id)}
            className="toast-close-btn"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
