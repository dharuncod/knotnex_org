import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
    try {
      const content = `KNOTNEX GRANT SCHEME PORTAL
===========================================
Document: ${docName}
Applicant: ${app.applicant || app.name || 'Applicant'}
Scheme: ${app.schemeTitle || app.scheme || 'Scheme'}
Grant Requested: ${app.requestedAmount || app.funding || 'N/A'}
Date: ${app.date || new Date().toLocaleDateString()}
Status: Verified Official Institutional Artifact
===========================================
This document contains official verification records and audited attachments submitted through the Knotnex Organization Management Portal.
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded: ${docName}`, 'success');
    } catch {
      showToast(`Downloading artifact: ${docName}`, 'info');
    }
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
                style={{ height: '38px', padding: '0 18px', fontSize: '13px', fontWeight: 600, background: '#6336EB', borderColor: '#6336EB' }}
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

        {/* 3. Hero Identity Card */}
        <div
          style={{
            background: 'var(--bg-card, #FFFFFF)',
            border: '1px solid var(--border-default)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px'
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

        {/* 4. Core Details Parameters Grid (2x3 Grid) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '14px',
            marginBottom: '24px'
          }}
        >
          {/* Item 1: Applied Grant Scheme */}
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
              Applied Grant Scheme
            </span>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {app.schemeTitle || app.scheme}
            </span>
          </div>

          {/* Item 2: Funding Requested */}
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
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#6336EB' }}>
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
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {app.summary ||
              'This initiative proposes comprehensive infrastructure deployment, measurable social and technical impact metrics, and rigorous milestone-based grant utilization audited under organizational governance rules.'}
          </p>
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
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: '#F4F3FF',
                      color: '#6336EB',
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
                    style={{
                      height: '32px',
                      padding: '0 14px',
                      fontSize: '12px',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download</span>
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
            <div
              style={{
                background: 'var(--bg-subtle, #F8FAFC)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-default)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#027A48', fontWeight: 700 }}>✓ Stage 1</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>· 02 Sep</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Document Screening
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>Passed tax & registration check</span>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle, #F8FAFC)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-default)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#027A48', fontWeight: 700 }}>✓ Stage 2</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>· 05 Sep</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Technical Verification
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>Assessed by Independent Expert Jury</span>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle, #F8FAFC)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid var(--border-default)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#027A48', fontWeight: 700 }}>✓ Stage 3</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>· 08 Sep</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Site Audit & Diligence
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>On-ground physical campus audit cleared</span>
            </div>

            <div
              style={{
                background: isApproved ? 'var(--bg-subtle, #F8FAFC)' : '#F4F3FF',
                padding: '14px',
                borderRadius: '10px',
                border: isApproved ? '1px solid var(--border-default)' : '1px solid #D9D6FE'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: isApproved ? '#027A48' : '#6336EB', fontWeight: 700 }}>
                  {isApproved ? '✓ Final' : '⏳ Current'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>· September</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                Disbursement & Sanction Order
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                {isApproved ? 'Grant Sanction Released' : 'Awaiting Administrative Approval'}
              </span>
            </div>
          </div>
        </div>

        {/* 8. Bottom Sticky Navigation & Approval Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-default)'
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
                  background: '#6336EB',
                  borderColor: '#6336EB',
                  color: '#FFFFFF'
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
      {showConfirmModal &&
        createPortal(
          <div
            className="modal-backdrop open"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '16px',
              boxSizing: 'border-box'
            }}
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
                padding: '28px 24px 24px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                background: 'var(--bg-card, #FFFFFF)',
                border: '1px solid var(--border-default)'
              }}
            >
              <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Approve Scheme Application?
              </h3>

              <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Are you sure you want to approve grant funding for{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{app.applicant || app.name}</strong>?
              </p>

              <div
                style={{
                  background: 'var(--bg-subtle, #F8FAFC)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '22px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Applied Scheme:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', textAlign: 'right' }}>
                    {app.schemeTitle || app.scheme}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Grant Funding:</span>
                  <span style={{ fontWeight: 700, color: '#6336EB' }}>
                    {app.requestedAmount || app.funding || '₹10,00,000'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmApprove}
                  disabled={isApproving}
                  style={{
                    flex: 1,
                    height: '42px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    background: '#6336EB',
                    borderColor: '#6336EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  {isApproving ? 'Approving...' : 'Yes, Approve'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
