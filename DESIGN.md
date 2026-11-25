---
name: Nusantara Digital
description: Company profile for a digital studio, presented as a credible corporate report.
colors:
  primary: "#1e3a8a"
  primary-deep: "#172554"
  ground: "#ffffff"
  ground-soft: "#f8fafc"
  ink: "#0f172a"
  ink-soft: "#1e293b"
  muted: "#475569"
  subtle: "#94a3b8"
  rule: "#cbd5e1"
typography:
  display:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
---

# Design System: Nusantara Digital

## Overview

**Creative North Star: "The Annual Report"**

The studio presented as a credible company. Clean white plates, navy ink, and a quiet grid a procurement officer trusts. The category's safe register: familiar, legible, indistinguishable from a well-run firm — and that is the point. Craft lives in the spacing, the type scale, and the restraint, not in a novel skin.

Personality: credible, calm, professional. Density is medium. Motion is minimal. No decoration beyond the grid.

**Key Characteristics:**
- White ground with navy ink; blue accent carries all primary actions.
- 6px rounded corners throughout; no sharp label edges.
- Single type family (Source Sans 3) with weight doing the hierarchy work.
- Hairline rules (#cbd5e1) separate content; shadows are minimal (1px).
- Standard grid: hero, three services, three portfolio items, CTA.

## Colors

### Primary
- **Navy** (#1e3a8a): primary actions, links, active states.

### Neutral
- **Ink** (#0f172a): primary text, headings.
- **Ink Soft** (#1e293b): secondary text.
- **Muted** (#475569): body secondary, captions.
- **Subtle** (#94a3b8): metadata, placeholders.
- **Ground** (#ffffff): page ground.
- **Ground Soft** (#f8fafc): panel ground, footer.
- **Rule** (#cbd5e1): borders, dividers.

### Named Rules
**The One Accent Rule.** Navy is the only saturated color. No secondary accent competes.

## Typography

**Display Font:** Source Sans 3 (with system-ui fallback)
**Body Font:** Source Sans 3
**Label/Mono Font:** System monospace (for codes only)

**Character:** One family, weight-driven hierarchy. Calm and readable.

### Hierarchy
- **Display** (700, clamp(2rem–3rem), 1.1): hero headline.
- **Headline** (700, 1.5rem, 1.2): page titles.
- **Title** (600, 1.125rem, 1.3): card headings.
- **Body** (400, 1rem, 1.6): paragraphs.
- **Label** (500, 0.75rem, 0.05em): metadata.

## Layout

Container max-width 1152px, 12-column grid at lg collapsing to 1 column. Spacing 4/8/16/24/32/48. Sections separated by hairline rules.

## Elevation & Depth

Minimal. 1px box-shadow on cards. No lift on hover beyond color shift.

## Shapes

6px radius throughout. No sharp corners, no clip-paths.

## Components

### Buttons
- **Primary:** navy ground, white text, 6px radius.
- **Outline:** transparent, 1px slate border, navy text on hover.

### Cards
- **Corner:** 6px.
- **Background:** white on slate-50 ground.
- **Border:** 1px slate-200.
- **Shadow:** 1px minimal.

### Navigation
- Sticky white bar, slate-200 bottom border. Blue active state.

## Do's and Don'ts

### Do:
- **Do** keep the grid clean and predictable.
- **Do** use navy for all primary actions.
- **Do** let spacing and type do the work.

### Don't:
- **Don't** add decoration beyond the grid.
- **Don't** introduce a second accent color.
- **Don't** fabricate testimonials or metrics.