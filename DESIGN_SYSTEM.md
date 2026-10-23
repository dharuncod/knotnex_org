# Knotnex Handmade Minimal Design System Specification

A clean, minimalist, high-density desktop and responsive application design system featuring **Knotnex's signature Royal Purple identity** combined with the modern, tactile, handmade structure of the reference fintech UI.

---

## 1. Core Color Tokens (Knotnex Royal Purple Identity)

### Primary Brand Palette
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--knotnex-primary` | `#6336EB` | Primary brand royal purple, main action buttons, active navigation accents |
| `--knotnex-primary-dark` | `#4D25C9` | Hover states on primary buttons and brand focus rings |
| `--brand-50` | `#F5F3FF` | Soft active navigation pill background, active table row tint |
| `--brand-100` | `#EDE9FE` | Active nav pill border, focus rings, subtle badges |
| `--brand-200` | `#DDD6FE` | Hover states on light purple surfaces |
| `--brand-500` | `#8B5CF6` | Vibrant violet accent |
| `--brand-600` | `#6336EB` | Signature Knotnex primary brand color |
| `--brand-700` | `#4D25C9` | Primary button hover state |
| `--brand-gradient` | `linear-gradient(135deg, #4D25C9 0%, #6336EB 50%, #7C3AED 100%)` | Hero actions, summit banners |

### Semantic Accents & Status Badges
| Token Name | Background / Text | Role / Usage |
| :--- | :--- | :--- |
| `--status-paid-bg` / `--status-paid-text` | `#ECFDF3` / `#16A34A` | `● Paid`, `● Completed`, verified checkmarks |
| `--status-pending-bg` / `--status-pending-text` | `#FFFBEB` / `#D97706` | `● Pending`, `● Ongoing`, `4 pending` alert |
| `--status-overdue-bg` / `--status-overdue-text` | `#FEF2F2` / `#DC2626` | `● Overdue`, `2 alert`, danger actions |
| `--status-draft-bg` / `--status-draft-text` | `#F1F5F9` / `#475467` | `● Draft`, inactive tags, neutral pills |

### Neutrals & Surfaces (Minimalist Canvas)
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--canvas-bg` | `#F8F9FA` | Soft neutral canvas background behind cards |
| `--bg-surface` | `#FFFFFF` | Crisp pure white card surface, sidebar, popovers, modals |
| `--border-default` | `#E5E7EB` | Standard card borders, input borders, button borders |
| `--border-subtle` | `#F3F4F6` | Table row dividers, inner section separators |
| `--text-primary` | `#111827` | Primary dark headings, KPI numbers, client titles |
| `--text-secondary` | `#4B5563` | Subtitles, body labels, active table labels |
| `--text-tertiary` | `#6B7280` | Table column headers (`thead`), date stamps |
| `--text-muted` | `#9CA3AF` | Nav section titles ("MAIN MENU", "MANAGEMENTS"), shortcuts |

---

## 2. Corner Radii (Handmade Minimal System)

| Token | Value | Applied To |
| :--- | :--- | :--- |
| `--radius-card` | `20px` | KPI stat cards, table cards, hero banners, content sheets, modal dialogs |
| `--radius-pill` | `9999px` | Search inputs, primary buttons, secondary buttons, "Call the Expert" CTA, filter pills |
| `--radius-icon-box` | `12px` | 44px $\times$ 44px rounded square stat icon boxes, quick action icon wraps |
| `--radius-nav-pill` | `12px` | Sidebar active nav pill (`.nav-item.active`) |
| `--radius-support-card` | `16px` | Sidebar "Need support" bottom card widget |
| `--radius-checkbox` | `6px` | Custom table header and row checkboxes |

---

## 3. Structural Component Breakdown

### 1. Sidebar Navigation
- **Brand Emblem**: 34px $\times$ 34px Knotnex purple square (`#6336EB`, 10px radius) with white emblem and workspace switcher `↕`.
- **Sidebar Search**: Pill search bar with magnifying glass, placeholder, and `⌘ + K` badge.
- **Categorized Sections**: "Main menu", "Managements", "Help & Support" in tracked 11px uppercase gray.
- **Active Navigation Pill**: 12px border radius, soft `#F5F3FF` background, `#EDE9FE` border, `#6336EB` icon & text.
- **Support Card Widget**: 16px border-radius white card with headphone icon, close `×`, helper text, and a full-width pill `Call the Expert` button.
- **Footer Links**: Clean Settings and Log out links.

### 2. KPI / Metric Cards (3-Part Layout)
- **Container**: Crisp white (`#FFFFFF`), `border-radius: 20px`, `border: 1px solid #E5E7EB`.
- **Left**: 44px $\times$ 44px rounded square icon box (`border-radius: 12px; background: #FAFAFA; border: 1px solid #F0F0F0;`).
- **Middle**: Label on top (`color: #6B7280; font-size: 13px; font-weight: 500;`), large value below (`color: #111827; font-size: 24px; font-weight: 700;`).
- **Right**: Three-dots `···` menu button and status/trend pill badge (`+14.8%`, `4 pending`, `2 alert`).

### 3. Data Tables (Minimal Handmade Aesthetic)
- **Container**: Card with `border-radius: 20px`, `border: 1px solid #ECECEC`, `overflow: hidden`.
- **Controls**: Pill search input (`border-radius: 9999px`) + segmented filter pills (`All`, `Upcoming`, `Ongoing`, `Completed`).
- **Header**: Light `#FFFFFF` or `#FAFAFA`, subtle `#F3F4F6` bottom border, uppercase tracked column titles, 6px rounded checkbox, strict 48px centered `#`.
- **Rows**: 60px–64px height, soft `#F3F4F6` dividers, hover state `#F9FAFB`.
- **Entity Cell**: Multi-hue colored initials circle + bold title (`#111827`, 13.5px) + subtitle (`#9CA3AF`, 12px).
- **Status Pills**: Minimal dot indicators (`.status-badge-minimal`).

### 4. Buttons
- **Primary Button (`.btn-primary`)**: Full pill shape (`border-radius: 9999px`), Knotnex royal purple (`#6336EB`), white bold text, subtle purple glow (`box-shadow: 0 4px 14px rgba(99, 54, 235, 0.28)`), hover `#4D25C9`.
- **Secondary Button (`.btn-secondary`)**: Full pill shape (`border-radius: 9999px`), crisp white surface, `#E5E7EB` border.
