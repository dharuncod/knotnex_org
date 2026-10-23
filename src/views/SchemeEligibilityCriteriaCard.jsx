import React, { useState } from 'react';

export default function SchemeEligibilityCriteriaCard({
  eligibilityCriteria = [],
  setEligibilityCriteria,
  showToast
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');

  const handleAdd = () => {
    if (!newRuleText.trim()) return;
    setEligibilityCriteria(prev => [...prev, newRuleText.trim()]);
    setNewRuleText('');
    setIsAdding(false);
    if (showToast) showToast('Eligibility rule added!', 'success');
  };

  const handleRemove = (idx) => {
    setEligibilityCriteria(prev => prev.filter((_, i) => i !== idx));
    if (showToast) showToast('Rule removed.', 'info');
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
            Eligibility Criteria {eligibilityCriteria.length > 0 && `(${eligibilityCriteria.length})`}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary, #64748B)', margin: '2px 0 0' }}>
            Guidelines &amp; attendee requirements
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
          + Add Rule
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
            value={newRuleText}
            onChange={e => setNewRuleText(e.target.value)}
            placeholder="e.g. Open to all students & researchers..."
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
                setNewRuleText('');
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
        {eligibilityCriteria.length === 0 && !isAdding && (
          <div style={{ fontSize: 12.5, color: 'var(--text-placeholder, #94A3B8)', fontStyle: 'italic', padding: '6px 0' }}>
            No eligibility criteria specified yet. Click &quot;+ Add Rule&quot; to add guidelines.
          </div>
        )}
        {eligibilityCriteria.map((rule, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 10,
              paddingBottom: 8,
              borderBottom: '1px solid var(--border-subtle, #F1F5F9)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--text-primary, #334155)', lineHeight: 1.5 }}>
              <span style={{ color: '#6336EB', fontWeight: 800 }}>•</span>
              <span>{rule}</span>
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
              title="Remove rule"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
