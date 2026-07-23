/**
 * ConnectZ Enterprise Design Tokens
 * 
 * Single source of truth for all design decisions.
 * Use these constants everywhere — never hardcode spacing, typography,
 * border-radius, shadow, or color values in components.
 */

// ═══════════════════════════════════════════════════════════════
// SPACING (4px base grid)
// ═══════════════════════════════════════════════════════════════
export const space = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem',  // 40px
  '5xl': '3rem',    // 48px
  '6xl': '4rem',    // 64px
  '7xl': '5rem',    // 80px
  '8xl': '6rem',    // 96px
} as const;

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════
export const typography = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg font-semibold',
  body: 'text-base leading-relaxed',
  bodySm: 'text-sm leading-relaxed',
  caption: 'text-xs text-muted-foreground',
  label: 'text-sm font-medium',
} as const;

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════
export const radius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
} as const;

// ═══════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════
export const shadow = {
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  emerald: 'shadow-lg shadow-emerald-600/20',
  emeraldHover: 'shadow-xl shadow-emerald-600/30',
} as const;

// ═══════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════
export const layout = {
  container: 'mx-auto max-w-7xl px-6 lg:px-8',
  sectionPadding: 'py-20 md:py-24',
  sectionGap: 'space-y-0',
} as const;

// ═══════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════
export const transition = {
  default: 'transition-all duration-200',
  smooth: 'transition-all duration-300 ease-out',
  spring: 'transition-all duration-300',
} as const;

// ═══════════════════════════════════════════════════════════════
// HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════
export const hover = {
  lift: 'hover:-translate-y-1 hover:shadow-lg',
  liftLg: 'hover:-translate-y-1 hover:shadow-xl',
  scale: 'hover:scale-[1.02]',
  scaleLg: 'hover:scale-[1.03]',
} as const;

// ═══════════════════════════════════════════════════════════════
// SECTION BACKGROUNDS (alternating visual rhythm)
// ═══════════════════════════════════════════════════════════════
export const section = {
  white: 'bg-background',
  muted: 'bg-muted/50',
  tinted: 'bg-emerald-50/50 dark:bg-emerald-950/20',
  dark: 'bg-foreground text-background',
} as const;

// ═══════════════════════════════════════════════════════════════
// CARD PRESETS
// ═══════════════════════════════════════════════════════════════
export const cardPresets = {
  standard: [
    'rounded-2xl border border-border/60 shadow-sm',
    'hover:shadow-xl hover:-translate-y-1',
    'transition-all duration-300 ease-out',
    'hover:border-emerald-500/50',
  ].join(' '),
  interactive: [
    'rounded-2xl border border-border/60 shadow-sm cursor-pointer',
    'hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50',
    'transition-all duration-300 ease-out active:scale-[0.99]',
  ].join(' '),
  ghost: [
    'rounded-2xl border border-transparent',
    'hover:bg-muted/50 hover:border-border/40',
    'transition-all duration-200',
  ].join(' '),
} as const;

// ═══════════════════════════════════════════════════════════════
// BUTTON PRESETS
// ═══════════════════════════════════════════════════════════════
export const buttonPresets = {
  brand: [
    'bg-emerald-600 text-white hover:bg-emerald-700',
    'shadow-sm shadow-emerald-600/20',
    'transition-all duration-200',
    'hover:shadow-md hover:shadow-emerald-600/30',
    'active:scale-[0.98]',
  ].join(' '),
  brandLg: [
    'bg-emerald-600 text-white hover:bg-emerald-700',
    'shadow-lg shadow-emerald-600/25',
    'transition-all duration-200',
    'hover:shadow-xl hover:shadow-emerald-600/40 hover:scale-[1.02]',
  ].join(' '),
} as const;