import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/common/BackButton';

export default function EventRegistrationFormBuilder({
  draftEvent,
  onPublishComplete,
  onBackToDetails,
  onSaveDraft,
  addToast
}) {
  useEffect(() => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) {
        mainArea.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    const t = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 200);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  const [emergencyContactEnabled, setEmergencyContactEnabled] = useState(true);
  const [accommodationsEnabled, setAccommodationsEnabled] = useState(true);
  const [accommodations, setAccommodations] = useState([
    { id: 'acc-1', label: 'Wheelchair Ramp & Step-Free Seating', checked: true },
    { id: 'acc-2', label: 'Indian Sign Language (ISL) Interpreter', checked: true },
    { id: 'acc-3', label: 'Braille / Tactile Agenda & Materials', checked: true },
    { id: 'acc-4', label: 'Assistive Transport & Dedicated Parking', checked: true },
    { id: 'acc-5', label: 'Personal Volunteer Escort / Guide', checked: true },
    { id: 'acc-6', label: 'Free Caregiver / Companion Pass (1 Person)', checked: true }
  ]);

  // Inline custom accommodation state (NO POPUP)
  const [isAddingAccommodation, setIsAddingAccommodation] = useState(false);
  const [newAccommodationText, setNewAccommodationText] = useState('');

  const [customQuestions, setCustomQuestions] = useState([
    { id: 'cq-1', title: 'Dietary Preferences or Meal Choice', type: 'DROPDOWN', required: true, hint: 'Choices: Vegetarian, Vegan, Jain Meal' },
    { id: 'cq-2', title: 'Event T-Shirt Size (for Welcome Kit)', type: 'DROPDOWN', required: true, hint: 'Choices: S (Small), M (Medium), L (Large), XL' },
    { id: 'cq-3', title: 'Any specific assistive tools you are bringing?', type: 'SHORT TEXT', required: false, hint: 'e.g. Motorized wheelchair, White cane, Screen reader...' }
  ]);

  const [instantConfirmation, setInstantConfirmation] = useState(true);
  const [capRegistrations, setCapRegistrations] = useState(false);
  const [capacityLimit, setCapacityLimit] = useState(draftEvent?.capacity || '');
  const [enableWaitlist, setEnableWaitlist] = useState(true);

  // New question form state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('SHORT TEXT');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [newQuestionHint, setNewQuestionHint] = useState('');

  const handleToggleAccommodation = (id) => {
    setAccommodations(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  // Inline Add Accommodation Handler (NO POPUP)
  const handleConfirmAddAccommodation = () => {
    if (!newAccommodationText.trim()) return;
    const text = newAccommodationText.trim();
    setAccommodations(prev => [...prev, { id: `acc-${Date.now()}`, label: text, checked: true }]);
    setNewAccommodationText('');
    setIsAddingAccommodation(false);
    if (addToast) addToast(`Accommodation "${text}" added!`, 'success');
  };

  const handleAddQuestion = () => {
    if (!newQuestionTitle.trim()) return;
    const newQ = {
      id: `cq-${Date.now()}`,
      title: newQuestionTitle.trim(),
      type: newQuestionType,
      required: newQuestionRequired,
      hint: newQuestionHint.trim() || 'Attendee answer'
    };
    setCustomQuestions(prev => [...prev, newQ]);
    setNewQuestionTitle('');
    setNewQuestionHint('');
    setNewQuestionRequired(false);
    setIsAddingQuestion(false);
    if (addToast) addToast('Question added to registration form!', 'success');
  };

  const handleRemoveQuestion = (id) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
    if (addToast) addToast('Question removed.', 'info');
  };

  const handleSaveDraft = () => {
    const fullEvent = {
      ...draftEvent,
      capacity: capRegistrations ? capacityLimit : 9999,
      formConfig: {
        emergencyContactEnabled,
        accommodationsEnabled,
        accommodations: accommodationsEnabled ? accommodations.filter(a => a.checked) : [],
        customQuestions,
        instantConfirmation,
        capRegistrations,
        capacityLimit,
        enableWaitlist
      }
    };
    if (onSaveDraft) {
      onSaveDraft(fullEvent);
    } else if (addToast) {
      addToast('Event draft saved to local workspace!', 'success');
    }
  };

  const handlePublish = () => {
    const fullEvent = {
      ...draftEvent,
      capacity: capRegistrations ? capacityLimit : 9999,
      formConfig: {
        emergencyContactEnabled,
        accommodationsEnabled,
        accommodations: accommodationsEnabled ? accommodations.filter(a => a.checked) : [],
        customQuestions,
        instantConfirmation,
        capRegistrations,
        capacityLimit,
        enableWaitlist
      }
    };
    onPublishComplete(fullEvent);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 70px)',
        width: '100%',
        background: '#F8F9FA',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Main Full-Page Content Section */}
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '16px 28px 28px 28px',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Header Row: ONLY Back Arrow and 'Back' text */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <BackButton onClick={onBackToDetails} />
        </div>

        {/* 2-Column Full-Page Width & Height Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 24,
            width: '100%',
            flex: 1,
            alignItems: 'stretch',
            boxSizing: 'border-box'
          }}
        >
          {/* LEFT COLUMN: Standard Attendee Profile Fields (Stretches Full Height) */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                padding: '26px 30px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                {/* Card Title & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #F1F5F9', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Standard Attendee Profile Fields</h3>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Default attendee demographic profile fields</p>
                  </div>
                </div>

                {/* Locked Demographic Fields List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Full Name', sub: 'Auto-filled profile name' },
                    { label: 'Email Address', sub: 'Used for QR ticket delivery' },
                    { label: 'Phone Number', sub: 'For SMS & security verification' },
                    { label: 'Date of Birth / Age', sub: 'Verify age eligibility requirements' },
                    { label: 'Gender Identification', sub: 'For accessibility & seating planning' },
                    { label: 'State & District', sub: 'Regional location data' }
                  ].map((field, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                      <div>
                        <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>{field.label}</strong>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{field.sub}</div>
                      </div>
                      <span title="Locked standard field" style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, background: '#F1F5F9', padding: '4px 9px', borderRadius: 6, fontWeight: 600 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles Group: Emergency Contact & Accommodations */}
              <div style={{ marginTop: 14 }}>
                {/* Toggle: Emergency Contact */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Emergency Contact Person &amp; Phone</strong>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>On-site emergency contact details</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmergencyContactEnabled(!emergencyContactEnabled)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: emergencyContactEnabled ? '#6336EB' : '#E2E8F0',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                      padding: 0
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      position: 'absolute',
                      top: 3,
                      left: emergencyContactEnabled ? 23 : 3,
                      transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                </div>

                {/* Toggle: Accessibility & Support Accommodations */}
                <div style={{ paddingTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: accommodationsEnabled ? 12 : 0 }}>
                    <div>
                      <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Accessibility &amp; Support Accommodations</strong>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Enable attendee accommodation requests</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccommodationsEnabled(!accommodationsEnabled)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: accommodationsEnabled ? '#6336EB' : '#E2E8F0',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                        padding: 0
                      }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        position: 'absolute',
                        top: 3,
                        left: accommodationsEnabled ? 23 : 3,
                        transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>

                  {accommodationsEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#F8FAFC', padding: '16px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                      {accommodations.map(acc => (
                        <label key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#334155', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={acc.checked}
                            onChange={() => handleToggleAccommodation(acc.id)}
                            style={{ width: 16, height: 16, accentColor: '#6336EB', borderRadius: 4 }}
                          />
                          <span>{acc.label}</span>
                        </label>
                      ))}

                      {/* Inline Custom Option Adder (NO POPUP) */}
                      {isAddingAccommodation ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                          <input
                            type="text"
                            autoFocus
                            value={newAccommodationText}
                            onChange={e => setNewAccommodationText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleConfirmAddAccommodation(); }}
                            placeholder="e.g. Quiet sensory space / low sensory room..."
                            style={{
                              flex: 1,
                              height: 34,
                              padding: '0 10px',
                              borderRadius: 6,
                              border: '1.5px solid #6336EB',
                              fontSize: 12.5,
                              outline: 'none',
                              boxSizing: 'border-box',
                              background: '#FFF'
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleConfirmAddAccommodation}
                            style={{
                              background: '#6336EB',
                              color: '#FFF',
                              border: 'none',
                              borderRadius: 6,
                              padding: '0 14px',
                              height: 34,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsAddingAccommodation(false); setNewAccommodationText(''); }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748B',
                              fontSize: 12,
                              cursor: 'pointer',
                              padding: '0 6px'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsAddingAccommodation(true)}
                          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#6336EB', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
                        >
                          + Add Custom Option
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Custom Questions & Registration Capacity (Stretches Full Height) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, height: '100%' }}>
            
            {/* 1. Custom Questions */}
            <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: '26px 30px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Custom Questions ({customQuestions.length})</h3>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Add specific questions for attendees</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(true)}
                  style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Field
                </button>
              </div>

              {isAddingQuestion && (
                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={newQuestionTitle}
                    onChange={e => setNewQuestionTitle(e.target.value)}
                    placeholder="Question prompt / label..."
                    autoFocus
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', background: '#FFF' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <select
                      value={newQuestionType}
                      onChange={e => setNewQuestionType(e.target.value)}
                      style={{ height: 34, padding: '0 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, background: '#FFF' }}
                    >
                      <option value="SHORT TEXT">Short Text</option>
                      <option value="DROPDOWN">Dropdown</option>
                      <option value="MULTI-CHOICE">Multiple Choice</option>
                      <option value="FILE UPLOAD">File Upload</option>
                    </select>
                    <input
                      type="text"
                      value={newQuestionHint}
                      onChange={e => setNewQuestionHint(e.target.value)}
                      placeholder="Hint / choices (optional)..."
                      style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', background: '#FFF' }}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newQuestionRequired}
                      onChange={e => setNewQuestionRequired(e.target.checked)}
                      style={{ accentColor: '#6336EB' }}
                    />
                    Required field
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <button type="button" onClick={() => setIsAddingQuestion(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={handleAddQuestion} style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add Field</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {customQuestions.map(q => (
                  <div key={q.id} style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: 13, color: '#1E1B4B' }}>{q.title}</strong>
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#EDE9FE', color: '#6336EB', padding: '1px 6px', borderRadius: 4 }}>{q.type}</span>
                          {q.required && <span style={{ fontSize: 10.5, color: '#EF4444', fontWeight: 600 }}>*Required</span>}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>{q.hint}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Registration Capacity & Rules (Stretches to Balance Left Column) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                padding: '26px 30px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Registration Capacity &amp; Rules</h3>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Capacity, approval rules &amp; waitlist limits</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Instant Confirmation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Instant Confirmation (Auto-Approve)</strong>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Instant digital QR pass issued to attendee</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInstantConfirmation(!instantConfirmation)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: instantConfirmation ? '#6336EB' : '#E2E8F0',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                        padding: 0
                      }}
                    >
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        position: 'absolute',
                        top: 3,
                        left: instantConfirmation ? 23 : 3,
                        transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>

                  {/* Cap Maximum Attendee Registrations */}
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: capRegistrations ? 14 : 0 }}>
                      <div>
                        <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Cap Maximum Attendee Registrations</strong>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Limit: {capacityLimit} attendees</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCapRegistrations(!capRegistrations)}
                        style={{
                          width: 44,
                          height: 24,
                          borderRadius: 12,
                          background: capRegistrations ? '#6336EB' : '#E2E8F0',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.2s ease',
                          padding: 0
                        }}
                      >
                        <div style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          position: 'absolute',
                          top: 3,
                          left: capRegistrations ? 23 : 3,
                          transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>

                    {capRegistrations && (
                      <div style={{ background: '#F8FAFC', padding: '16px 18px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 12.5, color: '#64748B' }}>Venue Seat Capacity</span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#6336EB', background: '#FFF', border: '1px solid #E2E8F0', padding: '2px 10px', borderRadius: 6 }}>
                            {capacityLimit} <span style={{ fontWeight: 400, color: '#94A3B8' }}>seats</span>
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          step="50"
                          value={capacityLimit}
                          onChange={e => setCapacityLimit(parseInt(e.target.value) || 250)}
                          style={{ width: '100%', accentColor: '#6336EB', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          {[50, 100, 250, 500, 1000].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setCapacityLimit(val)}
                              style={{
                                flex: 1,
                                padding: '6px 0',
                                fontSize: 12,
                                fontWeight: 600,
                                background: capacityLimit === val ? '#6336EB' : '#FFFFFF',
                                color: capacityLimit === val ? '#FFFFFF' : '#475467',
                                border: '1px solid',
                                borderColor: capacityLimit === val ? '#6336EB' : '#D0D5DD',
                                borderRadius: 6,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enable Waitlist When Full */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 14, marginTop: 14 }}>
                <div>
                  <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Enable Waitlist When Full</strong>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>Attendees queue if capacity fills up</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableWaitlist(!enableWaitlist)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: enableWaitlist ? '#6336EB' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    padding: 0
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: 3,
                    left: enableWaitlist ? 23 : 3,
                    transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Sticky Bottom Bar: Back on left; Save Draft before Publish on right */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #E2E8F0',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left: Simple Clean Back Button */}
        <BackButton onClick={onBackToDetails} />

        {/* Right: Save Draft on right side BEFORE Publish Event */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={handleSaveDraft}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 40,
              padding: '0 20px',
              borderRadius: 10,
              border: '1.5px solid #E2E8F0',
              background: '#FFF',
              fontSize: 13,
              fontWeight: 600,
              color: '#1E1B4B',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6336EB'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublish}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 40,
              padding: '0 26px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #6336EB, #4D25C9)',
              color: '#FFF',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99,54,235,0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Publish Event &amp; Form &#10003;
          </button>
        </div>
      </div>
    </div>
  );
}
