import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return <div className="toast-container" id="toastContainer" />;

  return (
    <div
      className="toast-container"
      id="toastContainer"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        width: 'auto',
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-notification toast-${toast.type || 'info'}`}
          style={{
            pointerEvents: 'auto',
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '11px 18px',
            borderRadius: '14px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13.5px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            maxWidth: '90vw',
            animation: 'toastBottomPop 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '18px',
              color: toast.type === 'success' ? '#12B76A' : (toast.type === 'warning' ? '#F79009' : (toast.type === 'error' ? '#F04438' : '#A78BFA')),
              flexShrink: 0
            }}
          >
            {toast.type === 'success' ? 'check_circle' : (toast.type === 'warning' ? 'warning' : (toast.type === 'error' ? 'error' : 'info'))}
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0 2px 0 6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              transition: 'color 0.15s ease'
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
