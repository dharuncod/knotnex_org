import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Layout & Common Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ToastContainer from './components/common/ToastContainer';
import LoginModal from './components/common/LoginModal';
import ModalManager from './components/modals/ModalManager';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ViewSkeleton, SidebarSkeleton, HeaderSkeleton } from './components/skeletons';

// Views
import DashboardView from './views/DashboardView';
import EventsView from './views/EventsView';
import CreateEventView from './views/CreateEventView';
import EventDetailsView from './views/EventDetailsView';
import EventPassesView from './views/EventPassesView';
import CampaignsView from './views/CampaignsView';
import CareersView from './views/CareersView';
import CreateOpportunityView from './views/CreateOpportunityView';
import CareerDetailsView from './views/CareerDetailsView';
import SchemesView from './views/SchemesView';
import SchemeDetailsView from './views/SchemeDetailsView';
import SchemeApplicationDetailsView from './views/SchemeApplicationDetailsView';
import CreateSchemeView from './views/CreateSchemeView';
import AchievementsView from './views/AchievementsView';
import OrgContentView from './views/OrgContentView';
import OrgProfileView from './views/OrgProfileView';
import TicketsView from './views/TicketsView';
import HelpCenterView from './views/HelpCenterView';
import SettingsView from './views/SettingsView';
import NotificationsView from './views/NotificationsView';

function AppContent() {
  const { activeView, isSidebarCollapsed, isLoading, isInitialLoading, navigateTo } = useApp();

  useEffect(() => {
    const resetScroll = () => {
      const mainArea = document.getElementById('mainContentArea');
      if (mainArea) {
        mainArea.scrollTop = 0;
      }
      const appFrame = document.getElementById('appFrame');
      if (appFrame && appFrame.style.visibility === 'hidden') {
        appFrame.style.visibility = '';
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 200);
    const t3 = setTimeout(resetScroll, 420);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeView, isLoading]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'events':
        return <EventsView />;
      case 'createEvent':
        return <CreateEventView />;
      case 'eventDetails':
        return <EventDetailsView />;
      case 'eventPasses':
        return <EventPassesView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'careers':
        return <CareersView />;
      case 'careerDetails':
        return <CareerDetailsView />;
      case 'createOpportunity':
        return <CreateOpportunityView />;
      case 'schemes':
        return <SchemesView />;
      case 'schemeDetails':
        return <SchemeDetailsView />;
      case 'schemeApplicationDetails':
        return <SchemeApplicationDetailsView />;
      case 'createScheme':
        return <CreateSchemeView />;
      case 'achievements':
        return <AchievementsView />;
      case 'orgContent':
        return <OrgContentView />;
      case 'orgProfile':
        return <OrgProfileView />;
      case 'tickets':
        return <TicketsView />;
      case 'support':
      case 'helpCenter':
        return <HelpCenterView />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="desktop-viewport">
      <div className={`desktop-app-frame ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="appFrame">
        {isInitialLoading ? <SidebarSkeleton /> : <Sidebar />}
        <main className="main-content" id="mainContentArea">
          {isInitialLoading ? <HeaderSkeleton /> : <Header />}
          <div className="content-fade-in" key={activeView + (isLoading ? '-loading' : '-loaded')}>
            <ErrorBoundary onNavigateDashboard={() => navigateTo('dashboard')}>
              {isLoading ? <ViewSkeleton viewKey={activeView} /> : renderActiveView()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      <ModalManager />
      <ToastContainer />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
