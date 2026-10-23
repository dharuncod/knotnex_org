import React, { useState, useEffect } from 'react';
import BackButton from '../../../components/common/BackButton';

export default function EventEligibilityScreen({
  eventName,
  initialCriteria,
  initialSpeakers,
  initialSponsors,
  initialPhotos,
  initialDocuments,
  initialOrganizer,
  initialVolunteersNeeded = false,
  initialVolunteerRole = '',
  initialVolunteerOpenings = 0,
  initialContact,
  initialFaqs,
  onBack,
  onNext,
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
  const [rules, setRules] = useState(
    Array.isArray(initialCriteria) ? initialCriteria : []
  );

  const [speakers, setSpeakers] = useState(
    Array.isArray(initialSpeakers) ? initialSpeakers : []
  );

  const [sponsors, setSponsors] = useState(
    Array.isArray(initialSponsors) ? initialSponsors : []
  );

  const [photos, setPhotos] = useState(initialPhotos || []);
  const [documents, setDocuments] = useState(initialDocuments || []);

  const [organizer, setOrganizer] = useState(() => {
    if (initialOrganizer && initialOrganizer.name) return initialOrganizer;
    return {
      initials: '',
      name: '',
      subtitle: '',
      verified: false
    };
  });

  // Inline editing state for Organized By (NO POPUPS)
  const [isEditingOrganizer, setIsEditingOrganizer] = useState(false);
  const [orgNameInput, setOrgNameInput] = useState(organizer.name || '');
  const [orgSubtitleInput, setOrgSubtitleInput] = useState(organizer.subtitle || '');

  const [volunteersNeeded, setVolunteersNeeded] = useState(
    initialVolunteersNeeded !== undefined ? initialVolunteersNeeded : false
  );
  const [volunteerRole, setVolunteerRole] = useState(initialVolunteerRole || '');
  const [volunteerOpenings, setVolunteerOpenings] = useState(initialVolunteerOpenings || 0);

  const [contact, setContact] = useState(() => {
    if (initialContact && (initialContact.email || initialContact.phone || initialContact.helpDesk)) {
      return initialContact;
    }
    return {
      email: '',
      phone: '',
      helpDesk: ''
    };
  });

  // Inline editing state for Contact & Support (NO POPUPS)
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactEmailInput, setContactEmailInput] = useState(contact.email || '');
  const [contactPhoneInput, setContactPhoneInput] = useState(contact.phone || '');
  const [contactHelpDeskInput, setContactHelpDeskInput] = useState(contact.helpDesk || '');

  const [faqs, setFaqs] = useState(
    Array.isArray(initialFaqs) ? initialFaqs : []
  );

  // Inline adding states
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');

  const [isAddingSpeaker, setIsAddingSpeaker] = useState(false);
  const [speakerForm, setSpeakerForm] = useState({ name: '', role: '' });

  const [isAddingSponsor, setIsAddingSponsor] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({ name: '', role: '' });

  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  // Handlers for Rules
  const handleAddRule = () => {
    if (!newRuleText.trim()) return;
    setRules(prev => [...prev, newRuleText.trim()]);
    setNewRuleText('');
    setIsAddingRule(false);
    if (addToast) addToast('Eligibility rule added!', 'success');
  };

  const handleRemoveRule = (index) => {
    setRules(prev => prev.filter((_, i) => i !== index));
    if (addToast) addToast('Rule removed.', 'info');
  };

  // Handlers for Speakers
  const handleAddSpeaker = () => {
    if (!speakerForm.name.trim()) return;
    const name = speakerForm.name.trim();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newSpk = {
      id: `spk-${Date.now()}`,
      initials: initials || 'SP',
      name,
      role: speakerForm.role.trim() || 'Keynote Speaker',
      verified: true
    };
    setSpeakers(prev => [...prev, newSpk]);
    setSpeakerForm({ name: '', role: '' });
    setIsAddingSpeaker(false);
    if (addToast) addToast(`Speaker "${name}" added!`, 'success');
  };

  const handleRemoveSpeaker = (id) => {
    setSpeakers(prev => prev.filter(s => s.id !== id));
    if (addToast) addToast('Speaker removed.', 'info');
  };

  // Handlers for Sponsors
  const handleAddSponsor = () => {
    if (!sponsorForm.name.trim()) return;
    const name = sponsorForm.name.trim();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newSpn = {
      id: `spn-${Date.now()}`,
      initials: initials || 'SP',
      name,
      role: sponsorForm.role.trim() || 'Partner',
      verified: true
    };
    setSponsors(prev => [...prev, newSpn]);
    setSponsorForm({ name: '', role: '' });
    setIsAddingSponsor(false);
    if (addToast) addToast(`Partner "${name}" added!`, 'success');
  };

  const handleRemoveSponsor = (id) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
    if (addToast) addToast('Sponsor removed.', 'info');
  };

  // Handlers for FAQs
  const handleAddFaq = () => {
    if (!faqForm.q.trim() || !faqForm.a.trim()) return;
    const newFaqItem = {
      id: `faq-${Date.now()}`,
      q: faqForm.q.trim(),
      a: faqForm.a.trim()
    };
    setFaqs(prev => [...prev, newFaqItem]);
    setFaqForm({ q: '', a: '' });
    setIsAddingFaq(false);
    if (addToast) addToast('FAQ added!', 'success');
  };

  const handleRemoveFaq = (id) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (addToast) addToast('FAQ removed.', 'info');
  };

  // Handlers for Photos & Docs
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, { id: `pht-${Date.now()}`, url: ev.target.result, name: file.name }]);
        if (addToast) addToast(`Photo "${file.name}" attached!`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => [...prev, { id: `doc-${Date.now()}`, name: file.name, size: `${Math.round(file.size / 1024)} KB` }]);
      if (addToast) addToast(`Document "${file.name}" attached!`, 'success');
    }
  };

  // Inline Save Organizer
  const handleSaveOrganizerInline = () => {
    if (!orgNameInput.trim()) return;
    const name = orgNameInput.trim();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ORG';
    const updated = {
      ...organizer,
      name,
      subtitle: orgSubtitleInput.trim() || name,
      initials
    };
    setOrganizer(updated);
    setIsEditingOrganizer(false);
    if (addToast) addToast('Organizer details updated!', 'success');
  };

  // Inline Save Contact Channels
  const handleSaveContactInline = () => {
    setContact({
      email: contactEmailInput.trim(),
      phone: contactPhoneInput.trim(),
      helpDesk: contactHelpDeskInput.trim()
    });
    setIsEditingContact(false);
    if (addToast) addToast('Contact channels updated!', 'success');
  };

  // Submit step 2
  const handleContinue = () => {
    onNext({
      eligibilityCriteria: rules,
      speakers,
      sponsors,
      photos,
      documents,
      organizer,
      volunteersNeeded,
      volunteerRole,
      volunteerOpenings,
      contact,
      faqs
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section className="app-view active" id="viewCreateEventEligibility" style={{ paddingBottom: '32px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* Top Header Row: ONLY Back Arrow and 'Back' text, NO bulky titles or event pills */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 20px 0' }}>
          <BackButton onClick={onBack} />
        </div>

        {/* 2-Column Grid Filling Center Completely */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 20, width: '100%' }}>
          
          {/* LEFT COLUMN: Eligibility, Speakers, Sponsors, Photos, Docs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* 1. Eligibility Criteria */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Eligibility Criteria</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Guidelines &amp; attendee requirements</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingRule(true)}
                  style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Rule
                </button>
              </div>

              {isAddingRule && (
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 12 }}>
                  <input
                    type="text"
                    value={newRuleText}
                    onChange={e => setNewRuleText(e.target.value)}
                    placeholder="e.g. Open to all students & researchers..."
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleAddRule(); }}
                    style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={() => { setIsAddingRule(false); setNewRuleText(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={handleAddRule} style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {rules.length === 0 && !isAddingRule && (
                  <div style={{ fontSize: 12.5, color: '#94A3B8', fontStyle: 'italic', padding: '6px 0' }}>
                    No eligibility criteria specified yet. Click "+ Add Rule" to add guidelines.
                  </div>
                )}
                {rules.map((rule, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, paddingBottom: 8, borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                      <span style={{ color: '#6336EB', fontWeight: 800 }}>•</span>
                      <span>{rule}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 2. Chief Guests & Speakers */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Chief Guests &amp; Speakers</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Keynote presenters &amp; dignitaries</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingSpeaker(true)}
                  style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Speaker
                </button>
              </div>

              {isAddingSpeaker && (
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={speakerForm.name}
                    onChange={e => setSpeakerForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Speaker full name..."
                    autoFocus
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <input
                    type="text"
                    value={speakerForm.role}
                    onChange={e => setSpeakerForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Role / Title (e.g. Accessibility Advocate)..."
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setIsAddingSpeaker(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={handleAddSpeaker} style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {speakers.length === 0 && !isAddingSpeaker && (
                  <div style={{ fontSize: 12.5, color: '#94A3B8', fontStyle: 'italic', padding: '6px 0' }}>
                    No speakers added yet. Click "+ Add Speaker" to feature keynote presenters.
                  </div>
                )}
                {speakers.map(spk => (
                  <div key={spk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE9FE', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 700 }}>
                        {spk.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {spk.name}
                          {spk.verified && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#6336EB" stroke="#FFF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="16 9 10 15 7 12"/></svg>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>{spk.role}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(spk.id)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Sponsors & Partners */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Sponsors &amp; Partners</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Collaborating brands and institutions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingSponsor(true)}
                  style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Sponsor
                </button>
              </div>
              {isAddingSponsor && (
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={sponsorForm.name}
                    onChange={e => setSpeakerForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Sponsor / Partner name..."
                    autoFocus
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <input
                    type="text"
                    value={sponsorForm.role}
                    onChange={e => setSponsorForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Tier (e.g. Platinum Partner)..."
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setIsAddingSponsor(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={handleAddSponsor} style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sponsors.length === 0 && !isAddingSponsor && (
                  <div style={{ fontSize: 12.5, color: '#94A3B8', fontStyle: 'italic', padding: '6px 0' }}>
                    No sponsors or partners added yet. Click "+ Add Sponsor" to include partners.
                  </div>
                )}
                {sponsors.map(spn => (
                  <div key={spn.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 700 }}>
                        {spn.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>{spn.name}</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>{spn.role}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSponsor(spn.id)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 4. Event Photos & Media */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Event Gallery ({photos.length})</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Venue photos &amp; promotional graphics</p>
                </div>
                <label style={{ cursor: 'pointer', color: '#6336EB', fontSize: 12.5, fontWeight: 700 }}>
                  + Add Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {photos.length === 0 ? (
                <label style={{ border: '1.5px dashed #CBD5E1', borderRadius: 12, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FAFAFC' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#6336EB', marginTop: 6 }}>Upload Event Media</span>
                  <span style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>PNG, JPG or WebP</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {photos.map(p => (
                    <div key={p.id} style={{ position: 'relative', height: 70, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <img src={p.url} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Documents & Guides */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Documents &amp; PDFs ({documents.length})</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Brochures, campus maps &amp; accessibility guide</p>
                </div>
                <label style={{ cursor: 'pointer', color: '#6336EB', fontSize: 12.5, fontWeight: 700 }}>
                  + Attach File
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleDocUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {documents.length === 0 ? (
                <label style={{ border: '1.5px dashed #CBD5E1', borderRadius: 12, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FAFAFC' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#475569', marginTop: 6 }}>Attach Document / PDF</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleDocUpload} style={{ display: 'none' }} />
                </label>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {documents.map(d => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: '#1E1B4B' }}>{d.name}</span>
                      <span style={{ color: '#94A3B8' }}>{d.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Organized By, Volunteers, Contact, FAQ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* 1. Organized By (INLINE EDITING - NO POPUP) */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Organized By</h3>
                {!isEditingOrganizer && (
                  <button
                    type="button"
                    onClick={() => {
                      setOrgNameInput(organizer.name);
                      setOrgSubtitleInput(organizer.subtitle || '');
                      setIsEditingOrganizer(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingOrganizer ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Organization Name</label>
                    <input
                      type="text"
                      value={orgNameInput}
                      onChange={e => setOrgNameInput(e.target.value)}
                      placeholder="e.g. Ability First Foundation"
                      autoFocus
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1.5px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={orgSubtitleInput}
                      onChange={e => setOrgSubtitleInput(e.target.value)}
                      placeholder="e.g. Inclusive Community Partner"
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1.5px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#FFF' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingOrganizer(false)}
                      style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOrganizerInline}
                      style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: organizer.name ? 'linear-gradient(135deg, #6336EB, #4D25C9)' : '#F1F5F9', color: organizer.name ? '#FFF' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800 }}>
                    {organizer.initials || 'ORG'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: organizer.name ? '#1E1B4B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {organizer.name || 'Organization Name Not Set'}
                      {organizer.verified && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#6336EB" stroke="#FFF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="16 9 10 15 7 12"/></svg>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{organizer.subtitle || 'Click Edit to set organizing partner details'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Volunteers Needed */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: 13.5, color: '#1E1B4B' }}>Volunteers Needed</strong>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>Enlist community support assistants</div>
                  </div>
                </div>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setVolunteersNeeded(!volunteersNeeded)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: volunteersNeeded ? '#6336EB' : '#E2E8F0',
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
                    left: volunteersNeeded ? 23 : 3,
                    transition: 'left 0.2s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>

              {volunteersNeeded && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Role Description</label>
                    <input
                      type="text"
                      value={volunteerRole}
                      onChange={e => setVolunteerRole(e.target.value)}
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 12.5, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Estimated Openings</label>
                    <input
                      type="number"
                      value={volunteerOpenings}
                      onChange={e => setVolunteerOpenings(Number(e.target.value))}
                      style={{ width: 130, height: 36, padding: '0 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 12.5, outline: 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Contact & Support (INLINE EDITING - NO POPUP) */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Contact &amp; Support</h3>
                {!isEditingContact && (
                  <button
                    type="button"
                    onClick={() => {
                      setContactEmailInput(contact.email);
                      setContactPhoneInput(contact.phone);
                      setContactHelpDeskInput(contact.helpDesk);
                      setIsEditingContact(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Edit Channels
                  </button>
                )}
              </div>

              {isEditingContact ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Email Organizer</label>
                    <input
                      type="email"
                      value={contactEmailInput}
                      onChange={e => setContactEmailInput(e.target.value)}
                      placeholder="e.g. events@knotnex.org"
                      autoFocus
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1.5px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Call Organizer</label>
                    <input
                      type="text"
                      value={contactPhoneInput}
                      onChange={e => setContactPhoneInput(e.target.value)}
                      placeholder="e.g. +91 800-KNOTNEX"
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1.5px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Event Help Desk</label>
                    <input
                      type="text"
                      value={contactHelpDeskInput}
                      onChange={e => setContactHelpDeskInput(e.target.value)}
                      placeholder="e.g. help@knotnex.org"
                      style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1.5px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#FFF' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(false)}
                      style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveContactInline}
                      style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save Channels
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Email Organizer</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: contact.email ? '#1E1B4B' : '#94A3B8', marginTop: 2 }}>{contact.email || 'Not specified'}</div>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Call Organizer</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: contact.phone ? '#1E1B4B' : '#94A3B8', marginTop: 2 }}>{contact.phone || 'Not specified'}</div>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Help Desk</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: contact.helpDesk ? '#1E1B4B' : '#94A3B8', marginTop: 2 }}>{contact.helpDesk || 'Not specified'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Frequently Asked Questions */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', margin: 0 }}>Frequently Asked Questions</h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Help attendees prepare beforehand</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingFaq(true)}
                  style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add FAQ
                </button>
              </div>

              {isAddingFaq && (
                <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    value={faqForm.q}
                    onChange={e => setFaqForm(f => ({ ...f, q: e.target.value }))}
                    placeholder="Question (e.g. Is parking available?)..."
                    autoFocus
                    style={{ height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                  <textarea
                    value={faqForm.a}
                    onChange={e => setFaqForm(f => ({ ...f, a: e.target.value }))}
                    placeholder="Answer details..."
                    rows={2}
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', resize: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setIsAddingFaq(false)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={handleAddFaq} style={{ background: '#6336EB', color: '#FFF', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save FAQ</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {faqs.length === 0 && !isAddingFaq && (
                  <div style={{ fontSize: 12.5, color: '#94A3B8', fontStyle: 'italic', padding: '6px 0' }}>
                    No FAQs added yet. Click "+ Add FAQ" to provide helpful answers.
                  </div>
                )}
                {faqs.map(faq => (
                  <div key={faq.id} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9', position: 'relative' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', paddingRight: 20 }}>{faq.q}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 1.5 }}>{faq.a}</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(faq.id)}
                      style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 16 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Sticky Bottom Bar: Back on left; Save Draft before Next on right */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #E2E8F0',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        boxSizing: 'border-box'
      }}>
        {/* Left: Simple Clean Back Button */}
        <BackButton onClick={onBack} />

        {/* Right: Save Draft on right side BEFORE Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => {
              if (onSaveDraft) {
                onSaveDraft({
                  eligibilityCriteria: rules,
                  speakers,
                  chiefGuests: speakers,
                  sponsors,
                  photos,
                  documents,
                  organizerData: {
                    ...organizer,
                    name: orgNameInput,
                    subtitle: orgSubtitleInput
                  },
                  volunteersNeeded,
                  volunteerRole,
                  volunteerOpenings,
                  contact: {
                    email: contactEmailInput,
                    phone: contactPhoneInput,
                    helpDesk: contactHelpDeskInput
                  },
                  faqs
                });
              } else if (addToast) {
                addToast('Draft saved!', 'success');
              }
            }}
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
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6336EB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleContinue}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 40,
              padding: '0 24px',
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
            Next: Registration Form
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
