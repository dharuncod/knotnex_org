import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import BackButton from '../components/common/BackButton';
import { getUserAvatar } from '../data/initialData';
import SearchBar from '../components/common/SearchBar';
import { downloadCSV } from '../utils/csvExport';

export default function SchemeDetailsView() {
  const {
    selectedScheme,
    schemes,
    schemeApplications,
    navigateTo,
    showToast,
    setEditingScheme,
    updateSchemeApplication,
    selectSchemeApplication,
    deleteScheme
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved'
  const [appToApprove, setAppToApprove] = useState(null); // for approval confirmation popup
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scheme = selectedScheme || schemes?.[0];

  if (!scheme) {
    return (
      <section className="app-view active" id="viewSchemeDetails">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>No grant scheme selected</h2>
          <div style={{ marginTop: '16px' }}>
            <BackButton onClick={() => navigateTo('schemes')} />
          </div>
        </div>
      </section>
    );
  }

  // Applications matching this specific scheme program
  const schemeSpecificApps = schemeApplications.filter(a => {
    const sName = (a.schemeTitle || a.scheme || '').toLowerCase().trim();
    const curName = (scheme.title || '').toLowerCase().trim();
    return sName === curName || curName.includes(sName) || sName.includes(curName);
  });

  const displayApps = schemeSpecificApps;

  const pendingCount = displayApps.filter(a => {
    const st = (a.status || '').toLowerCase();
    return st === 'pending' || st === 'under review' || st === 'shortlisted';
  }).length;

  const approvedCount = displayApps.filter(a => {
    const st = (a.status || '').toLowerCase();
    return st === 'approved' || st === 'disbursed';
  }).length;

  const filteredApps = displayApps.filter(a => {
    if (statusFilter === 'pending') {
      const st = (a.status || '').toLowerCase();
      const isPending = st === 'pending' || st === 'under review' || st === 'shortlisted';
      if (!isPending) return false;
    } else if (statusFilter === 'approved') {
      const st = (a.status || '').toLowerCase();
      const isApproved = st === 'approved' || st === 'disbursed';
      if (!isApproved) return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (a.applicant || a.name || '').toLowerCase().includes(q) ||
        (a.orgType || '').toLowerCase().includes(q) ||
        (a.contactPerson || '').toLowerCase().includes(q) ||
        (a.city || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(`Grant program "${scheme.title}" data refreshed!`, 'success');
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Applicant Entity', 'Org Type', 'Grant Scheme', 'Funding Requested', 'Score', 'Status', 'Lead Contact', 'City'];
    const rows = filteredApps.map((a, idx) => [
      String(idx + 1).padStart(2, '0'),
      a.applicant || a.name,
      a.orgType || 'Registered Non-Profit',
      a.schemeTitle || a.scheme || scheme.title,
      a.requestedAmount || a.funding || '₹10,00,000',
      a.score || '9.4 / 10',
      (a.status || 'Pending').toUpperCase(),
      a.contactPerson || 'Authorized Representative',
      a.city || 'India'
    ]);
    downloadCSV(`knotnex_${scheme.id}_beneficiaries.csv`, headers, rows);
    showToast(`Downloaded knotnex_${scheme.id}_beneficiaries.csv`, 'success');
  };

  const handleConfirmApprove = () => {
    if (!appToApprove) return;
    if (updateSchemeApplication) {
      updateSchemeApplication(appToApprove.id, {
        status: 'Approved',
        stage: 'Approved & Disbursed'
      });
    }
    showToast(`Approved grant funding of ${appToApprove.requestedAmount || appToApprove.funding || '₹10,00,000'} for ${appToApprove.applicant || appToApprove.name}!`, 'success');
    setAppToApprove(null);
  };

  return (
    <section className="app-view active" id="viewSchemeDetails">
      <div className="event-details-wrapper">

        {/* 1. Breadcrumb Navigation */}
        <nav className="event-breadcrumb-bar" aria-label="Breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigateTo('dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Dashboard</span>
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-link" onClick={() => navigateTo('schemes')}>Schemes</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{scheme.title}</span>
        </nav>

        {/* 2. Top Header Toolbar */}
        <header className="event-header-top">
          <div className="event-title-cluster">
            <button
              type="button"
              className="btn-back-circle"
              onClick={() => navigateTo('schemes')}
              title="Back to Schemes"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#F5F3FF',
                color: '#6336EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EDE9FE',
                flexShrink: 0
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>account_balance</span>
            </div>
            <div className="event-heading-text">
              <div className="event-main-title">
                <span>{scheme.title}</span>
              </div>
              <p className="event-sub-desc">
                {scheme.eligibility || 'Government & organizational subsidy, capital funding, and grant disbursement portal.'}
              </p>
            </div>
          </div>

          <div className="event-header-actions-group">
            <button
              type="button"
              className="btn-header-action secondary"
              onClick={handleExportCSV}
              title="Export roster"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              className="btn-header-action secondary"
              onClick={() => {
                if (setEditingScheme) setEditingScheme(scheme);
                navigateTo('createScheme');
              }}
              title="Edit grant program parameters"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Edit Scheme</span>
            </button>
            <button
              type="button"
              className="btn-header-action secondary"
              style={{ color: '#E11D48', borderColor: '#FECDD3' }}
              id="btnDeleteScheme"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete "${scheme.title}"? This action cannot be undone.`)) {
                  if (deleteScheme) {
                    await deleteScheme(scheme.id);
                  }
                  navigateTo('schemes');
                }
              }}
              title="Delete this scheme"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* 3. Hero Banner Card */}
        <div className="event-hero-banner-card">
          <div className="event-hero-content">
            <div className="event-hero-top-row">
              <div className="event-hero-main-info">
                <div className="event-hero-meta-chips">
                  <span className="hero-meta-chip category">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span>{scheme.category || 'Technology & R&D'}</span>
                  </span>

                  <span className="hero-meta-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Deadline: {scheme.deadline || '30 Nov 2026'}</span>
                  </span>

                  <span className="hero-meta-chip">
                    <span style={{ fontWeight: '700', color: '#12B76A' }}>{scheme.grantAmount || scheme.value || '₹25,00,000'}</span>
                    <span style={{ color: 'var(--neutral-500)', fontSize: '11px' }}>/ Program Pool</span>
                  </span>

                  <span
                    className="hero-meta-chip"
                    style={{
                      background: scheme.status === 'active' ? '#ECFDF3' : '#F2F4F7',
                      color: scheme.status === 'active' ? '#027A48' : '#475467'
                    }}
                  >
                    <span>{scheme.status === 'active' ? '● Active Program' : '○ Completed'}</span>
                  </span>
                </div>

                <p className="event-hero-description">
                  {scheme.description ||
                    `The ${scheme.title} provides financial grant allocations, seed funding, and operational subsidies to qualified non-profit institutions, academic incubators, and student teams.`}
                </p>
              </div>

              <div className="event-hero-capacity-box">
                <div className="hero-capacity-header">
                  <span className="hero-capacity-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>Fund Disbursal</span>
                  </span>
                  <span className="hero-capacity-pct">78%</span>
                </div>
                <div className="hero-capacity-bar-track">
                  <div className="hero-capacity-bar-fill" style={{ width: '78%' }} />
                </div>
                <div className="hero-capacity-footer">
                  <span>₹19.5L Disbursed</span>
                  <span className="capacity-available">₹5.5L Remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. KPI Stats Grid */}
        <div className="module-stat-grid">
          <div className="module-stat-card" id="cardSchemeTotalGrantPool" title="Approved program allocation pool">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap emerald">
                <span style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1" }}>₹</span>
              </div>
              <span className="badge-trend-pos" style={{ background: '#ECFDF3', color: '#027A48' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>Allocated</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Program Allocation Pool</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="schemeMetricAllocationPool">{scheme.grantAmount || scheme.value || '₹25,00,000'}</span>
                <span className="module-stat-unit">Grant</span>
              </div>
              <div className="module-stat-subtext">Approved state budget treasury</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardSchemeBeneficiaryApps" title="Total beneficiary applications">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="badge-trend-pos" style={{ background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB' }}>
                <span>Stage 1</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Beneficiary Applications</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="schemeMetricApplications">{displayApps.length}</span>
                <span className="module-stat-unit">Proposals</span>
              </div>
              <div className="module-stat-subtext">Screened against eligibility criteria</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardSchemeApprovedGrants" title="Grants cleared by evaluation committee">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="badge-trend-pos" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>Cleared</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Approved Grants</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="schemeMetricApproved">{approvedCount}</span>
                <span className="module-stat-unit">Grants</span>
              </div>
              <div className="module-stat-subtext">Cleared by evaluation committee</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardSchemePendingVerification" title="Awaiting administrative sign-off">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="badge-trend-pos" style={{ background: 'rgba(247,144,9,0.1)', color: '#B54708' }}>
                <span>In Review</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Pending Verification</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="schemeMetricPending">{pendingCount}</span>
                <span className="module-stat-unit">In Review</span>
              </div>
              <div className="module-stat-subtext">Awaiting final administrative sign-off</div>
            </div>
          </div>
        </div>

        {/* 5. Beneficiary Applications Console Card */}
        <div className="sheets-console-card full-screen-width">
          <div className="sheets-console-top-bar">
            <div className="sheets-count-cluster">
              <span className="sheets-count-number">{filteredApps.length}</span>
              <span className="sheets-count-label">Scheme Applications</span>
            </div>

            {/* Status Filter: All, Pending, Approved */}
            <div className="sheets-status-filter-pills">
              <button
                type="button"
                className={`sheets-filter-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
                id="filterSchemeAppAll"
                onClick={() => setStatusFilter('all')}
              >
                All ({displayApps.length})
              </button>
              <button
                type="button"
                className={`sheets-filter-pill-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                id="filterSchemeAppPending"
                onClick={() => setStatusFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                className={`sheets-filter-pill-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                id="filterSchemeAppApproved"
                onClick={() => setStatusFilter('approved')}
              >
                Approved ({approvedCount})
              </button>
            </div>

            <div className="sheets-console-actions">
              <SearchBar
                id="schemeDetailsSearchInput"
                placeholder="Search applicant entity, lead person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="280px"
              />
              <button
                type="button"
                className="circle-action-btn"
                title="Refresh application roster"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    animation: isRefreshing ? 'spin 0.6s linear infinite' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '48px' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '15%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Applicant Entity</th>
                  <th>Funding Requested</th>
                  <th>Review Score</th>
                  <th>Stage</th>
                  <th className="col-center">View</th>
                  <th className="col-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-500)' }}>
                      No applications found matching the current search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((a, idx) => (
                    <tr key={a.id || idx}>
                      <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={getUserAvatar(a, idx)}
                            alt=""
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {a.applicant || a.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                              {a.orgType || 'Registered Non-Profit'} · {a.city || 'India'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#12B76A', fontWeight: 600 }}>
                        {a.requestedAmount || a.funding || '—'}
                      </td>
                      <td>
                        <span className="status-badge-minimal" style={{ background: '#EFF8FF', color: '#175CD3', fontSize: '11.5px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          ★ {a.score || 'Review'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {a.stage || a.status || 'Under Review'}
                      </td>
                      <td className="col-center">
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#F8F9FA',
                            border: '1px solid #D0D5DD',
                            color: '#344054',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EFF8FF';
                            e.currentTarget.style.borderColor = '#84CAFF';
                            e.currentTarget.style.color = '#175CD3';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#F8F9FA';
                            e.currentTarget.style.borderColor = '#D0D5DD';
                            e.currentTarget.style.color = '#344054';
                          }}
                          onClick={() => selectSchemeApplication(a, 'schemeDetails')}
                          title={`View details for ${a.applicant || a.name}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>View</span>
                        </button>
                      </td>
                      <td className="col-right">
                        {(a.status || '').toLowerCase() === 'approved' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#ECFDF3',
                              color: '#027A48',
                              border: '1px solid #A6F4C5',
                              padding: '3px 9px',
                              borderRadius: '9999px',
                              fontSize: '11.5px',
                              fontWeight: 600
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Approved
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
                            onClick={() => setAppToApprove(a)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal: Approval Confirmation Popup */}
      {appToApprove &&
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
              if (e.target.classList.contains('modal-backdrop')) setAppToApprove(null);
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
                <strong style={{ color: 'var(--text-primary)' }}>{appToApprove.applicant || appToApprove.name}</strong>?
              </p>

              {/* Scheme & Funding Info Card */}
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
                    {appToApprove.schemeTitle || appToApprove.scheme || scheme.title}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Grant Funding:</span>
                  <span style={{ fontWeight: 700, color: '#6336EB' }}>
                    {appToApprove.requestedAmount || appToApprove.funding || '₹10,00,000'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAppToApprove(null)}
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
                  Yes, Approve
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
