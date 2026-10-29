/** Source of truth for color roles. Extend into NativeWind CSS variables where supported. */
export const palette = {
  light: {
    canvas: '#FFFFFF',
    surface: '#F8F9FB',
    text: '#111827',
    muted: '#5E6677',
    border: '#DDE1E8',
    primary: '#2156D8',
    onPrimary: '#FFFFFF',
    danger: '#B42318',
  },
  dark: {
    canvas: '#101218',
    surface: '#1B1F28',
    text: '#F5F7FA',
    muted: '#A9B1C0',
    border: '#323947',
    primary: '#8EADFF',
    onPrimary: '#101218',
    danger: '#FF8B83',
  },
} as const;

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24 } as const;
export type ColorScheme = keyof typeof palette;
