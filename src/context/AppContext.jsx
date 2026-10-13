import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  initialState,
  initialTopNotifications,
  initialAchievements,
  initialContentPosts,
  initialOrgProfile
} from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation & UI Layout State
  const [activeView, setActiveView] = useState('dashboard');
  const [activeSubAction, setActiveSubAction] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initial mount micro-loader (for whole page + sidebar on refresh/first load)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Dark Mode Theme State & Persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('knotnex_dark_mode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('knotnex_dark_mode', 'true');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('knotnex_dark_mode', 'false');
      }
    } catch (e) {
      console.error('Failed to sync dark mode', e);
    }
  }, [isDarkMode]);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // Top Notifications
  const [topNotifications, setTopNotifications] = useState(initialTopNotifications);
  const [activeNotifFilter, setActiveNotifFilter] = useState('all');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Selected Entities
  const [selectedEventId, setSelectedEventId] = useState('ev-1');
  const [selectedJobId, setSelectedJobId] = useState('job-1');
  const [selectedTicketId, setSelectedTicketId] = useState('tkt-1');
  const [selectedPass, setSelectedPass] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editingScheme, setEditingScheme] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState('sch-1');
  const [selectedSchemeAppId, setSelectedSchemeAppId] = useState('sap-1');
  const [schemeAppReturnView, setSchemeAppReturnView] = useState('schemes');

  // Modals & Popups
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Toasts (Single active notification that replaces immediately on new events)
  const [toasts, setToasts] = useState([]);
  const toastTimerRef = useRef(null);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Main Domain Collections
  const [events, setEvents] = useState(initialState.events || []);
  const [registrations, setRegistrations] = useState(initialState.registrations || []);
  const [campaigns, setCampaigns] = useState(initialState.campaigns || []);
  const [jobs, setJobs] = useState(initialState.jobs || []);
  const [applications, setApplications] = useState(initialState.applications || []);
  const [schemes, setSchemes] = useState(initialState.schemes || []);
  const [schemeApplications, setSchemeApplications] = useState(initialState.schemeApplications || []);
  const [tickets, setTickets] = useState(initialState.tickets || []);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [contentPosts, setContentPosts] = useState(initialContentPosts);
  const [orgProfile, setOrgProfile] = useState(initialOrgProfile);
  const [knowledgeCategories] = useState(initialState.knowledgeCategories || []);
  const [helpArticles] = useState(initialState.helpArticles || []);

  // Account Settings (Display Name, Email, Phone, Organization Name, Subscription)
  const [accountSettings, setAccountSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('knotnex_account_settings');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      displayName: 'Ravi Prasanth',
      email: 'ravi@knotnex.com',
      phone: '+91 98765 43210',
      orgName: 'Knotbox Technologies Foundation',
      plan: 'Enterprise — Active Tier'
    };
  });

  const updateAccountSettings = (newSettings) => {
    setAccountSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('knotnex_account_settings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Support Queries State (User submitted queries / Ask Anything form)
  const [supportQueries, setSupportQueries] = useState(() => {
    try {
      const stored = localStorage.getItem('knotnex_support_queries');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'SUP-9281',
        createdAt: '12 Oct 2026, 14:30',
        name: 'Ravi Prasanth',
        email: 'ravi@knotnex.com',
        category: 'Event Management & Ticketing',
        subject: 'How do I generate attendee QR badges in bulk?',
        message: 'We have 450 registered delegates for our upcoming Tech Summit. Can we export and trigger automatic QR badge generation directly to attendee WhatsApp/Email in batch mode?',
        status: 'Resolved',
        priority: 'Medium'
      }
    ];
  });

  const addSupportQuery = (query) => {
    setSupportQueries(prev => {
      const updated = [query, ...prev];
      try {
        localStorage.setItem('knotnex_support_queries', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Show Toast Helper (Replaces previous popup immediately so notifications don't stack upwards)
  const showToast = (message, type = 'info') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts([{ id, message, type }]);
    toastTimerRef.current = setTimeout(() => {
      setToasts([]);
      toastTimerRef.current = null;
    }, 3500);
  };

  const removeToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToasts([]);
  };

  // View Navigation with Micro-loader
  const navigateTo = (viewKey, subAction = null) => {
    const resetScroll = () => {
      const el = document.getElementById('mainContentArea');
      if (el) el.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    resetScroll();
    setIsLoading(true);
    setActiveView(viewKey);
    setActiveSubAction(subAction);
    setIsMobileSidebarOpen(false);
    if (viewKey !== 'createEvent' || subAction !== 'edit-event') {
      if (subAction !== 'edit-event') {
        setEditingEvent(null);
      }
    }
    if (viewKey !== 'createOpportunity' || subAction !== 'edit-job') {
      if (subAction !== 'edit-job') {
        setEditingJob(null);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
      resetScroll();
      requestAnimationFrame(resetScroll);
      setTimeout(resetScroll, 60);
    }, 380);
  };

  const startEditEvent = (eventToEdit) => {
    const target = eventToEdit || selectedEvent;
    setEditingEvent(target);
    if (target && target.id) {
      setSelectedEventId(target.id);
    }
    navigateTo('createEvent', 'edit-event');
  };

  // Modal Controllers
  const openModal = (modalName, data = null) => {
    setActiveModal(modalName);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  // Keyboard shortcut for Escape to close modals and ⌘K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeModal) closeModal();
        if (isNotifOpen) setIsNotifOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('globalTopSearch');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, isNotifOpen]);

  // Notifications Helpers
  const markAllNotifsRead = () => {
    setTopNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'success');
  };

  const markNotifAsRead = (id) => {
    setTopNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    showToast('Notification marked as read', 'success');
  };

  const deleteNotif = (id) => {
    setTopNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification dismissed', 'info');
  };

  const clearAllNotifs = () => {
    setTopNotifications([]);
    showToast('Cleared all notifications', 'info');
  };

  // Event Helpers
  const selectEvent = (id) => {
    setSelectedEventId(id);
    navigateTo('eventDetails');
  };

  const addEvent = (newEvent) => {
    const ev = {
      ...newEvent,
      id: `ev-${Date.now()}`,
      poster: newEvent.poster || '/assets/posters/poster-default.svg',
      registered: 0,
      status: 'upcoming'
    };
    setEvents(prev => [ev, ...prev]);
    showToast(`Event "${ev.name}" successfully created!`, 'success');
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    if (id) {
      setSelectedEventId(id);
    }
    setEditingEvent(null);
    showToast('Event details updated successfully.', 'success');
  };

  // Opportunity (Job) Helpers
  const selectJob = (id) => {
    setSelectedJobId(id);
    navigateTo('careerDetails');
  };

  const startEditJob = (jobToEdit) => {
    const target = jobToEdit || selectedJob;
    setEditingJob(target);
    if (target && target.id) {
      setSelectedJobId(target.id);
    }
    navigateTo('createOpportunity', 'edit-job');
  };

  const addJob = (newJob) => {
    const job = {
      ...newJob,
      id: `job-${Date.now()}`,
      poster: newJob.poster || '/assets/hiring/hiring-default.svg',
      applicantsCount: 0,
      status: 'active'
    };
    setJobs(prev => [job, ...prev]);
    showToast(`Opportunity "${job.title}" published!`, 'success');
  };

  const updateJob = (jobId, updatedData) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, ...updatedData } : j)));
    showToast(`Opportunity updated successfully!`, 'success');
  };

  // Scheme Helpers
  const selectScheme = (id) => {
    setSelectedSchemeId(id);
    navigateTo('schemeDetails');
  };

  const addScheme = (newScheme) => {
    const scheme = {
      ...newScheme,
      id: `sch-${Date.now()}`,
      applicantsCount: 0,
      status: 'active'
    };
    setSchemes(prev => [scheme, ...prev]);
    showToast(`Grant scheme "${scheme.title}" launched!`, 'success');
  };

  const updateScheme = (schemeId, updatedData) => {
    setSchemes(prev => prev.map(s => (s.id === schemeId ? { ...s, ...updatedData } : s)));
    showToast(`Scheme updated successfully!`, 'success');
  };

  const updateSchemeApplication = (appId, updatedData) => {
    setSchemeApplications(prev => prev.map(a => (a.id === appId ? { ...a, ...updatedData } : a)));
  };

  const selectSchemeApplication = (appOrId, returnView = 'schemes') => {
    const id = typeof appOrId === 'object' && appOrId ? appOrId.id : appOrId;
    if (id) setSelectedSchemeAppId(id);
    setSchemeAppReturnView(returnView);
    navigateTo('schemeApplicationDetails');
  };

  // Campaign Helpers
  const addCampaign = (newCamp) => {
    const camp = {
      ...newCamp,
      id: `camp-${Date.now()}`,
      status: 'active',
      spend: '$0',
      reach: '0',
      conversions: 0
    };
    setCampaigns(prev => [camp, ...prev]);
    showToast(`Campaign "${camp.name}" launched!`, 'success');
  };

  // Achievement Helpers
  const addAchievement = (newAch) => {
    const ach = {
      ...newAch,
      id: `ach-${Date.now()}`
    };
    setAchievements(prev => [ach, ...prev]);
    showToast(`Achievement "${ach.title}" added to showcase!`, 'success');
  };

  // Content Helpers
  const addContentPost = (newPost) => {
    const post = {
      ...newPost,
      id: `cnt-${Date.now()}`,
      author: 'Arthur Taylor',
      date: 'Today',
      status: 'Published'
    };
    setContentPosts(prev => [post, ...prev]);
    showToast(`Published "${post.title}" to portal!`, 'success');
  };

  // Gate Scanner / Attendee Check-In
  const checkInAttendee = (ticketCode) => {
    setRegistrations(prev =>
      prev.map(reg => {
        if (reg.ticketCode === ticketCode || reg.id === ticketCode) {
          return { ...reg, status: 'used', validatedAt: 'Just now' };
        }
        return reg;
      })
    );
    showToast(`Pass ${ticketCode} verified & gate unlocked!`, 'success');
  };

  const addRegistration = (newReg) => {
    setRegistrations(prev => [newReg, ...prev]);
    showToast(`Pass credential ${newReg.ticketCode || ''} issued for ${newReg.name}!`, 'success');
  };

  // Ticket Status update
  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast(`Ticket status updated to ${status}.`, 'info');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const selectedScheme = schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  const selectedSchemeApplication =
    schemeApplications.find(a => a.id === selectedSchemeAppId) || schemeApplications[0];

  const value = {
    // Nav & layout
    activeView,
    activeSubAction,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isLoading,
    isInitialLoading,
    navigateTo,
    // Search
    searchQuery,
    setSearchQuery,
    // Notifications
    topNotifications,
    activeNotifFilter,
    setActiveNotifFilter,
    isNotifOpen,
    setIsNotifOpen,
    markAllNotifsRead,
    markNotifAsRead,
    deleteNotif,
    clearAllNotifs,
    // Selected
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    selectEvent,
    editingEvent,
    setEditingEvent,
    startEditEvent,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    selectJob,
    editingJob,
    setEditingJob,
    startEditJob,
    editingScheme,
    setEditingScheme,
    updateScheme,
    selectedSchemeId,
    setSelectedSchemeId,
    selectedScheme,
    selectScheme,
    selectedSchemeAppId,
    setSelectedSchemeAppId,
    selectedSchemeApplication,
    selectSchemeApplication,
    schemeAppReturnView,
    setSchemeAppReturnView,
    selectedTicketId,
    selectedTicket,
    setSelectedTicketId,
    selectedPass,
    setSelectedPass,
    // Modals
    activeModal,
    modalData,
    openModal,
    closeModal,
    // Toasts
    toasts,
    showToast,
    removeToast,
    // Collections
    events,
    setEvents,
    registrations,
    campaigns,
    jobs,
    applications,
    schemes,
    schemeApplications,
    tickets,
    achievements,
    contentPosts,
    orgProfile,
    setOrgProfile,
    knowledgeCategories,
    helpArticles,
    // Account Settings & Support Queries
    accountSettings,
    updateAccountSettings,
    supportQueries,
    addSupportQuery,
    // Mutation Handlers
    addEvent,
    updateEvent,
    addJob,
    updateJob,
    addScheme,
    updateScheme,
    updateSchemeApplication,
    setSchemeApplications,
    addCampaign,
    addAchievement,
    addContentPost,
    checkInAttendee,
    addRegistration,
    setRegistrations,
    updateTicketStatus,
    // Theme Mode
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode,
    // Auth
    isLoggedIn,
    setIsLoggedIn
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
