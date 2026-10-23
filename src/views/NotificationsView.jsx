import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/common/SearchBar';

export default function NotificationsView() {
  const {
    topNotifications,
    markAllNotifsRead,
    markNotifAsRead,
    deleteNotif,
    clearAllNotifs,
    navigateTo,
    showToast,
    loadBackendData
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (loadBackendData) {
        await loadBackendData();
      }
      showToast('Notifications stream synced with live gateway!', 'success');
    } catch {
      showToast('Refreshed local notification view', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const unreadCount = topNotifications.filter(n => n.unread).length;
  const txnCount = topNotifications.filter(n => n.type === 'txn').length;
  const gateCount = topNotifications.filter(n => n.type === 'gate').length;
  const otherCount = topNotifications.filter(n => n.type === 'career' || n.type === 'scheme').length;

  const filteredNotifications = topNotifications.filter(n => {
    if (activeTab === 'unread' && !n.unread) return false;
    if (activeTab === 'txn' && n.type !== 'txn') return false;
    if (activeTab === 'gate' && n.type !== 'gate') return false;
    if (activeTab === 'other' && n.type !== 'career' && n.type !== 'scheme') return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (n.title || '').toLowerCase().includes(q) ||
        (n.msg || '').toLowerCase().includes(q) ||
        (n.code || '').toLowerCase().includes(q) ||
        (n.type || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'txn':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        );
      case 'gate':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        );
      case 'career':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case 'scheme':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
    }
  };

  const getNotifTypeBadge = (type) => {
    switch (type) {
      case 'txn':
        return 'Payment';
      case 'gate':
        return 'Gate Turnstile';
      case 'career':
        return 'Application';
      case 'scheme':
        return 'Grant Scheme';
      default:
        return 'Alert';
    }
  };

  return (
    <section className="app-view active" id="viewNotifications">
      {/* 1. Breadcrumb Bar */}
      <nav className="event-breadcrumb-bar" aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
        <span className="breadcrumb-link" onClick={() => navigateTo('dashboard')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>Dashboard</span>
        </span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Notifications</span>
      </nav>

      {/* 2. Content Header */}
      <header className="content-header">
        <div className="header-title-group">
          <div className="header-icon-box" style={{ background: 'rgba(99, 54, 235, 0.08)', color: '#6336EB' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="header-text-group">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Review real-time payment settlements, attendee check-ins, candidates, and grant updates.</p>
          </div>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {unreadCount > 0 && (
            <button
              className="btn-secondary"
              id="btnNotifMarkAllRead"
              onClick={markAllNotifsRead}
              title="Mark all notifications as read"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Mark all read</span>
            </button>
          )}
          {topNotifications.length > 0 && (
            <button
              className="btn-secondary"
              id="btnNotifClearAll"
              onClick={clearAllNotifs}
              title="Clear all notification history"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Clear all</span>
            </button>
          )}
        </div>
      </header>

      {/* 3. KPI Summary Stats */}
      <div className="module-stat-grid">
        <div className="module-stat-card" id="cardNotifTotal" title="All system notifications">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Total Notifications</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="notifMetricTotal">{topNotifications.length}</span>
              <span className="module-stat-unit">Alerts</span>
            </div>
            <div className="module-stat-subtext">Across all active workspaces</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardNotifUnread" title="Unread updates pending review">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Unread Updates</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="notifMetricUnread">{unreadCount}</span>
              <span className="module-stat-unit">Pending</span>
            </div>
            <div className="module-stat-subtext">Actionable recent notifications</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardNotifTxn" title="Financial & grant payments">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap brand">
              <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>₹</span>
            </div>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Payments &amp; Grants</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="notifMetricTxn">{txnCount}</span>
              <span className="module-stat-unit">Settled</span>
            </div>
            <div className="module-stat-subtext">HDFC &amp; UPI gateway triggers</div>
          </div>
        </div>

        <div className="module-stat-card" id="cardNotifGate" title="Attendee check-in events">
          <div className="module-stat-card-top">
            <div className="module-stat-icon-wrap blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
          </div>
          <div className="module-stat-info">
            <span className="module-stat-label">Gate Pass Turnstiles</span>
            <div className="module-stat-value-row">
              <span className="module-stat-value" id="notifMetricGate">{gateCount}</span>
              <span className="module-stat-unit">Admissions</span>
            </div>
            <div className="module-stat-subtext">Hardware scanner verified</div>
          </div>
        </div>
      </div>

      {/* 4. Main Console Feed */}
      <div className="sheets-console-card full-screen-width" id="notificationsConsoleCard">
        <div className="sheets-console-top-bar">
          <div className="sheets-status-filter-pills">
            <button
              className={`sheets-filter-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({topNotifications.length})
            </button>
            <button
              className={`sheets-filter-pill-btn ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`sheets-filter-pill-btn ${activeTab === 'txn' ? 'active' : ''}`}
              onClick={() => setActiveTab('txn')}
            >
              Payments ({txnCount})
            </button>
            <button
              className={`sheets-filter-pill-btn ${activeTab === 'gate' ? 'active' : ''}`}
              onClick={() => setActiveTab('gate')}
            >
              Gate Passes ({gateCount})
            </button>
            <button
              className={`sheets-filter-pill-btn ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              Careers &amp; Schemes ({otherCount})
            </button>
          </div>

          <div className="sheets-console-actions">
            <SearchBar
              id="notificationsSearchInput"
              placeholder="Search notifications, codes, names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="320px"
            />
            <button
              className="circle-action-btn"
              id="btnRefreshNotifications"
              title="Refresh notifications"
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

        {/* Notifications Feed */}
        <div style={{ padding: '8px 20px 20px 20px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--brand-50, #F4F0FF)',
                  color: '#6336EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--neutral-900, #111827)', marginBottom: '6px' }}>
                All caught up!
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--neutral-500, #6B7280)', maxWidth: '360px', margin: '0 auto' }}>
                There are no notifications matching your current filters. Live system triggers will appear here automatically.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  id={`notifItem-${notif.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--neutral-200, #E5E7EB)',
                    background: notif.unread ? 'rgba(99, 54, 235, 0.02)' : 'var(--neutral-0, #FFFFFF)',
                    transition: 'all 0.15s ease'
                  }}
                  className="notif-feed-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    {/* Unread indicator */}
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: notif.unread ? '#6336EB' : 'transparent',
                        flexShrink: 0
                      }}
                      title={notif.unread ? 'Unread notification' : 'Read'}
                    />

                    {/* Icon container */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: notif.type === 'txn' ? 'rgba(18, 183, 106, 0.08)' : 'rgba(99, 54, 235, 0.08)',
                        color: notif.type === 'txn' ? '#12B76A' : '#6336EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getNotifIcon(notif.type)}
                    </div>

                    {/* Notification info */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral-900, #111827)' }}>
                          {notif.title}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: 'var(--neutral-100, #F3F4F6)',
                            color: 'var(--neutral-600, #4B5563)'
                          }}
                        >
                          {getNotifTypeBadge(notif.type)}
                        </span>
                        {notif.code && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(99, 54, 235, 0.06)',
                              color: '#6336EB'
                            }}
                          >
                            {notif.code}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--neutral-600, #4B5563)', margin: 0, lineHeight: 1.4 }}>
                        {notif.msg}
                      </p>
                    </div>
                  </div>

                  {/* Right side actions & time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, marginLeft: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--neutral-400, #9CA3AF)', whiteSpace: 'nowrap' }}>
                      {notif.time}
                    </span>

                    {notif.unread && (
                      <button
                        className="btn-secondary"
                        style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                        onClick={() => markNotifAsRead(notif.id)}
                        title="Mark as read"
                      >
                        Mark read
                      </button>
                    )}

                    {notif.targetView && (
                      <button
                        className="btn-secondary"
                        style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                        onClick={() => navigateTo(notif.targetView)}
                        title="View source records"
                      >
                        Open
                      </button>
                    )}

                    <button
                      className="circle-action-btn"
                      style={{ width: '32px', height: '32px', minWidth: '32px', maxWidth: '32px' }}
                      onClick={() => deleteNotif(notif.id)}
                      title="Dismiss notification"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
