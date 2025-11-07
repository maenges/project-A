import { createTheme } from '@mui/material/styles';
import { theme } from './index';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: typeof theme.colors;
    customSpacing: typeof theme.spacing;
    customRadius: typeof theme.radius;
    customShadows: typeof theme.shadows;
  }

  interface ThemeOptions {
    customColors?: typeof theme.colors;
    customSpacing?: typeof theme.spacing;
    customRadius?: typeof theme.radius;
    customShadows?: typeof theme.shadows;
  }
}

// MUI 테마 생성 (styled-components 테마와 완전 통합)
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary.main,
      dark: theme.colors.primary.dark,
      light: theme.colors.primary.light,
    },
    secondary: {
      main: theme.colors.secondary.main,
      dark: theme.colors.secondary.dark,
      light: theme.colors.secondary.light,
    },
    text: {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      disabled: theme.colors.text.disabled,
    },
    background: {
      default: theme.colors.background.default,
      paper: theme.colors.background.paper,
    },
    success: {
      main: theme.colors.status.success,
    },
    warning: {
      main: theme.colors.status.warning,
    },
    error: {
      main: theme.colors.status.error,
    },
    info: {
      main: theme.colors.status.info,
    },
    grey: {
      50: theme.colors.neutral[10],
      100: theme.colors.neutral[20],
      200: theme.colors.neutral[30],
      400: theme.colors.neutral[50],
      600: theme.colors.neutral[70],
      900: theme.colors.neutral[90],
    },
  },
  typography: {
    fontFamily: theme.fonts.family.primary,
    fontSize: parseInt(theme.fonts.size.md),
    h1: {
      fontSize: theme.fonts.size['2xl'],
      fontWeight: theme.fonts.weight.bold,
      lineHeight: theme.fonts.lineHeight.tight,
    },
    h2: {
      fontSize: theme.fonts.size.xl,
      fontWeight: theme.fonts.weight.bold,
      lineHeight: theme.fonts.lineHeight.normal,
    },
    h3: {
      fontSize: theme.fonts.size.lg,
      fontWeight: theme.fonts.weight.medium,
      lineHeight: theme.fonts.lineHeight.normal,
    },
    h4: {
      fontSize: theme.fonts.size.md,
      fontWeight: theme.fonts.weight.medium,
      lineHeight: theme.fonts.lineHeight.normal,
    },
    h5: {
      fontSize: theme.fonts.size.sm,
      fontWeight: theme.fonts.weight.medium,
      lineHeight: theme.fonts.lineHeight.normal,
    },
    h6: {
      fontSize: theme.fonts.size.xs,
      fontWeight: theme.fonts.weight.medium,
      lineHeight: theme.fonts.lineHeight.normal,
    },
    body1: {
      fontSize: theme.fonts.size.md,
      fontWeight: theme.fonts.weight.regular,
      lineHeight: theme.fonts.lineHeight.relaxed,
    },
    body2: {
      fontSize: theme.fonts.size.sm,
      fontWeight: theme.fonts.weight.regular,
      lineHeight: theme.fonts.lineHeight.relaxed,
    },
    button: {
      fontSize: theme.fonts.size.sm,
      fontWeight: theme.fonts.weight.bold,
      lineHeight: theme.fonts.lineHeight.relaxed,
      textTransform: 'none',
    },
    caption: {
      fontSize: theme.fonts.size.xs,
      fontWeight: theme.fonts.weight.regular,
      lineHeight: theme.fonts.lineHeight.normal,
    },
  },
  spacing: (factor: number) => `${factor * 8}px`, // 8px base unit
  breakpoints: {
    values: {
      xs: 0,
      sm: parseInt(theme.breakpoints.mobile),
      md: parseInt(theme.breakpoints.tablet),
      lg: parseInt(theme.breakpoints.desktop),
      xl: 1920,
    },
  },
  shape: {
    borderRadius: parseInt(theme.radius.md),
  },
  shadows: [
    'none',
    theme.shadows.sm,
    theme.shadows.sm,
    theme.shadows.md,
    theme.shadows.md,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
    theme.shadows.lg,
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.radius.md,
          textTransform: 'none',
          fontFamily: theme.fonts.family.primary,
          fontWeight: theme.fonts.weight.bold,
          fontSize: theme.fonts.size.sm,
          padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: theme.shadows.sm,
          },
        },
        containedPrimary: {
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.neutral[10],
          '&:hover': {
            backgroundColor: theme.colors.primary.dark,
          },
        },
        containedSecondary: {
          backgroundColor: theme.colors.secondary.main,
          color: theme.colors.neutral[10],
          '&:hover': {
            backgroundColor: theme.colors.secondary.dark,
          },
        },
        outlined: {
          borderColor: theme.colors.neutral[30],
          color: theme.colors.text.primary,
          '&:hover': {
            borderColor: theme.colors.primary.main,
            backgroundColor: theme.colors.neutral[10],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.radius.md,
            fontFamily: theme.fonts.family.primary,
            fontSize: theme.fonts.size.sm,
            '& fieldset': {
              borderColor: theme.colors.neutral[30],
            },
            '&:hover fieldset': {
              borderColor: theme.colors.neutral[50],
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.colors.primary.main,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: theme.fonts.family.primary,
            fontSize: theme.fonts.size.sm,
            color: theme.colors.text.secondary,
            '&.Mui-focused': {
              color: theme.colors.primary.main,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: theme.radius.md,
          fontFamily: theme.fonts.family.primary,
          fontSize: theme.fonts.size.sm,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.md,
        },
        elevation1: {
          boxShadow: theme.shadows.sm,
        },
        elevation2: {
          boxShadow: theme.shadows.md,
        },
        elevation3: {
          boxShadow: theme.shadows.lg,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.neutral[20]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: theme.radius.md,
          fontFamily: theme.fonts.family.primary,
          fontSize: theme.fonts.size.xs,
          fontWeight: theme.fonts.weight.medium,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows.lg,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: theme.colors.neutral[20],
          '& .MuiTableCell-head': {
            fontFamily: theme.fonts.family.primary,
            fontWeight: theme.fonts.weight.bold,
            fontSize: theme.fonts.size.sm,
            color: theme.colors.text.primary,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: theme.fonts.family.primary,
          fontSize: theme.fonts.size.sm,
          borderBottom: `1px solid ${theme.colors.neutral[20]}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.colors.neutral[30]}`,
        },
        indicator: {
          backgroundColor: theme.colors.primary.main,
          height: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: theme.fonts.family.primary,
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.medium,
          textTransform: 'none',
          color: theme.colors.text.secondary,
          '&.Mui-selected': {
            color: theme.colors.primary.main,
            fontWeight: theme.fonts.weight.bold,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '10px',
          fontFamily: '"Hanjin Group Sans"',
          marginLeft: '0px',
          marginTop: '0px',
          position: 'absolute',
          top: '100%',
          left: '0',
          zIndex: 1,
          '&.Mui-error': {
            color: '#ef4444',
          },
        },
      },
    },
  },
  // 커스텀 속성들을 테마에 추가
  customColors: theme.colors,
  customSpacing: theme.spacing,
  customRadius: theme.radius,
  customShadows: theme.shadows,
});

export default muiTheme;
