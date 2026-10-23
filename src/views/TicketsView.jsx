import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getUserAvatar } from '../data/initialData';
import { TicketsTableSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';
import { downloadCSV } from '../utils/csvExport';

export default function TicketsView() {
  const { tickets, updateTicketStatus, openModal, showToast, setIsSidebarCollapsed, loadBackendData } = useApp();

  const [tabFilter, setTabFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsTabLoading(true);
    try {
      if (loadBackendData) {
        await loadBackendData();
      }
      showToast('Support ticket inbox synced successfully!', 'success');
    } catch {
      showToast('Refreshed ticket inbox', 'info');
    } finally {
      setIsTabLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Ticket ID', 'User Name', 'Email', 'Subject', 'Category', 'Priority', 'Date'];
    const rows = filtered.map((t, idx) => {
      const userName = typeof t.user === 'object' ? (t.user.name || '') : (t.user || t.attendee || 'User');
      const email = typeof t.user === 'object' ? (t.user.email || '') : (t.email || 'N/A');
      return [
        String(idx + 1).padStart(2, '0'),
        t.id || 'N/A',
        userName,
        email,
        t.subject || t.title || 'N/A',
        t.category || t.issueType || 'General',
        t.priority || 'Normal',
        t.createdAt || t.date || 'Recent'
      ];
    });
    downloadCSV('knotnex_tickets_audit_log.csv', headers, rows);
    showToast('Downloaded knotnex_tickets_audit_log.csv', 'success');
  };

  const handleTabChange = (newFilter) => {
    if (newFilter === tabFilter) return;
    setIsTabLoading(true);
    setTabFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  const filtered = tickets.filter(t => {
    if (tabFilter !== 'all') {
      const cat = (t.category || t.issueType || '').toLowerCase();
      if (tabFilter === 'payment' && !cat.includes('payment') && !cat.includes('gateway')) return false;
      if (tabFilter === 'refund' && !cat.includes('refund')) return false;
      if (tabFilter === 'pass' && !cat.includes('pass') && !cat.includes('gate')) return false;
      if (tabFilter === 'inquiry' && !cat.includes('inquiry') && !cat.includes('general')) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const userName = typeof t.user === 'object' ? (t.user.name || '') : (t.user || t.attendee || '');
      const match = (t.id || '').toLowerCase().includes(q) ||
        userName.toLowerCase().includes(q) ||
        (t.eventName || '').toLowerCase().includes(q) ||
        (t.desc || t.details || '').toLowerCase().includes(q) ||
        (t.txnId || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <section className="app-view active" id="viewTickets">
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Tickets &amp; Issues</h1>
            <p className="page-subtitle">Informational log of attendee-reported issues, booking queries, and refund requests.</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn-secondary"
            id="btnExportTicketsCsv"
            title="Export tickets audit log as CSV"
            onClick={handleExportCSV}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Audit Log</span>
          </button>
        </div>
      </header>

      <div className="sheets-console-card full-screen-width" id="ticketsTableCard">
        <div className="sheets-console-top-bar">
          <div className="sheets-count-cluster">
            <span className="sheets-count-number" id="ticketsActiveCount">{filtered.length}</span>
            <span className="sheets-count-label">Reported Issues</span>
          </div>

          <div className="sheets-status-filter-pills">
            <button
              className={`sheets-filter-pill-btn ${tabFilter === 'all' ? 'active' : ''}`}
              id="tabTicketsAll"
              onClick={() => handleTabChange('all')}
            >
              All Issues ({tickets.length})
            </button>
            <button
              className={`sheets-filter-pill-btn ${tabFilter === 'payment' ? 'active' : ''}`}
              id="tabTicketsPayment"
              onClick={() => handleTabChange('payment')}
            >
              Payment Issues (2)
            </button>
            <button
              className={`sheets-filter-pill-btn ${tabFilter === 'refund' ? 'active' : ''}`}
              id="tabTicketsRefund"
              onClick={() => handleTabChange('refund')}
            >
              Refund Requests (3)
            </button>
            <button
              className={`sheets-filter-pill-btn ${tabFilter === 'pass' ? 'active' : ''}`}
              id="tabTicketsPass"
              onClick={() => handleTabChange('pass')}
            >
              Pass Issues (1)
            </button>
            <button
              className={`sheets-filter-pill-btn ${tabFilter === 'inquiry' ? 'active' : ''}`}
              id="tabTicketsInquiry"
              onClick={() => handleTabChange('inquiry')}
            >
              Inquiries (2)
            </button>
          </div>

          <div className="sheets-console-actions">
            <SearchBar
              id="ticketsSearchInput"
              placeholder="Search ticket ID, user, txn ref, event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="320px"
            />
            <button
              className="circle-action-btn"
              id="btnRefreshTicketsTable"
              style={{ width: '38px', height: '38px' }}
              title="Refresh tickets &amp; issues"
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

        <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
          {isTabLoading ? (
            <TicketsTableSkeleton rows={5} />
          ) : (
            <table className="recent-products-table" id="ticketsTable" style={{ width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '48px' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="col-center" style={{ width: '48px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                <th>Ticket &amp; Priority</th>
                <th>Raised By (User)</th>
                <th>Category &amp; Event</th>
                <th>Issue Description</th>
                <th style={{ paddingLeft: '36px' }}>Amount</th>
                <th className="col-right">Action</th>
              </tr>
            </thead>
            <tbody id="ticketsTableBody">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--neutral-500)' }}>
                    No support tickets or queries found. User-reported issues, ticketing queries, and inquiries will appear here.
                  </td>
                </tr>
              ) : (
                filtered.map((t, idx) => {
                  const txnId = t.txnId || t.paymentRef || (t.id ? `TXN-${String(t.id).slice(0, 8).toUpperCase()}` : '—');
                  const ticketUser = typeof t.user === 'object' ? (t.user.name || t.user.email) : (t.user || t.attendee || 'Attendee');
                  const ticketTime = t.time || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent');
                  const evName = t.eventName || t.event_title || 'General';
                  const issueDesc = t.desc || t.details || t.description || t.subject || 'Inquiry';

                  return (
                    <tr key={t.id || idx} style={{ cursor: 'pointer' }} onClick={() => openModal('modalTicketIssueDetails', { ...t, txnId })}>
                      <td className="col-center" style={{ color: 'var(--neutral-400)', fontWeight: 600, fontSize: '12px' }}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td>
                        <div>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', background: '#F2F4F7', padding: '2px 6px', borderRadius: '4px' }}>
                            {t.id || `#TCK-${idx + 1}`}
                          </span>
                          <div style={{ marginTop: '4px' }}>
                            <span
                              className="status-badge-minimal"
                              style={{
                                background: t.priority === 'High' ? '#FEF3F2' : (t.priority === 'Medium' ? '#FFFBEB' : '#F0FDF4'),
                                color: t.priority === 'High' ? '#D92D20' : (t.priority === 'Medium' ? '#B54708' : '#16A34A'),
                                fontSize: '10.5px',
                                padding: '1px 6px',
                                borderRadius: '9999px',
                                fontWeight: 600
                              }}
                            >
                              {t.priority || 'Normal'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={getUserAvatar(t, idx)}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {ticketUser}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                              {ticketTime}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-primary)' }}>
                          {t.category || t.issueType || 'General'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {evName}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={issueDesc}
                        >
                          {issueDesc}
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', verticalAlign: 'middle', paddingLeft: '36px' }}>
                        {t.amount || '—'}
                      </td>
                      <td className="col-right" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-secondary"
                            style={{ height: '32px', padding: '0 14px', fontSize: '12px', fontWeight: 600 }}
                            onClick={() => openModal('modalTicketIssueDetails', { ...t, txnId })}
                          >
                            View
                          </button>
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
