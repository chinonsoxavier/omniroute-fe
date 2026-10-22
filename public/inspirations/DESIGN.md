---
name: Forest Precision Operations
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#404944'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4a2400'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a3700'
  on-tertiary-container: '#ff9939'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-default:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  data-mono-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  label-micro:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets high-velocity retail operations, inventory intelligence, and supply chain logistics directors within modern enterprise supermarket chains. The visual ethos merges the vitality and freshness of retail grocery with the surgical precision of enterprise telemetry.

### Visual Aesthetic & Movement
The design language is **Modern High-Density Utility**, combining systematic structural alignment with crisp micro-interactions:
- **Calm, High-Performance Control**: Crisp lines, structural dividers, and low-noise data surfaces empower managers to scan thousands of SKU units, stockout probabilities, and cold-chain thermal telemetry without cognitive exhaustion.
- **Freshness & Integrity**: Deep botanical greens evoke fresh agricultural stock and store vitality, shifting enterprise grocery software away from drab legacy terminal palettes into modern, tactile intelligence tools.
- **Information Architecture**: Engineered specifically for desktop-first widescreen consoles, wallboard metrics, and operational command terminals where information density, scannability, and millisecond recognition take precedence over decorative filler.

## Colors

The palette establishes an unmistakable hierarchy built for data-dense tabular presentation, operational threshold indicators, and telemetry alerts.

### Functional Roles & Distribution

- **Primary Brand Base (`#064E3B`)**: Represents authoritative grounding. Applied to primary navigational rails, active high-priority table headers, brand anchors, and master KPI badges.
- **Secondary Retail Energy (`#10B981`, with mid-tone `#059669`)**: Drives primary interactive callouts, active switches, healthy inventory states, confirmed intake receipts, and positive throughput deltas.
- **Warning & Pre-Emptive Action (`#D97706`)**: Applied to low-stock thresholds, impending expiration schedules (e.g., 48-hour shelf-life perishables), and pending vendor discrepancies.
- **Critical & Spoilage Alert (`#E11D48`)**: High-visibility rose/crimson dedicated exclusively to critical stockouts, cold-chain temperature violations, broken batches, and damaged goods.
- **Structural Slate Neutrals**:
  - `#0F172A`: Primary high-contrast typography, metric numerical values, and master icons.
  - `#334155`: Secondary labels, table column headers, and structural metadata.
  - `#E2E8F0`: Precision hairpins, column dividers, and card borders.
  - `#F1F5F9`: Alternating row bands, metric card footers, and active filter chip grounds.
  - `#F8FAFC`: Master viewport canvas surface ensuring glare-free extended usage in store back-offices.

## Typography

The typographic hierarchy pairs the structured modernity of Plus Jakarta Sans for high-level store summaries and KPI titles with the hyper-legible, utilitarian neutrality of Inter for high-density operations.

### Font Feature Directives
- **Tabular Figures Enabled**: All numerical metrics, SKU IDs, inventory counts, currency totals, and barcoded outputs must enforce `font-feature-settings: "tnum" 1, "cv05" 1, "cv11" 1` within CSS. This guarantees perfect vertical column alignment across rapidly updating inventory grids.
- **Scale Compactness**: Font sizes top out at 30px to maximize vertical screen efficiency on standard desktop monitors (1920x1080 and 2560x1440), eliminating the need for excessive scrolling during live shift operations.

## Layout & Spacing

The layout is architected around a fluid 24-column desktop operational grid with dedicated 64px collapsed / 240px expanded navigation sidebars. 

### Density Rhythms
- **High-Density Table Cells**: Table row heights are tightly bounded at 36px (condensed) or 44px (default with multi-tier SKU subtitles), utilizing `space-xs` (4px) vertical padding and `space-md` (12px) horizontal cell margins.
- **Card Clustering**: Metric telemetry groups utilize nested CSS grids with `gutter-dense` (8px) gaps to allow multi-metric comparative analysis above the inventory fold.
- **Viewport Constraints**: Viewports dynamically fit widescreen layouts without fluid bloat. Content modules stretch across screen width while capping max-width at 1920px for singular dashboard contexts to maintain scan paths.

## Elevation & Depth

Visual hierarchy prioritizes crisp border separations over multi-layered floating drop shadows, preserving clarity under harsh supermarket fluorescent and backroom terminal conditions.

### Architectural Surface Layers
- **Base Canvas (`#F8FAFC`)**: Lowest surface level housing the main workspace.
- **Structured Panels (`#FFFFFF`)**: Primary operational cards, data grids, and filter toolbars rely on a single 1px hairline border of `#E2E8F0` rather than deep shadows.
- **Subtle Ambient Lift**:
  - `Elevation-1` (Stationary Cards): `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
  - `Elevation-2` (Active Popovers / Filter Panels / Flyouts): `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
  - `Elevation-3` (Modals / Batch Transfer Prompts): `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.
- **Active Focus Rings**: Consistent 2px offset rings in `#10B981` with a 1px white boundary spacer for interactive inputs and cell navigations via keyboard.

## Shapes

The design system maintains a refined, tight geometry (`roundedness: 1`). Tight border radii provide crisp borders suited for information-packed dashboards while avoiding juvenile or consumer-app over-rounding.

### Shape Geometry Application
- **Tables & Nested Panels**: 4px (`0.25rem`) inner radius, 6px outer container radius.
- **Buttons, Inputs, Select Triggers**: 6px (`0.375rem`) corner radius for sharp geometric precision.
- **Cards & Primary Modules (`rounded-lg`)**: 8px (`0.5rem`) corner radius.
- **Micro-Metric Badges & Status Chips**: 4px (`0.25rem`) corner radius or full pill configuration exclusively for categorical item tagging.

## Components

### 1. Data Tables & High-Density Grids
- **Header**: Height 32px, background `#F1F5F9`, typography `label-xs` in uppercase slate `#334155`, bottom border 1px solid `#CBD5E1`.
- **Rows**: Alternating background support (`#FFFFFF` to `#F8FAFC`), hover state transitioning smoothly to `#F0FDF4` (soft green tint). 
- **Cell Alignment**: All inventory counts, currency, and timestamps must right-align; text descriptions left-align; status tags center-align.

### 2. Buttons & Actions
- **Primary Operational Button**: Background `#064E3B`, text `#FFFFFF`, font-weight 600, padding 6px 14px, radius 6px. Hover state deepens to `#022C22`.
- **Secondary Accent Button**: Background `#10B981`, text `#FFFFFF`. Hover state `#059669`.
- **Tertiary Utility Button**: Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#334155`. Hover background `#F8FAFC`.
- **Destructive Stockout/Discard**: Background `#FFF1F2`, border 1px solid `#FECDD3`, text `#E11D48`.

### 3. Micro-Metric Badges & Threshold Chips
- **Optimal Stock**: Background `#ECFDF5`, border 1px solid `#A7F3D0`, text `#065F46`, typography `label-micro`. Accompanied by a 6px solid emerald dot.
- **Low Stock (Warning)**: Background `#FFFBEB`, border 1px solid `#FDE68A`, text `#92400E`, typography `label-micro`.
- **Critical / Zero Inventory**: Background `#FFF1F2`, border 1px solid `#FECDD3`, text `#9F1239`, typography `label-micro`.
- **Transit / Scheduled Intake**: Background `#F1F5F9`, border 1px solid `#CBD5E1`, text `#334155`, typography `label-micro`.

### 4. Input Fields & Search Bars
- **SKU Barcode Quick-Find Input**: Background `#FFFFFF`, border 1px solid `#CBD5E1`, height 32px, text `body-sm`. Accompanied by fixed monospaced keyboard shortcut badge (`⌘K`).
- **Inline Table Editor Inputs**: Unbordered by default; on cell hover displays 1px dashed `#94A3B8`; on cell active displays 1px solid `#10B981` with zero layout shift.

### 5. Summary Telemetry Cards
- **Structure**: Background `#FFFFFF`, border 1px solid `#E2E8F0`, padding 16px, border-radius 8px.
- **Content Hierarchy**: Top title in `label-xs` slate (`#64748B`), core metric value rendered in 24px `Plus Jakarta Sans` semi-bold tabular figures, footer micro-trend displaying percentage changes in positive emerald (`#059669`) or negative rose (`#E11D48`).