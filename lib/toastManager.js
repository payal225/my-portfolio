// Lightweight event emitter for global HUD toast notifications

class ToastManager {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  show(toast) {
    const id = Date.now() + Math.random();
    const item = {
      id,
      title: toast.title || 'System Notification',
      message: toast.message || '',
      type: toast.type || 'info', // 'info' | 'success' | 'warn'
      duration: toast.duration || 4000,
    };

    for (const listener of this.listeners) {
      listener({ action: 'add', toast: item });
    }
    return id;
  }

  dismiss(id) {
    for (const listener of this.listeners) {
      listener({ action: 'remove', id });
    }
  }
}

export const toastManager = new ToastManager();

export function showToast(toast) {
  return toastManager.show(toast);
}
