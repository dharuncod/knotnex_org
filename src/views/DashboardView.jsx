import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getEventPoster, getJobPoster } from '../data/initialData';
import { ActivitiesStreamSkeleton } from '../components/skeletons';
import SearchBar from '../components/common/SearchBar';

export default function DashboardView() {
  const {
    events,
    jobs,
    schemes,
    navigateTo,
    selectEvent,
    selectJob,
    showToast,
    loadBackendData
  } = useApp();

  const [actFilter, setActFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemActiveStates, setItemActiveStates] = useState({});
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (loadBackendData) {
        await loadBackendData();
      }
      showToast('Dashboard stream refreshed successfully!', 'success');
    } catch {
      showToast('Refreshed local view', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleActFilterChange = (newFilter) => {
    if (newFilter === actFilter) return;
    setIsTabLoading(true);
    setActFilter(newFilter);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 260);
  };

  // Build unified activities list
  const getUnifiedActivities = () => {
    const list = [];

    // 1. Events
    (events || []).forEach(ev => {
      list.push({
        id: ev.id,
        title: ev.name,
        type: 'events',
        typeLabel: 'Event',
        icon: 'event',
        poster: getEventPoster(ev),
        subtitle: `${ev.location} · ${ev.category}`,
        metric: `${ev.registered} / ${ev.capacity} Attendees`,
        date: ev.date || 'Upcoming 2026',
        status: ev.status,
        defaultActive: ev.status !== 'closed' && ev.status !== 'archived',
        targetView: 'events',
        raw: ev
      });
    });

    // 2. Jobs
    (jobs || []).forEach(j => {
      list.push({
        id: j.id,
        title: j.title,
        type: 'jobs',
        typeLabel: 'Job',
        icon: 'work',
        poster: getJobPoster(j),
        subtitle: `${j.dept || 'Engineering'} · ${j.location || 'Remote'}`,
        metric: `${j.applicantsCount || 0} Applications`,
        date: j.postedDate || j.date || (j.created_at ? new Date(j.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active'),
        status: j.status,
        defaultActive: j.status === 'active',
        targetView: 'careers',
        raw: j
      });
    });

    // 3. Schemes
    (schemes || []).forEach(s => {
      list.push({
        id: s.id,
        title: s.title,
        type: 'schemes',
        typeLabel: 'Scheme',
        icon: 'account_balance',
        poster: null,
        subtitle: `${s.category || 'Grant'} · ${s.eligibility ? s.eligibility.substring(0, 35) + '...' : 'Open Eligibility'}`,
        metric: s.grantAmount || s.value || 'Grant Funded',
        date: s.deadline || (s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active'),
        status: s.status,
        defaultActive: s.status === 'active',
        targetView: 'schemes',
        raw: s
      });
    });

    return list;
  };

  const allActivities = getUnifiedActivities();

  // Filter activities
  const filteredActivities = allActivities.filter(item => {
    if (actFilter !== 'all' && item.type !== actFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.metric && item.metric.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const toggleItemActive = (id, defaultState) => {
    setItemActiveStates(prev => {
      const current = prev[id] !== undefined ? prev[id] : defaultState;
      const next = !current;
      showToast(`Status toggled to ${next ? 'Active' : 'Inactive'} for item`);
      return { ...prev, [id]: next };
    });
  };

  return (
    <section className="app-view active" id="viewDashboard">
      {/* Quick Actions Section */}
      <div className="home-quick-actions-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Quick Actions</h2>
        </div>

        <div className="qa-horizontal-grid">
          {/* Create Event Card */}
          <div className="qa-linear-card event-card" id="qaFeatureCreateEvent" title="Launch Event creation" onClick={() => navigateTo('createEvent')}>
            <div className="qa-linear-main">
              <div className="qa-linear-icon event">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="qa-linear-info">
                <div className="qa-linear-title">Create Event</div>
                <div className="qa-linear-desc">Conferences, stages &amp; ticketing</div>
              </div>
            </div>
            <button
              className="btn-qa-launch"
              id="btnQaLaunchEvent"
              title="Launch Event creation"
              onClick={(e) => { e.stopPropagation(); navigateTo('createEvent'); }}
            >
              Launch +
            </button>
          </div>

          {/* Post Opportunity Card */}
          <div className="qa-linear-card career-card" id="qaFeatureCreateOpportunity" title="Launch Opportunity creation" onClick={() => navigateTo('createOpportunity')}>
            <div className="qa-linear-main">
              <div className="qa-linear-icon career">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="qa-linear-info">
                <div className="qa-linear-title">Post Opportunity</div>
                <div className="qa-linear-desc">Jobs, fellowships &amp; pipeline</div>
              </div>
            </div>
            <button
              className="btn-qa-launch"
              id="btnQaLaunchOpportunity"
              title="Launch Opportunity creation"
              onClick={(e) => { e.stopPropagation(); navigateTo('createOpportunity'); }}
            >
              Post Role +
            </button>
          </div>

          {/* Post Scheme Card */}
          <div className="qa-linear-card scheme-card" id="qaFeaturePostScheme" title="Launch Grant Scheme creation" onClick={() => navigateTo('createScheme')}>
            <div className="qa-linear-main">
              <div className="qa-linear-icon scheme">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M3 10h18" />
                  <path d="M5 6l7-3 7 3" />
                  <path d="M4 10v11" />
                  <path d="M20 10v11" />
                  <path d="M8 14v4" /><path d="M12 14v4" /><path d="M16 14v4" />
                </svg>
              </div>
              <div className="qa-linear-info">
                <div className="qa-linear-title">Post Scheme</div>
                <div className="qa-linear-desc">Grants, subsidies &amp; seed awards</div>
              </div>
            </div>
            <button
              className="btn-qa-launch"
              id="btnQaLaunchScheme"
              title="Launch Grant Scheme creation"
              onClick={(e) => { e.stopPropagation(); navigateTo('createScheme'); }}
            >
              Post +
            </button>
          </div>
        </div>

      </div>

      {/* Recent Activities Section */}
      <div className="home-recent-activities-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Recent Activities</h2>
        </div>

        <div className="figma-recent-activities-card full-screen-width">
          <div className="recent-act-top-bar">
            <div className="recent-act-top-left-group">
              <div className="recent-act-items-count">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span className="count-big" id="recentActivitiesCount">{allActivities.length}</span>
                  <span className="count-unit">Postings</span>
                </div>
              </div>

              <div className="recent-act-type-filters">
                <button
                  className={`recent-act-filter-btn ${actFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleActFilterChange('all')}
                >
                  All ({allActivities.length})
                </button>
                <button
                  className={`recent-act-filter-btn ${actFilter === 'events' ? 'active' : ''}`}
                  onClick={() => handleActFilterChange('events')}
                >
                  Events ({events.length})
                </button>
                <button
                  className={`recent-act-filter-btn ${actFilter === 'jobs' ? 'active' : ''}`}
                  onClick={() => handleActFilterChange('jobs')}
                >
                  Jobs ({jobs.length})
                </button>
                <button
                  className={`recent-act-filter-btn ${actFilter === 'schemes' ? 'active' : ''}`}
                  onClick={() => handleActFilterChange('schemes')}
                >
                  Schemes ({schemes.length})
                </button>
              </div>
            </div>

            <div className="recent-act-top-right-group">
              <SearchBar
                id="recentActivitiesSearchInput"
                placeholder="Search recent jobs, events, schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="320px"
                style={{ marginLeft: '-8px', marginRight: 'calc(var(--side-growth) + 10px)' }}
              />

              <button
                className="circle-action-btn"
                id="btnRefreshDashboardActivities"
                title="Refresh recent activities"
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{ marginRight: '10px' }}
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

              <button
                className="btn-see-more-pill"
                id="btnRecentActivitiesSeeMore"
                title="View all items in active module"
                onClick={() => {
                  if (actFilter === 'jobs') {
                    navigateTo('careers', 'all-careers');
                  } else if (actFilter === 'schemes') {
                    navigateTo('schemes', 'all-schemes');
                  } else {
                    navigateTo('events', 'manage-events');
                  }
                }}
              >
                See More
              </button>
            </div>
          </div>

          {isTabLoading ? (
            <ActivitiesStreamSkeleton count={5} />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="recent-products-table">
              <colgroup>
                <col style={{ width: '44px' }} />
                <col style={{ width: '38%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '44px', color: 'var(--neutral-400)', fontSize: '11px' }}>#</th>
                  <th>Item &amp; Details</th>
                  <th>Type</th>
                  <th>Metric / Info</th>
                  <th>Date Posted</th>
                  <th className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }}>Active</th>
                </tr>
              </thead>
              <tbody id="recentActivitiesTbody">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-400)' }}>
                      No matching activities found for your query.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((item, idx) => {
                    const isActive = itemActiveStates[item.id] !== undefined ? itemActiveStates[item.id] : item.defaultActive;
                    return (
                      <tr
                        key={`${item.type}-${item.id}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (item.type === 'events') {
                            selectEvent(item.id);
                          } else if (item.type === 'jobs') {
                            selectJob(item.id);
                          } else {
                            navigateTo(item.targetView);
                          }
                        }}
                      >
                        <td style={{ color: 'var(--neutral-400)', fontSize: '12px', fontWeight: 600 }}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.poster ? (
                              <img
                                src={item.poster}
                                alt=""
                                style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ECECEC' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '8px',
                                  background: 'var(--brand-50)',
                                  color: 'var(--knotnex-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid var(--brand-100)'
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13.5px' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className="status-badge-minimal"
                            style={{
                              background: item.type === 'events' ? '#EEF4FF' : (item.type === 'jobs' ? '#F4F3FF' : '#ECFDF3'),
                              color: item.type === 'events' ? '#3538CD' : (item.type === 'jobs' ? '#5925DC' : '#027A48'),
                              border: 'none',
                              padding: '3px 9px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {item.typeLabel}
                          </span>
                        </td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {item.metric}
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {item.date}
                        </td>
                        <td className="col-center" style={{ width: '90px', minWidth: '90px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <label className="active-toggle-ios" title={isActive ? 'Active (Click to Toggle)' : 'Inactive (Click to Toggle)'}>
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleItemActive(item.id, item.defaultActive)}
                            />
                            <span className="active-toggle-slider" />
                          </label>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
