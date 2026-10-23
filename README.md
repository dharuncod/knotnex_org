# Knotnex Organization Admin Dashboard — React Frontend

A complete, pixel-perfect React conversion of the **Knotnex Handmade Minimal Organization Portal**. Every layout element, view, tab, wizard, interactive modal, dynamic table, and CSS token from the original design has been preserved with zero omissions.

---

## 🚀 Quick Start

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/).

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Architecture Overview

```text
Knotnexorgdash/
├── public/
│   └── assets/                     # Complete visual assets (posters, avatars, hiring banners, brand SVGs)
├── src/
│   ├── assets/                     # Vite default assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlobalLoadingBar.jsx # Visual transition loading bar across view changes
│   │   │   ├── LoginModal.jsx       # Knotnex Enterprise authentication modal
│   │   │   └── ToastContainer.jsx   # Dynamic floating feedback toasts
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Global search (⌘K), Notifications panel, Quick "+ Create" menu
│   │   │   └── Sidebar.jsx          # Collapsible navigation, sub-menus, active badges, Expert CTA
│   │   └── modals/
│   │       └── ModalManager.jsx     # Master controller for all 13 interactive modals
│   ├── context/
│   │   └── AppContext.jsx           # State management: views, CRUD, modal triggers, toast alerts, filters
│   ├── data/
│   │   └── initialData.js           # Complete seeded mock dataset for events, jobs, schemes, tickets, etc.
│   ├── views/
│   │   ├── DashboardView.jsx        # Hero carousel, KPI stat cards, Quick actions, Activity stream
│   │   ├── EventsView.jsx           # Events catalog + Attendee Registrations tab, filter tags, search
│   │   ├── CreateEventView.jsx      # 3-step studio wizard, poster gallery, live sticky preview card
│   │   ├── EventDetailsView.jsx     # Full banner, agenda, pass tiers, speaker sidebar, gate turnstile
│   │   ├── EventPassesView.jsx      # Issued passes credentials, QR validator, quick check-in actions
│   │   ├── CampaignsView.jsx        # Fundraising campaign cards, target progress bars, donation stats
│   │   ├── CareersView.jsx          # Open roles grid + Candidate applications review table
│   │   ├── CreateOpportunityView.jsx# Job definition wizard, hiring poster picker, live preview card
│   │   ├── SchemesView.jsx          # Government & corporate grants catalog, applicant dossiers
│   │   ├── CreateSchemeView.jsx     # Grant definition form, focus area, timeline, live card preview
│   │   ├── AchievementsView.jsx     # Recognition & milestones 3-column cards with external citations
│   │   ├── OrgContentView.jsx       # Published articles, press releases, media assets manager
│   │   ├── OrgProfileView.jsx       # Legal entity dossier, GSTIN/PAN, address, PDF dropzone
│   │   ├── TicketsView.jsx          # Support tickets queue, priority badges, status update workflows
│   │   ├── HelpCenterView.jsx       # 6 knowledge categories, emergency support hotlines, search
│   │   └── SettingsView.jsx         # Account, Notifications, Privacy, Appearance, Integrations
│   ├── App.jsx                      # Root application assembling layouts & view transitions
│   ├── main.jsx                     # Application entry point
│   └── style.css                    # Complete 12,612-line Knotnex Handmade Minimal Design System
├── index.html                       # Preloads Google Sans, JetBrains Mono, Material Symbols
└── vite.config.js                   # Vite configuration
```

---

## 🎨 Complete Design System Fidelity
- **Palette**: Knotnex Royal Purple (`#6336EB`), Deep Void (`#1A1726`), Soft Gray (`#F6F8FA`), and Surface whites.
- **Typography**: Google Sans, Google Sans Flex, and JetBrains Mono code elements.
- **Icons**: Google Material Symbols Outlined icons throughout.
- **Modals Included (13/13)**:
  1. `modalEventLivePreview` — Live Event Ticket & Pass simulation
  2. `modalAddCustomQuestion` — Custom registration form field builder
  3. `modalAddSessionDialog` — Agenda schedule item creator
  4. `modalAddSpeakerDialog` — Keynote speaker profile modal
  5. `modalCreateCampaign` — Fundraising campaign modal
  6. `modalAddAchievement` — Milestone / award creator
  7. `modalCreateContent` — Article / press announcement composer
  8. `modalViewTicketPass` — Attendee event badge & QR pass
  9. `modalIssueTicket` — Support ticket issue composer
  10. `modalEditEventDetails` — Edit live event details
  11. `modalQrGateScanner` — Interactive camera/simulated gate turnstile QR pass scanner
  12. `modalAddAttendee` — Manual attendee registry bypass
  13. `modalTicketIssueDetails` — Comprehensive support ticket audit dossier


  
