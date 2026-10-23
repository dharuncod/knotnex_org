import React, { useState } from 'react';

export default function SchemeProcessStepsCard({
  applicationSteps = [],
  setApplicationSteps,
  showToast
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDesc, setStepDesc] = useState('');

  const handleAdd = () => {
    if (!stepTitle.trim()) return;
    setApplicationSteps(prev => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        stepNumber: prev.length + 1,
        title: stepTitle.trim(),
        description: stepDesc.trim()
      }
    ]);
    setStepTitle('');
    setStepDesc('');
    setIsAdding(false);
    if (showToast) showToast('Application step added!', 'success');
  };

  const handleRemove = (id) => {
    setApplicationSteps(prev =>
      prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
    );
    if (showToast) showToast('Step removed.', 'info');
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
            How to Apply (Process Steps) {applicationSteps.length > 0 && `(${applicationSteps.length})`}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary, #64748B)', margin: '2px 0 0' }}>
            Step-by-step submission &amp; verification guide
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
          + Add Step
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
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0
          }}
        >
          <input
            type="text"
            value={stepTitle}
            onChange={e => setStepTitle(e.target.value)}
            placeholder="Step title (e.g. Online Registration & Profile Verification)..."
            autoFocus
            style={{
              height: 34,
              padding: '0 10px',
              borderRadius: 6,
              border: '1px solid var(--border-strong, #CBD5E1)',
              fontSize: 13,
              outline: 'none',
              background: 'var(--bg-surface, #FFFFFF)',
              color: 'var(--text-primary, #1E1B4B)'
            }}
          />
          <textarea
            value={stepDesc}
            onChange={e => setStepDesc(e.target.value)}
            placeholder="Step instructions & document checklist (optional)..."
            rows={2}
            style={{
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid var(--border-strong, #CBD5E1)',
              fontSize: 12.5,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              background: 'var(--bg-surface, #FFFFFF)',
              color: 'var(--text-primary, #1E1B4B)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setStepTitle('');
                setStepDesc('');
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
              Save Step
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
        {applicationSteps.length === 0 && !isAdding && (
          <div style={{ fontSize: 12.5, color: 'var(--text-placeholder, #94A3B8)', fontStyle: 'italic', padding: '6px 0' }}>
            No application steps specified yet. Click &quot;+ Add Step&quot; to guide applicants.
          </div>
        )}
        {applicationSteps.map((step, idx) => (
          <div
            key={step.id || idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'var(--bg-surface-subtle, #F8FAFC)',
              borderRadius: 10,
              border: '1px solid var(--border-subtle, #F1F5F9)',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'var(--brand-100, #EDE9FE)',
                  color: 'var(--knotnex-primary, #6336EB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 1
                }}
              >
                {step.stepNumber || idx + 1}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #1E1B4B)' }}>
                  {step.title}
                </div>
                {step.description && (
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary, #64748B)', marginTop: 2, lineHeight: 1.4 }}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(step.id)}
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
              title="Remove step"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
