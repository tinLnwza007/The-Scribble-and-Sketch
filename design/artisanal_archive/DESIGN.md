---
name: Artisanal Archive
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#45464e'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#75777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#525e7f'
  primary: '#182442'
  on-primary: '#ffffff'
  primary-container: '#2e3a59'
  on-primary-container: '#98a4c9'
  inverse-primary: '#bac6ec'
  secondary: '#a73920'
  on-secondary: '#ffffff'
  secondary-container: '#fe795a'
  on-secondary-container: '#6f1300'
  tertiary: '#0a2c14'
  on-tertiary: '#ffffff'
  tertiary-container: '#224228'
  on-tertiary-container: '#8aae8c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bac6ec'
  on-primary-fixed: '#0d1a38'
  on-primary-fixed-variant: '#3a4666'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#86220a'
  tertiary-fixed: '#c6ecc7'
  tertiary-fixed-dim: '#abd0ac'
  on-tertiary-fixed: '#01210a'
  on-tertiary-fixed-variant: '#2d4e33'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  headline-xl:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is built to evoke the tactile joy of opening a fresh notebook. It caters to a community of creators—artists, poets, and journalers—who value the intersection of analog craft and digital convenience. The brand personality is "The Encouraging Mentor": knowledgeable and premium, yet warm, accessible, and deeply creative.

The visual style is a hybrid of **Minimalism** and **Tactile/Skeuomorphism**. It leverages heavy whitespace to simulate paper margins, while using subtle textures and hand-drawn accents to provide a "human touch." Every digital interaction should feel as intentional as a pen stroke on high-quality cardstock.

## Colors

The palette is inspired by the physical materials of the craft. 
- **Primary (Ink Indigo):** A deep, reliable navy used for typography and primary actions, mimicking the weight of fountain pen ink.
- **Secondary (Pencil Sunset):** A vibrant orange used for highlights, calls to action, and creative "sparks."
- **Tertiary (Craft Leaf):** A muted green representing natural fibers and sustainable materials, used for success states and organic accents.
- **Neutral (Creamy Vellum):** The foundation of the UI. Avoid pure white (#FFFFFF); instead, use the warm, paper-like tones for backgrounds to reduce eye strain and increase the "analog" feel.

## Typography

This design system utilizes a sophisticated pairing to balance playfulness with legibility. 
- **Headings:** **Bricolage Grotesque** is used for its quirky, characterful terminals that mimic the expressive nature of hand-lettering while remaining professional.
- **Body & UI:** **Plus Jakarta Sans** provides a soft, modern, and highly readable foundation for product descriptions and navigation.

Line heights are intentionally generous (1.6 for body) to mimic the spacing of lined paper, ensuring a relaxed reading pace.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high internal margins to emphasize the "fresh notebook" feel. 
- **Desktop:** 12-column grid with wide 64px outer margins to frame the content like a page.
- **Mobile:** 4-column grid with 20px margins.

Spacing should follow a strict 8px rhythm. Use "Negative Space" as a design element; do not crowd components. Elements should feel like they are placed on a desk, with enough room to breathe. Use asymmetrical layouts for editorial sections to lean into the creative brand identity.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and subtle physical metaphors rather than heavy shadows.
- **Surface Level 0:** The warm `neutral_color_hex` background with a subtle, low-opacity grain texture overlay to simulate paper tooth.
- **Surface Level 1 (Cards):** Use a slightly lighter tint or a thin 1px border in a "pencil grey" (a desaturated ink color at 10% opacity).
- **Interactive Depth:** Instead of shadows, use "Lift" effects—a slight upward translation (e.g., -4px) and a very soft, high-diffusion amber-tinted shadow to suggest a card being picked up from a desk.
- **Dividers:** Use hand-drawn style SVG strokes (slightly irregular lines) instead of perfectly straight CSS borders to separate major sections.

## Shapes

The shape language is **Rounded**, avoiding sharp institutional corners.
- **Standard UI (Buttons, Inputs):** 0.5rem (8px) radius provides a friendly, approachable feel.
- **Featured Elements (Large Cards):** 1.5rem (24px) radius to create a soft, inviting container.
- **Accents:** Use organic, "blob" shapes for background decorations or image masks to reinforce the artistic theme.

## Components

- **Buttons:** Primary buttons use a solid "Ink" background with "Vellum" text. Apply a subtle 1px "hand-drawn" stroke outline in the secondary color to create a creative, layered look.
- **Input Fields:** Use a "lined paper" style—only a bottom border (1px) by default, which transforms into a full rounded box upon focus. Use the secondary "Pencil" color for the focus ring.
- **Cards:** Keep cards flat with a 1px soft border. Use a small "washi-tape" style accent (a small colored rectangle in the corner) to denote categories (e.g., green for notebooks, orange for pens).
- **Chips/Tags:** Use a "torn paper" edge effect (via SVG masks) for tags to emphasize the stationery theme.
- **Checkboxes:** When checked, replace the standard tick with a hand-drawn "X" or a soft ink-blob dot.
- **Lists:** Use custom bullet points that look like pencil marks or small ink circles.