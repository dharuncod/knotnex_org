import React from 'react';
import DashboardSkeleton from './pages/DashboardSkeleton';
import EventsSkeleton from './pages/EventsSkeleton';
import CreateEventSkeleton from './pages/CreateEventSkeleton';
import EventDetailsSkeleton from './pages/EventDetailsSkeleton';
import EventPassesSkeleton from './pages/EventPassesSkeleton';
import CampaignsSkeleton from './pages/CampaignsSkeleton';
import CareersSkeleton from './pages/CareersSkeleton';
import CreateOpportunitySkeleton from './pages/CreateOpportunitySkeleton';
import SchemesSkeleton from './pages/SchemesSkeleton';
import CreateSchemeSkeleton from './pages/CreateSchemeSkeleton';
import AchievementsSkeleton from './pages/AchievementsSkeleton';
import OrgContentSkeleton from './pages/OrgContentSkeleton';
import OrgProfileSkeleton from './pages/OrgProfileSkeleton';
import TicketsSkeleton from './pages/TicketsSkeleton';
import HelpCenterSkeleton from './pages/HelpCenterSkeleton';
import SettingsSkeleton from './pages/SettingsSkeleton';

export default function ViewSkeleton({ viewKey }) {
  switch (viewKey) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'events':
      return <EventsSkeleton />;
    case 'createEvent':
      return <CreateEventSkeleton />;
    case 'eventDetails':
      return <EventDetailsSkeleton />;
    case 'eventPasses':
      return <EventPassesSkeleton />;
    case 'campaigns':
      return <CampaignsSkeleton />;
    case 'careers':
      return <CareersSkeleton />;
    case 'careerDetails':
      return <EventDetailsSkeleton />;
    case 'createOpportunity':
      return <CreateOpportunitySkeleton />;
    case 'schemes':
      return <SchemesSkeleton />;
    case 'schemeDetails':
    case 'schemeApplicationDetails':
      return <EventDetailsSkeleton />;
    case 'createScheme':
      return <CreateSchemeSkeleton />;
    case 'achievements':
      return <AchievementsSkeleton />;
    case 'orgContent':
      return <OrgContentSkeleton />;
    case 'orgProfile':
      return <OrgProfileSkeleton />;
    case 'tickets':
      return <TicketsSkeleton />;
    case 'helpCenter':
      return <HelpCenterSkeleton />;
    case 'settings':
      return <SettingsSkeleton />;
    default:
      return <DashboardSkeleton />;
  }
}
