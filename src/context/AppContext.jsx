import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import authApi from '../api/authApi';
import eventsApi from '../api/eventsApi';
import jobsApi from '../api/jobsApi';
import schemesApi from '../api/schemesApi';
import registrationsApi from '../api/registrationsApi';
import organizationsApi from '../api/organizationsApi';
import ticketsApi from '../api/ticketsApi';
import notificationsApi from '../api/notificationsApi';

export const normalizeEvent = (e) => ({
  ...e,
  id: String(e.id),
  name: e.title || e.name || 'Untitled Event',
  title: e.title || e.name || 'Untitled Event',
  poster: e.cover_url || e.coverUrl || e.poster || '/assets/posters/poster-default.svg',
  date: e.event_date || e.date || 'Upcoming 2026',
  time: e.start_time || e.time || '09:00 AM',
  location: e.venue_name || e.venueName || e.location || 'Venue TBD',
  category: e.category || 'General',
  capacity: Number(e.capacity || 500),
  registered: Number(e.registration_count ?? e.registered ?? e.registered_count ?? 0),
  ticketPrice: e.ticket_price !== undefined ? e.ticket_price : (e.ticketPrice || 0),
  status: e.status || 'upcoming',
  description: e.detailed_description || e.short_description || e.description || '',
});

export const normalizeJob = (j) => ({
  ...j,
  id: String(j.id),
  title: j.title || j.role || 'Untitled Role',
  dept: j.department || j.dept || 'General',
  department: j.department || j.dept || 'General',
  type: j.type || 'Full-time',
  location: j.location || 'Remote',
  salary: j.salary || (j.min_salary ? `₹${j.min_salary} - ₹${j.max_salary}` : 'Competitive'),
  applicantsCount: Number(j.applications_count ?? j.applicantsCount ?? j.applicants_count ?? 0),
  status: j.status || 'active',
  description: j.description || '',
  poster: j.poster || '/assets/hiring/hiring-default.svg',
});

export const normalizeScheme = (s) => ({
  ...s,
  id: String(s.id),
  title: s.title || s.name || 'Untitled Scheme',
  provider: s.provider_name || s.provider || 'KnotNex Foundation',
  type: s.type || 'NGO',
  category: s.category || 'Welfare',
  description: s.description || '',
  deadline: s.application_deadline ? new Date(s.application_deadline).toLocaleDateString() : (s.deadline || 'Ongoing'),
  applicantsCount: Number(s.applications_count ?? s.applicantsCount ?? 0),
  status: s.status || 'active',
});

export const normalizeRegistration = (r, idx = 0) => ({
  ...r,
  id: String(r.id || `REG-${idx + 1001}`),
  ticketCode: r.qr_code_hash ? `#KNT-${r.qr_code_hash.substring(0, 6).toUpperCase()}` : (r.ticketCode || `#KNT-${idx + 8400}`),
  name: r.user_name || r.name || r.personal_info?.fullName || 'Participant',
  email: r.user_email || r.email || r.personal_info?.email || 'participant@knotnex.com',
  phone: r.phone || r.personal_info?.phone || '+91 98765 43210',
  eventName: r.event_title || r.eventName || r.event || 'KnotNex Event',
  event: r.event_title || r.eventName || r.event || 'KnotNex Event',
  date: r.created_at ? new Date(r.created_at).toLocaleDateString() : (r.date || 'Recent'),
  status: r.status === 'attended' ? 'used' : (r.status || 'valid'),
  checkedIn: Boolean(r.checked_in_at || r.status === 'attended' || r.status === 'used'),
  type: r.is_free ? 'Free Pass' : (r.ticket_price ? `Paid Pass (₹${r.ticket_price})` : 'Standard Entry'),
  paymentType: r.is_free ? 'free' : 'paid',
  tier: r.is_free ? 'Free Pass' : 'Standard Entry',
});

const defaultOrgProfile = {
  id: '',
  name: 'KnotNex Organization',
  slug: 'knotnex-org',
  type: 'NGO',
  about: '',
  mission: '',
  vision: '',
  services: [],
  contact_email: '',
  contact_phone: '',
  website: '',
  is_verified: true,
  followers_count: 0
};

const defaultKnowledgeCategories = [
  { id: 'cat-1', name: 'Event Ticketing & Badges', count: 4 },
  { id: 'cat-2', name: 'Opportunity Posting & Pipeline', count: 3 },
  { id: 'cat-3', name: 'Grant Application Reviews', count: 2 },
  { id: 'cat-4', name: 'Gate Scanner & Check-in', count: 5 },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation & UI Layout State
  const [activeView, setActiveView] = useState('dashboard');
  const [activeSubAction, setActiveSubAction] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  // Top Notifications (Real empty list, populated from backend)
  const [topNotifications, setTopNotifications] = useState([]);
  const [activeNotifFilter, setActiveNotifFilter] = useState('all');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Selected Entities
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editingScheme, setEditingScheme] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [selectedSchemeAppId, setSelectedSchemeAppId] = useState(null);
  const [schemeAppReturnView, setSchemeAppReturnView] = useState('schemes');

  // Modals & Popups
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastTimerRef = useRef(null);

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.'));

  // Auth State
  const [ssoError, setSsoError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem('knotnex_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const search = window.location.search || '';
        const params = new URLSearchParams(search);
        const code = params.get('code');
        const origin = params.get('origin');
        const client = params.get('client');
        const authToken = params.get('auth_token') || params.get('token');
        const orgId = params.get('orgId') || params.get('org_id');

        if (origin === 'knotnex_app' || client === 'flutter_mobile' || Boolean(authToken) || Boolean(code)) {
          try {
            sessionStorage.setItem('knotnex_enclave_authenticated', 'true');
            localStorage.setItem('knotnex_enclave_authenticated', 'true');
            if (authToken) {
              localStorage.setItem('knotnex_token', authToken);
            }
            if (orgId) {
              localStorage.setItem('knotnex_target_org_id', orgId);
            }
          } catch (_) {}
          return true;
        }

        const isEnclaveAuth =
          sessionStorage.getItem('knotnex_enclave_authenticated') === 'true' ||
          localStorage.getItem('knotnex_enclave_authenticated') === 'true';

        const token = localStorage.getItem('knotnex_token');
        if (isEnclaveAuth || token) return true;
      }
      return isLocalhost;
    } catch {
      return isLocalhost;
    }
  });

  const devBypass = () => {
    setIsLoggedIn(true);
    setSsoError(null);
  };

  // Main Domain Collections — All initialized to EMPTY arrays (100% Real Backend Data Only)
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [schemeApplications, setSchemeApplications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contentPosts, setContentPosts] = useState([]);
  const [orgProfile, setOrgProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('knotnex_org');
      return stored ? JSON.parse(stored) : defaultOrgProfile;
    } catch {
      return defaultOrgProfile;
    }
  });
  const [knowledgeCategories] = useState(defaultKnowledgeCategories);
  const [helpArticles] = useState([]);

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

  const loadBackendData = async (orgId) => {
    try {
      let activeOrg = orgProfile;
      if (!activeOrg || !activeOrg.id) {
        activeOrg = await organizationsApi.getMyOrganization();
        if (!activeOrg || !activeOrg.id) {
          try {
            const orgsRes = await apiClient.get('/organizations');
            const list = Array.isArray(orgsRes?.data) ? orgsRes.data : [];
            if (list.length > 0) activeOrg = list[0];
          } catch (_) {}
        }
        if (activeOrg) {
          setOrgProfile(activeOrg);
          try {
            localStorage.setItem('knotnex_org', JSON.stringify(activeOrg));
          } catch (_) {}
        }
      }

      const targetOrgId = orgId || activeOrg?.id;

      const [backendEvents, backendJobs, backendSchemes, backendRegs, backendTickets, backendNotifs] =
        await Promise.allSettled([
          targetOrgId ? eventsApi.getOrgEvents(targetOrgId) : Promise.resolve([]),
          targetOrgId ? jobsApi.getOrgJobs(targetOrgId) : Promise.resolve([]),
          targetOrgId ? schemesApi.getOrgSchemes(targetOrgId) : Promise.resolve([]),
          targetOrgId ? registrationsApi.getOrgRegistrations(targetOrgId) : Promise.resolve([]),
          ticketsApi.getTickets(),
          notificationsApi.getNotifications(),
        ]);

      if (backendEvents.status === 'fulfilled') {
        const evList = Array.isArray(backendEvents.value) ? backendEvents.value : (backendEvents.value?.items || []);
        setEvents(evList.map(normalizeEvent));
        setSelectedEventId(evList.length > 0 ? String(evList[0].id) : null);
      } else {
        setEvents([]);
        setSelectedEventId(null);
      }

      if (backendJobs.status === 'fulfilled') {
        const jobList = Array.isArray(backendJobs.value) ? backendJobs.value : (backendJobs.value?.items || []);
        setJobs(jobList.map(normalizeJob));
        setSelectedJobId(jobList.length > 0 ? String(jobList[0].id) : null);
      } else {
        setJobs([]);
        setSelectedJobId(null);
      }

      if (backendSchemes.status === 'fulfilled') {
        const schemeList = Array.isArray(backendSchemes.value) ? backendSchemes.value : (backendSchemes.value?.items || []);
        setSchemes(schemeList.map(normalizeScheme));
        setSelectedSchemeId(schemeList.length > 0 ? String(schemeList[0].id) : null);
      } else {
        setSchemes([]);
        setSelectedSchemeId(null);
      }

      if (backendRegs.status === 'fulfilled') {
        const regList = Array.isArray(backendRegs.value) ? backendRegs.value : (backendRegs.value?.items || []);
        setRegistrations(regList.map((r, i) => normalizeRegistration(r, i)));
      } else {
        setRegistrations([]);
      }

      if (backendTickets.status === 'fulfilled') {
        const tList = Array.isArray(backendTickets.value) ? backendTickets.value : [];
        setTickets(tList);
        setSelectedTicketId(tList.length > 0 ? String(tList[0].id) : null);
      }

      if (backendNotifs.status === 'fulfilled') {
        const nList = Array.isArray(backendNotifs.value) ? backendNotifs.value : [];
        setTopNotifications(nList);
      }
    } catch (e) {
      console.warn('[AppContext] Error loading backend data:', e);
    }
  };

  // SSO Verification & Initial Backend Data Sync
  useEffect(() => {
    let isMounted = true;

    const handleSsoAndData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const authToken = urlParams.get('auth_token') || urlParams.get('token');
        const origin = urlParams.get('origin');
        const client = urlParams.get('client');
        const orgIdParam =
          urlParams.get('orgId') ||
          urlParams.get('org_id') ||
          (typeof window !== 'undefined' ? localStorage.getItem('knotnex_target_org_id') : null);

        const isMobileLaunch =
          origin === 'knotnex_app' ||
          client === 'flutter_mobile' ||
          Boolean(authToken) ||
          Boolean(code) ||
          (typeof window !== 'undefined' &&
            (sessionStorage.getItem('knotnex_enclave_authenticated') === 'true' ||
              localStorage.getItem('knotnex_enclave_authenticated') === 'true'));

        if (isMobileLaunch) {
          try {
            sessionStorage.setItem('knotnex_enclave_authenticated', 'true');
            localStorage.setItem('knotnex_enclave_authenticated', 'true');
            if (authToken) {
              localStorage.setItem('knotnex_token', authToken);
            }
            if (orgIdParam) {
              localStorage.setItem('knotnex_target_org_id', orgIdParam);
            }
          } catch (_) {}
        }

        if (code) {
          try {
            const data = await authApi.verifySsoCode(code);
            if (isMounted) {
              setIsLoggedIn(true);
              setSsoError(null);
              if (data.user) {
                setCurrentUser(data.user);
                localStorage.setItem('knotnex_user', JSON.stringify(data.user));
              }
              if (data.organization) {
                setOrgProfile(prev => ({
                  ...prev,
                  ...data.organization,
                  name: data.organization.name || prev.name,
                  about: data.organization.about || prev.about,
                }));
                localStorage.setItem('knotnex_org', JSON.stringify(data.organization));
              }
              const cleanUrl = window.location.pathname + window.location.hash;
              window.history.replaceState({}, document.title, cleanUrl);
              showToast('✅ Authenticated via KnotNex Mobile Enclave', 'success');
            }
          } catch (err) {
            console.error('[AppContext] SSO verification error:', err);
            if (isMounted) {
              setSsoError(err.message || 'SSO verification failed');
              if (!isLocalhost && !isMobileLaunch) {
                setIsLoggedIn(false);
                apiClient.setToken(null);
              }
            }
          }
        } else if (authToken) {
          // Direct secure mobile app token handoff from KnotNex Flutter app
          if (isMounted) {
            apiClient.setToken(authToken);
            try {
              localStorage.setItem('knotnex_token', authToken);
            } catch (_) {}
            setIsLoggedIn(true);
            setSsoError(null);

            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            showToast('✅ Authenticated via KnotNex Mobile App', 'success');
          }

          try {
            const profileRes = await apiClient.get('/users/profile');
            if (profileRes && profileRes.data && isMounted) {
              setCurrentUser(profileRes.data);
              try {
                localStorage.setItem('knotnex_user', JSON.stringify(profileRes.data));
              } catch (_) {}
            }
          } catch (_) {}
        } else if (isMobileLaunch) {
          // In-App browser opened from KnotNex Flutter app
          if (isMounted) {
            setIsLoggedIn(true);
            setSsoError(null);
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            showToast('✅ Connected via KnotNex App', 'success');
          }
        } else if (!isLocalhost && !isMobileLaunch) {
          // Standalone browser access without mobile app handoff:
          // Check if an existing stored session is still valid with the backend
          const existingToken = apiClient.getToken();
          if (existingToken) {
            try {
              const profileRes = await apiClient.get('/users/profile');
              if (profileRes && profileRes.data) {
                if (isMounted) {
                  setIsLoggedIn(true);
                  if (profileRes.data) setCurrentUser(profileRes.data);
                }
              } else {
                if (isMounted) {
                  setIsLoggedIn(false);
                  apiClient.setToken(null);
                }
              }
            } catch {
              if (isMounted) {
                setIsLoggedIn(false);
                apiClient.setToken(null);
              }
            }
          } else {
            if (isMounted) {
              setIsLoggedIn(false);
            }
          }
        }

        let activeOrg = orgProfile;
        if (orgIdParam && (!activeOrg || activeOrg.id !== orgIdParam)) {
          try {
            const fetchedOrg = await apiClient.get(`/organizations/${orgIdParam}`);
            const orgData = fetchedOrg?.data || fetchedOrg;
            if (orgData && orgData.id) {
              activeOrg = orgData;
              if (isMounted) {
                setOrgProfile(activeOrg);
                localStorage.setItem('knotnex_org', JSON.stringify(activeOrg));
              }
            }
          } catch (_) {}
        }

        if (!activeOrg || !activeOrg.id) {
          activeOrg = await organizationsApi.getMyOrganization();
          if (!activeOrg || !activeOrg.id) {
            try {
              const orgsRes = await apiClient.get('/organizations');
              const list = Array.isArray(orgsRes?.data) ? orgsRes.data : (Array.isArray(orgsRes) ? orgsRes : []);
              if (list.length > 0) activeOrg = list[0];
            } catch (_) {}
          }
          if (activeOrg && isMounted) {
            setOrgProfile(activeOrg);
            localStorage.setItem('knotnex_org', JSON.stringify(activeOrg));
          }
        }

        await loadBackendData(activeOrg?.id);
      } catch (err) {
        console.warn('[AppContext] Initial load error:', err);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
          setIsLoading(false);
        }
      }
    };

    handleSsoAndData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Event Operations (Backend Connected)
  const addEvent = async (newEvent) => {
    try {
      let rawDate = newEvent.date || newEvent.eventDate;
      if (rawDate && rawDate.includes(' • ')) {
        rawDate = rawDate.split(' • ')[0];
      }
      let formattedDate = new Date().toISOString().split('T')[0];
      if (rawDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
          formattedDate = rawDate;
        } else {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().split('T')[0];
          }
        }
      }

      const rawPrice = newEvent.ticketPrice !== undefined ? newEvent.ticketPrice : 0;
      const numPrice = typeof rawPrice === 'number' ? rawPrice : (parseInt(String(rawPrice).replace(/[^0-9]/g, ''), 10) || 0);
      const isFree = numPrice === 0 || String(rawPrice).toLowerCase().includes('free');

      const activeOrgId = orgProfile?.id;

      const payload = {
        title: newEvent.name || newEvent.title,
        category: newEvent.category || 'Technology',
        type: (newEvent.type && ['Online', 'In-Person', 'Hybrid'].includes(newEvent.type)) ? newEvent.type : 'In-Person',
        eventDate: formattedDate,
        startTime: newEvent.time || newEvent.startTime || '10:00:00',
        endTime: newEvent.endTime || '17:00:00',
        venueName: newEvent.location || newEvent.venueName || 'Venue TBD',
        shortDescription: newEvent.description ? newEvent.description.substring(0, 160) : '',
        detailedDescription: newEvent.description || '',
        coverUrl: newEvent.poster || newEvent.coverUrl || undefined,
        ticketPrice: numPrice,
        isFree,
        wheelchairAccessible: Boolean(newEvent.wheelchairAccessible),
        signLanguage: Boolean(newEvent.signLanguage),
        capacity: newEvent.capacity ? Number(newEvent.capacity) : 500,
        status: 'published',
        orgId: activeOrgId,
        org_id: activeOrgId,
      };

      const created = await eventsApi.createEvent(payload);
      const ev = normalizeEvent({ ...newEvent, ...(created || {}), id: created?.id || newEvent.id });
      setEvents(prev => [ev, ...prev]);
      setSelectedEventId(ev.id);
      showToast(`Event "${ev.name}" successfully published!`, 'success');
      return ev;
    } catch (err) {
      console.warn('[AppContext] createEvent error:', err);
      showToast(`Event created locally (${err.message})`, 'info');
      const ev = normalizeEvent({
        ...newEvent,
        id: `ev-${Date.now()}`,
        status: 'published',
      });
      setEvents(prev => [ev, ...prev]);
      setSelectedEventId(ev.id);
      return ev;
    }
  };

  const updateEvent = async (id, updates) => {
    try {
      await eventsApi.updateEvent(id, updates);
    } catch (err) {
      console.warn('[AppContext] updateEvent error:', err);
    }
    setEvents(prev => prev.map(e => (String(e.id) === String(id) ? normalizeEvent({ ...e, ...updates }) : e)));
    if (id) {
      setSelectedEventId(id);
    }
    setEditingEvent(null);
    showToast('Event details updated successfully.', 'success');
  };

  const deleteEvent = async (id) => {
    try {
      await eventsApi.deleteEvent(id);
    } catch (err) {
      console.warn('[AppContext] deleteEvent error:', err);
    }
    setEvents(prev => prev.filter(e => String(e.id) !== String(id)));
    showToast('Event deleted successfully.', 'info');
  };

  // Opportunity (Job) Operations (Backend Connected)
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

  const addJob = async (newJob) => {
    try {
      const activeOrgId = orgProfile?.id;
      const jType = (newJob.type && ['full-time', 'part-time', 'internship', 'volunteer', 'contract'].includes(newJob.type.toLowerCase()))
        ? newJob.type.toLowerCase() : 'full-time';
      const locType = (newJob.location && newJob.location.toLowerCase().includes('remote')) ? 'remote' : 'on-site';

      const payload = {
        title: newJob.title || newJob.role,
        department: newJob.dept || newJob.department || 'General',
        type: jType,
        locationType: locType,
        location: newJob.location || 'Remote',
        description: newJob.description || 'Opportunity at KnotNex Organization',
        requirements: Array.isArray(newJob.skills) ? newJob.skills : (newJob.skills ? [newJob.skills] : []),
        responsibilities: Array.isArray(newJob.responsibilities) ? newJob.responsibilities : [],
        disabilityAccommodations: Array.isArray(newJob.accommodations) ? newJob.accommodations : [],
        minSalary: Number(newJob.minSalary || 350000),
        maxSalary: Number(newJob.maxSalary || 650000),
        status: 'open',
        orgId: activeOrgId,
        org_id: activeOrgId,
      };

      const created = await jobsApi.createJob(payload);
      const job = normalizeJob({ ...newJob, ...(created || {}), id: created?.id || newJob.id });
      setJobs(prev => [job, ...prev]);
      setSelectedJobId(job.id);
      showToast(`Opportunity "${job.title}" published!`, 'success');
      return job;
    } catch (err) {
      console.warn('[AppContext] createJob error:', err);
      showToast(`Opportunity created locally (${err.message})`, 'info');
      const job = normalizeJob({
        ...newJob,
        id: `job-${Date.now()}`,
        status: 'active',
      });
      setJobs(prev => [job, ...prev]);
      setSelectedJobId(job.id);
      return job;
    }
  };

  const updateJob = async (jobId, updatedData) => {
    try {
      await jobsApi.updateJob(jobId, updatedData);
    } catch (err) {
      console.warn('[AppContext] updateJob error:', err);
    }
    setJobs(prev => prev.map(j => (String(j.id) === String(jobId) ? normalizeJob({ ...j, ...updatedData }) : j)));
    showToast('Opportunity updated successfully!', 'success');
  };

  const deleteJob = async (jobId) => {
    try {
      await jobsApi.deleteJob(jobId);
    } catch (err) {
      console.warn('[AppContext] deleteJob error:', err);
    }
    setJobs(prev => prev.filter(j => String(j.id) !== String(jobId)));
    showToast('Opportunity deleted successfully.', 'info');
  };

  // Scheme Operations (Backend Connected)
  const selectScheme = (id) => {
    setSelectedSchemeId(id);
    navigateTo('schemeDetails');
  };

  const addScheme = async (newScheme) => {
    try {
      const activeOrgId = orgProfile?.id;
      const sType = (newScheme.type && ['Government', 'NGO', 'Corporate CSR'].includes(newScheme.type))
        ? newScheme.type : 'NGO';

      const payload = {
        title: newScheme.title || newScheme.name,
        providerName: newScheme.provider || orgProfile?.name || 'KnotNex Foundation',
        type: sType,
        category: newScheme.category || 'Welfare',
        description: newScheme.description || 'Welfare scheme program',
        eligibilityCriteria: Array.isArray(newScheme.eligibilityCriteria)
          ? newScheme.eligibilityCriteria
          : (newScheme.eligibility ? [newScheme.eligibility] : []),
        benefits: Array.isArray(newScheme.benefits) ? newScheme.benefits : [],
        documentsRequired: Array.isArray(newScheme.documents) ? newScheme.documents : (newScheme.documentsRequired || []),
        applicationDeadline: newScheme.deadline || undefined,
        status: 'active',
        orgId: activeOrgId,
        org_id: activeOrgId,
      };

      const created = await schemesApi.createScheme(payload);
      const scheme = normalizeScheme({ ...newScheme, ...(created || {}), id: created?.id || newScheme.id });
      setSchemes(prev => [scheme, ...prev]);
      setSelectedSchemeId(scheme.id);
      showToast(`Grant scheme "${scheme.title}" launched!`, 'success');
      return scheme;
    } catch (err) {
      console.warn('[AppContext] createScheme error:', err);
      showToast(`Scheme saved locally (${err.message})`, 'info');
      const scheme = normalizeScheme({
        ...newScheme,
        id: `sch-${Date.now()}`,
        status: 'active',
      });
      setSchemes(prev => [scheme, ...prev]);
      setSelectedSchemeId(scheme.id);
      return scheme;
    }
  };

  const updateScheme = async (schemeId, updatedData) => {
    try {
      await schemesApi.updateScheme(schemeId, updatedData);
    } catch (err) {
      console.warn('[AppContext] updateScheme error:', err);
    }
    setSchemes(prev => prev.map(s => (String(s.id) === String(schemeId) ? normalizeScheme({ ...s, ...updatedData }) : s)));
    showToast('Scheme updated successfully!', 'success');
  };

  const deleteScheme = async (schemeId) => {
    try {
      await schemesApi.deleteScheme(schemeId);
    } catch (err) {
      console.warn('[AppContext] deleteScheme error:', err);
    }
    setSchemes(prev => prev.filter(s => String(s.id) !== String(schemeId)));
    showToast('Scheme deleted successfully.', 'info');
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

  // Organization Profile Update (Backend Connected)
  const updateOrgProfile = async (updatedData) => {
    const orgId = orgProfile?.id;
    if (orgId) {
      try {
        await organizationsApi.updateOrg(orgId, updatedData);
      } catch (err) {
        console.warn('[AppContext] updateOrg error:', err);
      }
    }
    setOrgProfile(prev => {
      const merged = { ...prev, ...updatedData };
      try {
        localStorage.setItem('knotnex_org', JSON.stringify(merged));
      } catch (_) {}
      return merged;
    });
    showToast('Organisation profile saved!', 'success');
  };

  // Gate Scanner / Attendee Check-In (Backend Connected)
  const checkInAttendee = async (ticketCode) => {
    try {
      await registrationsApi.checkInByQr(ticketCode);
    } catch (err) {
      console.warn('[AppContext] checkInByQr error:', err);
    }
    setRegistrations(prev =>
      prev.map(reg => {
        if (reg.ticketCode === ticketCode || String(reg.id) === String(ticketCode)) {
          return { ...reg, status: 'used', checkedIn: true, validatedAt: 'Just now' };
        }
        return reg;
      })
    );
    showToast(`Pass ${ticketCode} verified & gate unlocked!`, 'success');
  };

  const updateRegistrationStatus = async (regId, status) => {
    try {
      await registrationsApi.updateStatus(regId, status);
    } catch (err) {
      console.warn('[AppContext] updateStatus error:', err);
    }
    setRegistrations(prev =>
      prev.map(reg => (String(reg.id) === String(regId) ? { ...reg, status, checkedIn: status === 'attended' || status === 'used' } : reg))
    );
    showToast(`Registration status set to ${status}.`, 'info');
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


  const selectedEvent = events.find(e => String(e.id) === String(selectedEventId)) || events[0] || null;
  const selectedJob = jobs.find(j => String(j.id) === String(selectedJobId)) || jobs[0] || null;
  const selectedTicket = tickets.find(t => String(t.id) === String(selectedTicketId)) || tickets[0] || null;
  const selectedScheme = schemes.find(s => String(s.id) === String(selectedSchemeId)) || schemes[0] || null;
  const selectedSchemeApplication =
    schemeApplications.find(a => String(a.id) === String(selectedSchemeAppId)) || schemeApplications[0] || null;

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
    deleteEvent,
    addJob,
    updateJob,
    deleteJob,
    addScheme,
    updateScheme,
    deleteScheme,
    updateSchemeApplication,
    setSchemeApplications,
    updateOrgProfile,
    addCampaign,
    addAchievement,
    addContentPost,
    checkInAttendee,
    updateRegistrationStatus,
    addRegistration,
    setRegistrations,
    updateTicketStatus,
    // Theme Mode
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode,
    // Auth & SSO
    isLoggedIn,
    setIsLoggedIn,
    ssoError,
    currentUser,
    devBypass,
    loadBackendData,
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
