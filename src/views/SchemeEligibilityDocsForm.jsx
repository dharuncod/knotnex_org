import React, { useState } from 'react';

export default function SchemeEligibilityDocsForm({
  eligibilityCriteria = [],
  setEligibilityCriteria,
  requirements = [],
  setRequirements,
  showToast
}) {
  // Local state for adding Eligibility Criteria
  const [newCriteriaText, setNewCriteriaText] = useState('');
  const [isAddingCriteria, setIsAddingCriteria] = useState(false);

  // Local state for adding Required Documents
  const [newRequirementText, setNewRequirementText] = useState('');
  const [isAddingRequirement, setIsAddingRequirement] = useState(false);

  // Handlers for Eligibility Criteria
  const handleAddCriteria = () => {
    if (!newCriteriaText.trim()) return;
    setEligibilityCriteria((prev) => [...prev, newCriteriaText.trim()]);
    setNewCriteriaText('');
    setIsAddingCriteria(false);
    if (showToast) showToast('Eligibility criterion added', 'success');
  };

  const handleRemoveCriteria = (index) => {
    setEligibilityCriteria((prev) => prev.filter((_, i) => i !== index));
    if (showToast) showToast('Criterion removed', 'info');
  };

  // Handlers for Requirements (Documents)
  const handleAddRequirement = () => {
    if (!newRequirementText.trim()) return;
    setRequirements((prev) => [...prev, newRequirementText.trim()]);
    setNewRequirementText('');
    setIsAddingRequirement(false);
    if (showToast) showToast('Required document added', 'success');
  };

  const handleRemoveRequirement = (index) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
    if (showToast) showToast('Document removed', 'info');
  };

  return (
    <div
      className="studio-card scheme-eligibility-docs-component"
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <div>
          <h3 className="studio-card-title">Eligibility &amp; Required Documents</h3>
          <p className="studio-card-desc">Specify eligibility criteria and mandatory documents for applicants</p>
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
            1. Section: Eligibility Criteria
           ======================================================== */}
        <div className="form-group">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <label
              className="form-label"
              style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}
            >
              Eligibility Criteria {eligibilityCriteria.length > 0 && `(${eligibilityCriteria.length})`}
            </label>
            <button
              type="button"
              id="btnAddEligibilityCriteriaToggle"
              onClick={() => setIsAddingCriteria(true)}
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
              + Add Criteria
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {eligibilityCriteria.length === 0 ? (
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
                No criteria added yet. Click &ldquo;+ Add Criteria&rdquo; above.
              </div>
            ) : (
              eligibilityCriteria.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, paddingRight: '8px' }}>
                    <span style={{ color: '#6336EB', fontSize: '16px', lineHeight: '20px' }}>&bull;</span>
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(idx)}
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
                    title="Remove item"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {isAddingCriteria && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                autoFocus
                id="inpNewCriteria"
                value={newCriteriaText}
                onChange={(e) => setNewCriteriaText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCriteria(); }}
                placeholder="e.g. Indian citizen aged 18 to 35 years..."
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #6336EB',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                id="btnSubmitAddCriteria"
                onClick={handleAddCriteria}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  background: '#6336EB',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 650,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingCriteria(false); setNewCriteriaText(''); }}
                style={{
                  height: '36px',
                  padding: '0 10px',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            2. Section: Required Documents Checklist
           ======================================================== */}
        <div className="form-group" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <label
              className="form-label"
              style={{ margin: 0, fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}
            >
              Required Documents {requirements.length > 0 && `(${requirements.length})`}
            </label>
            <button
              type="button"
              id="btnAddRequirementToggle"
              onClick={() => setIsAddingRequirement(true)}
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
              + Add Document
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {requirements.length === 0 ? (
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
                No required documents added yet. Click &ldquo;+ Add Document&rdquo; above.
              </div>
            ) : (
              requirements.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, paddingRight: '8px' }}>
                    <span style={{ color: '#6336EB', fontSize: '16px', lineHeight: '20px' }}>&bull;</span>
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{doc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
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
                    title="Remove document"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {isAddingRequirement && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                autoFocus
                id="inpNewRequirement"
                value={newRequirementText}
                onChange={(e) => setNewRequirementText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddRequirement(); }}
                placeholder="e.g. Aadhaar Card (linked with mobile number)..."
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #6336EB',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                id="btnSubmitAddRequirement"
                onClick={handleAddRequirement}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  background: '#6336EB',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 650,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingRequirement(false); setNewRequirementText(''); }}
                style={{
                  height: '36px',
                  padding: '0 10px',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
