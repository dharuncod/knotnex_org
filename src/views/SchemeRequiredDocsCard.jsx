import React, { useState } from 'react';

export default function SchemeRequiredDocsCard({
  requirements = [],
  setRequirements,
  showToast
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDocText, setNewDocText] = useState('');

  const handleAdd = () => {
    if (!newDocText.trim()) return;
    setRequirements(prev => [...prev, newDocText.trim()]);
    setNewDocText('');
    setIsAdding(false);
    if (showToast) showToast('Required document added!', 'success');
  };

  const handleRemove = (idx) => {
    setRequirements(prev => prev.filter((_, i) => i !== idx));
    if (showToast) showToast('Document removed.', 'info');
  };

  return (
    <div
      className="scheme-criteria-card-box"
      style={{
        background: 'var(--knotnex-card-bg, #FFFFFF)',
        borderRadius: 16,
        border: '1px solid var(--border-default, #E2E8F0)',
        padding: '20px 22px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexShrink: 0 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary, #1E1B4B)', margin: 0 }}>
            Required Documents {requirements.length > 0 && `(${requirements.length})`}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary, #64748B)', margin: '2px 0 0' }}>
            Mandatory certificates &amp; paperwork checklist
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6336EB',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          + Add Document
        </button>
      </div>

      {isAdding && (
        <div
          className="scheme-card-add-box"
          style={{
            background: 'var(--bg-surface-subtle, #F8FAFC)',
            padding: 12,
            borderRadius: 10,
            border: '1px solid var(--border-default, #E2E8F0)',
            marginBottom: 12,
            flexShrink: 0
          }}
        >
          <input
            type="text"
            value={newDocText}
            onChange={e => setNewDocText(e.target.value)}
            placeholder="e.g. Identity Proof (Aadhaar / Voter ID / Passport)..."
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
            }}
            style={{
              width: '100%',
              height: 36,
              padding: '0 10px',
              borderRadius: 6,
              border: '1px solid var(--border-strong, #CBD5E1)',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
              background: 'var(--bg-surface, #FFFFFF)',
              color: 'var(--text-primary, #1E1B4B)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewDocText('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: 'var(--text-tertiary, #64748B)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              style={{
                background: '#6336EB',
                color: '#FFF',
                border: 'none',
                borderRadius: 6,
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div
        className="scheme-card-content-scroll"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4
        }}
      >
        {requirements.length === 0 && !isAdding && (
          <div style={{ fontSize: 12.5, color: 'var(--text-placeholder, #94A3B8)', fontStyle: 'italic', padding: '6px 0' }}>
            No required documents specified yet. Click &quot;+ Add Document&quot; to add checklist items.
          </div>
        )}
        {requirements.map((doc, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '10px 12px',
              background: 'var(--bg-surface-subtle, #F8FAFC)',
              borderRadius: 10,
              border: '1px solid var(--border-subtle, #F1F5F9)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--text-primary, #334155)' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'var(--brand-100, #EDE9FE)',
                  color: 'var(--knotnex-primary, #6336EB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary, #1E1B4B)' }}>{doc}</span>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-placeholder, #94A3B8)',
                cursor: 'pointer',
                fontSize: 16,
                padding: '0 4px',
                lineHeight: 1
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-placeholder, #94A3B8)'; }}
              title="Remove document"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
