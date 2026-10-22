import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getUserAvatar } from '../data/initialData';

export default function SchemeApplicationDetailsView() {
  const {
    selectedSchemeApplication,
    updateSchemeApplication,
    showToast,
    navigateTo,
    schemeAppReturnView
  } = useApp();

  const [isApproving, setIsApproving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fallback if no application selected
  const app = selectedSchemeApplication || {
    id: 'sap-7',
    applicant: 'Pacific Rim Net-Zero College',
    orgType: 'Autonomous Higher Ed Institution',
    scheme: 'Green Campus Environmental Award',
    schemeTitle: 'Green Campus Environmental Award',
    funding: '₹10,00,000',
    requestedAmount: '₹10,00,000',
    score: '9.7 / 10',
    date: '01 Sep 2026',
    stage: 'Site Audit Passed',
    status: 'Approved',
    contactPerson: 'Prof. Suresh Balakrishnan',
    email: 'dean.infra@pacificrimcollege.edu',
    phone: '+91 98410 88204',
    city: 'Chennai, Tamil Nadu',
    summary:
      'Campus net-zero energy transformation with automated biodigesters, rainwater aquifer recharge, and solar canopy infrastructure.'
  };

  const isApproved = (app.status || '').toLowerCase() === 'approved';

  const handleConfirmApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      if (updateSchemeApplication) {
        updateSchemeApplication(app.id, {
          status: 'Approved',
          stage: 'Approved & Disbursed'
        });
      }
      setIsApproving(false);
      setShowConfirmModal(false);
      showToast(`Grant funding for "${app.applicant || app.name}" approved!`, 'success');
    }, 350);
  };

  const handleDownloadDoc = (docName) => {
    showToast(`Downloading artifact: ${docName}`, 'info');
  };

  const handleExportDossier = () => {
    showToast(`Exporting Grant Dossier for ${app.applicant || app.name}...`, 'success');
  };

  const handleBack = () => {
    navigateTo(schemeAppReturnView || 'schemes');
  };

  const documents = [
    {
      name: 'Entity Registration Certificate & 12A/80G Tax Exemption.pdf',
      type: 'pdf',
      size: '2.4 MB'
    },
    {
      name: 'Detailed Budget Breakdown & Milestone Utilization Schedule.xlsx',
      type: 'xlsx',
      size: '1.1 MB'
    },
    {
      name: 'Technical Feasibility & Environmental Impact Assessment.pdf',
      type: 'pdf',
      size: '4.8 MB'
    }
  ];

  return (
    <section className="app-view scheme-application-details-view" style={{ paddingBottom: '60px' }}>
      <div className="view-container">
        {/* 1. Breadcrumbs */}
        <nav className="event-breadcrumb-bar" aria-label="Breadcrumb" style={{ marginBottom: '18px' }}>
          <span className="breadcrumb-link" onClick={() => navigateTo('dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Dashboard</span>
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-link" onClick={() => navigateTo('schemes')}>
            Schemes
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">
            {app.applicant || app.name || 'Grant Application Profile'}
          </span>
        </nav>

        {/* 2. Top Header Toolbar */}
        <header className="event-header-top" style={{ marginBottom: '24px' }}>
          <div className="event-title-cluster" style={{ alignItems: 'flex-start' }}>
            <button
              type="button"
              className="btn-back-circle"
              onClick={handleBack}
              title="Back to Applications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="event-heading-text">
              <div className="event-main-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Grant Application Profile
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    background: isApproved ? '#ECFDF3' : '#FFFBEB',
                    color: isApproved ? '#027A48' : '#B54708',
                    border: `1px solid ${isApproved ? '#A6F4C5' : '#FEDF89'}`
                  }}
                >
                  {isApproved ? 'Approved ✓' : 'Pending Review'}
                </span>
              </div>
              <p className="event-sub-desc" style={{ marginTop: '4px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                Application ID: #{app.id} · Submitted {app.date || 'Recent'}
              </p>
            </div>
          </div>

          <div className="event-header-actions-group" style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-header-action secondary"
              onClick={handleExportDossier}
              title="Download applicant dossier"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export Dossier</span>
            </button>
            {!isApproved ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowConfirmModal(true)}
                style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 600, background: '#6336EB' }}
              >
                Approve Application
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => showToast(`Sanction Order PDF generated for #${app.id}`, 'success')}
                style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#027A48', borderColor: '#A6F4C5', background: '#ECFDF3' }}
              >
                Sanction Order Disbursed
              </button>
            )}
          </div>
        </header>

        {/* 3. Applicant Profile Hero Card */}
        <div
          style={{
            background: 'var(--bg-card, #FFFFFF)',
            borderRadius: '16px',
            border: '1px solid var(--border-default)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={getUserAvatar(app)}
              alt=""
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #EDE9FE',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {app.applicant || app.name}
                </h2>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    background: isApproved ? '#ECFDF3' : '#FFFBEB',
                    color: isApproved ? '#027A48' : '#B54708',
                    border: `1px solid ${isApproved ? '#A6F4C5' : '#FEDF89'}`
                  }}
                >
                  {isApproved ? 'Approved' : 'Pending Review'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {app.orgType || 'Registered Non-Profit Entity'} · Lead:{' '}
                <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {app.contactPerson || 'Authorized Representative'}
                </strong>
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: 'var(--bg-subtle, #F8FAFC)',
              borderRadius: '12px',
              border: '1px solid var(--border-default)'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
                EVALUATION SCORE
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#6336EB' }}>
                ★ {app.score || '9.6 / 10'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Core Details Parameters Grid (2x3 Grid matching screenshot cards) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '18px',
            marginBottom: '24px'
          }}
        >
          {/* Item 1: Target Scheme Program */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Target Scheme Program
            </span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {app.schemeTitle || app.scheme}
            </span>
          </div>

          {/* Item 2: Funding Grant Requested */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Funding Grant Requested
            </span>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#12B76A' }}>
              {app.requestedAmount || app.funding || '₹10,00,000'}
            </span>
          </div>

          {/* Item 3: Official Email */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Official Email
            </span>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {app.email || 'contact@entity.org'}
            </span>
          </div>

          {/* Item 4: Phone & Location */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Phone & Location
            </span>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {app.phone || '+91 98401 22910'} · {app.city || 'India'}
            </span>
          </div>

          {/* Item 5: Application Stage */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Application Stage
            </span>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#6336EB' }}>
              {app.stage || 'Final Board Review'}
            </span>
          </div>

          {/* Item 6: Compliance Status */}
          <div
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)'
            }}
          >
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Compliance Status
            </span>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#027A48', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> Verified Non-Profit Entity
            </span>
          </div>
        </div>

        {/* 5. Proposal & Project Summary Card */}
        <div
          style={{
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)'
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Proposal & Project Summary
          </h3>
          <div
            style={{
              background: 'var(--bg-subtle, #F8FAFC)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              padding: '16px 18px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}
          >
            {app.summary ||
              'Comprehensive project summary detailing technology deployment, beneficiary reach, sustainability milestones, and measurable community outcomes.'}
          </div>
        </div>

        {/* 6. Submitted Documentation & Artifacts */}
        <div
          style={{
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Submitted Documentation & Artifacts
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              All 3 required artifacts verified by Trust & Safety
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-subtle, #F8FAFC)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: doc.type === 'pdf' ? '#FEE4E2' : '#D1FADF',
                      color: doc.type === 'pdf' ? '#D92D20' : '#039855',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px'
                    }}
                  >
                    {doc.type === 'pdf' ? '📄' : '📊'}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                      {doc.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {doc.size} · Digitally Signed
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#027A48',
                      fontWeight: 600,
                      background: '#ECFDF3',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    Verified ✓
                  </span>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleDownloadDoc(doc.name)}
                    style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Institutional Governance & Audit Trail */}
        <div
          style={{
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)'
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Review Stages & Grant Audit Trail
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#027A48', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
                <span>✓ Stage 1</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Application Intake
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                Submitted {app.date || 'Recent'}
              </span>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#027A48', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
                <span>✓ Stage 2</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Legal & Tax 12A/80G Audit
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                Passed compliance checks
              </span>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#027A48', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
                <span>✓ Stage 3</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Technical Feasibility & Scoring
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                Peer Review: {app.score || '9.6 / 10'}
              </span>
            </div>

            <div
              style={{
                padding: '14px',
                background: isApproved ? '#ECFDF3' : '#FFFBEB',
                borderRadius: '10px',
                border: `1px solid ${isApproved ? '#A6F4C5' : '#FEDF89'}`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isApproved ? '#027A48' : '#B54708',
                  fontWeight: 600,
                  fontSize: '12px',
                  marginBottom: '4px'
                }}
              >
                <span>{isApproved ? '✓ Stage 4' : '⏳ Stage 4'}</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Final Discretionary Sanction
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                {isApproved ? 'Sanctioned & Active' : 'Awaiting Board Approval'}
              </span>
            </div>
          </div>
        </div>

        {/* 8. Bottom Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            background: 'var(--bg-card, #FFFFFF)',
            borderRadius: '14px',
            border: '1px solid var(--border-default)',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)'
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={handleBack}
            style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 600 }}
          >
            ← Back to Applications
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isApproved ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowConfirmModal(true)}
                disabled={isApproving}
                style={{
                  height: '38px',
                  padding: '0 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: '#12B76A',
                  borderColor: '#12B76A'
                }}
              >
                {isApproving ? 'Approving...' : 'Approve Application'}
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => showToast('Disbursement tranche initiated', 'info')}
                style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 600 }}
              >
                Manage Tranche Disbursement
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal when user clicks Approve */}
      {showConfirmModal && (
        <div
          className="modal-backdrop open"
          style={{ display: 'flex', zIndex: 1200 }}
          onClick={(e) => {
            if (e.target.classList.contains('modal-backdrop')) setShowConfirmModal(false);
          }}
        >
          <div
            className="modal-dialog"
            style={{
              maxWidth: '440px',
              width: '90%',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#ECFDF3',
                color: '#12B76A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '4px solid #D1FADF'
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Approve Scheme Application?
            </h3>

            <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to approve grant funding for{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{app.applicant || app.name}</strong>?
            </p>

            <div
              style={{
                background: 'var(--bg-subtle, #F8FAFC)',
                border: '1px solid var(--border-default)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Applied Scheme:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', textAlign: 'right' }}>
                  {app.schemeTitle || app.scheme}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Grant Funding:</span>
                <span style={{ fontWeight: 700, color: '#12B76A' }}>
                  {app.requestedAmount || app.funding || '₹10,00,000'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, height: '38px', fontSize: '13px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmApprove}
                disabled={isApproving}
                style={{ flex: 1, height: '38px', fontSize: '13px', fontWeight: 600, background: '#12B76A', borderColor: '#12B76A' }}
              >
                {isApproving ? 'Approving...' : 'Yes, Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
