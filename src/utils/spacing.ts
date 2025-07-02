// Constantes de espaçamento padronizadas para todo o projeto
export const SPACING = {
  // Espaçamentos base (múltiplos de 8px)
  xs: 8,    // 8px
  sm: 16,   // 16px
  md: 24,   // 24px
  lg: 32,   // 32px
  xl: 40,   // 40px
  xxl: 48,  // 48px

  // Espaçamentos específicos para componentes
  card: {
    padding: 24,
    margin: 16,
    gap: 16,
  },
  
  form: {
    fieldSpacing: 24,
    sectionSpacing: 32,
    buttonSpacing: 16,
  },
  
  layout: {
    containerPadding: 24,
    sectionSpacing: 32,
    headerSpacing: 16,
  },
  
  grid: {
    gap: 24,
    itemSpacing: 16,
  },
} as const;

// Funções helper para espaçamentos responsivos
export const getResponsiveSpacing = (mobile: number, tablet: number, desktop: number) => ({
  xs: mobile,
  sm: tablet,
  md: desktop,
});

// Espaçamentos padrão para diferentes breakpoints
export const RESPONSIVE_SPACING = {
  container: getResponsiveSpacing(16, 24, 32),
  section: getResponsiveSpacing(24, 32, 40),
  card: getResponsiveSpacing(16, 24, 32),
} as const;

// Breakpoints responsivos
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// Tamanhos de fonte padronizados
export const TYPOGRAPHY = {
  h1: { fontSize: '2.5rem', lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: '2rem', lineHeight: 1.3, fontWeight: 600 },
  h3: { fontSize: '1.75rem', lineHeight: 1.3, fontWeight: 600 },
  h4: { fontSize: '1.5rem', lineHeight: 1.4, fontWeight: 600 },
  h5: { fontSize: '1.25rem', lineHeight: 1.4, fontWeight: 600 },
  h6: { fontSize: '1.125rem', lineHeight: 1.4, fontWeight: 600 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  button: { fontSize: '0.875rem', fontWeight: 600 },
  caption: { fontSize: '0.75rem', lineHeight: 1.4 },
} as const;

// Bordas e raios padronizados
export const BORDERS = {
  radius: {
    xs: 4,    // 4px
    sm: 8,    // 8px
    md: 12,   // 12px
    lg: 16,   // 16px
    xl: 24,   // 24px
  },
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
} as const;

// Sombras padronizadas
export const SHADOWS = {
  xs: '0 2px 4px rgba(0,0,0,0.1)',
  sm: '0 4px 8px rgba(0,0,0,0.1)',
  md: '0 8px 16px rgba(0,0,0,0.1)',
  lg: '0 16px 32px rgba(0,0,0,0.1)',
  xl: '0 32px 64px rgba(0,0,0,0.1)',
  card: '0 4px 20px rgba(0,0,0,0.08)',
  cardHover: '0 12px 40px rgba(0,0,0,0.12)',
  button: '0 4px 14px rgba(0,0,0,0.1)',
  buttonHover: '0 8px 25px rgba(0,0,0,0.15)',
} as const;

// Transições padronizadas
export const TRANSITIONS = {
  fast: 'all 0.15s ease',
  normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Z-index padronizados
export const Z_INDEX = {
  drawer: 1200,
  appBar: 1100,
  modal: 1300,
  tooltip: 1500,
  snackbar: 1400,
} as const; 