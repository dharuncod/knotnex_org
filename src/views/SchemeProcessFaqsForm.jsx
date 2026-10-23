import React, { useState } from 'react';

export default function SchemeProcessFaqsForm({
  applicationSteps = [],
  setApplicationSteps,
  faqs = [],
  setFaqs,
  showToast
}) {
  // Local state for adding Process Steps
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);

  // Local state for adding FAQs
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Handlers for Application Steps
  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    setApplicationSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        stepNumber: prev.length + 1,
        title: newStepTitle.trim(),
        description: newStepDesc.trim()
      }
    ]);
    setNewStepTitle('');
    setNewStepDesc('');
    setIsAddingStep(false);
    if (showToast) showToast('Process step added', 'success');
  };

  const handleRemoveStep = (id) => {
    setApplicationSteps((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
    );
    if (showToast) showToast('Step removed', 'info');
  };

  // Handlers for FAQs
  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newId = `faq-${Date.now()}`;
    setFaqs((prev) => [
      ...prev,
      {
        id: newId,
        question: newFaqQuestion.trim(),
        answer: newFaqAnswer.trim()
      }
    ]);
    setExpandedFaqId(newId);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setIsAddingFaq(false);
    if (showToast) showToast('FAQ added', 'success');
  };

  const handleRemoveFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (showToast) showToast('FAQ removed', 'info');
  };

  return (
    <div
      className="studio-card scheme-process-faqs-component"
      style={{
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Header */}
      <div
        className="studio-card-header"
        style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
      >
        <div className="studio-card-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </div>
        <div>
          <h3 className="studio-card-title">How to Apply &amp; FAQs</h3>
          <p className="studio-card-desc">Define step-by-step application process and frequently asked questions</p>
        </div>
      </div>

      <div
        className="studio-card-body"
        style={{
          padding: '22px',
          gap: '22px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        {/* ========================================================
            1. Section: How to Apply (Process Steps)
           ======================================================== */}
        <div className="form-group">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <label
              className="form-label"
              style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}
            >
              How to Apply (Process Steps) {applicationSteps.length > 0 && `(${applicationSteps.length})`}
            </label>
            <button
              type="button"
              id="btnAddStepToggle"
              onClick={() => setIsAddingStep(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6336EB',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              + Add Step
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {applicationSteps.length === 0 ? (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  color: '#64748B'
                }}
              >
                No application steps configured yet. Click &ldquo;+ Add Step&rdquo; above.
              </div>
            ) : (
              applicationSteps.map((step) => (
                <div
                  key={step.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 750,
                          background: '#EDE9FE',
                          color: '#6336EB',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}
                      >
                        STEP {step.stepNumber}
                      </span>
                      <strong style={{ fontSize: '13.5px', color: '#1E1B4B' }}>{step.title}</strong>
                    </div>
                    {step.description && (
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>
                        {step.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      padding: '0 4px',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                    title="Remove step"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {isAddingStep && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: '#F1F5F9',
                marginTop: '10px'
              }}
            >
              <input
                type="text"
                autoFocus
                id="inpNewStepTitle"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder={`Step ${applicationSteps.length + 1} Title (e.g. Online Portal Registration)...`}
                style={{
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  background: '#FFF',
                  outline: 'none'
                }}
              />
              <textarea
                rows={2}
                id="inpNewStepDesc"
                value={newStepDesc}
                onChange={(e) => setNewStepDesc(e.target.value)}
                placeholder="Step description / instructions..."
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  resize: 'vertical',
                  background: '#FFF',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddingStep(false); setNewStepTitle(''); setNewStepDesc(''); }}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="btnSubmitAddStep"
                  onClick={handleAddStep}
                  style={{
                    background: '#6336EB',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add Step
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            2. Section: Frequently Asked Questions (FAQs)
           ======================================================== */}
        <div className="form-group" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <label
              className="form-label"
              style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}
            >
              Frequently Asked Questions {faqs.length > 0 && `(${faqs.length})`}
            </label>
            <button
              type="button"
              id="btnAddFaqToggle"
              onClick={() => setIsAddingFaq(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6336EB',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              + Add FAQ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.length === 0 ? (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  color: '#64748B'
                }}
              >
                No FAQs added yet. Click &ldquo;+ Add FAQ&rdquo; above.
              </div>
            ) : (
              faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: isExpanded ? '#F8FAFC' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 650, color: '#1E1B4B', flex: 1, paddingRight: '8px' }}>
                        {faq.question}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          &#9662;
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFaq(faq.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: 1,
                            padding: '0 4px',
                            transition: 'color 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                          title="Remove FAQ"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '12px 14px', fontSize: '12.5px', color: '#64748B', lineHeight: 1.55, borderTop: '1px solid #F1F5F9', background: '#FAFAFD' }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {isAddingFaq && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: '#F1F5F9',
                marginTop: '10px'
              }}
            >
              <input
                type="text"
                autoFocus
                id="inpNewFaqQuestion"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                placeholder="Question (e.g. Is there any application fee?)..."
                style={{
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  background: '#FFF',
                  outline: 'none'
                }}
              />
              <textarea
                rows={2}
                id="inpNewFaqAnswer"
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                placeholder="Answer details..."
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  resize: 'vertical',
                  background: '#FFF',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddingFaq(false); setNewFaqQuestion(''); setNewFaqAnswer(''); }}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="btnSubmitAddFaq"
                  onClick={handleAddFaq}
                  style={{
                    background: '#6336EB',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add FAQ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
