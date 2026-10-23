import React, { useState } from 'react';

export default function SchemeFaqsCard({
  faqs = [],
  setFaqs,
  showToast
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const handleAdd = () => {
    if (!question.trim() || !answer.trim()) return;
    const newId = `faq-${Date.now()}`;
    setFaqs(prev => [
      ...prev,
      {
        id: newId,
        question: question.trim(),
        answer: answer.trim()
      }
    ]);
    setExpandedFaqId(newId);
    setQuestion('');
    setAnswer('');
    setIsAdding(false);
    if (showToast) showToast('FAQ added!', 'success');
  };

  const handleRemove = (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (showToast) showToast('FAQ removed.', 'info');
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
            Frequently Asked Questions ({faqs.length})
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary, #64748B)', margin: '2px 0 0' }}>
            Helpful answers to common applicant queries
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
          + Add FAQ
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
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Question (e.g. What is the minimum grant funding?)..."
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
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Detailed answer for applicants..."
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
                setQuestion('');
                setAnswer('');
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
              Save FAQ
            </button>
          </div>
        </div>
      )}

      <div
        className="scheme-card-content-scroll"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4
        }}
      >
        {faqs.length === 0 && !isAdding && (
          <div style={{ fontSize: 12.5, color: 'var(--text-placeholder, #94A3B8)', fontStyle: 'italic', padding: '6px 0' }}>
            No FAQs added yet. Click &quot;+ Add FAQ&quot; to provide quick answers.
          </div>
        )}
        {faqs.map(faq => {
          const isExpanded = expandedFaqId === faq.id;
          return (
            <div
              key={faq.id}
              style={{
                background: 'var(--bg-surface-subtle, #F8FAFC)',
                borderRadius: 10,
                border: '1px solid var(--border-subtle, #F1F5F9)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, paddingRight: 8 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: 'var(--brand-100, #EDE9FE)',
                      color: 'var(--knotnex-primary, #6336EB)',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    Q
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 650, color: 'var(--text-primary, #1E1B4B)' }}>
                    {faq.question}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="2.5"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(faq.id);
                    }}
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
                    title="Remove FAQ"
                  >
                    &times;
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div
                  style={{
                    padding: '8px 12px 12px 40px',
                    fontSize: 12.5,
                    color: 'var(--text-secondary, #475569)',
                    lineHeight: 1.5,
                    borderTop: '1px solid var(--border-subtle, #EDF2F7)',
                    background: 'var(--bg-surface, #FFFFFF)'
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
