import { Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

type Props = {
  value?: unknown;
};

const sanitizeTooltipHtml = (html: string) => {
  if (typeof document === 'undefined') return '';

  const container = document.createElement('div');
  container.innerHTML = html;

  // Remove dangerous/non-content tags
  container
    .querySelectorAll('script,style,iframe,object,embed,link,meta')
    .forEach((node) => node.remove());

  // Replace images (including base64) with a placeholder
  container.querySelectorAll('img').forEach((img) => {
    const span = document.createElement('span');
    span.textContent = '[이미지]';
    img.replaceWith(span);
  });

  const allowedStyleProps = new Set([
    'color',
    'background-color',
    'font-size',
    'font-weight',
    'font-style',
    'text-decoration',
    'text-align',
  ]);

  const sanitizeStyle = (styleValue: string) => {
    const cleaned = styleValue
      .split(';')
      .map((decl) => decl.trim())
      .filter(Boolean)
      .map((decl) => {
        const idx = decl.indexOf(':');
        if (idx === -1) return null;

        const prop = decl.slice(0, idx).trim().toLowerCase();
        const value = decl.slice(idx + 1).trim();

        if (!allowedStyleProps.has(prop)) return null;
        if (/url\s*\(|expression\s*\(|javascript\s*:/i.test(value)) return null;

        return `${prop}: ${value}`;
      })
      .filter((x): x is string => typeof x === 'string' && x.length > 0)
      .join('; ');

    return cleaned;
  };

  // Strip event handlers and sanitize inline styles
  container.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if (name === 'style') {
        const safeStyle = sanitizeStyle(attr.value ?? '');
        if (safeStyle) el.setAttribute('style', safeStyle);
        else el.removeAttribute('style');
      }
    });

    if (el.tagName.toLowerCase() === 'a') {
      const href = el.getAttribute('href') ?? '';
      const isSafeHref = href.startsWith('/') || href.startsWith('#') || /^https?:\/\//i.test(href);

      if (!isSafeHref) {
        el.removeAttribute('href');
      } else {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  return container.innerHTML;
};

export default function HtmlTooltipComponent({ value }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const raw = typeof value === 'string' ? value : value == null ? '' : String(value);

  // ag-grid tooltip은 hover 때마다 자주 렌더될 수 있어 최소한의 처리만 수행
  const safeHtml = React.useMemo(() => {
    if (!raw) return '';
    if (typeof document === 'undefined') return raw;
    return sanitizeTooltipHtml(raw);
  }, [raw]);

  return (
    <Box
      sx={{
        // 카드(미리보기) 느낌: 컴포넌트 자체에 배경/패딩을 줘서 투명해 보이지 않게
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.98)',
        color: isDark ? '#ffffff' : '#111827',
        border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.12)',
        borderRadius: '10px',
        boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.25)' : '0 10px 25px rgba(0,0,0,0.12)',
        padding: '14px 16px',

        // 크기(미리보기): 넉넉하게
        minWidth: 520,
        maxWidth: 1100,
        maxHeight: 620,
        overflow: 'auto',

        // 미리보기용: 실제보다 더 크게
        fontSize: '16px',
        lineHeight: 1.6,
        whiteSpace: 'normal',
        wordBreak: 'break-word',

        // inline style(font-size 등)까지 함께 키우기 (Chrome/Edge에서 동작)
        zoom: 1.1,

        '& p': { margin: '0 0 10px 0' },
        '& ul, & ol': { margin: '0 0 10px 0', paddingLeft: '20px' },
        '& li': { margin: 0 },
        '& hr': {
          margin: '10px 0',
          border: 0,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.12)',
        },
      }}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
