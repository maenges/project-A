import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import { EtsInput, EtsCheckBox, EtsCheckButton, EtsSelect } from '@/components/EtsCommon';

const HeaderContent = styled(Box)`
  width: 688px;
  height: 27px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BodyDiv = styled(Box)`
  display: flex;
  padding: 20px var(--spacing-40, 40px) 22px var(--spacing-40, 40px);
  flex-direction: column;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  width: 100%;
  max-width: auto;
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  overflow-y: auto;
  @media (max-width: 1340px) {
    max-width: calc(100vw - 40px);
    padding: 16px 20px 16px 20px;
  }
  @media (max-width: 768px) {
    padding: 16px 16px 16px 16px;
    gap: 10px;
    height: auto;
  }
  @media (max-width: 480px) {
    padding: 12px 8px 12px 8px;
    gap: 8px;
  }
`;

const BodyTopContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
  width: 100%;
  max-width: 1220px;
  min-height: 100px;
  box-sizing: border-box;
  flex-shrink: 0;
  @media (max-width: 1260px) {
    max-width: calc(100% - 40px);
  }
  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 100px;
    gap: 4px;
  }
`;

const BodyTopContentDiv = styled(Box)`
  display: flex;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  align-self: stretch;
  width: 100%;
  min-height: 95px;
  box-sizing: border-box;
  & table {
    height: 80px;
    width: 100%;
  }
  @media (max-width: 768px) {
    min-height: 95px;
    overflow-x: auto;
    & table {
      min-width: 600px;
    }
  }
  @media (max-width: 480px) {
    overflow-x: auto;
    & table {
      min-width: 500px;
      font-size: 10px;
    }
  }
`;

const BodyContentDivText = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 16px;
  align-self: stretch;
`;

const BodyContent = styled(Box)`
  width: 100%;
  max-width: 1220px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  box-sizing: border-box;
  flex: 1;
  @media (max-width: 1260px) {
    max-width: calc(100% - 40px);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const BodyContentFram = styled(Box)`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 14px;
  @media (max-width: 768px) {
    max-width: 100%;
    gap: 12px;
  }
`;

const BodyContentSecondFram = styled(Box)`
  width: 100%;
  max-width: 604px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 14px;
  @media (max-width: 768px) {
    max-width: 100%;
    gap: 12px;
  }
`;

const BodyContentFramDiv = styled(Box)`
  display: flex;
  width: 100%;
  max-width: 600px;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  @media (max-width: 768px) {
    max-width: 100%;
    gap: 4px;
  }
`;

const BodyContentFramBottomDiv = styled(Box)`
  display: flex;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  align-self: stretch;
`;

const LabelTextArea = styled(Box)`
  display: flex;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  height: 100%;
`;

const LabelText = styled(Box)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  height: 100%;
`;

const LabelTypography = styled(Typography)`
  text-align: right;
`;

// 공통 테이블 스타일
const tableStyle = {
  width: '100%',
  background: '#FFFFFF',
  tableLayout: 'fixed' as const,
  borderCollapse: 'collapse' as const,
};

// 공통 테이블 셀 스타일 util
const tableCellStyles = {
  thBase: {
    alignContent: 'center',
    background: '#F7F7F7',
    borderRight: '1px solid #D9D9D9',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    height: '40px',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: '600',
  } as const,
  thOrange: {
    alignContent: 'center',
    background: '#FFF7EC',
    borderRight: '1px solid #D9D9D9',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    height: '40px',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: '600',
  } as const,
  thRed: {
    alignContent: 'center',
    background: '#FFF5F5',
    borderRight: '1px solid #D9D9D9',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    height: '40px',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: '600',
  } as const,
  tdDefault: {
    height: '55px',
    minHeight: '55px',
    maxHeight: '55px',
    borderBottom: '1px solid #D9D9D9',
    borderRight: '1px solid #D9D9D9',
    padding: '8px',
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    boxSizing: 'border-box',
  } as const,
  tdHeaderStandard: {
    textAlign: 'left',
    width: '250px',
    height: '40px',
    background: '#F7F7F7',
    borderRight: '1px solid #D9D9D9',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    verticalAlign: 'middle',
  } as const,
  tdHeaderLarge: {
    width: '350px',
    height: '40px',
    background: '#F7F7F7',
    borderRight: '1px solid #D9D9D9',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    verticalAlign: 'middle',
    textAlign: 'left',
  } as const,
  tdValue: {
    width: 'calc(100% / 14)',
    height: '55px !important',
    minHeight: '55px !important',
    maxHeight: '55px !important',
    boxSizing: 'border-box',
    borderBottom: '1px solid #D9D9D9',
    borderRight: '1px solid #D9D9D9',
    padding: '8px',
    textAlign: 'center',
    verticalAlign: 'middle',
    display: 'table-cell',
    lineHeight: '1.2',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      fontSize: '11px',
      padding: '4px 2px',
      height: '45px !important',
      minHeight: '45px !important',
      maxHeight: '45px !important',
      lineHeight: '1.1',
    },
    '@media (max-width: 480px)': {
      fontSize: '9px',
      padding: '2px 1px',
      height: '35px !important',
      minHeight: '35px !important',
      maxHeight: '35px !important',
      lineHeight: '1',
    },
  } as const,
  tdValueMedium: {
    width: '246px',
    height: '40px',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    verticalAlign: 'middle',
    overflow: 'hidden',
  } as const,
  tdValueLarge: {
    width: '350px',
    height: '40px',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    verticalAlign: 'middle',
    overflow: 'hidden',
  } as const,
  tdValueStandard: {
    width: '250px',
    height: '40px',
    borderBottom: '1px solid #D9D9D9',
    padding: '8px',
    verticalAlign: 'middle',
    overflow: 'hidden',
  } as const,
};

const CheckBoxLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '2px',
});

// 공통 EtsInput 스타일
const editableInputStyles = {
  width: '100% !important',
  minWidth: '0 !important',
  maxWidth: '100% !important',
  flex: '1 !important',
  margin: '0 !important',
  '& .MuiOutlinedInput-root': {
    height: '37px !important',
    minHeight: '37px !important',
    maxHeight: '37px !important',
    width: '100% !important',
    padding: '0 8px !important',
    boxSizing: 'border-box !important',
    lineHeight: '1 !important',
  },
  '& .MuiOutlinedInput-input': {
    padding: '0 !important',
    lineHeight: '1 !important',
  },
} as const;

const formatNumber = (value: any, decimalPlaces?: number): string => {
  const num = Number(value);
  if (value === null || value === undefined || isNaN(num)) {
    return '';
  }
  if (decimalPlaces !== undefined) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  }
  return num.toLocaleString();
};

interface EditableCellProps {
  isEditable: boolean;
  value: string | number | boolean | null;
  onChange: (value: any) => void;
  type?: 'text' | 'number' | 'decimal' | 'check' | 'check-button' | 'select';
  readOnly?: boolean;
  decimalPlaces?: number;
  options?: Array<{ value: string | number; label: string }>;
}

const EditableCell: React.FC<EditableCellProps> = ({
  isEditable,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  decimalPlaces,
  options = [],
}) => {
  if (!isEditable || readOnly) {
    if (type === 'check') {
      return (
        <CheckBoxLayout>
          <EtsCheckBox checked={!!value} readOnly />
        </CheckBoxLayout>
      );
    }
    if (type === 'check-button') {
      return <EtsCheckButton checked={!!value} readOnly />;
    }
    if (type === 'select') {
      const selectedOption = options.find((opt) => opt.value === value);
      return <>{selectedOption?.label || value || ''}</>;
    }
    if (type === 'number' || type === 'decimal') {
      return <>{formatNumber(value, decimalPlaces)}</>;
    }
    return <>{value || ''}</>;
  }

  // 편집 모드일 경우
  switch (type) {
    case 'number':
    case 'decimal':
    case 'text':
      return <EtsInput value={value || ''} onChange={onChange} sx={editableInputStyles} />;
    case 'check':
      return (
        <CheckBoxLayout>
          <EtsCheckBox checked={!!value} onChange={(checked) => onChange(checked)} />
        </CheckBoxLayout>
      );
    case 'check-button':
      return <EtsCheckButton checked={!!value} onChange={(checked) => onChange(checked)} />;
    case 'select':
      return (
        <EtsSelect
          value={value || ''}
          options={options}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: '100%' }}
        />
      );
    default:
      return <>{value}</>;
  }
};

const table = styled.table<{ customHeight?: string }>`
  width: 100%;
  background: #ffffff;
  table-layout: fixed;
  border-collapse: collapse;
  ${({ customHeight }) => customHeight && `height: ${customHeight};`}
`;

const thead = styled.thead``;
const tbody = styled.tbody``;

const tr = styled.tr`
  border-top: 1px solid #252525;
  height: 40px;
`;

const td = styled.td<{
  variant?: 'base' | 'orange' | 'red' | 'hd-lg' | 'hd-sm' | 'lg' | 'md' | 'sm' | 'td';
}>`
  ${({ variant }) => {
    switch (variant) {
      case 'orange':
        return tableCellStyles.thOrange;
      case 'red':
        return tableCellStyles.thRed;
      case 'base':
        return tableCellStyles.thBase;
      case 'hd-lg':
        return tableCellStyles.tdHeaderLarge;
      case 'hd-sm':
        return tableCellStyles.tdHeaderStandard;
      case 'lg':
        return tableCellStyles.tdValueLarge;
      case 'md':
        return tableCellStyles.tdValueMedium;
      case 'sm':
        return tableCellStyles.tdValueStandard;
      case 'td':
        return tableCellStyles.tdValue;
      default:
        return tableCellStyles.tdDefault;
    }
  }}
  &:last-child {
    border-right: none;
  }
`;

export const tableForm = {
  HeaderContent,
  BodyDiv,
  BodyTopContent,
  BodyTopContentDiv,
  BodyContentDivText,
  BodyContent,
  BodyContentFram,
  BodyContentSecondFram,
  BodyContentFramDiv,
  BodyContentFramBottomDiv,
  LabelTextArea,
  LabelText,
  LabelTypography,
  tableStyle,
  tableCellStyles,
  table,
  thead,
  tbody,
  tr,
  td,
  EditableCell,
};
