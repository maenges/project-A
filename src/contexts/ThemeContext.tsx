import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { theme as lightThemeBase } from '@style/index';
import muiBaseTheme from '@style/muiTheme';

// Define dark theme overrides derived from light theme structure
const buildDarkTheme = () => ({
  ...lightThemeBase,
  colors: {
    ...lightThemeBase.colors,
    primary: {
      ...lightThemeBase.colors.primary,
      main: '#90caf9',
      dark: '#64b5f6',
      light: '#e3f2fd',
    },
    secondary: {
      ...lightThemeBase.colors.secondary,
      main: '#f48fb1',
      dark: '#f06292',
      light: '#fce4ec',
    },
    neutral: {
      10: '#121212',
      20: '#1D242B',
      30: '#2a2a2a',
      50: '#555555',
      70: '#777777',
      90: '#eeeeee',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d0d0d0',
      disabled: '#888888',
      title: '#ffffff',
      base: '#ffffff',
      label: '#ffffff',
    },
    background: {
      default: '#141A21',
      paper: '#1C252E',
    },
    status: {
      ...lightThemeBase.colors.status,
      success: '#66bb6a',
      warning: '#ffa726',
      error: '#ef5350',
      info: '#29b6f6',
    },
  },
});

const DARK_THEME = buildDarkTheme();

// Build corresponding MUI themes (explicit mode parameter to avoid object identity bugs)
const buildMuiThemeFrom = (scTheme: typeof lightThemeBase, mode: 'light' | 'dark') =>
  createTheme({
    ...muiBaseTheme,
    palette: {
      ...muiBaseTheme.palette,
      mode,
      primary: { main: scTheme.colors.primary.main },
      secondary: { main: scTheme.colors.secondary.main },
      background: {
        default: scTheme.colors.background.default,
        paper: scTheme.colors.background.paper,
      },
      text: {
        primary: scTheme.colors.text.primary,
        secondary: scTheme.colors.text.secondary,
        disabled: scTheme.colors.text.disabled,
      },
    },
  });

type BrandKey = 'green' | 'blue' | 'purple';

interface ThemeContextValue {
  mode: 'light' | 'dark';
  brand: BrandKey;
  toggle: () => void; // legacy API kept
  setBrand: (b: BrandKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const ThemeModeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('app-theme') as 'light' | 'dark') || 'light'
  );
  const [brand, setBrand] = useState<BrandKey>(
    () => (localStorage.getItem('app-brand') as BrandKey) || 'green'
  );

  useEffect(() => {
    localStorage.setItem('app-theme', mode);
    document.body.dataset.theme = mode; // allow body[data-theme="dark"] selectors later
  }, [mode]);
  useEffect(() => {
    localStorage.setItem('app-brand', brand);
    document.body.dataset.brand = brand;
  }, [brand]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  const setBrandSafe = (b: BrandKey) => setBrand(b);

  const brandPalette: Record<BrandKey, { main: string; dark: string; light: string }> = {
    green: { main: '#00AB55', dark: '#007B55', light: '#E6F4EC' },
    blue: { main: '#1976d2', dark: '#115293', light: '#e3f2fd' },
    purple: { main: '#7C09CE', dark: '#5A0796', light: '#F4ECF9' },
  };

  const appliedLight = useMemo(
    () => ({
      ...lightThemeBase,
      colors: {
        ...lightThemeBase.colors,
        primary: brandPalette[brand],
        label: brandPalette[brand].main,
      },
    }),
    [brand]
  );
  const appliedDark = useMemo(() => {
    const base = DARK_THEME as any;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: brandPalette[brand],
        label: brandPalette[brand].light,
      },
    };
  }, [brand]);

  const styledTheme = mode === 'light' ? appliedLight : appliedDark;
  const muiTheme = useMemo(() => buildMuiThemeFrom(styledTheme, mode), [styledTheme, mode]);

  const value = useMemo(() => ({ mode, brand, toggle, setBrand: setBrandSafe }), [mode, brand]);

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={styledTheme}>
        <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeModeProvider;
