import React from 'react';

export default function SessionItem({ session, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
      {/* Minimalist Timeline Indicator (pure geometry, no icons) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6336EB', border: '2px solid #EDE9FE' }} />
        <div style={{ width: 2, flex: 1, background: '#E2E8F0', marginTop: 4, minHeight: 36 }} />
      </div>

      {/* Session Card */}
      <div style={{
        flex: 1,
        background: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E2E8F0',
        padding: '12px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.15s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {session.category && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6336EB',
                background: 'rgba(99, 54, 235, 0.08)',
                padding: '2px 8px',
                borderRadius: 4
              }}>
                {session.category}
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E1B4B', fontFamily: 'monospace', background: '#F8FAFC', padding: '2px 8px', borderRadius: 4, border: '1px solid #E2E8F0' }}>
              {session.time}
            </span>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>•</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>{session.date}</span>
            {session.speaker && (
              <>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>•</span>
                <span style={{ fontSize: 12, color: '#475569' }}>
                  Speaker: <strong style={{ fontWeight: 600 }}>{session.speaker}</strong>
                </span>
              </>
            )}
            {session.location && (
              <>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>•</span>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Venue: {session.location}
                </span>
              </>
            )}
          </div>

          {/* Text-only Action Buttons (NO icons) */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => onEdit(session)}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                color: '#6336EB',
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 10px',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99, 54, 235, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(session.id)}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                color: '#EF4444',
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 10px',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
            >
              Delete
            </button>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: session.description ? 3 : 0 }}>
          {session.title}
        </div>
        {session.description && (
          <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.5 }}>
            {session.description}
          </div>
        )}
      </div>
    </div>
  );
}
