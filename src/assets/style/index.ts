// styled-components 테마 타입 정의
export interface ThemeInterface {
  colors: {
    primary: {
      main: string;
      dark: string;
      light: string;
    };
    secondary: {
      main: string;
      dark: string;
      light: string;
    };
    neutral: {
      10: string;
      20: string;
      30: string;
      50: string;
      70: string;
      90: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      title: string;
      base: string;
      label: string;
    };
    background: {
      default: string;
      paper: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  fonts: {
    family: {
      primary: string;
    };
    size: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    weight: {
      light: number;
      regular: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const theme: ThemeInterface = {
  colors: {
    primary: {
      main: '#051766',
      dark: '#03104d',
      light: '#1a237e',
    },
    secondary: {
      main: '#dc004e',
      dark: '#a0003a',
      light: '#e33371',
    },
    neutral: {
      10: '#ffffff',
      20: '#F7F8FA',
      30: '#e0e3e7',
      50: '#c1c7cd',
      70: '#a0a4ab',
      90: '#252525',
    },
    text: {
      primary: '#252525',
      secondary: '#666666',
      disabled: '#999999',
      title: '#051766',
      base: '#252525',
      label: '#051766',
    },
    background: {
      default: '#ffffff',
      paper: '#F7F8FA',
    },
    status: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
    },
  },
  fonts: {
    family: {
      primary: '"Sans", sans-serif',
    },
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '28px',
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      tight: '120%',
      normal: '130%',
      relaxed: '150%',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '50%',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 2px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
};

export { agGridStyles } from './agGridStyles';
export { searchForm } from './SearchFormLayout';
export { buttonForm } from './ButtonFormLayout';
export { tableForm } from './TableFormLayout';
export { default as StyledAgGridSelectionBox } from './SelectionBoxLayout';
export default theme;
