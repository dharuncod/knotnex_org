import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { getUserAvatar } from '../data/initialData';
import { SchemesListSkeleton, SchemeApplicationsSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';

export default function SchemesView() {
  const {
    schemes,
    schemeApplications,
    activeSubAction,
    navigateTo,
    showToast,
    updateScheme,
    updateSchemeApplication,
    selectScheme,
    selectSchemeApplication
  } = useApp();

  const [activeTab, setActiveTab] = useState(
    activeSubAction === 'applications' || activeSubAction === 'scheme-applications'
      ? 'applications'
      : 'schemes'
  );
  const [schemeFilter, setSchemeFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [appStatusFilter, setAppStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved'
  const [appToApprove, setAppToApprove] = useState(null); // for confirmation popup
  const [searchTerm, setSearchTerm] = useState('');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (activeSubAction === 'applications' || activeSubAction === 'scheme-applications') {
      setActiveTab('applications');
    } else if (activeSubAction === 'manage-schemes' || activeSubAction === 'all-schemes') {
      setActiveTab('schemes');
    }
  }, [activeSubAction]);

  const handleToggleScheme = (s) => {
    const nextStatus = s.status === 'active' ? 'inactive' : 'active';
    if (updateScheme) {
      updateScheme(s.id, { status: nextStatus });
    }
    showToast(`Scheme "${s.title}" marked as ${nextStatus === 'active' ? 'Active' : 'Inactive'}`, nextStatus === 'active' ? 'success' : 'info');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
      setIsRefreshing(false);
      showToast('Grant schemes database synced successfully!', 'success');
    }, 400);
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(newTab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 280);
  };

  const activeSchemesCount = schemes.filter(s => s.status === 'active').length;
  const completedSchemesCount = schemes.filter(s => s.status === 'completed' || s.status === 'inactive' || s.status === 'upcoming').length;

  const pendingCount = schemeApplications.filter(a => {
    const st = (a.status || '').toLowerCase();
    return st === 'pending' || st === 'under review' || st === 'shortlisted';
  }).length;

  const approvedCount = schemeApplications.filter(a => {
    const st = (a.status || '').toLowerCase();
    return st === 'approved' || st === 'disbursed';
  }).length;

  const filteredSchemes = schemes.filter(s => {
    if (schemeFilter === 'active' && s.status !== 'active') return false;
    if (schemeFilter === 'completed' && s.status === 'active') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (s.title || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.eligibility || '').toLowerCase().includes(q);
    }
    return true;
  });

  const filteredApps = schemeApplications.filter(a => {
    // 1. Status Filter (all, pending, approved)
    if (appStatusFilter === 'pending') {
      const st = (a.status || '').toLowerCase();
      const isPending = st === 'pending' || st === 'under review' || st === 'shortlisted';
      if (!isPending) return false;
    } else if (appStatusFilter === 'approved') {
      const st = (a.status || '').toLowerCase();
      const isApproved = st === 'approved' || st === 'disbursed';
      if (!isApproved) return false;
    }

    // 2. Search query filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (a.applicant || a.name || '').toLowerCase().includes(q) ||
        (a.schemeTitle || a.scheme || a.appliedScheme || '').toLowerCase().includes(q) ||
        (a.orgType || '').toLowerCase().includes(q) ||
        (a.contactPerson || '').toLowerCase().includes(q) ||
        (a.city || '').toLowerCase().includes(q);
    }
    return true;
  });

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
    <section className="app-view active" id="viewSchemes">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Organizational Schemes</h1>
            <p className="page-subtitle">Government &amp; organizational grant programs, subsidies, and educational schemes.</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            id="btnOpenCreateSchemeModal"
            onClick={() => {
              if (setEditingScheme) setEditingScheme(null);
              navigateTo('createScheme');
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Scheme</span>
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="module-stat-grid">
        <div className="module-stat-card" id="cardSchemesTotal" title="Active schemes catalog">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <span>{schemes.length} Active</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Active Scheme Programs</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="schemesMetricTotal">{schemes.length}</span>
              <span className="module-stat-unit">Programs</span>
            </div>
            <div className="module-stat-subtext">Central, State &amp; CSR matched</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardSchemesFunding" title="Total funding allocated">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap brand">
              <span style={{ fontSize: '19px', fontWeight: 700, lineHeight: 1 }}>₹</span>
            </div>
            <span className="badge-trend-pos">
              <span>₹85L Disbursed</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Total Grant Pool (INR)</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="schemesMetricFunding">₹4,20,00,000</span>
            </div>
            <div className="module-stat-subtext">Direct beneficiary transfer pool</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardSchemesApplications" title="Beneficiary applications">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              <span>+22.5% MoM</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Grant Applications</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="schemesMetricApplications">{schemeApplications.length}</span>
              <span className="module-stat-unit">Submitted</span>
            </div>
            <div className="module-stat-subtext">Under review with committee</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardSchemesApprovalRate" title="Verification & approval rate">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="badge-trend-pos">
              <span>91.4%</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Avg. Verification Rate</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="schemesMetricApprovalRate">91.4%</span>
              <span className="module-stat-unit">Passed</span>
            </div>
            <div className="module-stat-subtext">Document compliance verified</div>
          </div>
        </div>
      </div>

      {/* Main Schemes Card */}
      <div className="sheets-console-card full-screen-width">
        <div className="sheets-console-top-bar">
          <div className="sheets-count-cluster">
            <span className="sheets-count-number">
              {filteredSchemes.length}
            </span>
            <span className="sheets-count-label">
              Active Schemes
            </span>
          </div>

          <div className="sheets-status-filter-pills">
            <button
              type="button"
              className={`sheets-filter-pill-btn ${schemeFilter === 'all' ? 'active' : ''}`}
              id="filterSchemeAll"
              onClick={() => setSchemeFilter('all')}
            >
              All ({schemes.length})
            </button>
            <button
              type="button"
              className={`sheets-filter-pill-btn ${schemeFilter === 'active' ? 'active' : ''}`}
              id="filterSchemeActive"
              onClick={() => setSchemeFilter('active')}
            >
              Active ({activeSchemesCount})
            </button>
            <button
              type="button"
              className={`sheets-filter-pill-btn ${schemeFilter === 'completed' ? 'active' : ''}`}
              id="filterSchemeCompleted"
              onClick={() => setSchemeFilter('completed')}
            >
              Completed ({completedSchemesCount})
            </button>
          </div>

          <div className="sheets-console-actions">
            <SearchBar
              id="schemesSearchInput"
              placeholder="Search schemes, grants, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="280px"
            />
            <button
              className="circle-action-btn"
              id="btnRefreshSchemesList"
              title="Refresh schemes list"
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

        {isTabLoading ? (
          <div style={{ padding: '20px' }}>
            {activeTab === 'schemes' ? <SchemesListSkeleton count={4} /> : <SchemeApplicationsSkeleton rows={5} />}
          </div>
        ) : (
          <>
            {/* Tab 1: Schemes List */}
            {activeTab === 'schemes' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '48px' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Scheme Program</th>
                  <th>Category</th>
                  <th>Grant Pool</th>
                  <th>Deadline</th>
                  <th className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchemes.map((s, idx) => (
                  <tr
                    key={s.id || idx}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                    onClick={() => selectScheme && selectScheme(s.id)}
                    title={`View details for ${s.title}`}
                  >
                    <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#F5F3FF',
                            color: '#6336EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #EDE9FE'
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>account_balance</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                            {s.eligibility || 'Non-profit and student entrepreneurs'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge-minimal" style={{ background: '#ECFDF3', color: '#027A48', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                        {s.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600, color: '#12B76A' }}>
                      {s.grantAmount || s.value || '₹25,00,000'}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {s.deadline || '30 Nov 2026'}
                    </td>
                    <td className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <label
                        className="active-toggle-ios"
                        title={s.status === 'active' ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                      >
                        <input
                          type="checkbox"
                          checked={s.status === 'active'}
                          onChange={() => handleToggleScheme(s)}
                        />
                        <span className="active-toggle-slider" />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Applications */}
        {activeTab === 'applications' && (
          <div style={{ overflowX: 'auto' }}>
            <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '48px' }} />
                <col style={{ width: '23%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '16%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Applicant Entity</th>
                  <th>Applied Scheme</th>
                  <th>Funding Requested</th>
                  <th>Review Score</th>
                  <th className="col-center">View</th>
                  <th className="col-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-500)' }}>
                      No applications found matching the current filter.
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
                              {a.orgType || 'Registered Non-Profit'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {a.schemeTitle || a.scheme || a.appliedScheme || '—'}
                      </td>
                      <td style={{ fontSize: '13px', color: '#12B76A', fontWeight: 600 }}>
                        {a.requestedAmount || a.funding || '₹10,00,000'}
                      </td>
                      <td>
                        <span className="status-badge-minimal" style={{ background: '#EFF8FF', color: '#175CD3', fontSize: '11.5px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          ★ {a.score || '9.4 / 10'}
                        </span>
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
                          onClick={() => selectSchemeApplication(a, 'schemes')}
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
        )}
      </>
    )}
  </div>

  {/* Modal 2: Approval Confirmation Popup */}
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
                {appToApprove.schemeTitle || appToApprove.scheme}
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
