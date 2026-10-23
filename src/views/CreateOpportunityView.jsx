import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/common/BackButton';
import JobApplicationFormBuilder from './JobApplicationFormBuilder';

const DEPARTMENT_OPTIONS = [
  { value: 'Product & Design', label: 'Product & Design' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Community & Growth', label: 'Community & Growth' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Marketing & Outreach', label: 'Marketing & Outreach' }
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Fellowship', label: 'Fellowship' },
  { value: 'Internship', label: 'Internship' }
];

const PERK_OPTIONS = [
  { id: 'health', label: 'Health Coverage' },
  { id: 'remote', label: 'Remote Setup Allowance' },
  { id: 'budget', label: '₹1,50,000 Learning Budget' },
  { id: 'hours', label: 'Flexible Work Hours' },
  { id: 'equity', label: 'Equity / ESOPs' },
  { id: 'wellness', label: 'Mental Wellness Days' }
];

const DEFAULT_REQUIREMENTS = `• 4+ years leading design systems and WCAG AAA accessibility workflows.
• Proven track record with Figma design tokens, rapid prototyping, and micro-interactions.
• Experience collaborating with cross-functional teams in high-growth ecosystems.
• Strong written and verbal communication skills with community empathy.`;

/**
 * Dropdown component mirroring the App Bar "+ Create" button dropdown layout:
 * - .appbar-dropdown-anchor wrapper
 * - .appbar-create-menu-dropdown card layout
 * - .appbar-menu-row item layout
 */
function AppbarStyleDropdown({ id, label, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="appbar-dropdown-anchor" ref={dropdownRef} style={{ width: '100%', position: 'relative' }}>
        <button
          type="button"
          id={id}
          className="form-input form-select-appbar-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          style={{
            width: '100%',
            height: '42px',
            padding: '0 14px',
            background: '#FFFFFF',
            border: isOpen ? '1.5px solid #6336EB' : '1px solid #DDE2E9',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#111827',
            boxShadow: isOpen ? '0 0 0 3px rgba(99, 54, 235, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.18s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            if (!isOpen) e.currentTarget.style.borderColor = '#C4B5FD';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.currentTarget.style.borderColor = '#DDE2E9';
          }}
        >
          <span>{selectedOption?.label}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2.5"
            style={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="appbar-create-menu-dropdown"
            role="listbox"
            style={{
              width: '100%',
              left: 0,
              right: 'auto',
              top: 'calc(100% + 6px)',
              minWidth: '220px',
              boxSizing: 'border-box',
              zIndex: 120
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className="appbar-menu-row"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: isSelected ? '#F3EFFF' : undefined,
                    color: isSelected ? '#6336EB' : '#111827',
                    fontWeight: isSelected ? 600 : 500,
                    padding: '10px 14px'
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '18px', color: '#6336EB' }}
                    >
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateOpportunityView() {
  const { navigateTo, addJob, updateJob, showToast, editingJob } = useApp();

  const [currentStep, setCurrentStep] = useState('details'); // 'details' | 'formBuilder'

  const [jobData, setJobData] = useState(() => ({
    title: editingJob?.title || '',
    dept: editingJob?.dept || 'Product & Design',
    type: editingJob?.type || 'Full-time',
    location: editingJob?.location || '',
    salary: editingJob?.salary || '',
    experience: editingJob?.experience || '',
    desc: editingJob?.desc || '',
    poster: editingJob?.poster || ''
  }));

  const [selectedPerks, setSelectedPerks] = useState(() => editingJob?.perks || []);

  // Application Form Configuration State (matching Event Registration Form Builder)
  const [resumeRequired, setResumeRequired] = useState(
    () => editingJob?.formConfig?.resumeRequired ?? true
  );
  const [accommodationsEnabled, setAccommodationsEnabled] = useState(
    () => editingJob?.formConfig?.accommodationsEnabled ?? true
  );
  const [accommodations, setAccommodations] = useState(
    () =>
      editingJob?.formConfig?.accommodations || [
        { id: 'acc-1', label: 'Wheelchair Desk & Step-Free Workspace', checked: true },
        { id: 'acc-2', label: 'Indian Sign Language (ISL) Interpreter', checked: true },
        { id: 'acc-3', label: 'Screen Reader & Tactile / Braille Materials', checked: true },
        { id: 'acc-4', label: 'Assistive Transport & Dedicated Parking', checked: true },
        { id: 'acc-5', label: 'Quiet / Low-Sensory Interview Room', checked: true },
        { id: 'acc-6', label: 'Flexible Schedule / Neurodivergent Support', checked: true }
      ]
  );

  const [customQuestions, setCustomQuestions] = useState(
    () =>
      editingJob?.formConfig?.customQuestions || [
        { id: 'cq-1', title: 'Years of relevant experience in this domain', type: 'SHORT TEXT', required: true, hint: 'e.g. 4+ years' },
        { id: 'cq-2', title: 'Portfolio / GitHub / Work Samples URL', type: 'SHORT TEXT', required: true, hint: 'https://...' },
        { id: 'cq-3', title: 'Notice period / Earliest available start date', type: 'DROPDOWN', required: false, hint: 'Choices: Immediate, 15 days, 30 days, 60 days' }
      ]
  );

  const [instantConfirmation, setInstantConfirmation] = useState(
    () => editingJob?.formConfig?.instantConfirmation ?? true
  );
  const [capApplications, setCapApplications] = useState(
    () => editingJob?.formConfig?.capApplications ?? false
  );
  const [applicationLimit, setApplicationLimit] = useState(
    () => editingJob?.formConfig?.applicationLimit || '50'
  );

  const changeStep = (nextStep) => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) mainArea.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetScroll();
    setCurrentStep(nextStep);
    requestAnimationFrame(resetScroll);
    setTimeout(resetScroll, 50);
  };

  useEffect(() => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) mainArea.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
    const t = setTimeout(resetScroll, 50);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    if (editingJob) {
      setJobData({
        title: editingJob.title || '',
        dept: editingJob.dept || 'Product & Design',
        type: editingJob.type || 'Full-time',
        location: editingJob.location || '',
        salary: editingJob.salary || '',
        experience: editingJob.experience || '',
        desc: editingJob.desc || '',
        poster: editingJob.poster || ''
      });
      setSelectedPerks(editingJob.perks || []);
      if (editingJob.formConfig) {
        setResumeRequired(editingJob.formConfig.resumeRequired ?? true);
        setAccommodationsEnabled(editingJob.formConfig.accommodationsEnabled ?? true);
        if (editingJob.formConfig.accommodations) {
          setAccommodations(editingJob.formConfig.accommodations);
        }
        if (editingJob.formConfig.customQuestions) {
          setCustomQuestions(editingJob.formConfig.customQuestions);
        }
        setInstantConfirmation(editingJob.formConfig.instantConfirmation ?? true);
        setCapApplications(editingJob.formConfig.capApplications ?? false);
        setApplicationLimit(editingJob.formConfig.applicationLimit || '50');
      }
    } else {
      setJobData({
        title: '',
        dept: 'Product & Design',
        type: 'Full-time',
        location: '',
        salary: '',
        experience: '',
        desc: '',
        poster: ''
      });
      setSelectedPerks([]);
    }
  }, [editingJob]);

  const togglePerk = (id) => {
    setSelectedPerks((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handlePublish = (customFormConfig) => {
    if (!jobData.title?.trim()) {
      showToast('Please enter a role title', 'warning');
      changeStep('details');
      return;
    }

    const resolvedFormConfig = customFormConfig || {
      resumeRequired,
      accommodationsEnabled,
      accommodations: accommodationsEnabled ? accommodations.filter((a) => a.checked) : [],
      customQuestions,
      instantConfirmation,
      capApplications,
      applicationLimit
    };

    const newJob = {
      ...(editingJob || {}),
      id: editingJob?.id || `job-${Date.now()}`,
      ...jobData,
      title: jobData.title.trim(),
      dept: jobData.dept || 'Product & Design',
      type: jobData.type || 'Full-time',
      location: jobData.location.trim() || 'Remote',
      salary: jobData.salary.trim() || 'Competitive',
      experience: jobData.experience.trim() || 'Not specified',
      desc: jobData.desc.trim(),
      perks: selectedPerks,
      status: editingJob?.status || 'active',
      posted: editingJob?.posted || 'Just now',
      applicantsCount: editingJob?.applicantsCount || 0,
      formConfig: resolvedFormConfig
    };

    if (editingJob && updateJob) {
      updateJob(editingJob.id, newJob);
      showToast(`Opportunity "${newJob.title}" updated successfully!`, 'success');
    } else {
      addJob(newJob);
      showToast(`Opportunity "${newJob.title}" published successfully!`, 'success');
    }
    navigateTo('careers');
  };

  // Step 2: Form Builder screen (Matching Event Registration Form Builder)
  if (currentStep === 'formBuilder') {
    return (
      <JobApplicationFormBuilder
        jobData={jobData}
        initialFormConfig={{
          resumeRequired,
          accommodationsEnabled,
          accommodations,
          customQuestions,
          instantConfirmation,
          capApplications,
          applicationLimit
        }}
        onPublishComplete={(newConfig) => handlePublish(newConfig)}
        onBackToDetails={() => changeStep('details')}
        showToast={showToast}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
      <section className="app-view active" id="viewCreateOpportunity" style={{ paddingBottom: '32px', flex: 1 }}>
        {/* Top Header: Back Button alone */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <BackButton
            id="btnBackToCareersFromCreate"
            onClick={() => navigateTo('careers')}
          />
        </div>

      {/* Main Container */}
      <div
        className="create-opportunity-container"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Top: 2-Column Grid for Role Details & Requirements */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Role & Position Details */}
          <div className="studio-card" style={{ overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
            <div
              className="studio-card-header"
              style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
            >
              <div className="studio-card-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h3 className="studio-card-title">Role &amp; Position Details</h3>
                <p className="studio-card-desc">Specify the title, work mode, department and compensation for this opening</p>
              </div>
            </div>

            <div className="studio-card-body" style={{ padding: '22px', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="inpJobTitle">
                  Role Title <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input form-input-lg"
                  id="inpJobTitle"
                  placeholder="e.g. Senior Product Designer"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                />
              </div>

              {/* Department and Employment Type Dropdowns */}
              <div className="form-row-2">
                <AppbarStyleDropdown
                  id="inpJobDept"
                  label="Department"
                  value={jobData.dept}
                  onChange={(val) => setJobData({ ...jobData, dept: val })}
                  options={DEPARTMENT_OPTIONS}
                />

                <AppbarStyleDropdown
                  id="inpJobType"
                  label="Employment Type"
                  value={jobData.type}
                  onChange={(val) => setJobData({ ...jobData, type: val })}
                  options={EMPLOYMENT_TYPE_OPTIONS}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="inpJobLocation">Work Location</label>
                  <input
                    type="text"
                    className="form-input"
                    id="inpJobLocation"
                    placeholder="e.g. Remote (India / Global)"
                    value={jobData.location}
                    onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inpJobSalary">Compensation</label>
                  <input
                    type="text"
                    className="form-input"
                    id="inpJobSalary"
                    placeholder="e.g. ₹15,00,000 - ₹22,00,000 / yr"
                    value={jobData.salary}
                    onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inpJobExperience">Experience Required</label>
                <input
                  type="text"
                  className="form-input"
                  id="inpJobExperience"
                  placeholder="e.g. 3-5 Years"
                  value={jobData.experience}
                  onChange={(e) => setJobData({ ...jobData, experience: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Requirements & Perks */}
          <div className="studio-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="studio-card-header">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(99, 54, 235, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6336EB',
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div>
                <h3 className="studio-card-title">
                  Requirements &amp; Perks
                </h3>
                <p className="studio-card-desc">
                  Detail responsibilities, core technical skills, and candidate perks
                </p>
              </div>
            </div>

            <div className="studio-card-body" style={{ padding: '22px', gap: '20px', flex: 1 }}>
              {/* Field: Requirements & Qualifications */}
              <div className="form-group">
                <label
                  htmlFor="inpJobRequirements"
                  className="form-label"
                  style={{ marginBottom: '8px' }}
                >
                  Requirements &amp; Qualifications <span className="required-star">*</span>
                </label>
                <textarea
                  id="inpJobRequirements"
                  className="studio-card-textarea"
                  rows={6}
                  value={jobData.desc}
                  onChange={(e) => setJobData({ ...jobData, desc: e.target.value })}
                  placeholder="Detail requirements, qualifications & key responsibilities..."
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #DDE2E9',
                    background: '#FFFFFF',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#1E293B',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Field: Offered Benefits & Perks */}
              <div className="form-group">
                <label
                  className="form-label"
                  style={{ marginBottom: '8px' }}
                >
                  Offered Benefits &amp; Perks (Click to toggle)
                </label>
                <div className="perks-toggle-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PERK_OPTIONS.map((perk) => {
                    const isSelected = selectedPerks.includes(perk.id);
                    return (
                      <button
                        key={perk.id}
                        type="button"
                        className={`perk-toggle-pill ${isSelected ? 'active' : 'inactive'}`}
                        onClick={() => togglePerk(perk.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '7px 16px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: 550,
                          background: isSelected ? '#FFFFFF' : '#F9FAFB',
                          border: isSelected ? '1.5px solid #6336EB' : '1.5px solid #E2E8F0',
                          color: isSelected ? '#4F46E5' : '#64748B',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          userSelect: 'none'
                        }}
                      >
                        <span>{perk.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Sticky Bottom Bar: Cancel & Discard on left, Next: Registration Form on right */}
      <div
        style={{
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
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <button
          type="button"
          id="btnCancelOpportunity"
          onClick={() => navigateTo('careers')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            padding: '0 20px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            color: '#1E1B4B',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6336EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          Cancel &amp; Discard
        </button>

        <button
          type="button"
          id="btnNextToAppForm"
          onClick={() => changeStep('formBuilder')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 26px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #6336EB, #4D25C9)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 54, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <span>Next: Registration Form</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
