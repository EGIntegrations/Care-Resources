export const colors = {
  navy: '#0C2340',        // brand header / tab focus
  blue: '#2160DC',        // primary CTAs & Mental Health card
  yellow: '#FADA5E',      // Get Help CTA & Crisis Care card
  green: '#4CAF50',       // Medical Care card
  orange: '#E28A2B',      // Family Support card footer / alerts
  grey100: '#F5F5F5',     // light bg
  grey200: '#EEEEEE',     // borders
  grey300: '#D1D5DB',     // medium borders
  grey700: '#424242',     // body text
  grey800: '#1F2937',     // dark text
  white: '#FFFFFF',
  danger: '#D32F2F',
};

export const spacing = [0, 4, 8, 12, 16, 20, 24];

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
};

export const fonts = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Fonts = typeof fonts;