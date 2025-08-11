import React, { createContext, useContext, ReactNode } from 'react';
import { colors, spacing, radii, fonts, shadows } from './tokens';

interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  fonts: typeof fonts;
  shadows: typeof shadows;
}

const theme: Theme = {
  colors,
  spacing,
  radii,
  fonts,
  shadows,
};

const ThemeContext = createContext<Theme>(theme);

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};