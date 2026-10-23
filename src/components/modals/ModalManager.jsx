import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function ModalManager() {
  const {
    activeModal,
    modalData,
    closeModal,
    events,
    registrations,
    addCampaign,
    addAchievement,
    addContentPost,
    updateEvent,
    checkInAttendee,
    addRegistration,
    updateTicketStatus,
    setIsSidebarCollapsed,
    showToast
  } = useApp();

  const [copiedTxnModal, setCopiedTxnModal] = useState(false);



  // Local state for modals
  // 1. Campaign modal
  const [campForm, setCampForm] = useState({ title: '', goal: 50000, audience: '', desc: '' });
  // 2. Achievement modal
  const [achForm, setAchForm] = useState({ title: '', date: '2026', body: '', desc: '' });
  // 3. Content modal
  const [contentForm, setContentForm] = useState({ title: '', type: 'Article', body: '' });
  // 4. Edit Event modal
  const [editEventForm, setEditEventForm] = useState(null);
  // 5. Issue ticket modal
  const [issueTicketForm, setIssueTicketForm] = useState({
    name: '',
    email: '',
    phone: '',
    org: '',
    eventId: events?.[0]?.id || '',
    tier: 'General Delegate',
    gate: 'Gate 1 (Main Hall)',
    sendEmail: true
  });
  // 6. Add attendee modal
  const [addAttendeeForm, setAddAttendeeForm] = useState({ name: '', email: '', eventId: events?.[0]?.id || '', tier: 'General Delegate' });
  // 7. Preview tab state
  const [previewTab, setPreviewTab] = useState('page');
  // 8. Gate scan success state
  const [scanResult, setScanResult] = useState(null);

  if (!activeModal) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  };

  return (
    <>
      {/* 1. modalEventLivePreview */}
      {activeModal === 'modalEventLivePreview' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog preview-studio-dialog" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <h2 className="modal-title">{modalData?.name || 'Inclusive Innovation & Accessibility Forum 2026'}</h2>
                <span className="status-badge-minimal upcoming" style={{ marginLeft: '10px' }}>Live Preview</span>
              </div>
              <div className="modal-header-tabs">
                <button
                  type="button"
                  className={`preview-tab-btn ${previewTab === 'page' ? 'active' : ''}`}
                  onClick={() => setPreviewTab('page')}
                >
                  Public Event Page
                </button>
                <button
                  type="button"
                  className={`preview-tab-btn ${previewTab === 'pass' ? 'active' : ''}`}
                  onClick={() => setPreviewTab('pass')}
                >
                  Attendee Gate Pass
                </button>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              {previewTab === 'page' ? (
                <div>
                  <img
                    src={modalData?.poster || '/assets/posters/poster-tech-summit.svg'}
                    alt=""
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                    {modalData?.name || 'Inclusive Innovation & Accessibility Forum 2026'}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--neutral-500)', fontSize: '13px', marginBottom: '14px' }}>
                    <span>📍 {modalData?.location || 'Bharat Mandapam, New Delhi'}</span>
                    <span>📅 {modalData?.date || 'Nov 12-14, 2026'}</span>
                    <span>🏷️ {modalData?.category || 'Technology'}</span>
                  </div>
                  <p style={{ color: '#4B5563', lineHeight: 1.5, fontSize: '14px', marginBottom: '20px' }}>
                    {modalData?.description || 'A landmark national summit bringing together accessible hardware architects, assistive AI developers, and disability rights advocates.'}
                  </p>
                </div>
              ) : (
                <div style={{ background: '#F8F9FA', border: '2px dashed #E5E7EB', borderRadius: '16px', padding: '24px', textAlign: 'center', maxWidth: '380px', margin: '0 auto' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6336EB', fontWeight: 700 }}>Knotnex Digital Pass</div>
                  <h4 style={{ fontSize: '17px', fontWeight: 700, margin: '8px 0' }}>{modalData?.name || 'Youth Tech Summit 2026'}</h4>
                  <div style={{ margin: '16px 0' }}>
                    <div style={{ width: '140px', height: '140px', background: '#111827', margin: '0 auto', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '72px' }}>qr_code_2</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', color: '#111827' }}>#KNT-8401-DELEGATE</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>Gate 4B · Hall 2 Turnstile Access</div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid #ECECEC' }}>
              <button type="button" className="btn-secondary" onClick={closeModal}>Close Preview</button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  closeModal();
                  showToast('Event published successfully!', 'success');
                }}
              >
                Confirm &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. modalAddCustomQuestion */}
      {activeModal === 'modalAddCustomQuestion' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Custom Registration Question</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Question Prompt</label>
                <input type="text" className="form-input" placeholder="e.g. Do you require wheelchair accessibility?" />
              </div>
              <div className="form-group">
                <label className="form-label">Response Type</label>
                <select className="form-select">
                  <option>Short Text Input</option>
                  <option>Multiple Choice (Dropdown)</option>
                  <option>Yes / No Confirmation</option>
                  <option>Document Upload (PDF)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  closeModal();
                  showToast('Custom question added to registration form', 'success');
                }}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. modalAddSessionDialog */}
      {activeModal === 'modalAddSessionDialog' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Schedule Session</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Session Title</label>
                <input type="text" className="form-input" placeholder="e.g. Keynote: Scaled AI Governance" />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="text" className="form-input" placeholder="09:30 AM - 10:45 AM" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage / Hall</label>
                  <input type="text" className="form-input" placeholder="Main Auditorium" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  closeModal();
                  showToast('Agenda session added!', 'success');
                }}
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. modalAddSpeakerDialog */}
      {activeModal === 'modalAddSpeakerDialog' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Chief Guest or Speaker</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Speaker Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. Dr. Maya Lin" />
              </div>
              <div className="form-group">
                <label className="form-label">Title &amp; Organization</label>
                <input type="text" className="form-input" placeholder="e.g. Lead Accessibility Architect, NeuralTech" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  closeModal();
                  showToast('Speaker invite recorded!', 'success');
                }}
              >
                Add Speaker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. modalCreateCampaign */}
      {activeModal === 'modalCreateCampaign' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Campaign</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Clean Energy Microgrid Fund"
                  value={campForm.title}
                  onChange={(e) => setCampForm({ ...campForm, title: e.target.value })}
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Fundraising Target ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={campForm.goal}
                    onChange={(e) => setCampForm({ ...campForm, goal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rural Communities"
                    value={campForm.audience}
                    onChange={(e) => setCampForm({ ...campForm, audience: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description &amp; Objective</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={campForm.desc}
                  onChange={(e) => setCampForm({ ...campForm, desc: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (!campForm.title) {
                    showToast('Please enter a campaign title', 'warning');
                    return;
                  }
                  addCampaign({
                    title: campForm.title,
                    goal: parseInt(campForm.goal) || 50000,
                    raised: 0,
                    supporters: 0,
                    audience: campForm.audience || 'General Public',
                    desc: campForm.desc
                  });
                  closeModal();
                }}
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. modalAddAchievement */}
      {activeModal === 'modalAddAchievement' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Add Achievement or Citation</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Achievement Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. National Innovation Excellence 2026"
                  value={achForm.title}
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Year / Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={achForm.date}
                    onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Awarding Body / Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ministry of Electronics & IT"
                    value={achForm.body}
                    onChange={(e) => setAchForm({ ...achForm, body: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Citation Summary</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={achForm.desc}
                  onChange={(e) => setAchForm({ ...achForm, desc: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (!achForm.title) {
                    showToast('Please enter an achievement title', 'warning');
                    return;
                  }
                  addAchievement(achForm);
                  closeModal();
                }}
              >
                Save Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. modalCreateContent */}
      {activeModal === 'modalCreateContent' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Create Content Post</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Headline / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Keynote Takeaways: Autonomous AI Systems"
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={contentForm.type}
                  onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                >
                  <option value="Article">Article</option>
                  <option value="Media">Media Asset</option>
                  <option value="Announcement">Urgent Announcement</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Body Content</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={contentForm.body}
                  onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (!contentForm.title) {
                    showToast('Please enter a title', 'warning');
                    return;
                  }
                  addContentPost(contentForm);
                  closeModal();
                }}
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. modalViewTicketPass */}
      {activeModal === 'modalViewTicketPass' && (() => {
        const isCheckedIn = modalData?.status === 'used' || modalData?.checkedIn;
        const isExpired = modalData?.status === 'expired';
        const passCode = modalData?.ticketCode || modalData?.regId || (modalData?.qr_code_hash ? `#${modalData.qr_code_hash.slice(0, 8).toUpperCase()}` : (modalData?.id ? `#PASS-${modalData.id.slice(0, 6).toUpperCase()}` : '—'));
        const attendeeName = modalData?.personal_info?.name || modalData?.user_name || modalData?.name || modalData?.attendeeName || 'Attendee';
        const attendeeEmail = modalData?.personal_info?.email || modalData?.email || '—';
        const eventName = modalData?.eventName || modalData?.event_title || modalData?.event || 'Official Event';
        const eventLocation = modalData?.personal_info?.city || modalData?.location || modalData?.city || 'Main Venue';
        const passTier = modalData?.tier || modalData?.type || 'Standard Pass';
        const gate = modalData?.gate || 'Main Entrance';

        return (
          <div
            className="modal-backdrop open"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 1050,
              padding: '16px'
            }}
            onClick={handleBackdropClick}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: '390px',
                width: '100%',
                padding: '0',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#FFFFFF',
                boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12)',
                margin: 'auto'
              }}
            >
              {/* Pass Header Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #6336EB 0%, #4D25C9 100%)',
                  color: '#FFFFFF',
                  padding: '20px 20px 16px',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: 'none',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>KNOTNEX VERIFIED PASS</span>
                </div>

                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 4px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3
                  }}
                >
                  {eventName}
                </h3>

                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.88)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{eventLocation}</span>
                </div>
              </div>

              {/* Pass Content Area */}
              <div style={{ padding: '16px 20px 20px', background: '#FFFFFF' }}>
                {/* Attendee Dossier Card */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #EDF2F7',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                        Attendee
                      </div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', marginTop: '1px' }}>
                        {attendeeName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {attendeeEmail}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                        Pass Tier
                      </div>
                      <div style={{ marginTop: '2px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#F4F3FF',
                            color: '#5925DC',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            border: '1px solid #D9D6FE'
                          }}
                        >
                          {passTier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Gate / Entry: </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155' }}>{gate}</span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: isCheckedIn ? '#12B76A' : (isExpired ? '#D92D20' : '#175CD3')
                        }}
                      >
                        {isCheckedIn ? '● Checked-in' : (isExpired ? '● Expired' : '● Active Pass')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code Card */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '14px',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      background: '#FAFAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px'
                    }}
                  >
                    <svg width="98" height="98" viewBox="0 0 110 110" fill="none">
                      <rect x="5" y="5" width="28" height="28" rx="6" fill="#1E1B4B" />
                      <rect x="9" y="9" width="20" height="20" rx="3" fill="#FFFFFF" />
                      <rect x="13" y="13" width="12" height="12" rx="2" fill="#6336EB" />

                      <rect x="77" y="5" width="28" height="28" rx="6" fill="#1E1B4B" />
                      <rect x="81" y="9" width="20" height="20" rx="3" fill="#FFFFFF" />
                      <rect x="85" y="13" width="12" height="12" rx="2" fill="#6336EB" />

                      <rect x="5" y="77" width="28" height="28" rx="6" fill="#1E1B4B" />
                      <rect x="9" y="81" width="20" height="20" rx="3" fill="#FFFFFF" />
                      <rect x="13" y="85" width="12" height="12" rx="2" fill="#6336EB" />

                      <rect x="39" y="11" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="51" y="11" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="63" y="11" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="11" y="39" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="11" y="51" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="11" y="63" width="6" height="6" rx="1.5" fill="#1E1B4B" />

                      <rect x="42" y="42" width="12" height="12" rx="3" fill="#6336EB" />
                      <rect x="58" y="42" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="42" y="58" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="58" y="58" width="10" height="10" rx="2" fill="#1E1B4B" />

                      <rect x="25" y="45" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="25" y="59" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="79" y="45" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="75" y="59" width="8" height="8" rx="2" fill="#1E1B4B" />
                      <rect x="89" y="55" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="89" y="69" width="6" height="6" rx="1.5" fill="#1E1B4B" />

                      <rect x="45" y="75" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="59" y="75" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="45" y="89" width="8" height="8" rx="2" fill="#1E1B4B" />
                      <rect x="59" y="89" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                      <rect x="75" y="85" width="8" height="8" rx="2" fill="#1E1B4B" />
                      <rect x="89" y="85" width="6" height="6" rx="1.5" fill="#1E1B4B" />
                    </svg>
                  </div>

                  <div
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      color: '#0F172A',
                      letterSpacing: '1px',
                      background: '#F1F5F9',
                      padding: '2px 10px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}
                  >
                    {passCode}
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      color: isCheckedIn ? '#12B76A' : '#16A34A',
                      fontWeight: 600,
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{isCheckedIn ? 'Credential Scanned & Verified' : 'Cryptographically Signed & Valid'}</span>
                  </div>
                </div>

                {/* Footer Close Button in App Bar Create Button Design */}
                {!isCheckedIn && !isExpired ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        height: '38px',
                        padding: '0 20px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 500
                      }}
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="appbar-create-btn"
                      style={{
                        height: '38px',
                        padding: '0 22px',
                        fontSize: '13px'
                      }}
                      onClick={() => {
                        checkInAttendee(passCode || modalData?.id);
                        closeModal();
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Check In
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="appbar-create-btn"
                      style={{
                        height: '38px',
                        padding: '0 32px',
                        fontSize: '13.5px'
                      }}
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 9. modalIssueTicket (Enlarged from down to app bar center) */}
      {activeModal === 'modalIssueTicket' && (() => {
        const selectedEv = events.find(e => e.id === issueTicketForm.eventId) || events[0] || { name: 'Annual Youth Tech Summit 2026', location: 'Moscone Center, SF' };
        const initials = issueTicketForm.name.trim()
          ? issueTicketForm.name.trim().split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
          : 'AP';

        return (
          <div
            className="modal-backdrop open"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 16px',
              background: 'rgba(15, 23, 42, 0.68)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000
            }}
            onClick={handleBackdropClick}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: '920px',
                width: '95%',
                height: 'min(720px, calc(100vh - 80px))',
                maxHeight: 'calc(100vh - 80px)',
                borderRadius: '24px',
                boxShadow: '0 24px 60px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                margin: 'auto'
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 28px',
                  borderBottom: '1px solid #E2E8F0',
                  background: '#FCFCFD'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #6336EB 0%, #4D25C9 100%)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(99, 54, 235, 0.28)'
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M6 12h.01M18 12h.01" />
                      <line x1="10" y1="12" x2="14" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1E1B4B', margin: 0, letterSpacing: '-0.02em' }}>
                      Issue Attendee Pass
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '3px 0 0' }}>
                      Generate, authorize, and dispatch digital entry credentials with live QR verification.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: '#64748B',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body: 2-Column Responsive Layout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.25fr 0.95fr',
                  gap: '28px',
                  padding: '24px 28px',
                  overflowY: 'auto',
                  flex: 1,
                  background: '#F8FAFC'
                }}
              >
                {/* Left Column: Form Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: '#FFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6336EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Attendee Profile
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                          Attendee Full Name <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Priya Sharma"
                          value={issueTicketForm.name}
                          onChange={(e) => setIssueTicketForm({ ...issueTicketForm, name: e.target.value })}
                          style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 13.5, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                            Email Address <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="email"
                            className="form-input"
                            placeholder="priya@knotnex.org"
                            value={issueTicketForm.email}
                            onChange={(e) => setIssueTicketForm({ ...issueTicketForm, email: e.target.value })}
                            style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 13.5, boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                            Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="+91 98401 24789"
                            value={issueTicketForm.phone || ''}
                            onChange={(e) => setIssueTicketForm({ ...issueTicketForm, phone: e.target.value })}
                            style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 13.5, boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                          Organization / Affiliation
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Stanford AI Lab · Fellow"
                          value={issueTicketForm.org || ''}
                          onChange={(e) => setIssueTicketForm({ ...issueTicketForm, org: e.target.value })}
                          style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 14px', fontSize: 13.5, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#FFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6336EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Event &amp; Access Rights
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                          Select Event
                        </label>
                        <select
                          className="form-select"
                          value={issueTicketForm.eventId}
                          onChange={(e) => setIssueTicketForm({ ...issueTicketForm, eventId: e.target.value })}
                          style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 12px', fontSize: 13.5, background: '#FFF' }}
                        >
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name} ({ev.date || 'Upcoming'})</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                            Pass Tier
                          </label>
                          <select
                            className="form-select"
                            value={issueTicketForm.tier}
                            onChange={(e) => setIssueTicketForm({ ...issueTicketForm, tier: e.target.value })}
                            style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 12px', fontSize: 13.5, background: '#FFF' }}
                          >
                            <option value="General Delegate">General Delegate</option>
                            <option value="VIP All-Access">VIP All-Access</option>
                            <option value="Speaker Credential">Speaker Credential</option>
                            <option value="Media Pass">Media Pass</option>
                            <option value="Student / Scholar">Student / Scholar</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5, display: 'block' }}>
                            Designated Gate
                          </label>
                          <select
                            className="form-select"
                            value={issueTicketForm.gate || 'Gate 1 (Main Hall)'}
                            onChange={(e) => setIssueTicketForm({ ...issueTicketForm, gate: e.target.value })}
                            style={{ width: '100%', height: 40, borderRadius: 10, border: '1.5px solid #E2E8F0', padding: '0 12px', fontSize: 13.5, background: '#FFF' }}
                          >
                            <option value="Gate 1 (Main Hall)">Gate 1 (Main Hall)</option>
                            <option value="Gate 2 (VIP / Speakers)">Gate 2 (VIP / Speakers)</option>
                            <option value="Gate 3 (Exhibition)">Gate 3 (Exhibition)</option>
                            <option value="All Gate Access">All Gate Access</option>
                          </select>
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#475569', cursor: 'pointer', marginTop: 4 }}>
                        <input
                          type="checkbox"
                          checked={issueTicketForm.sendEmail !== false}
                          onChange={(e) => setIssueTicketForm({ ...issueTicketForm, sendEmail: e.target.checked })}
                          style={{ accentColor: '#6336EB', width: 16, height: 16 }}
                        />
                        <span>Send digital pass &amp; QR credential via email immediately</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Digital Pass Card Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 14px 34px rgba(99, 54, 235, 0.16), 0 2px 10px rgba(0,0,0,0.06)',
                      border: '1px solid #E2E8F0',
                      background: '#FFF'
                    }}
                  >
                    {/* Badge Lanyard Slot */}
                    <div style={{ background: '#F1F5F9', padding: '8px 0', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: 44, height: 7, borderRadius: 4, background: '#CBD5E1' }}></div>
                    </div>

                    {/* Pass Header */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #6336EB 0%, #4318FF 100%)',
                        color: '#FFF',
                        padding: '18px 16px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', opacity: 0.85, textTransform: 'uppercase' }}>
                        KNOTNEX OFFICIAL PASS
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4, lineHeight: 1.3 }}>
                        {selectedEv?.name || 'Annual Youth Tech Summit 2026'}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.9, marginTop: 3 }}>
                        {selectedEv?.location || 'Moscone Center & Virtual'}
                      </div>
                    </div>

                    {/* Pass Body */}
                    <div style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                          color: '#6336EB',
                          fontWeight: 800,
                          fontSize: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px',
                          border: '2px solid #FFF',
                          boxShadow: '0 2px 8px rgba(99, 54, 235, 0.2)'
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        {issueTicketForm.name.trim() || 'Attendee Full Name'}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        {issueTicketForm.org?.trim() || issueTicketForm.email?.trim() || 'Organization / Institution'}
                      </div>

                      <div style={{ margin: '12px 0 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: 'rgba(99, 54, 235, 0.1)',
                            color: '#6336EB',
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: 20
                          }}
                        >
                          {issueTicketForm.tier}
                        </span>
                      </div>

                      {/* QR Code Container */}
                      <div
                        style={{
                          background: '#F8FAFC',
                          border: '1.5px dashed #CBD5E1',
                          borderRadius: 14,
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <div
                          style={{
                            width: 100,
                            height: 100,
                            background: '#0F172A',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFF'
                          }}
                        >
                          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                            <path d="M14 14h3v3h-3z"></path>
                            <path d="M20 14v3h-3"></path>
                            <path d="M14 20h3"></path>
                            <path d="M20 20h.01"></path>
                          </svg>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: '#0F172A', letterSpacing: '0.05em' }}>
                          #KNT-8422
                        </span>
                        <span style={{ fontSize: 10.5, color: '#16A34A', fontWeight: 700 }}>
                          ● Signed &amp; Scan-Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 28px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#FFF'
                }}
              >
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  style={{ height: 40, padding: '0 20px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    if (!issueTicketForm.name.trim()) {
                      showToast('Please enter the attendee name', 'warning');
                      return;
                    }
                    const passCode = `#PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    const newPass = {
                      id: `reg-${Date.now()}`,
                      regId: passCode,
                      ticketCode: passCode,
                      txnId: `TXN-${Date.now().toString(36).toUpperCase()}-ADMIN`,
                      name: issueTicketForm.name.trim(),
                      email: issueTicketForm.email.trim() || '—',
                      phone: issueTicketForm.phone?.trim() || '—',
                      org: issueTicketForm.org?.trim() || 'Delegate',
                      eventId: selectedEv?.id || issueTicketForm.eventId,
                      event: selectedEv?.name || 'Event',
                      eventName: selectedEv?.name || 'Event',
                      type: issueTicketForm.tier || 'General Delegate',
                      tier: issueTicketForm.tier || 'General Delegate',
                      payment: 'Complimentary · Issued',
                      paymentMethod: 'Admin Override',
                      paymentType: 'paid',
                      source: 'Admin Direct Issue',
                      status: 'valid',
                      checkedIn: false,
                      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    };
                    if (addRegistration) {
                      addRegistration(newPass);
                    } else {
                      showToast(`Pass credential ${passCode} generated for ${issueTicketForm.name}!`, 'success');
                    }
                    closeModal();
                  }}
                  style={{
                    height: 42,
                    padding: '0 24px',
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #6336EB 0%, #4D25C9 100%)',
                    color: '#FFF',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(99, 54, 235, 0.3)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Generate &amp; Dispatch Pass</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 10. modalEditEventDetails */}
      {activeModal === 'modalEditEventDetails' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Event Parameters</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={modalData?.name || ''}
                  id="inpEditEventName"
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Capacity Limit</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={modalData?.capacity || 500}
                    id="inpEditEventCapacity"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" defaultValue={modalData?.status || 'upcoming'} id="inpEditEventStatus">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  const newName = document.getElementById('inpEditEventName')?.value;
                  const newCap = parseInt(document.getElementById('inpEditEventCapacity')?.value) || modalData?.capacity;
                  const newStatus = document.getElementById('inpEditEventStatus')?.value;
                  if (modalData?.id) {
                    updateEvent(modalData.id, { name: newName, capacity: newCap, status: newStatus });
                  }
                  closeModal();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. modalQrGateScanner */}
      {activeModal === 'modalQrGateScanner' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '440px', width: '90%', textAlign: 'center' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#6336EB' }}>qr_code_scanner</span>
                Turnstile QR Gate Scanner
              </h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '24px 20px' }}>
              <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 20px', background: '#0F172A', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Viewfinder borders */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '3px solid #6336EB', borderLeft: '3px solid #6336EB' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '3px solid #6336EB', borderRight: '3px solid #6336EB' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '3px solid #6336EB', borderLeft: '3px solid #6336EB' }} />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '3px solid #6336EB', borderRight: '3px solid #6336EB' }} />

                {/* Laser scan line animation */}
                <div style={{ position: 'absolute', width: '100%', height: '2px', background: '#12B76A', boxShadow: '0 0 10px #12B76A', animation: 'scanLaser 2s infinite ease-in-out' }} />

                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'rgba(255,255,255,0.2)' }}>videocam</span>
              </div>

              {scanResult ? (
                <div style={{ background: '#ECFDF3', color: '#12B76A', padding: '14px', borderRadius: '12px', fontWeight: 600, fontSize: '13.5px', marginBottom: '16px' }}>
                  ✓ Pass {scanResult} Validated! Gate Unlocked.
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--neutral-500)', marginBottom: '16px' }}>
                  Align attendee mobile QR code inside the frame. Camera auto-focus enabled.
                </p>
              )}

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const targetCode = registrations?.[0]?.ticketCode || registrations?.[0]?.qr_code_hash || registrations?.[0]?.id || 'PASS-SCAN-VERIFIED';
                  checkInAttendee(targetCode);
                  setScanResult(targetCode);
                }}
              >
                Simulate Camera Scan ({registrations?.[0]?.ticketCode || registrations?.[0]?.qr_code_hash?.slice(0, 8)?.toUpperCase() || 'Turnstile QR'})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. modalAddAttendee */}
      {activeModal === 'modalAddAttendee' && (
        <div className="modal-backdrop open" style={{ display: 'flex' }} onClick={handleBackdropClick}>
          <div className="modal-dialog" style={{ maxWidth: '480px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Manual Turnstile Check-In</h3>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Attendee Name or Ticket Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Attendee Name, Email or Pass ID"
                  value={addAttendeeForm.name}
                  onChange={(e) => setAddAttendeeForm({ ...addAttendeeForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (addAttendeeForm.name?.trim()) {
                    checkInAttendee(addAttendeeForm.name.trim());
                    closeModal();
                  } else {
                    showToast('Please enter an attendee name or ticket code', 'warning');
                  }
                }}
              >
                Verify &amp; Admit Attendee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. modalTicketIssueDetails */}
      {activeModal === 'modalTicketIssueDetails' && (
        <div
          className="modal-backdrop open"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1050,
            padding: '16px'
          }}
          onClick={handleBackdropClick}
        >
          <div className="modal-dialog" style={{ maxWidth: '580px', width: '90%' }}>
            <div className="modal-header">
              <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>receipt_long</span>
                </div>
                <div>
                  <h3 className="modal-title">{modalData?.id || 'Ticket #TK-8401'} - Audit Dossier</h3>
                  <p className="modal-subtitle" style={{ fontSize: '11.5px', color: 'var(--neutral-500)' }}>Attendee support audit log and refund disposition</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ background: '#F8F9FA', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 600 }}>ATTENDEE</span>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>
                    {typeof modalData?.user === 'object' ? (modalData.user.name || modalData.user.email) : (modalData?.user || modalData?.attendee || 'Attendee')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 600 }}>TRANSACTION</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: 'var(--neutral-900)' }}>
                      {modalData?.txnId || modalData?.paymentRef || (modalData?.id ? `TXN-${String(modalData.id).slice(0, 8).toUpperCase()}` : '—')}
                    </span>
                    <button
                      type="button"
                      className="btn-copy-txn-modal"
                      onClick={() => {
                        const idToCopy = modalData?.txnId || modalData?.paymentRef || (modalData?.id ? `TXN-${String(modalData.id).slice(0, 8).toUpperCase()}` : 'N/A');
                        navigator.clipboard.writeText(idToCopy);
                        setCopiedTxnModal(true);
                        showToast(`Copied Transaction ID "${idToCopy}" to clipboard!`, 'success');
                        setTimeout(() => setCopiedTxnModal(false), 2000);
                      }}
                      title="Copy Transaction ID"
                      style={{
                        background: copiedTxnModal ? '#ECFDF3' : '#F2F4F7',
                        border: copiedTxnModal ? '1px solid #A6F4C5' : '1px solid #D0D5DD',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: copiedTxnModal ? '#12B76A' : '#344054',
                        fontSize: '11px',
                        fontWeight: 600,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {copiedTxnModal ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-400)', fontWeight: 600 }}>AMOUNT</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#12B76A' }}>{modalData?.amount || '—'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Reported Problem:</div>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.4 }}>
                  {modalData?.desc || modalData?.details || modalData?.description || 'Issue inquiry submitted by attendee.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #ECECEC', paddingTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Audit Log & Status:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#4B5563' }}>
                  <div>● Category: {modalData?.category || modalData?.issueType || 'General Inquiry'}</div>
                  <div>● Associated Event: {modalData?.eventName || modalData?.event_title || 'Organization Event'}</div>
                  <div>● Status: {modalData?.status || 'Open / Pending'}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                className="btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  updateTicketStatus(modalData?.id, 'Resolved');
                  showToast(`Support ticket ${modalData?.id || ''} resolved!`, 'success');
                  closeModal();
                }}
              >
                Resolve Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
