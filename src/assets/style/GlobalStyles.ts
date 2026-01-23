import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { agGridStyles } from './agGridStyles';

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  if (full.length !== 6) return hex;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const GlobalStyles = createGlobalStyle`
  ${reset}
  /* Font faces are now loaded from /public/fonts.css */

  /* Prevent layout shift when scrollbar appears/disappears */
  html {
    scrollbar-gutter: stable;
  }

  @supports not (scrollbar-gutter: stable) {
    html {
      overflow-y: scroll;
    }
  }

  /* Ensure fonts are loaded before applying */
  * {
    font-family: ${(props) => props.theme.fonts.family.primary};
  }

  /* Global body styles */
  body {
    font-family: ${(props) => props.theme.fonts.family.primary};
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.base};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Text selection highlight (theme-friendly) */
  input::selection,
  textarea::selection,
  [contenteditable="true"]::selection,
  .MuiInputBase-input::selection,
  .MuiInputBase-inputMultiline::selection,
  .ag-theme-material input::selection,
  .ag-theme-material textarea::selection {
    background: ${(props) => hexToRgba(props.theme.colors.primary.main, 0.28)};
    color: ${(props) => props.theme.colors.text.base};
  }

  input::-moz-selection,
  textarea::-moz-selection,
  [contenteditable="true"]::-moz-selection,
  .MuiInputBase-input::-moz-selection,
  .MuiInputBase-inputMultiline::-moz-selection,
  .ag-theme-material input::-moz-selection,
  .ag-theme-material textarea::-moz-selection {
    background: ${(props) => hexToRgba(props.theme.colors.primary.main, 0.28)};
    color: ${(props) => props.theme.colors.text.base};
  }

  /* MUI Typography override */
  .MuiTypography-root {
    font-family: ${(props) => props.theme.fonts.family.primary};
  }

  /* MUI DatePicker styles */
  .MuiPickersDay-root:focus,
  .MuiPickersDay-root.Mui-selected:focus,
  .MuiPickersDay-root[tabindex="0"],
  .MuiPickersDay-root.Mui-selected {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    background: ${(props) => props.theme.colors.neutral[20]};
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.neutral[20]};
    border-radius: ${(props) => props.theme.radius.md};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.neutral[50]};
    border-radius: ${(props) => props.theme.radius.md};
    
    &:hover {
      background: ${(props) => props.theme.colors.neutral[70]};
    }
  }

  /* CSS Variables - Figma Design Tokens */
  :root {
    /* KE Global - Primitive Tokens */
    /* color */
    --color-brand-darkblue-10: #e6e7ef;
    --color-brand-darkblue-10-alpha20: #e6e7ef33;
    --color-brand-darkblue-100: #051766;
    --color-brand-darkblue-20: #cdd1e0;
    --color-brand-darkblue-40: #9ba2c2;
    --color-brand-darkblue-60: #6974a3;
    --color-brand-darkblue-80: #374585;
    --color-brand-lightblue-10: #eef8fd;
    --color-brand-lightblue-100: #57bbeb;
    --color-brand-lightblue-20: #ddf1fb;
    --color-brand-lightblue-40: #bce4f7;
    --color-brand-lightblue-60: #98d5f3;
    --color-brand-lightblue-80: #77c8ef;
    --color-neutral-10: #ffffff;
    --color-neutral-10-alpha40: #ffffff66;
    --color-neutral-10-alpha80: #ffffffcc;
    --color-neutral-20: #f7f7f7;
    --color-neutral-30: #ededed;
    --color-neutral-40: #d9d9d9;
    --color-neutral-50: #bdbdbd;
    --color-neutral-60: #a4a4a4;
    --color-neutral-70: #5e5e5e;
    --color-neutral-80: #333333;
    --color-neutral-90: #252525;
    --color-neutral-90-alpha50: #25252580;
    --color-system-green-100: #28794e;
    --color-system-green-200: #086a36;
    --color-system-lightgreen-100: #f0fff4;
    --color-system-lightgreen-200: #dff5e5;
    --color-system-lightorange-100: #fff7ec;
    --color-system-lightorange-200: #ffe8c9;
    --color-system-lightred-100: #fff5f5;
    --color-system-lightred-200: #ffe3e3;
    --color-system-orange-100: #bd5814;
    --color-system-orange-200: #b33c00;
    --color-system-red-100: #da291c;
    --color-system-red-100-alpha60: #da291c99;
    --color-system-red-200: #c92317;

    /* number */
    --font-size-10: 0.75rem;
    --font-size-20: 0.875rem;
    --font-size-30: 1rem;
    --font-size-40: 1.125rem;
    --font-size-50: 1.3125rem;
    --font-size-60: 1.5rem;
    --font-size-70: 1.75rem;
    --font-size-80: 2.25rem;
    --font-size-90: 2.625rem;
    --size-0: 0rem;
    --size-1: 0.0625rem;
    --size-2: 0.125rem;
    --size-4: 0.25rem;
    --size-8: 0.5rem;
    --size-12: 0.75rem;
    --size-16: 1rem;
    --size-20: 1.25rem;
    --size-24: 1.5rem;
    --size-28: 1.75rem;
    --size-32: 2rem;
    --size-36: 2.25rem;
    --size-40: 2.5rem;
    --size-48: 3rem;
    --size-56: 3.5rem;
    --size-64: 4rem;
    --size-80: 5rem;
    --size-96: 6rem;
    --size-112: 7rem;
    --size-128: 8rem;
    --size-9999: 624.9375rem;

    /* string */
    --font-family-hanjingroup-sans: "Sans", sans-serif;
    --font-family-helvetica-neue: "Helvetica Neue", sans-serif;
    --font-family-microsoft-jhenghei: "Microsoft JhengHei", sans-serif;
    --font-family-microsoft-yahei: "Microsoft YaHei", sans-serif;
    --font-family-roboto: "Roboto", sans-serif;
    --font-family-yugothic-ui: "Yu Gothic UI", sans-serif;
    --font-weight-bold: bold;
    --font-weight-light: light;
    --font-weight-regular: regular;

    /* KE Alias (B2E) - Semantic Tokens */
    /* color */
    --color-background-fill-air-price: var(--color-system-green-200);
    --color-background-fill-air-route: var(--color-neutral-80);
    --color-background-fill-carousel-btn: var(--color-neutral-90-alpha50);
    --color-background-fill-dim: var(--color-neutral-90-alpha50);
    --color-background-fill-dim-touch: #252525e5;
    --color-background-fill-highlight: var(--color-brand-lightblue-100);
    --color-background-fill-inverse: var(--color-neutral-10);
    --color-background-fill-negative: var(--color-system-red-100);
    --color-background-fill-negative-bg: var(--color-system-lightred-100);
    --color-background-fill-overlay: var(--color-neutral-90);
    --color-background-fill-pin: #eef8fd80;
    --color-background-fill-positive-bg: var(--color-system-lightgreen-100);
    --color-background-fill-primary: var(--color-brand-darkblue-100);
    --color-background-fill-quarternary: var(--color-brand-darkblue-10);
    --color-background-fill-scroll: #25252540;
    --color-background-fill-secondary: var(--color-neutral-20);
    --color-background-fill-tertiary: var(--color-neutral-30);
    --color-background-fill-warning-bg: var(--color-system-lightorange-100);
    --color-background-interaction-disabled: var(--color-neutral-40);
    --color-background-interaction-enabled-dot: var(--color-brand-darkblue-60);
    --color-background-interaction-hovered: var(--color-brand-lightblue-20);
    --color-background-interaction-pressed-primary: var(--color-brand-darkblue-100);
    --color-background-interaction-pressed-secondary: var(--color-brand-darkblue-10);
    --color-background-interaction-readonly: var(--color-neutral-20);
    --color-background-interaction-selected-primary: var(--color-brand-darkblue-100);
    --color-background-interaction-selected-secondary: var(--color-brand-lightblue-40);
    --color-background-interaction-selected-tertiary: var(--color-brand-lightblue-20);
    --color-border-accent: var(--color-system-red-100);
    --color-border-disabled: var(--color-neutral-60);
    --color-border-divider-primary: var(--color-neutral-40);
    --color-border-divider-secondary: var(--color-neutral-30);
    --color-border-divider-top: var(--color-neutral-90);
    --color-border-inverse: var(--color-neutral-10);
    --color-border-negative: var(--color-system-red-100);
    --color-border-positive: var(--color-system-green-100);
    --color-border-primary: var(--color-brand-darkblue-100);
    --color-border-secondary: var(--color-neutral-60);
    --color-border-tertiary: var(--color-neutral-40);
    --color-border-warning: var(--color-system-orange-100);
    --color-icon-disabled: var(--color-neutral-60);
    --color-icon-dot: var(--color-system-red-100);
    --color-icon-inverse: var(--color-neutral-10);
    --color-icon-negative: var(--color-system-red-100);
    --color-icon-positive: var(--color-system-green-100);
    --color-icon-primary: var(--color-brand-darkblue-100);
    --color-icon-secondary: var(--color-neutral-90);
    --color-icon-tertiary: var(--color-neutral-70);
    --color-icon-warning: var(--color-system-orange-200);
    --color-text-disabled: var(--color-neutral-60);
    --color-text-inverse: var(--color-neutral-10);
    --color-text-title: var(--color-brand-darkblue-100);
    --color-text-accent: var(--color-system-red-100);
    --color-text-accent-alpha60: #da291c99;
    --color-text-base: var(--color-neutral-90);
    --color-text-negative: var(--color-system-red-100);
    --color-text-placeholder: var(--color-neutral-70);
    --color-text-positive: var(--color-system-green-100);
    --color-text-primary: var(--color-brand-darkblue-100);
    --color-text-secondary: var(--color-neutral-90);
    --color-text-tertiary: var(--color-neutral-70);
    --color-text-warning: var(--color-system-orange-200);

    /* number */
    --font-body-xs: var(--font-size-10);
    --font-body-sm: 0.8125rem;
    --font-body-ms: var(--font-size-20);
    --font-body-md: var(--font-size-30);
    --font-title-2xs: var(--font-size-30);
    --font-body-lg: var(--font-size-40);
    --font-title-xs: var(--font-size-40);
    --font-body-xl: var(--font-size-50);
    --font-title-sm: var(--font-size-50);
    --font-title-ms: var(--font-size-60);
    --font-title-md: var(--font-size-70);
    --font-title-lg: var(--font-size-80);
    --font-title-xl: var(--font-size-90);
    --radius-none: var(--size-0);
    --radius-xs: var(--size-2);
    --radius-sm: var(--size-8);
    --radius-md: var(--size-12);
    --radius-lg: var(--size-16);
    --radius-full: var(--size-9999);

    /* Color Palette */
    --color: #395fb8;
    --color-blue-10: #efeffb;
    --color-blue-100: #0a0c99;
    --color-blue-20: #d6d6fa;
    --color-blue-40: #c0c1fc;
    --color-blue-60: #8688f9;
    --color-blue-80: #5254e0;
    --color-green-10: #d8fde7;
    --color-green-100: #09672f;
    --color-green-20: #c5fcdb;
    --color-green-40: #a8f0c5;
    --color-green-60: #1eb85c;
    --color-green-80: #109e48;
    --color-indigo-10: #e6e8ef;
    --color-indigo-100: #081c78;
    --color-indigo-20: #9aa1c1;
    --color-indigo-40: #747eaa;
    --color-indigo-60: #4455a2;
    --color-indigo-80: #1d3396;
    --color-mint-10: #e2f3f2;
    --color-mint-100: #1c5451;
    --color-mint-20: #cef3f1;
    --color-mint-40: #9de7e3;
    --color-mint-60: #39c6bf;
    --color-mint-80: #339994;
    --color-orange-10: #fef5ec;
    --color-orange-100: #a25702;
    --color-orange-20: #fee2c2;
    --color-orange-40: #fbd9b1;
    --color-orange-60: #fcbc73;
    --color-orange-80: #dc7704;
    --color-purple-10: #f4ecf9;
    --color-purple-100: #7c09ce;
    --color-purple-20: #e5c5fc;
    --color-purple-40: #dcb1fb;
    --color-purple-60: #c383f1;
    --color-purple-80: #b54dff;
    --color-red-10: #fae5e5;
    --color-red-100: #990a0a;
    --color-red-20: #fad1d1;
    --color-red-40: #fcc5c5;
    --color-red-60: #f78282;
    --color-red-80: #f70808;
    --color-teal-10: #f4f9fb;
    --color-teal-100: #1177a7;
    --color-teal-20: #dff2fb;
    --color-teal-40: #bbe4f7;
    --color-teal-60: #3cb4ec;
    --color-teal-80: #1492cc;
    --color-yellow-10: #fef6d7;
    --color-yellow-100: #7a6200;
    --color-yellow-20: #fef0b9;
    --color-yellow-40: #fbe383;
    --color-yellow-60: #f9d339;
    --color-yellow-80: #a38300;

    /* Legacy Variables (backward compatibility) */
    --color-neutral-20-legacy: ${(props) => props.theme.colors.neutral[20]};
    --color-text-primary-darkblue-legacy: ${(props) => props.theme.colors.text.primary};
    --color-text-base-legacy: ${(props) => props.theme.colors.text.base};
    --color-text-label-legacy: ${(props) => props.theme.colors.text.label};
    --font-size-label-md-legacy: ${(props) => props.theme.fonts.size.sm};
    --font-size-body-md-legacy: ${(props) => props.theme.fonts.size.md};
    --font-size-label-lg-legacy: ${(props) => props.theme.fonts.size.md};
    --font-size-title-md-legacy: ${(props) => props.theme.fonts.size['2xl']};
    --font-body-sm-legacy: ${(props) => props.theme.fonts.size.sm};
    --font-weight-regular-legacy: ${(props) => props.theme.fonts.weight.regular};
    --font-weight-bold-legacy: ${(props) => props.theme.fonts.weight.bold};
    --font-family-hanjingroup-sans-legacy: ${(props) => props.theme.fonts.family.primary};
    --spacing-20: 20px;
    --spacing-2: 2px;
  }

  /* Utility Classes */
  .base {
    display: flex;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }

  .column {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    align-self: stretch;
  }
  
  .button-label {
    color: var(--color-text-base, #252525);
    text-align: center;
    font-family: "Sans";
    font-size: var(--font-size-label-sm, 13px);
    font-style: normal;
    font-weight: var(--font-weight-bold, 700);
    line-height: 130%; /* 16.9px */
  }

  .label {
    color: ${(props) => props.theme.colors.text.primary} !important;
    font-family: ${(props) => props.theme.fonts.family.primary} !important;
    font-size: var(--font-size-label-md, ${(props) => props.theme.fonts.size.sm}) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, ${(props) => props.theme.fonts.weight.regular}) !important;
    line-height: 130% !important;
  }

  .label-sm {
    color: var(--color-text-base, ${(props) => props.theme.colors.text.base}) !important;
    font-family: ${(props) => props.theme.fonts.family.primary} !important;
    font-size: var(--font-size-body-md, ${(props) => props.theme.fonts.size.md}) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, ${(props) => props.theme.fonts.weight.regular}) !important;
    line-height: 150% !important;
  }

  .label-md {
    color: var(--color-text-primary-darkblue, ${(props) => props.theme.colors.text.primary}) !important;
    font-family: ${(props) => props.theme.fonts.family.primary} !important;
    font-size: var(--font-size-label-lg, ${(props) => props.theme.fonts.size.md}) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, ${(props) => props.theme.fonts.weight.bold}) !important;
    line-height: 150% !important;
  }

  .label-lg {
    color: ${(props) => props.theme.colors.text.primary} !important;
    font-family: ${(props) => props.theme.fonts.family.primary} !important;
    font-size: var(--font-size-title-md, ${(props) => props.theme.fonts.size['2xl']}) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, ${(props) => props.theme.fonts.weight.bold}) !important;
    line-height: 150% !important;
  }

  .label-modal-sm {
    color: var(--color-text-title, #051766) !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-title-sm, 21px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, 700) !important;
    line-height: 130% !important; 
  }

  .label-grid {
    color: var(--color-text-accent, #DA291C);
    text-align: center;
    font-family: "Sans";
    font-size: 11px;
    font-style: normal;
    font-weight: var(--font-weight-regular, 400);
    line-height: 150%; /* 16.5px */
  }

  .sub-title {
    color: var(--color-text-body-secondary, #5E5E5E)!important;
    font-family: "Sans"!important;
    font-size: var(--font-body-md-bold, 16px)!important;
    font-style: normal!important;
    font-weight: 700!important;
    line-height: 150%!important; /* 24px */
  }

  .modal-body-text { 
    color: var(--color-text-base, #252525) !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-body-ms, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 150% !important;
  }

  .modal-body-text-sub {
    color: var(--color-text-warning, #B33C00) !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-body-ms, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 150% !important;
  }

  .label-modal-title-lg {
    overflow: hidden !important;
    color: var(--color-text-primary-darkblue, #051766) !important;
    text-overflow: ellipsis !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-body-lg, 18px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, 700) !important;
    line-height: 150% !important; /* 27px */
  }

  .label-modal-title-sm {
    overflow: hidden !important;
    color: var(--color-text-primary-darkblue, #051766) !important;
    text-overflow: ellipsis !important;
    font-family: "Sans" !important;
    font-size: 14px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 150% !important; /* 21px */
  }

  .tab-button-on {
    color: var(--color-text-title, #051766) !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-title-sm, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, 700) !important;
    line-height: 130% !important; 
  }

  .tab-button-off {
    color: var(--color-text-primary-darkblue, #051766) !important;
    text-align: center !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-label-md, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 130% !important; /* 18.2px */
  }

  .export-button-text {
    text-align: center !important;
    font-family: "Sans" !important;
    font-size: 13px !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, 700) !important;
    line-height: 130% !important; /* 16.9px */
  }

  .label-modal-grid-header {
    color: var(--color-text-base, #252525) !important;
    text-align: center !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-body-ms, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-bold, 700) !important;
    line-height: 150% !important; /* 21px */
  }

  .label-modal-grid-column {
    color: var(--color-text-base, #252525) !important;
    text-align: right !important;
    font-family: "Sans" !important;
    font-size: var(--font-size-body-ms, 14px) !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 150% !important; /* 21px */
  }

  .modal-foot-text-cancel {
    display: flex !important;
    min-width: 80px !important;
    min-height: 44px !important;
    padding: var(--spacing-12, 12px) var(--spacing-16, 16px) !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .label-button {
    color: var(--color-text-label, ${(props) => props.theme.colors.text.label}) !important; 
    text-align: center !important;
    font-family: ${(props) => props.theme.fonts.family.primary} !important;
    font-size: var(--font-body-sm, ${(props) => props.theme.fonts.size.sm}) !important;
    font-style: normal !important;
    font-weight: ${(props) => props.theme.fonts.weight.bold} !important;
    line-height: 150% !important; 
  }

  .label-input .MuiOutlinedInput-root {
    padding: 0 12px;
  }

  .label-input .MuiOutlinedInput-input {
    color: var(--color-text-base, ${(props) => props.theme.colors.text.base});
    font-family: ${(props) => props.theme.fonts.family.primary};
    padding: 0 12px;
    font-size: ${(props) => props.theme.fonts.size.sm};
    font-weight: ${(props) => props.theme.fonts.weight.regular};
    background: transparent;
    padding: 10px 0;
  }

  /* AG-Grid Styles (imported from separate file) */
  ${agGridStyles}

  /* Toast Styles */
  .ets-notify-toast .Toastify__toast,
  .ets-toast-item {
    background: var(--color-neutral-10) !important;
    color: var(--color-text-base, #252525) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: 0 4px 12px var(--color-neutral-90-alpha50) !important;
    border: 1px solid var(--color-neutral-30) !important;
    padding: var(--size-16) !important;
    padding-right: var(--size-40) !important;
    margin-bottom: var(--size-8) !important;
    min-height: 70px !important;
    width: fit-content; /* 내용에 맞게 조절 */
    font-family: var(--font-family-hanjingroup-sans) !important;
  }

  .ets-notify-toast .Toastify__toast--info {
    border-left: 4px solid var(--color-brand-lightblue-100);
  }

  .ets-notify-toast .Toastify__toast--success {
    border-left: 4px solid var(--color-system-green-100);
  }

  .ets-notify-toast .Toastify__toast--warning {
    border-left: 4px solid var(--color-system-orange-100);
  }

  .ets-notify-toast .Toastify__toast--error {
    border-left: 4px solid var(--color-system-red-100);
  }

  .ets-notify-toast .Toastify__toast-body,
  .ets-toast-body {
    color: var(--color-text-base, #252525) !important;
    font-size: var(--font-body-ms) !important;
    font-weight: var(--font-weight-regular, 400) !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .ets-notify-toast .Toastify__toast-body *,
  .ets-toast-body * {
    color: inherit !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .ets-notify-toast .Toastify__toast-icon {
    width: var(--size-20);
    height: var(--size-20);
    margin-right: var(--size-12);
  }

  .ets-notify-toast .Toastify__close-button {
    color: var(--color-neutral-70);
    opacity: 0.7;
  }

  .ets-notify-toast .Toastify__close-button:hover {
    color: var(--color-neutral-90);
    opacity: 1;
  }

  .ets-notify-toast .Toastify__progress-bar {
    height: var(--size-2);
  }

  .ets-notify-toast .Toastify__progress-bar--info {
    background: var(--color-brand-lightblue-100);
  }

  .ets-notify-toast .Toastify__progress-bar--success {
    background: var(--color-system-green-100);
  }

  .ets-notify-toast .Toastify__progress-bar--warning {
    background: var(--color-system-orange-100);
  }

  .ets-notify-toast .Toastify__progress-bar--error {
    background: var(--color-system-red-100);
  }

  /* Toast Container */
  .ets-notify-toast .Toastify__toast-container {
    padding: 0;
    bottom: var(--size-20);
  }

  .ets-notify-toast .Toastify__toast-container--bottom-center {
    bottom: var(--size-20);
    left: 50%;
    transform: translateX(-50%);
    /* max-width: 700px; */
    width: auto;
  }

  /* CSS Reset and Box-sizing */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Remove default margins */
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }

  /* Remove list styles */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Button reset */
  button {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }

  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* .auto-height-grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }

  .auto-height-grid .ag-header {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #fff;
  }

  .auto-height-grid .ag-root-wrapper-body {
    flex: 1;
    overflow: hidden;
  }

  .auto-height-grid .ag-body {
    height: 100%;
    overflow-y: auto !important;
  }

  .auto-height-grid .ag-body-viewport {
    height: auto !important;
    max-height: calc(100vh - 170px) !important; 
    overflow-y: auto !important;
  }

  .auto-height-grid .ag-body-vertical-scroll {
    width: 8px !important;
    max-width: 8px;
    min-width: 8px;
    overflow-y: auto !important;
    position: absolute;
    right: 0;
  }

  .auto-height-grid .ag-center-cols-container {
    height: auto !important;
  }


  .auto-height-grid .ag-header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #fff;
  } */
`;
