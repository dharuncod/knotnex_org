import React from 'react';

export default function BackButton({
  onClick,
  label = 'Back',
  id,
  className = '',
  style = {},
  title
}) {
  return (
    <button
      type="button"
      id={id}
      className={`knotnex-back-btn ${className}`}
      onClick={onClick}
      title={title || label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'none',
        border: 'none',
        padding: '6px 0',
        cursor: 'pointer',
        color: '#1E1B4B',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'inherit',
        transition: 'color 0.15s ease',
        boxShadow: 'none',
        outline: 'none',
        ...style
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#6336EB')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#1E1B4B')}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
