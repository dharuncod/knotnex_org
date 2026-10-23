import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BackButton from '../components/common/BackButton';
import { getEventPoster, getUserAvatar } from '../data/initialData';
import { AttendeesTableSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';
import eventsApi from '../api/eventsApi';

export default function EventDetailsView() {
  const {
    selectedEvent,
    registrations,
    navigateTo,
    showToast,
    checkInAttendee,
    startEditEvent,
    deleteEvent
  } = useApp();

  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeFilter, setAttendeeFilter] = useState('all');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    if (!selectedEvent?.id) return;
    let isMounted = true;
    setLoadingAttendees(true);
    eventsApi.getEventAttendees(selectedEvent.id)
      .then((data) => {
        if (isMounted) {
          setAttendees(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (isMounted) setAttendees([]);
      })
      .finally(() => {
        if (isMounted) setLoadingAttendees(false);
      });
    return () => { isMounted = false; };
  }, [selectedEvent?.id]);

  const handleFilterChange = (newFilter) => {
    if (newFilter === attendeeFilter) return;
    setIsTabLoading(true);
    setAttendeeFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  if (!selectedEvent) {
    return (
      <section className="app-view active" id="viewEventDetails">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>No event selected</h2>
          <div style={{ marginTop: '16px' }}>
            <BackButton onClick={() => navigateTo('events', 'manage-events')} />
          </div>
        </div>
      </section>
    );
  }

  const ev = selectedEvent;
  const poster = getEventPoster(ev);

  // Filter registrations relevant to this event
  const contextEventRegs = (registrations || []).filter(reg => 
    reg.eventId === ev.id || reg.event_id === ev.id || reg.event === ev.name || reg.eventName === ev.name
  );
  const activeRegs = attendees.length > 0 ? attendees : contextEventRegs;

  const totalReg = Number(ev.registered) || activeRegs.length || 0;
  const capacity = Number(ev.capacity) || 0;
  const pct = capacity > 0 ? Math.min(100, Math.round((totalReg / capacity) * 100)) : 0;

  // Format and parse ticket price cleanly to prevent NaN and double ₹
  const rawPriceStr = String(ev.ticketPrice !== undefined ? ev.ticketPrice : 0);
  const isFree = rawPriceStr.toLowerCase().includes('free') || rawPriceStr === '0';
  const numTicketPrice = isFree ? 0 : (parseInt(rawPriceStr.replace(/[^0-9]/g, ''), 10) || 0);
  const cleanPriceNum = rawPriceStr.replace(/[^0-9]/g, '') || '0';
  const displayTicketPrice = isFree || numTicketPrice === 0 ? 'Free Pass' : `₹${cleanPriceNum}`;
  const totalRevenue = totalReg * numTicketPrice;

  const formatEventDate = (event) => {
    if (!event) return 'TBD';
    if (event.date && (event.date.includes(' • ') || event.date.includes(' · '))) {
      return event.date.replace(' • ', ' · ');
    }
    if (event.date && event.time) {
      return `${event.date} · ${event.time}`;
    }
    return event.date || 'TBD';
  };

  const checkedInCount = activeRegs.filter(r => r.checkedIn || r.status === 'used' || r.status === 'attended').length;
  const turnoutPct = activeRegs.length > 0 ? Math.round((checkedInCount / activeRegs.length) * 100) : 0;

  const filteredRegistrations = activeRegs.filter(reg => {
    const isCheckedIn = reg.checkedIn || reg.status === 'used' || reg.status === 'attended';
    if (attendeeFilter === 'checked-in' && !isCheckedIn) return false;
    if (attendeeFilter === 'confirmed' && isCheckedIn) return false;
    if (attendeeFilter === 'paid' && reg.paymentType === 'sponsored') return false;
    if (attendeeFilter === 'sponsored' && reg.paymentType !== 'sponsored' && reg.type !== 'Student') return false;

    if (attendeeSearch) {
      const q = attendeeSearch.toLowerCase();
      const match = (reg.name || reg.attendeeName || reg.user_name || reg.personal_info?.name || '').toLowerCase().includes(q) ||
        (reg.email || reg.personal_info?.email || '').toLowerCase().includes(q) ||
        (reg.phone || reg.personal_info?.phone || '').toLowerCase().includes(q) ||
        (reg.city || reg.personal_info?.city || '').toLowerCase().includes(q) ||
        (reg.regId || reg.ticketCode || reg.qr_code_hash || '').toLowerCase().includes(q) ||
        (reg.txnId || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });


  return (
    <section className="app-view active" id="viewEventDetails">
      <div className="event-details-wrapper">

        {/* Breadcrumb Navigation */}
        <nav className="event-breadcrumb-bar" aria-label="Breadcrumb">
          <span className="breadcrumb-link" id="bcEventsHome" onClick={() => navigateTo("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>Dashboard</span>
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-link" id="bcManageEvents" onClick={() => navigateTo("events", "manage-events")}>Events</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current" id="bcCurrentEventName">{ev.name}</span>
        </nav>

        {/* Header Bar */}
        <header className="event-header-top">
          <div className="event-title-cluster">
            <button
              className="btn-back-circle"
              id="btnBackToEvents"
              onClick={() => navigateTo("events", "manage-events")}
              title="Back to Events"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="event-detail-poster-wrap" id="indEventPosterWrap" title="Event Poster">
              <img src={poster} id="indEventPosterImg" alt="Event Poster" className="event-detail-poster-img" />
            </div>
            <div className="event-heading-text">
              <div className="event-main-title">
                <span id="indEventTitle">{ev.name}</span>
                <span className="event-status-pill-live" id="indEventStatusBadge">
                  <span className="status-pulse-dot"></span>
                  <span id="indStatusText">{ev.status ? ev.status.toUpperCase() : "UPCOMING"}</span>
                </span>
              </div>
              <p className="event-sub-desc" id="indEventSubtitle">{ev.description || "The premier annual forum bringing together practitioners, builders, and community leaders."}</p>
            </div>
          </div>

          <div className="event-header-actions-group">
            <button
              className="btn-header-action secondary"
              id="btnExportEvent"
              onClick={() => showToast("Exporting attendee roster...", "info")}
              title="Export attendee records"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export</span>
            </button>
            <button
              className="btn-header-action secondary"
              id="btnOpenEditEventModal"
              onClick={() => {
                if (startEditEvent) {
                  startEditEvent(ev);
                } else {
                  navigateTo('createEvent');
                }
              }}
              title="Edit event parameters"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Edit Event</span>
            </button>
            <button
              className="btn-header-action secondary"
              style={{ color: '#E11D48', borderColor: '#FECDD3' }}
              id="btnDeleteEvent"
              onClick={async () => {
                if (window.confirm(`Are you sure you want to delete "${ev.name}"? This action cannot be undone.`)) {
                  if (deleteEvent) {
                    await deleteEvent(ev.id);
                  }
                  navigateTo('events', 'manage-events');
                }
              }}
              title="Delete this event"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </header>

        {/* Event Hero Banner Card */}
        <div className="event-hero-banner-card">
          <div className="event-hero-content">
            <div className="event-hero-top-row">
              <div className="event-hero-main-info">
                <div className="event-hero-meta-chips">
                  <span className="hero-meta-chip category">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span id="indEventHeroCat">{ev.category || 'Technology'}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="3"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="M9 16l2 2 4-4"></path>
                    </svg>
                    <span id="indEventHeroDate">{formatEventDate(ev)}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21c-4.5-4.5-7-8.5-7-12a7 7 0 1 1 14 0c0 3.5-2.5 7.5-7 12z"></path>
                      <circle cx="12" cy="9" r="2.5"></circle>
                    </svg>
                    <span id="indEventHeroLoc">{ev.location || 'Moscone Center, San Francisco (Hybrid)'}</span>
                  </span>
                  <span className="hero-meta-chip">
                    <span style={{ fontWeight: "700", color: "#6336EB" }}>{displayTicketPrice}</span>
                    <span style={{ color: "var(--neutral-500)", fontSize: "11px" }}>/ Gen Pass</span>
                  </span>
                </div>

                <p className="event-hero-description" id="indEventDesc">
                  {ev.description || "The flagship annual summit gathering emerging tech leaders, open-source contributors, and founders to explore AI governance, cloud scalability, and distributed intelligence."}
                </p>
              </div>

              <div className="event-hero-capacity-box">
                <div className="hero-capacity-header">
                  <span className="hero-capacity-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6336EB" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>Capacity Fill</span>
                  </span>
                  <span className="hero-capacity-pct" id="heroCapacityPctText">{pct}%</span>
                </div>
                <div className="hero-capacity-bar-track">
                  <div className="hero-capacity-bar-fill" id="heroCapacityBarFill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="hero-capacity-footer">
                  <span className="hero-capacity-seats" id="heroCapacitySeatsText">{totalReg.toLocaleString()} / {capacity.toLocaleString()} Seats</span>
                  <span id="heroRemainingSeatsText">{Math.max(0, capacity - totalReg).toLocaleString()} Left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric / KPI Stat Grid */}
        <div className="module-stat-grid">
          <div className="module-stat-card" id="cardIndTotalReg" title="Total registered attendees">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap emerald">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="badge-trend-pos">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+14.8%</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Total Registrations</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="indMetricTotalRegistrations">{totalReg.toLocaleString()}</span>
                <span className="module-stat-unit">Attendees</span>
              </div>
              <div className="module-stat-subtext" id="indSubtextReg">{pct}% of {capacity.toLocaleString()} total hall capacity</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardIndTotalRevenue" title="Ticketing and pass revenue">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap green">
                <span style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1" }}>₹</span>
              </div>
              <span className="badge-trend-pos">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>+8.6%</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Total Revenue (INR)</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="indMetricTotalRevenue">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="module-stat-subtext" id="indSubtextRev">Average ticket value {displayTicketPrice} / pass</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardIndCheckInRate" title="Gate attendance turnout">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="badge-trend-pos">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                <span>Active</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Check-In Turnout</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="indMetricCheckInRate">{turnoutPct}%</span>
                <span className="module-stat-unit">Verified</span>
              </div>
              <div className="module-stat-subtext" id="indSubtextTurnout">{checkedInCount} verified via Gate QR scanner</div>
            </div>
          </div>

          <div className="module-stat-card" id="cardIndTicketsRaised" title="Attendee support & inquiries">
            <div className="module-stat-card-top">
              <div className="module-stat-icon-wrap blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                  <path d="M6 12h.01M18 12h.01"></path>
                  <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
              </div>
              <span className="badge-trend-pos" style={{ background: "rgba(99, 54, 235, 0.08)", color: "#6336EB" }}>
                <span>In Review</span>
              </span>
            </div>
            <div className="module-stat-info">
              <span className="module-stat-label">Inquiries &amp; Passes</span>
              <div className="module-stat-value-row">
                <span className="module-stat-value" id="indMetricTicketsRaised">42</span>
                <span className="module-stat-unit">Tickets</span>
              </div>
              <div className="module-stat-subtext">18 resolved · Gate passes &amp; seats</div>
            </div>
          </div>
        </div>

        {/* Attendee Roster Console */}
        <div className="attendee-console-card">
          <div className="attendee-console-top-bar">
            <div className="attendee-count-cluster">
              <span className="attendee-count-number" id="indRegistrationsCount">{activeRegs.length}</span>
              <span className="attendee-count-label">Registered Attendees</span>
            </div>

            <div className="attendee-status-filter-pills">
              <button
                className={`attendee-filter-pill-btn ${attendeeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All ({activeRegs.length})
              </button>
              <button
                className={`attendee-filter-pill-btn ${attendeeFilter === 'checked-in' ? 'active' : ''}`}
                onClick={() => handleFilterChange('checked-in')}
              >
                Checked-in ({activeRegs.filter(r => r.checkedIn || r.status === 'used').length})
              </button>
              <button
                className={`attendee-filter-pill-btn ${attendeeFilter === 'confirmed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('confirmed')}
              >
                Confirmed ({activeRegs.filter(r => !r.checkedIn && r.status !== 'used').length})
              </button>
              <button
                className={`attendee-filter-pill-btn ${attendeeFilter === 'paid' ? 'active' : ''}`}
                onClick={() => handleFilterChange('paid')}
              >
                Paid ({activeRegs.filter(r => r.paymentType !== 'sponsored').length})
              </button>
              <button
                className={`attendee-filter-pill-btn ${attendeeFilter === 'sponsored' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sponsored')}
              >
                Sponsored ({activeRegs.filter(r => r.paymentType === 'sponsored' || r.type === 'Student').length})
              </button>
            </div>

            <div className="attendee-console-actions">
              <SearchBar
                id="indAttendeeSearch"
                placeholder="Search attendees by name, email, phone (+91), ticket ID..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                width="340px"
              />
            </div>
          </div>

          <div className="table-responsive-wrapper" style={{ overflowX: "auto" }}>
            {isTabLoading ? (
              <AttendeesTableSkeleton rows={6} />
            ) : (
              <table className="recent-products-table" id="indRegistrationsTable">
              <colgroup>
                <col style={{ width: "44px" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-center" style={{ width: "44px", color: "var(--neutral-400)", fontSize: "11px" }}>#</th>
                  <th>Attendee</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Pass ID</th>
                  <th>Transaction ID</th>
                  <th>City / State</th>
                  <th>Registered Date</th>
                  <th>Check-in / Action</th>
                </tr>
              </thead>
              <tbody id="indRegistrationsTableBody">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center", padding: "36px", color: "var(--neutral-500)" }}>
                      No attendee registrations found matching the current search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, idx) => {
                    const isCheckedIn = reg.checkedIn || reg.status === 'used' || reg.status === 'attended';
                    const attName = reg.personal_info?.name || reg.user_name || reg.name || reg.attendeeName || 'Attendee';
                    const attEmail = reg.personal_info?.email || reg.email || '—';
                    const attPhone = reg.personal_info?.phone || reg.phone || '—';
                    const attPassId = reg.regId || reg.ticketCode || (reg.qr_code_hash ? `#${reg.qr_code_hash.slice(0, 8).toUpperCase()}` : (reg.id ? `#REG-${reg.id.slice(0, 6).toUpperCase()}` : '—'));
                    const attTxn = reg.txnId || reg.transaction_id || (reg.id ? `TXN-${reg.id.slice(0, 8).toUpperCase()}` : 'Direct');
                    const attCity = reg.personal_info?.city || reg.city || '—';
                    const attDate = reg.date || reg.registeredDate || (reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
                    return (
                      <tr key={reg.id || idx}>
                        <td className="col-center" style={{ textAlign: "center", color: "var(--neutral-400)", fontWeight: 600, fontSize: "12px" }}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td>
                          <div className="attendee-user-cell">
                            <div className="attendee-avatar-initial with-photo">
                              <img src={getUserAvatar(reg, idx)} alt={attName} className="attendee-avatar-img" />
                              <span className="avatar-initial-fallback">{(attName || 'A').charAt(0)}</span>
                            </div>
                            <div className="attendee-name-col">
                              <span className="attendee-name-title">{attName}</span>
                              <span className="attendee-org-sub">{reg.org || 'Delegate'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: "12.5px", color: "var(--neutral-600)" }}>
                          {attEmail}
                        </td>
                        <td>
                          <div className="attendee-phone-cell">
                            <svg className="attendee-phone-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>{attPhone}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "var(--knotnex-primary)" }}>
                            {attPassId}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "11.5px", color: "var(--neutral-500)" }}>
                            {attTxn}
                          </span>
                        </td>
                        <td style={{ fontSize: "12.5px", color: "var(--neutral-700)" }}>
                          {attCity}
                        </td>
                        <td style={{ fontSize: "12px", color: "var(--neutral-500)" }}>
                          {attDate}
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" }}>
                            <button
                              className={`status-badge-minimal ${isCheckedIn ? 'completed' : 'upcoming'}`}
                              style={{ cursor: "pointer", border: "none" }}
                              onClick={() => checkInAttendee(reg.ticketCode || reg.qr_code_hash || reg.id)}
                              title={isCheckedIn ? "Checked in" : "Click to check in attendee"}
                            >
                              <span className="status-dot"></span>
                              <span>{isCheckedIn ? 'Checked In' : 'Admit Pass'}</span>
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
      </div>
    </section>
  );
}
