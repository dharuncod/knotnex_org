import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../common/SearchBar';

export default function Header() {
  const {
    activeView,
    navigateTo,
    searchQuery,
    setSearchQuery,
    topNotifications,
    activeNotifFilter,
    setActiveNotifFilter,
    isNotifOpen,
    setIsNotifOpen,
    markAllNotifsRead,
    clearAllNotifs,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    accountSettings,
    orgProfile
  } = useApp();

  const notifRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotifOpen]);

  const unreadCount = topNotifications.filter(n => n.unread).length;

  const filteredNotifications = topNotifications.filter(n => {
    if (activeNotifFilter === 'all') return true;
    return n.type === activeNotifFilter;
  });

  return (
    <header className="appbar-header" id="appHeader">
      {/* Mobile Drawer Trigger (Mobile Only) */}
      <button
        className="appbar-mobile-menu-btn"
        id="btnMobileMenuToggle"
        title="Toggle Menu"
        aria-label="Toggle Navigation Menu"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Center: Reusable Search Bar */}
      <div className="appbar-center-search">
        <SearchBar
          id="globalTopSearch"
          placeholder="Search events, jobs, schemes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="480px"
          expandWidth="525px"
        />
      </div>

      {/* Right: Actions Cluster matching screenshot */}
      <div className="appbar-right-actions">

        {/* Circular Notification Bell Button */}
        <div className="appbar-dropdown-anchor" id="topNotificationsWrapper">
          <button
            className={`appbar-circle-bell-btn ${activeView === 'notifications' ? 'active' : ''}`}
            title="Notifications"
            id="btnTopNotifications"
            aria-label="Open notifications screen"
            onClick={() => navigateTo('notifications')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="appbar-bell-dot" id="topNotifDot" />}
          </button>
        </div>

        {/* User Profile Badge: Purple circle avatar with "R", Name, Email & Chevron */}
        <div
          className="appbar-profile-badge"
          id="headerUserProfile"
          onClick={() => navigateTo('orgProfile')}
          title="Organization Profile"
        >
          <div className="appbar-avatar-circle">
            {(accountSettings?.displayName || orgProfile?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="appbar-profile-details">
            <span className="appbar-profile-name">{accountSettings?.displayName || orgProfile?.name || 'Organization Admin'}</span>
            <span className="appbar-profile-email">{accountSettings?.email || orgProfile?.contact_email || 'admin@knotnex.com'}</span>
          </div>
          <svg className="appbar-profile-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
