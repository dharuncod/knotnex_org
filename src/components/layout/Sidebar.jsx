import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const {
    activeView,
    activeSubAction,
    navigateTo,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    showToast
  } = useApp();

  // Single-open accordion state: only ONE menu ('events' | 'careers' | 'schemes') can be open at a time!
  const [openMenu, setOpenMenu] = useState(() => {
    if (['events', 'eventDetails', 'eventPasses', 'tickets', 'createEvent'].includes(activeView)) return 'events';
    if (['careers', 'careerDetails', 'createOpportunity'].includes(activeView)) return 'careers';
    if (['schemes', 'schemeDetails', 'createScheme'].includes(activeView)) return 'schemes';
    return null;
  });

  // Keep openMenu synced when activeView changes externally (e.g. from Quick Actions or Create menu)
  useEffect(() => {
    if (['events', 'eventDetails', 'eventPasses', 'tickets', 'createEvent'].includes(activeView)) {
      setOpenMenu('events');
    } else if (['careers', 'careerDetails', 'createOpportunity'].includes(activeView)) {
      setOpenMenu('careers');
    } else if (['schemes', 'schemeDetails', 'createScheme'].includes(activeView)) {
      setOpenMenu('schemes');
    }
  }, [activeView]);

  // Accordion toggle: opening one closes all other open menus
  const handleMenuClick = (menuKey, defaultView, defaultSubAction) => {
    if (openMenu === menuKey) {
      setOpenMenu(null); // Click again to close
    } else {
      setOpenMenu(menuKey); // Open clicked menu, automatically closing all others!
      if (defaultView && activeView !== defaultView) {
        navigateTo(defaultView, defaultSubAction);
      }
    }
  };

  const isEventsActive = ['events', 'eventDetails', 'eventPasses', 'tickets', 'createEvent'].includes(activeView);
  const isCareersActive = ['careers', 'careerDetails', 'createOpportunity'].includes(activeView);
  const isSchemesActive = ['schemes', 'schemeDetails', 'createScheme'].includes(activeView);

  return (
    <>
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`} id="mainSidebar">
        {/* Border collapse toggle button '<' as shown in screenshot */}
        <button
          className="sidebar-edge-toggle-btn"
          id="btnCollapseSidebarEdge"
          title={isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isSidebarCollapsed ? 'none' : 'translateX(-0.5px)' }}>
            <polyline points={isSidebarCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
          </svg>
        </button>

        <div className="sidebar-scrollable-content">
          {/* Top Brand Logo */}
          <div className="sidebar-brand-container">
            <div
              className="brand-logo-clickable"
              onClick={() => navigateTo('dashboard')}
              title="Go to Home"
            >
              {!isSidebarCollapsed ? (
                <>
                  <img
                    src="/assets/assets/logo/logo-knotnex-purple-with-text.svg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/assets/logo/logo-knotnex-purple-with-text.png';
                    }}
                    alt="knotnex"
                    className="brand-logo-full"
                  />
                  <span className="brand-org-tag" title="Organization Dashboard">org</span>
                </>
              ) : (
                <img
                  src="/assets/assets/logo/knotnex-icon.png"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/knotnex-icon.png';
                  }}
                  alt="knotnex"
                  className="brand-logo-collapsed"
                />
              )}
            </div>
          </div>

          <nav className="sidebar-nav-tree">
            {/* MAIN MENU */}
            <div className="nav-group-section">
              <span className="nav-section-label">MAIN MENU</span>
              <div
                className={`sidebar-nav-pill ${activeView === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateTo('dashboard')}
                title="Home"
              >
                <span className="nav-pill-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                {!isSidebarCollapsed && <span className="nav-pill-title">Home</span>}
              </div>
            </div>

            {/* MANAGEMENTS */}
            <div className="nav-group-section">
              <span className="nav-section-label">MANAGEMENTS</span>

              {/* Events Menu Item */}
              <div className={`nav-accordion-item ${openMenu === 'events' ? 'expanded' : ''}`}>
                <div
                  className={`sidebar-nav-pill ${isEventsActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick('events', 'events', 'manage-events')}
                  title="Events"
                >
                  <span className="nav-pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="nav-pill-title">Events</span>
                      <span className={`nav-chevron-icon ${openMenu === 'events' ? 'rotate-up' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>

                {/* Events Submenu (shown only when openMenu === 'events') */}
                {!isSidebarCollapsed && openMenu === 'events' && (
                  <div className="nav-sub-drawer">
                    <div
                      className={`sub-drawer-link ${activeView === 'events' && activeSubAction === 'manage-events' ? 'active' : ''}`}
                      onClick={() => navigateTo('events', 'manage-events')}
                    >
                      Manage events
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'eventPasses' ? 'active' : ''}`}
                      onClick={() => navigateTo('eventPasses', 'event-passes')}
                    >
                      Event Passes
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'tickets' ? 'active' : ''}`}
                      onClick={() => navigateTo('tickets', 'tickets-issues')}
                    >
                      Tickets &amp; Issues
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'createEvent' ? 'active' : ''}`}
                      onClick={() => navigateTo('createEvent', 'create-event')}
                    >
                      Create event
                    </div>
                  </div>
                )}
              </div>

              {/* Careers Menu Item */}
              <div className={`nav-accordion-item ${openMenu === 'careers' ? 'expanded' : ''}`}>
                <div
                  className={`sidebar-nav-pill ${isCareersActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick('careers', 'careers', 'all-careers')}
                  title="Careers"
                >
                  <span className="nav-pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="nav-pill-title">Careers</span>
                      <span className={`nav-chevron-icon ${openMenu === 'careers' ? 'rotate-up' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>

                {/* Careers Submenu (shown only when openMenu === 'careers') */}
                {!isSidebarCollapsed && openMenu === 'careers' && (
                  <div className="nav-sub-drawer">
                    <div
                      className={`sub-drawer-link ${activeView === 'careers' && (!activeSubAction || activeSubAction === 'all-careers') ? 'active' : ''}`}
                      onClick={() => navigateTo('careers', 'all-careers')}
                    >
                      All careers
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'createOpportunity' ? 'active' : ''}`}
                      onClick={() => navigateTo('createOpportunity', 'create-opportunity')}
                    >
                      Create opportunity
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'careers' && activeSubAction === 'applications' ? 'active' : ''}`}
                      onClick={() => navigateTo('careers', 'applications')}
                    >
                      Applications
                    </div>
                  </div>
                )}
              </div>

              {/* Schemes Menu Item */}
              <div className={`nav-accordion-item ${openMenu === 'schemes' ? 'expanded' : ''}`}>
                <div
                  className={`sidebar-nav-pill ${isSchemesActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick('schemes', 'schemes', 'all-schemes')}
                  title="Schemes"
                >
                  <span className="nav-pill-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      <line x1="12" y1="9" x2="12" y2="15" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                    </svg>
                  </span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="nav-pill-title">Schemes</span>
                      <span className={`nav-chevron-icon ${openMenu === 'schemes' ? 'rotate-up' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>

                {/* Schemes Submenu (shown only when openMenu === 'schemes') */}
                {!isSidebarCollapsed && openMenu === 'schemes' && (
                  <div className="nav-sub-drawer">
                    <div
                      className={`sub-drawer-link ${activeView === 'schemes' && (!activeSubAction || activeSubAction === 'all-schemes') ? 'active' : ''}`}
                      onClick={() => navigateTo('schemes', 'all-schemes')}
                    >
                      All schemes
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'createScheme' ? 'active' : ''}`}
                      onClick={() => navigateTo('createScheme', 'create-scheme')}
                    >
                      Create scheme
                    </div>
                    <div
                      className={`sub-drawer-link ${activeView === 'schemes' && activeSubAction === 'manage-schemes' ? 'active' : ''}`}
                      onClick={() => navigateTo('schemes', 'manage-schemes')}
                    >
                      Manage schemes
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* HELP & SUPPORT */}
            <div className="nav-group-section">
              <span className="nav-section-label">HELP &amp; SUPPORT</span>

              <div
                className={`sidebar-nav-pill ${activeView === 'helpCenter' || activeView === 'support' ? 'active' : ''}`}
                onClick={() => navigateTo('helpCenter')}
                title="Support"
              >
                <span className="nav-pill-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                {!isSidebarCollapsed && <span className="nav-pill-title">Support</span>}
              </div>

              <div
                className={`sidebar-nav-pill ${activeView === 'settings' ? 'active' : ''}`}
                onClick={() => navigateTo('settings')}
                title="Settings"
              >
                <span className="nav-pill-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                {!isSidebarCollapsed && <span className="nav-pill-title">Settings</span>}
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Support Card Box matching screenshot */}
        {!isSidebarCollapsed && (
          <div className="sidebar-support-card">
            <div className="support-card-headset-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div className="support-card-title">Need support?</div>
            <div className="support-card-desc">Contact our support team for any technical issue</div>
            <button
              className="support-card-btn"
              onClick={() => showToast('Connecting to Knotnex Tier-1 Support Desk...')}
            >
              Call the Expert
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop active"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
