import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const DEFAULT_CATEGORIES = [
  'General Question / Inquiry',
  'Event Management & Ticketing',
  'Government Schemes & Grants',
  'Career & Job Applications',
  'Billing, Invoices & Payouts',
  'Account & Security Settings',
  'API, Webhooks & Integrations',
  'Technical Bug / Error',
  'Feature Request / Feedback',
  'Other Query'
];

const DEFAULT_FORM_CONFIG = {
  formTitle: 'Ask Anything — Support & Query Desk',
  formSubtitle: 'Have a question, facing an issue, or need help with Knotnex? Ask us anything below. Describe your query and our team will assist you immediately.',
  allowAttachments: true,
  enablePriority: true,
  autoAcknowledge: true,
  slaNotice: 'Our dedicated support team typically responds within 1–2 business hours.',
  categories: DEFAULT_CATEGORIES,
  customQuestions: [
    {
      id: 'cq-1',
      title: 'Related Event, Scheme, or Ticket ID (Optional)',
      type: 'SHORT TEXT',
      required: false,
      hint: 'e.g. #EV-1024 or #TKT-8941'
    },
    {
      id: 'cq-2',
      title: 'Urgency / Severity Level',
      type: 'DROPDOWN',
      required: true,
      options: ['Minor question / Clarification', 'Moderate operational impact', 'Critical blocker for active event'],
      hint: 'Select the severity level'
    }
  ]
};

const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#10B981', bg: '#ECFDF5' },
  { id: 'medium', label: 'Medium', color: '#6336EB', bg: '#F5F3FF' },
  { id: 'high', label: 'High', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'urgent', label: 'Urgent', color: '#EF4444', bg: '#FEF2F2' }
];

export default function HelpCenterView() {
  const { showToast, accountSettings, supportQueries, addSupportQuery } = useApp();

  // Mode: 'builder' (Admin Create Form) | 'fill' (User Fill Form) | 'submissions' (Track Submitted Tickets)
  const [viewMode, setViewMode] = useState('builder');

  // Admin Form Configuration State (Persisted in localStorage)
  const [formConfig, setFormConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('knotnex_support_form_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_FORM_CONFIG;
  });

  // Category adder in Admin Builder
  const [newCategoryText, setNewCategoryText] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Custom Question adder in Admin Builder
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('SHORT TEXT');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [newQuestionHint, setNewQuestionHint] = useState('');
  const [newQuestionOptions, setNewQuestionOptions] = useState('');

  // User Fill Form State
  const [userFormData, setUserFormData] = useState({
    name: accountSettings?.displayName || 'Ravi Prasanth',
    email: accountSettings?.email || 'ravi@knotnex.com',
    category: formConfig.categories?.[0] || 'General Question / Inquiry',
    priority: 'medium',
    subject: '',
    message: '',
    customAnswers: {},
    attachment: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Sync default category when categories change
  useEffect(() => {
    if (!formConfig.categories.includes(userFormData.category)) {
      setUserFormData(prev => ({ ...prev, category: formConfig.categories[0] || 'General Question / Inquiry' }));
    }
  }, [formConfig.categories]);

  // Save configuration helper
  const handleSaveFormConfig = () => {
    try {
      localStorage.setItem('knotnex_support_form_config', JSON.stringify(formConfig));
      showToast('Support form configuration saved successfully!', 'success');
    } catch (e) {
      showToast('Failed to save configuration', 'error');
    }
  };

  // Add Category Handler
  const handleAddCategory = () => {
    if (!newCategoryText.trim()) return;
    const cat = newCategoryText.trim();
    if (formConfig.categories.includes(cat)) {
      showToast('Category already exists', 'warning');
      return;
    }
    const updated = { ...formConfig, categories: [...formConfig.categories, cat] };
    setFormConfig(updated);
    try {
      localStorage.setItem('knotnex_support_form_config', JSON.stringify(updated));
    } catch (e) {}
    setNewCategoryText('');
    setIsAddingCategory(false);
    showToast(`Added category: "${cat}"`, 'success');
  };

  const handleRemoveCategory = (catToRemove) => {
    if (formConfig.categories.length <= 1) {
      showToast('Must have at least one category', 'warning');
      return;
    }
    const updated = {
      ...formConfig,
      categories: formConfig.categories.filter(c => c !== catToRemove)
    };
    setFormConfig(updated);
    try {
      localStorage.setItem('knotnex_support_form_config', JSON.stringify(updated));
    } catch (e) {}
    showToast(`Removed category: "${catToRemove}"`, 'info');
  };

  // Add Custom Question Handler
  const handleAddQuestion = () => {
    if (!newQuestionTitle.trim()) {
      showToast('Please provide a question title', 'warning');
      return;
    }

    let parsedOptions = [];
    if (newQuestionType === 'DROPDOWN' || newQuestionType === 'CHECKBOXES') {
      parsedOptions = newQuestionOptions
        .split(',')
        .map(opt => opt.trim())
        .filter(Boolean);
      if (parsedOptions.length === 0) {
        parsedOptions = ['Option 1', 'Option 2', 'Option 3'];
      }
    }

    const newQ = {
      id: `cq-${Date.now()}`,
      title: newQuestionTitle.trim(),
      type: newQuestionType,
      required: newQuestionRequired,
      hint: newQuestionHint.trim() || 'User response',
      options: parsedOptions
    };

    const updated = {
      ...formConfig,
      customQuestions: [...(formConfig.customQuestions || []), newQ]
    };

    setFormConfig(updated);
    try {
      localStorage.setItem('knotnex_support_form_config', JSON.stringify(updated));
    } catch (e) {}

    setNewQuestionTitle('');
    setNewQuestionType('SHORT TEXT');
    setNewQuestionRequired(false);
    setNewQuestionHint('');
    setNewQuestionOptions('');
    setIsAddingQuestion(false);
    showToast('Custom question added to support form!', 'success');
  };

  const handleRemoveQuestion = (qId) => {
    const updated = {
      ...formConfig,
      customQuestions: formConfig.customQuestions.filter(q => q.id !== qId)
    };
    setFormConfig(updated);
    try {
      localStorage.setItem('knotnex_support_form_config', JSON.stringify(updated));
    } catch (e) {}
    showToast('Question removed from form.', 'info');
  };

  // User Fill Handlers
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomAnswerChange = (qId, value) => {
    setUserFormData(prev => ({
      ...prev,
      customAnswers: {
        ...prev.customAnswers,
        [qId]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUserFormData(prev => ({ ...prev, attachment: e.target.files[0].name }));
      showToast(`Attached file: ${e.target.files[0].name}`, 'info');
    }
  };

  const handleRemoveAttachment = () => {
    setUserFormData(prev => ({ ...prev, attachment: null }));
  };

  const handleResetUserForm = () => {
    setUserFormData({
      name: accountSettings?.displayName || 'Ravi Prasanth',
      email: accountSettings?.email || 'ravi@knotnex.com',
      category: formConfig.categories?.[0] || 'General Question / Inquiry',
      priority: 'medium',
      subject: '',
      message: '',
      customAnswers: {},
      attachment: null
    });
    setSubmittedTicket(null);
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();

    if (!userFormData.subject.trim()) {
      showToast('Please enter a query subject', 'warning');
      return;
    }

    if (!userFormData.message.trim()) {
      showToast('Please describe your query in detail', 'warning');
      return;
    }

    // Validate required custom questions
    for (const q of formConfig.customQuestions || []) {
      if (q.required && !userFormData.customAnswers[q.id]?.toString().trim()) {
        showToast(`Please answer required field: "${q.title}"`, 'warning');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `SUP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newQuery = {
        id: ticketId,
        createdAt: formattedDate,
        name: userFormData.name.trim() || accountSettings?.displayName || 'User',
        email: userFormData.email.trim() || accountSettings?.email || 'user@knotnex.com',
        category: userFormData.category,
        priority: userFormData.priority,
        subject: userFormData.subject.trim(),
        message: userFormData.message.trim(),
        customAnswers: userFormData.customAnswers,
        attachment: userFormData.attachment,
        status: 'Open'
      };

      if (addSupportQuery) {
        addSupportQuery(newQuery);
      }

      setSubmittedTicket(newQuery);
      setIsSubmitting(false);
      showToast(`Support query submitted! Ticket ID ${ticketId}`, 'success');
    }, 450);
  };

  return (
    <section className="app-view active" id="viewSupport" style={{ width: '100%', padding: '0 0 32px' }}>
      {/* Header - Second Image Elements Completely Removed */}
      <header className="content-header" style={{ marginBottom: '24px' }}>
        <div className="header-title-group">
          <div className="header-icon-box" style={{ background: 'rgba(99, 54, 235, 0.08)', color: 'var(--knotnex-primary, #6336EB)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="11" r="1" />
              <path d="M12 7v1" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Support</h1>
            <p className="page-subtitle">Configure organization support query forms, manage questions, or preview and fill tickets.</p>
          </div>
        </div>

        {/* Note: The old 'Support Online' badge and 'Ask Anything / My Queries' pill from Image 2 are completely removed */}
        <div className="header-actions"></div>
      </header>

      {/* Top Mode Bar - Full Page Width */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg-surface-subtle, #F1F5F9)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid var(--border-default, #E2E8F0)'
          }}
        >
          {/* Button 1: Create Form (Admin) */}
          <button
            type="button"
            id="btnModeFormBuilder"
            onClick={() => setViewMode('builder')}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'builder' ? '#6336EB' : 'transparent',
              color: viewMode === 'builder' ? '#ffffff' : 'var(--neutral-600, #475467)',
              boxShadow: viewMode === 'builder' ? '0 1px 3px rgba(99, 54, 235, 0.2)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Create Form (Admin)</span>
          </button>

          {/* Button 2: Fill Form (User View) */}
          <button
            type="button"
            id="btnModeFillForm"
            onClick={() => {
              setViewMode('fill');
              setSubmittedTicket(null);
            }}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'fill' ? '#6336EB' : 'transparent',
              color: viewMode === 'fill' ? '#ffffff' : 'var(--neutral-600, #475467)',
              boxShadow: viewMode === 'fill' ? '0 1px 3px rgba(99, 54, 235, 0.2)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Fill Form (User View)</span>
          </button>

          {/* Button 3: Submitted Queries */}
          <button
            type="button"
            id="btnModeSubmissions"
            onClick={() => setViewMode('submissions')}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'submissions' ? '#6336EB' : 'transparent',
              color: viewMode === 'submissions' ? '#ffffff' : 'var(--neutral-600, #475467)',
              boxShadow: viewMode === 'submissions' ? '0 1px 3px rgba(99, 54, 235, 0.2)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>Submissions ({supportQueries?.length || 0})</span>
          </button>
        </div>

        {viewMode === 'builder' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              id="btnPreviewUserFormTop"
              onClick={() => {
                setViewMode('fill');
                setSubmittedTicket(null);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Preview as User</span>
            </button>
            <button
              type="button"
              className="btn-primary"
              id="btnSaveFormConfigTop"
              onClick={handleSaveFormConfig}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Save Form Configuration</span>
            </button>
          </div>
        )}
      </div>

      {/* FULL-PAGE CONTENT AREA */}
      <div style={{ width: '100%' }}>
        {/* ========================================================
            MODE 1: ADMIN FORM BUILDER (CREATE FORM BY ADMIN)
            ======================================================== */}
        {viewMode === 'builder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            {/* Top Info Banner for Admin */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                background: 'linear-gradient(135deg, rgba(99, 54, 235, 0.06) 0%, rgba(241, 245, 249, 0.7) 100%)',
                border: '1px solid rgba(99, 54, 235, 0.18)',
                borderRadius: '14px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#6336EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>
                    Support Query Form Builder (Admin Mode)
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--neutral-500, #64748B)', margin: '2px 0 0' }}>
                    Build custom fields, configure support categories, and customize questions for users to fill.
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#6336EB',
                  background: 'rgba(99, 54, 235, 0.08)',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}
              >
                ● Live Builder Active
              </span>
            </div>

            {/* 2-Column Full Width Builder Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
                gap: '24px',
                width: '100%',
                alignItems: 'start'
              }}
            >
              {/* LEFT COLUMN: Form Branding, Core Fields & Categories */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Card 1: Form Header & Title Settings */}
                <div
                  className="content-card"
                  style={{
                    background: 'var(--bg-surface, #ffffff)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    padding: '24px 26px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-default, #F1F5F9)', paddingBottom: '14px', marginBottom: '18px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>Form Titles &amp; Instructions</h3>
                      <p style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', margin: '2px 0 0' }}>Displayed at the top of the user support form</p>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" htmlFor="cfgFormTitle" style={{ fontWeight: 600 }}>Form Heading Title</label>
                    <input
                      type="text"
                      id="cfgFormTitle"
                      className="form-input"
                      value={formConfig.formTitle}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, formTitle: e.target.value }))}
                      placeholder="e.g. Ask Anything — Support & Query Desk"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" htmlFor="cfgFormSubtitle" style={{ fontWeight: 600 }}>Form Description / User Prompt</label>
                    <textarea
                      id="cfgFormSubtitle"
                      className="form-textarea"
                      rows={3}
                      value={formConfig.formSubtitle}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, formSubtitle: e.target.value }))}
                      placeholder="Instructions guiding users to ask anything..."
                      style={{ minHeight: '80px', lineHeight: 1.45 }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cfgSlaNotice" style={{ fontWeight: 600 }}>Estimated Response SLA Message</label>
                    <input
                      type="text"
                      id="cfgSlaNotice"
                      className="form-input"
                      value={formConfig.slaNotice}
                      onChange={(e) => setFormConfig(prev => ({ ...prev, slaNotice: e.target.value }))}
                      placeholder="e.g. Our dedicated support team responds within 1–2 hours."
                    />
                  </div>
                </div>

                {/* Card 2: Standard Core Demographic Fields */}
                <div
                  className="content-card"
                  style={{
                    background: 'var(--bg-surface, #ffffff)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    padding: '24px 26px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-default, #F1F5F9)', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>Standard Core Fields</h3>
                      <p style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', margin: '2px 0 0' }}>Core contact &amp; ticket details included on every submission</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { name: 'Your Full Name', desc: 'Identifies the user querying support', locked: true },
                      { name: 'Email Address', desc: 'Destination for status replies & ticket notifications', locked: true },
                      { name: 'Query Subject', desc: 'One-line summary of what the user is asking', locked: true },
                      { name: 'Your Question / Detailed Query', desc: 'The comprehensive query message asking anything', locked: true }
                    ].map((field, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--neutral-50, #F8FAFC)' }}>
                        <div>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary, #111827)' }}>{field.name}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', marginTop: '1px' }}>{field.desc}</div>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#94A3B8', background: 'var(--bg-surface-subtle, #F1F5F9)', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          Standard Field
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Form Options Toggles */}
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-default, #F1F5F9)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-primary, #111827)' }}>Allow Screenshot / File Attachments</strong>
                        <div style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)' }}>Enables users to upload error screenshots, PDFs, logs</div>
                      </div>
                      <label className="active-toggle-ios">
                        <input
                          type="checkbox"
                          checked={formConfig.allowAttachments}
                          onChange={(e) => setFormConfig(prev => ({ ...prev, allowAttachments: e.target.checked }))}
                        />
                        <span className="active-toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-primary, #111827)' }}>Enable Priority Level Selector</strong>
                        <div style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)' }}>Allows user to select urgency (Low, Medium, High, Urgent)</div>
                      </div>
                      <label className="active-toggle-ios">
                        <input
                          type="checkbox"
                          checked={formConfig.enablePriority}
                          onChange={(e) => setFormConfig(prev => ({ ...prev, enablePriority: e.target.checked }))}
                        />
                        <span className="active-toggle-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Card 3: Support Categories Manager */}
                <div
                  className="content-card"
                  style={{
                    background: 'var(--bg-surface, #ffffff)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    padding: '24px 26px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default, #F1F5F9)', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>
                          Query Categories ({formConfig.categories.length})
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', margin: '2px 0 0' }}>Options available in the Category dropdown</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      style={{ background: 'none', border: 'none', color: '#6336EB', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Category
                    </button>
                  </div>

                  {isAddingCategory && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--bg-surface-subtle, #F8FAFC)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-default, #E2E8F0)' }}>
                      <input
                        type="text"
                        autoFocus
                        value={newCategoryText}
                        onChange={(e) => setNewCategoryText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                        placeholder="e.g. Sponsorship & Partnerships"
                        className="form-input"
                        style={{ flex: 1, padding: '7px 12px', fontSize: '13px' }}
                      />
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleAddCategory}
                        style={{ padding: '7px 14px', fontSize: '12.5px' }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => { setIsAddingCategory(false); setNewCategoryText(''); }}
                        style={{ padding: '7px 12px', fontSize: '12.5px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formConfig.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'var(--bg-surface-subtle, #F1F5F9)',
                          border: '1px solid var(--border-default, #E2E8F0)',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          color: 'var(--text-primary, #111827)'
                        }}
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(cat)}
                          title="Remove category"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '14px',
                            lineHeight: 1,
                            padding: 0
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Custom Questions Builder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div
                  className="content-card"
                  style={{
                    background: 'var(--bg-surface, #ffffff)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    padding: '24px 26px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default, #F1F5F9)', paddingBottom: '14px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>
                          Custom Form Questions ({formConfig.customQuestions?.length || 0})
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', margin: '2px 0 0' }}>
                          Add extra questions that users must or can answer when querying
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btnAddCustomQuestion"
                      onClick={() => setIsAddingQuestion(true)}
                      style={{
                        background: 'rgba(99, 54, 235, 0.08)',
                        border: '1px solid rgba(99, 54, 235, 0.2)',
                        color: '#6336EB',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Question
                    </button>
                  </div>

                  {/* Inline Question Builder */}
                  {isAddingQuestion && (
                    <div
                      style={{
                        background: 'var(--bg-surface-subtle, #F8FAFC)',
                        padding: '18px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--knotnex-primary, #6336EB)',
                        marginBottom: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1E1B4B' }}>Create New Support Question</div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Question Title / Prompt *</label>
                        <input
                          type="text"
                          className="form-input"
                          autoFocus
                          value={newQuestionTitle}
                          onChange={(e) => setNewQuestionTitle(e.target.value)}
                          placeholder="e.g. What is your attendee registration or ticket ID?"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Field Type</label>
                          <select
                            className="form-select"
                            value={newQuestionType}
                            onChange={(e) => setNewQuestionType(e.target.value)}
                          >
                            <option value="SHORT TEXT">Short Text</option>
                            <option value="PARAGRAPH">Paragraph / Long Text</option>
                            <option value="DROPDOWN">Dropdown List</option>
                            <option value="CHECKBOXES">Multiple Choice Checkboxes</option>
                            <option value="FILE UPLOAD">File Upload</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Placeholder / Hint</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newQuestionHint}
                            onChange={(e) => setNewQuestionHint(e.target.value)}
                            placeholder="e.g. Enter ID or N/A"
                          />
                        </div>
                      </div>

                      {(newQuestionType === 'DROPDOWN' || newQuestionType === 'CHECKBOXES') && (
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Options (comma separated)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newQuestionOptions}
                            onChange={(e) => setNewQuestionOptions(e.target.value)}
                            placeholder="e.g. High Priority, Normal Priority, Minor Inquiry"
                          />
                        </div>
                      )}

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary, #111827)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newQuestionRequired}
                          onChange={(e) => setNewQuestionRequired(e.target.checked)}
                          style={{ accentColor: '#6336EB' }}
                        />
                        <span>Mark as required field (user must answer)</span>
                      </label>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setIsAddingQuestion(false)}
                          style={{ padding: '6px 14px', fontSize: '12.5px' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleAddQuestion}
                          style={{ padding: '6px 16px', fontSize: '12.5px' }}
                        >
                          Save Question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Custom Questions */}
                  {(!formConfig.customQuestions || formConfig.customQuestions.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--neutral-400, #94A3B8)' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>No custom questions added yet. Click "+ Add Question" to create one.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formConfig.customQuestions.map((q) => (
                        <div
                          key={q.id}
                          style={{
                            padding: '14px 16px',
                            background: 'var(--bg-surface-subtle, #F8FAFC)',
                            border: '1px solid var(--border-default, #E2E8F0)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '13.5px', color: 'var(--text-primary, #111827)' }}>{q.title}</strong>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  background: 'rgba(99, 54, 235, 0.08)',
                                  color: '#6336EB',
                                  padding: '2px 7px',
                                  borderRadius: '6px'
                                }}
                              >
                                {q.type}
                              </span>
                              {q.required ? (
                                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>*Required</span>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--neutral-400, #94A3B8)' }}>Optional</span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--neutral-500, #64748B)', marginTop: '4px' }}>
                              Hint: {q.hint}
                            </div>
                            {q.options && q.options.length > 0 && (
                              <div style={{ fontSize: '11.5px', color: '#6336EB', marginTop: '3px' }}>
                                Options: {q.options.join(', ')}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            title="Delete question"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card 4: Quick Preview & Save Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 54, 235, 0.04) 0%, rgba(248, 250, 252, 0.8) 100%)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    padding: '24px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>
                      Ready to test or publish this form?
                    </h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--neutral-500, #64748B)', margin: '4px 0 0', lineHeight: 1.5 }}>
                      You can save these settings or switch directly into "Fill Form (User View)" to test the live submission flow.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleSaveFormConfig}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Save Form Settings</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        handleSaveFormConfig();
                        setViewMode('fill');
                        setSubmittedTicket(null);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span>Fill Form as User →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE 2: USER FILL FORM (LIVE FULL-PAGE FORM FOR USERS)
            ======================================================== */}
        {viewMode === 'fill' && (
          <div style={{ width: '100%' }}>
            {submittedTicket ? (
              /* Success Confirmation Card */
              <div
                className="content-card"
                style={{
                  padding: '40px 32px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-default, #E2E8F0)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary, #111827)', marginBottom: '6px' }}>
                  Query Submitted Successfully!
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--neutral-500, #64748B)', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                  Thank you for reaching out. We have registered your support ticket and sent a confirmation to <strong style={{ color: 'var(--text-primary, #111827)' }}>{submittedTicket.email}</strong>. {formConfig.slaNotice}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px',
                    background: 'var(--bg-surface-subtle, #F8FAFC)',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    borderRadius: '999px',
                    marginBottom: '28px',
                    fontSize: '13.5px'
                  }}
                >
                  <span style={{ color: 'var(--neutral-500, #64748B)' }}>Ticket Reference:</span>
                  <span style={{ fontWeight: 700, color: 'var(--knotnex-primary, #6336EB)', letterSpacing: '0.02em' }}>
                    {submittedTicket.id}
                  </span>
                </div>

                {/* Submitted Summary Details Box */}
                <div
                  style={{
                    textAlign: 'left',
                    background: 'var(--bg-surface-subtle, #F8FAFC)',
                    border: '1px solid var(--border-default, #E2E8F0)',
                    borderRadius: '14px',
                    padding: '24px',
                    marginBottom: '28px',
                    maxWidth: '800px',
                    margin: '0 auto 28px'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)', textTransform: 'uppercase', fontWeight: 600 }}>Subject</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #111827)', marginTop: '2px' }}>{submittedTicket.subject}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)', textTransform: 'uppercase', fontWeight: 600 }}>Category</div>
                      <div style={{ fontSize: '13.5px', color: 'var(--text-primary, #111827)', marginTop: '2px' }}>{submittedTicket.category}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)', textTransform: 'uppercase', fontWeight: 600 }}>Priority</div>
                      <div style={{ marginTop: '4px' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            textTransform: 'capitalize',
                            background: PRIORITIES.find(p => p.id === submittedTicket.priority)?.bg || '#F5F3FF',
                            color: PRIORITIES.find(p => p.id === submittedTicket.priority)?.color || '#6336EB'
                          }}
                        >
                          {submittedTicket.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Query Message</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary, #475467)', lineHeight: 1.5, background: 'var(--bg-surface, #ffffff)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-default, #E2E8F0)' }}>
                      {submittedTicket.message}
                    </div>
                  </div>

                  {submittedTicket.customAnswers && Object.keys(submittedTicket.customAnswers).length > 0 && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-default, #E2E8F0)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>
                        Custom Field Responses
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        {Object.entries(submittedTicket.customAnswers).map(([qId, ans]) => {
                          const q = formConfig.customQuestions?.find(item => item.id === qId);
                          return (
                            <div key={qId} style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-default, #E2E8F0)' }}>
                              <div style={{ fontSize: '11.5px', color: 'var(--neutral-500, #64748B)' }}>{q?.title || 'Question'}</div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #111827)', marginTop: '2px' }}>{ans || 'N/A'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {submittedTicket.attachment && (
                    <div style={{ marginTop: '14px', fontSize: '12.5px', color: 'var(--neutral-500, #64748B)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span>Attachment: <strong>{submittedTicket.attachment}</strong></span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    id="btnReturnToBuilderFromSuccess"
                    onClick={() => setViewMode('builder')}
                  >
                    ← Back to Form Builder
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    id="btnAskAnotherQuery"
                    onClick={handleResetUserForm}
                  >
                    Fill Another Query
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setViewMode('submissions')}
                  >
                    View All Submissions
                  </button>
                </div>
              </div>
            ) : (
              /* Live Full-Page User Form Card */
              <div
                className="content-card"
                style={{
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-default, #E2E8F0)',
                  borderRadius: '16px',
                  boxShadow: '0 2px 14px rgba(0, 0, 0, 0.03)',
                  overflow: 'hidden',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {/* Form Hero Banner Header Prompt */}
                <div
                  style={{
                    padding: '28px 32px 24px',
                    background: 'linear-gradient(135deg, rgba(99, 54, 235, 0.05) 0%, rgba(248, 250, 252, 0.8) 100%)',
                    borderBottom: '1px solid var(--border-default, #E2E8F0)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'var(--knotnex-primary, #6336EB)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(99, 54, 235, 0.25)'
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>

                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: '0 0 4px' }}>
                          {formConfig.formTitle || 'Ask Anything — Support & Query Desk'}
                        </h2>
                        <p style={{ fontSize: '13.5px', color: 'var(--neutral-500, #64748B)', margin: 0, lineHeight: 1.5, maxWidth: '800px' }}>
                          {formConfig.formSubtitle || 'Have a question, facing an issue, or need help with Knotnex? Ask us anything below.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setViewMode('builder')}
                      style={{ fontSize: '12.5px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>Edit in Form Builder</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields Body */}
                <form onSubmit={handleUserFormSubmit} style={{ padding: '30px 32px' }}>
                  {/* Two Column: Name & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '22px', marginBottom: '22px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="userFormName" style={{ fontWeight: 600 }}>
                        Your Full Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="userFormName"
                        name="name"
                        value={userFormData.name}
                        onChange={handleUserInputChange}
                        placeholder="e.g. Ravi Prasanth"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="userFormEmail" style={{ fontWeight: 600 }}>
                        Email Address <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        id="userFormEmail"
                        name="email"
                        value={userFormData.email}
                        onChange={handleUserInputChange}
                        placeholder="e.g. ravi@knotnex.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Two Column: Category & Priority */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '22px', marginBottom: '22px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="userFormCategory" style={{ fontWeight: 600 }}>
                        Query Category <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        id="userFormCategory"
                        name="category"
                        value={userFormData.category}
                        onChange={handleUserInputChange}
                      >
                        {formConfig.categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {formConfig.enablePriority && (
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600 }}>Priority Level</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {PRIORITIES.map(p => {
                            const isSelected = userFormData.priority === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setUserFormData(prev => ({ ...prev, priority: p.id }))}
                                style={{
                                  flex: 1,
                                  minWidth: '70px',
                                  padding: '9px 10px',
                                  borderRadius: '8px',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  border: isSelected ? `2px solid ${p.color}` : '1px solid var(--border-default, #E2E8F0)',
                                  background: isSelected ? p.bg : 'var(--bg-surface, #ffffff)',
                                  color: isSelected ? p.color : 'var(--neutral-600, #475467)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'center'
                                }}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Query Subject */}
                  <div className="form-group" style={{ marginBottom: '22px' }}>
                    <label className="form-label" htmlFor="userFormSubject" style={{ fontWeight: 600 }}>
                      Query Subject <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="userFormSubject"
                      name="subject"
                      value={userFormData.subject}
                      onChange={handleUserInputChange}
                      placeholder="Brief summary of your question (e.g. How do I configure gate check-in turnstiles?)"
                      required
                    />
                  </div>

                  {/* Ask Anything - Detailed Query Message */}
                  <div className="form-group" style={{ marginBottom: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" htmlFor="userFormMessage" style={{ fontWeight: 600 }}>
                        Your Question / Detailed Query <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: '12px', color: 'var(--neutral-400, #94A3B8)' }}>
                        Feel free to ask anything in detail
                      </span>
                    </div>
                    <textarea
                      className="form-textarea"
                      id="userFormMessage"
                      name="message"
                      rows={5}
                      value={userFormData.message}
                      onChange={handleUserInputChange}
                      placeholder="Ask anything... Describe your question, query, or problem in detail. The more details you share, the faster our specialists can help."
                      style={{ minHeight: '120px', lineHeight: 1.5 }}
                      required
                    />
                  </div>

                  {/* DYNAMIC CUSTOM QUESTIONS (Configured by Admin Builder) */}
                  {formConfig.customQuestions && formConfig.customQuestions.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-default, #F1F5F9)', paddingTop: '20px', marginBottom: '22px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary, #111827)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Additional Information Requested by Admin</span>
                        <span style={{ fontSize: '11px', background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB', padding: '2px 8px', borderRadius: '6px' }}>
                          {formConfig.customQuestions.length} custom fields
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '20px' }}>
                        {formConfig.customQuestions.map((q) => (
                          <div key={q.id} className="form-group">
                            <label className="form-label" htmlFor={`customField-${q.id}`} style={{ fontWeight: 600 }}>
                              {q.title} {q.required && <span style={{ color: '#EF4444' }}>*</span>}
                            </label>

                            {q.type === 'PARAGRAPH' ? (
                              <textarea
                                id={`customField-${q.id}`}
                                className="form-textarea"
                                rows={3}
                                value={userFormData.customAnswers[q.id] || ''}
                                onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                                placeholder={q.hint || 'Enter response...'}
                                required={q.required}
                              />
                            ) : q.type === 'DROPDOWN' ? (
                              <select
                                id={`customField-${q.id}`}
                                className="form-select"
                                value={userFormData.customAnswers[q.id] || ''}
                                onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                                required={q.required}
                              >
                                <option value="">-- Select an option --</option>
                                {(q.options || []).map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : q.type === 'CHECKBOXES' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-surface-subtle, #F8FAFC)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-default, #E2E8F0)' }}>
                                {(q.options || ['Yes', 'No']).map((opt, oIdx) => (
                                  <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`customRadio-${q.id}`}
                                      value={opt}
                                      checked={userFormData.customAnswers[q.id] === opt}
                                      onChange={() => handleCustomAnswerChange(q.id, opt)}
                                      style={{ accentColor: '#6336EB' }}
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <input
                                type="text"
                                id={`customField-${q.id}`}
                                className="form-input"
                                value={userFormData.customAnswers[q.id] || ''}
                                onChange={(e) => handleCustomAnswerChange(q.id, e.target.value)}
                                placeholder={q.hint || 'Enter answer...'}
                                required={q.required}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional File Attachment */}
                  {formConfig.allowAttachments && (
                    <div className="form-group" style={{ marginBottom: '28px' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Attachment (Optional)</label>

                      {userFormData.attachment ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: 'var(--bg-surface-subtle, #F8FAFC)',
                            border: '1px solid var(--border-default, #E2E8F0)',
                            borderRadius: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-primary, #111827)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span>{userFormData.attachment}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveAttachment}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#EF4444',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 600
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="userFileUpload"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 20px',
                            border: '1.5px dashed var(--border-default, #CBD5E1)',
                            borderRadius: '10px',
                            background: 'var(--bg-surface-subtle, #F8FAFC)',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--knotnex-primary, #6336EB)" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span style={{ fontSize: '13.5px', color: 'var(--neutral-600, #475467)' }}>
                            Attach screenshots, error documents, or files <strong style={{ color: 'var(--knotnex-primary, #6336EB)' }}>(Click to upload)</strong>
                          </span>
                          <input
                            id="userFileUpload"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Submission Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '12px',
                      paddingTop: '22px',
                      borderTop: '1px solid var(--border-default, #E2E8F0)'
                    }}
                  >
                    <button
                      type="button"
                      className="btn-secondary"
                      id="btnResetUserForm"
                      onClick={handleResetUserForm}
                      disabled={isSubmitting}
                    >
                      Clear Form
                    </button>

                    <button
                      type="submit"
                      className="btn-primary"
                      id="btnSubmitUserQuery"
                      disabled={isSubmitting}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '150px', justifyContent: 'center' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          <span>Submit Query</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODE 3: SUBMITTED QUERIES TRACKER
            ======================================================== */}
        {viewMode === 'submissions' && (
          <div
            className="content-card"
            style={{
              padding: '28px 30px',
              borderRadius: '16px',
              background: 'var(--bg-surface, #ffffff)',
              border: '1px solid var(--border-default, #E2E8F0)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #111827)', margin: 0 }}>
                  Submitted Support Queries ({supportQueries?.length || 0})
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--neutral-500, #64748B)', margin: '4px 0 0' }}>
                  Queries submitted through the admin configured support form
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setViewMode('builder')}
                  style={{ fontSize: '13px', padding: '7px 14px' }}
                >
                  Configure Form
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setViewMode('fill');
                    setSubmittedTicket(null);
                  }}
                  style={{ fontSize: '13px', padding: '7px 14px' }}
                >
                  + Fill New Query
                </button>
              </div>
            </div>

            {(!supportQueries || supportQueries.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--neutral-400, #94A3B8)' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div style={{ fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '4px', fontSize: '15px' }}>
                  No Queries Submitted Yet
                </div>
                <div style={{ fontSize: '13px', marginBottom: '18px' }}>
                  Switch to "Fill Form (User View)" to submit your first support query.
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setViewMode('fill')}
                >
                  Fill Query Form
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {supportQueries.map(query => {
                  const priorityMeta = PRIORITIES.find(p => p.id === query.priority) || { label: 'Medium', color: '#6336EB', bg: '#F5F3FF' };
                  const isResolved = query.status === 'Resolved';

                  return (
                    <div
                      key={query.id}
                      style={{
                        padding: '20px 22px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default, #E2E8F0)',
                        background: 'var(--bg-surface-subtle, #FAFAFA)',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--knotnex-primary, #6336EB)' }}>
                              {query.id}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--neutral-400, #94A3B8)' }}>•</span>
                            <span style={{ fontSize: '12.5px', color: 'var(--neutral-500, #64748B)' }}>
                              {query.createdAt}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--neutral-400, #94A3B8)' }}>•</span>
                            <span style={{ fontSize: '12.5px', color: 'var(--neutral-500, #64748B)' }}>
                              From: <strong>{query.name}</strong> ({query.email})
                            </span>
                          </div>
                          <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
                            {query.subject}
                          </h4>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 700,
                              padding: '3px 9px',
                              borderRadius: '999px',
                              background: priorityMeta.bg,
                              color: priorityMeta.color
                            }}
                          >
                            {priorityMeta.label}
                          </span>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '999px',
                              background: isResolved ? '#ECFDF5' : '#EFF6FF',
                              color: isResolved ? '#059669' : '#2563EB',
                              border: `1px solid ${isResolved ? '#A7F3D0' : '#BFDBFE'}`
                            }}
                          >
                            ● {query.status || 'Open'}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary, #475467)', margin: '0 0 12px', lineHeight: 1.5 }}>
                        {query.message}
                      </p>

                      {query.customAnswers && Object.keys(query.customAnswers).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          {Object.entries(query.customAnswers).map(([qId, ans]) => {
                            const q = formConfig.customQuestions?.find(item => item.id === qId);
                            return (
                              <span key={qId} style={{ fontSize: '12px', background: '#fff', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px' }}>
                                <strong style={{ color: '#6336EB' }}>{q?.title || 'Field'}:</strong> {ans}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--neutral-500, #64748B)', borderTop: '1px solid var(--border-default, #F1F5F9)', paddingTop: '10px' }}>
                        <div>
                          <span>Category: <strong>{query.category}</strong></span>
                        </div>
                        {query.attachment && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span>{query.attachment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
