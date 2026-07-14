# Design System & Styling Specification

This document details the active styling architecture, color palette, typography guidelines, and layout patterns for the Gym Management System frontend terminal.

---

## 1. Color System (The "So Matcha" Theme)

The application departs from standard dark dashboards, implementing a **tactile, warm, high-contrast athletic light design system**.

### 1.1 Color Variables
All design tokens are defined as CSS variables inside `:root` in [index.css](file:///d:/Camtech/Gym-Management-frontEnd/src/index.css):

| CSS Variable | Hex / HSL | Description / Visual Intent |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FAF8F2` | Warm off-white (60%). Applied to the main backdrop for a spacious, clean environment. |
| `--bg-surface` | `#FFFFFF` | Pure White. Used on container panels, modal boxes, lists, and elevated cards. |
| `--brand-primary` | `#3971B8` | Celtic Blue (30%). Primary brand color for sidebar, primary buttons, links, and active states. |
| `--accent-warm` | `#E6A100` | Refined Gold (10%). Used sparingly for sidebar highlights, metric text, and CTAs. |
| `--text-primary` | `#2B2E1F` | Cooled charcoal brown. Premium contrast tone for scanability. |
| `--text-muted` | `#6B7058` | Muted olive-grey. Secondary text, label descriptions, and helper prompts. |
| `--color-border` | `#D9E4F0` | Thin desaturated light blue border lines. |

### 1.2 Core Color Rules
* **Action Rule**: `blue` (`--brand-primary`) is strictly used for primary actions, CTA buttons, and main navigation links.
* **Accent Rule**: `gold` (`--accent-warm`) is strictly used for secondary highlights (active states inside the sidebar, numeric indicators, and high-importance numbers). Never use both colors as equals in the same component.

---

## 2. Neumorphic Depth & Elevation (Shadows)

The visual design simulates realistic physical elevation using layered shadows instead of simple flat lines.

```css
/* Core Neumorphic Elevations */
:root {
  --shadow-tactile: 
    0 1px 3px 0 rgba(52, 59, 27, 0.01),
    0 8px 16px -4px rgba(52, 59, 27, 0.02),
    0 4px 10px -2px rgba(52, 59, 27, 0.01);
    
  --shadow-tactile-lift: 
    0 12px 24px -4px rgba(52, 59, 27, 0.03),
    0 8px 16px -2px rgba(52, 59, 27, 0.01);
    
  --shadow-modal:
    0 25px 50px -12px rgba(52, 59, 27, 0.06),
    0 0 0 1.5px rgba(57, 113, 184, 0.15);
}
```

* **Interactive Lifting (`.tactile-card-lift:hover`)**: On hover, interactive cards lift upward (`transform: translateY(-2px)`) and change shadows from `--shadow-tactile` to `--shadow-tactile-lift` to provide tactile user feedback.
* **Transitions**: Micro-animations are driven by a smooth transition curve:
  `var(--transition-smooth): 0.15s cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 3. Typography Guide

Typography uses high-end, clean Google fonts to emphasize legibility and scanability for transactional screens:
* **Body Font** (`--font-family`): `'Poppins', -apple-system, BlinkMacSystemFont, sans-serif`. Heavy focus on line height (`1.5`) and letter spacing for general readability.
* **Heading Font** (`--font-heading`): `'Plus Jakarta Sans', sans-serif`. Applied on all metrics counts, headers, prices, and scan-heavy labels to ensure clear numeric formatting.

### 3.1 Font-Loading Verification
* Always check the **Computed** styles panel in DevTools to verify that `Plus Jakarta Sans` is successfully loaded and applied by the browser (ensuring it doesn't silently fall back to system sans-serif).

---

## 4. Grid System & Container Spacing

The layouts are built using standard CSS Grid classes to avoid ad-hoc styling and preserve structure.

```css
/* Responsive Layout Containers */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-overview-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Sub-Layout Spacing Columns */
.purity-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.purity-grid-2-3 {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
}

.purity-grid-3-2 {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}
```

### Responsive Overrides
At `@media (max-width: 1200px)` (tablets and small screens):
* Grids switch to single-column (`grid-template-columns: 1fr`).
* Outer margins and internal spacing adjust to a tighter `16px` padding and `16px` gaps.

---

## 5. UI Element Patterns

### 5.1 Border Radius
* `var(--radius-sm): 8px` (used for buttons, select dropdowns, and text inputs)
* `var(--radius-md): 12px` (used for smaller component cards and tags)
* `var(--radius-lg): 18px` (used for primary wrapper cards and overlay modals)
* `var(--radius-round): 9999px` (used for status pill badges and circular badges)

### 5.2 Status Pills
Status pill badges represent active states in the ledger table, using desaturated semantic colors that do not compete with the brand primary blue:
* **Active Status (`.status-badge.connected` / `.status-badge.active`)**: Semantic Green (`#16A34A` text on background `#DCFCE7`).
* **Pending Status (`.status-badge.pending`)**: Semantic Amber (`#D97706` text on background `#FEF3C7`).
* **Offline/Refunded (`.status-badge.offline` / `.status-badge.refunded`)**: Semantic Red (`#EF4444` text on background `#FEE2E2`).
