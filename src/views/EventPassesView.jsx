import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getUserAvatar } from '../data/initialData';
import { PassesTableSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';
import { downloadCSV } from '../utils/csvExport';

export default function EventPassesView() {
  const {
    registrations,
    openModal,
    setSelectedPass,
    checkInAttendee,
    showToast,
    loadBackendData
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (loadBackendData) {
        await loadBackendData();
      }
      showToast('Event passes roster refreshed successfully!', 'success');
    } catch {
      showToast('Refreshed local view', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Pass ID', 'Attendee Name', 'Email', 'Event Name', 'Ticket Tier', 'Status', 'Issued Date'];
    const rows = filtered.map((r, idx) => [
      String(idx + 1).padStart(2, '0'),
      r.id || `PASS-${idx + 1001}`,
      r.name || r.attendeeName || 'Attendee',
      r.email || 'N/A',
      r.eventName || r.event || 'Knotnex Event',
      r.tier || r.type || 'Standard Entry',
      r.status === 'used' ? 'Checked-In' : r.status === 'valid' ? 'Valid / Pending' : 'Expired',
      r.date || r.issuedAt || 'Recent'
    ]);
    downloadCSV('knotnex_event_passes_roster.csv', headers, rows);
    showToast('Downloaded knotnex_event_passes_roster.csv', 'success');
  };

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return;
    setIsTabLoading(true);
    setFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  const totalIssued = registrations.length;
  const checkedIn = registrations.filter(r => r.status === 'used' || r.status === 'attended' || r.checkedIn).length;
  const pending = registrations.filter(r => r.status === 'valid' || r.status === 'confirmed').length;
  const expired = registrations.filter(r => r.status === 'expired' || r.status === 'cancelled').length;

  const filtered = registrations.filter(r => {
    const isUsed = r.status === 'used' || r.status === 'attended' || r.checkedIn;
    const isValid = r.status === 'valid' || r.status === 'confirmed';
    const isExpired = r.status === 'expired' || r.status === 'cancelled';

    if (filter === 'valid' && !isValid) return false;
    if (filter === 'used' && !isUsed) return false;
    if (filter === 'expired' && !isExpired) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (r.name || r.attendeeName || r.user_name || r.personal_info?.name || '').toLowerCase().includes(q) ||
        (r.ticketCode || r.qr_code_hash || '').toLowerCase().includes(q) ||
        (r.eventName || r.event_title || r.event || '').toLowerCase().includes(q) ||
        (r.email || r.personal_info?.email || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });


  return (
    <section className="app-view active" id="viewEventPasses">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h.01M18 12h.01" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Event Passes</h1>
            <p className="page-subtitle">Issue, validate, and manage attendee entry passes, VIP credentials, and support requests.</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            id="btnExportEventPassesCsv"
            onClick={handleExportCSV}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            className="btn-primary"
            id="btnOpenIssueEventPassModal"
            onClick={() => openModal('modalIssueTicket')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Issue Pass</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="module-stat-grid">
        <div className="module-stat-card">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h.01M18 12h.01" /><line x1="10" y1="12" x2="14" y2="12" />
              </svg>
            </div>
            <span className="badge-trend-pos">
              <span>+14%</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Total Issued</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value">{totalIssued}</span>
              <span className="module-stat-unit">Passes</span>
            </div>
            <div className="module-stat-subtext">All confirmed event passes</div>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="badge-trend-pos">
              <span>{Math.round((checkedIn / (totalIssued || 1)) * 100)}%</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Checked-In / Validated</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value">{checkedIn}</span>
              <span className="module-stat-unit">Attendees</span>
            </div>
            <div className="module-stat-subtext">Scanned via gate access QR readers</div>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: 'rgba(247,144,9,0.1)', color: '#B54708' }}>
              <span>Pending</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Pending Gate Entry</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value">{pending}</span>
              <span className="module-stat-unit">Passes</span>
            </div>
            <div className="module-stat-subtext">Registered but not yet scanned</div>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <span className="badge-trend-pos" style={{ background: 'rgba(240,68,56,0.1)', color: '#D92D20' }}>
              <span>Alert</span>
            </span>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Expired / Revoked</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value">{expired}</span>
              <span className="module-stat-unit">Passes</span>
            </div>
            <div className="module-stat-subtext">Credentials invalid or cancelled</div>
          </div>
        </div>
      </div>

      {/* Passes Console Card */}
      <div className="sheets-console-card full-screen-width">
        <div className="sheets-console-top-bar">
          <div className="sheets-count-cluster">
            <span className="sheets-count-number">{filtered.length}</span>
            <span className="sheets-count-label">Issued Credentials</span>
          </div>

          <div className="sheets-status-filter-pills">
            <button className={`sheets-filter-pill-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>
              All Passes ({registrations.length})
            </button>
            <button className={`sheets-filter-pill-btn ${filter === 'valid' ? 'active' : ''}`} onClick={() => handleFilterChange('valid')}>
              Valid ({pending})
            </button>
            <button className={`sheets-filter-pill-btn ${filter === 'used' ? 'active' : ''}`} onClick={() => handleFilterChange('used')}>
              Checked-in ({checkedIn})
            </button>
            <button className={`sheets-filter-pill-btn ${filter === 'expired' ? 'active' : ''}`} onClick={() => handleFilterChange('expired')}>
              Expired ({expired})
            </button>
          </div>

          <div className="sheets-console-actions">
            <SearchBar
              id="passesSearchInput"
              placeholder="Search pass ID, attendee, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="320px"
            />
            <button
              className="circle-action-btn"
              id="btnRefreshEventPassesList"
              title="Refresh event passes"
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
          {isTabLoading ? (
            <PassesTableSkeleton rows={6} />
          ) : (
            <table className="recent-products-table">
            <colgroup>
              <col style={{ width: '48px' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                <th>Attendee</th>
                <th>Pass Code</th>
                <th>Event</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px 16px", color: "var(--neutral-500)" }}>
                    No event passes found. Passes issued to registered delegates will appear here automatically.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const isCheckedIn = r.status === 'used' || r.status === 'attended' || r.checkedIn;
                  const isValid = r.status === 'valid' || r.status === 'confirmed';
                  const attName = r.personal_info?.name || r.user_name || r.name || r.attendeeName || 'Attendee';
                  const attEmail = r.personal_info?.email || r.email || '—';
                  const passCode = r.ticketCode || (r.qr_code_hash ? `#${r.qr_code_hash.slice(0, 8).toUpperCase()}` : (r.id ? `#PASS-${r.id.slice(0, 6).toUpperCase()}` : '—'));
                  const evTitle = r.eventName || r.event_title || r.event || '—';
                  const passTier = r.tier || r.type || 'Standard Pass';

                  return (
                    <tr key={r.id || idx}>
                      <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={getUserAvatar(r, idx)}
                            alt=""
                            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {attName}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                              {attEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', background: '#F2F4F7', padding: '3px 7px', borderRadius: '6px' }}>
                          {passCode}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {evTitle}
                      </td>
                      <td>
                        <span className="status-badge-minimal" style={{ background: '#F4F3FF', color: '#5925DC', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          {passTier}
                        </span>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: isCheckedIn ? '#ECFDF3' : (isValid ? '#EFF8FF' : '#FEF3F2'),
                            color: isCheckedIn ? '#12B76A' : (isValid ? '#175CD3' : '#D92D20'),
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '9999px'
                          }}
                        >
                          {isCheckedIn ? '● Checked-in' : (isValid ? '● Active Pass' : '● Expired')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px' }}>
                          <button
                            className="btn-secondary"
                            style={{ height: '30px', padding: '0 8px', fontSize: '12px' }}
                            onClick={() => openModal('modalViewTicketPass', r)}
                          >
                            View Pass
                          </button>
                          {isValid && (
                            <button
                              className="btn-primary"
                              style={{ height: '30px', padding: '0 8px', fontSize: '11px' }}
                              title="Turnstile Gate Check-in"
                              onClick={() => checkInAttendee(r.ticketCode || r.qr_code_hash || r.id)}
                            >
                              Check-in
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </section>
  );
}
