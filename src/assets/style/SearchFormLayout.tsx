import { Box, Typography } from '@mui/material';
import styled, { css } from 'styled-components';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
`;

const Row = styled(Box)`
  display: flex;
  width: 100%;
  min-height: 36px;
  align-items: center;
  /* gap: var(--spacing-36, 36px); */
  flex-wrap: wrap;
  gap: 16px 0;
`;
const FieldAreaCss = css`
  display: flex;
  align-items: center;
  margin-right: 36px;
`;

const DateField = styled(Box)`
  ${FieldAreaCss}
  width: 265;
  gap: var(--spacing-16, 16px);
  flex-shrink: 0;
  align-self: stretch;
`;

const DateRangeField = styled(Box)`
  ${FieldAreaCss}
  width: 566px;
  gap: var(--spacing-16, 16px);
  flex-shrink: 0;
  align-self: stretch;
`;

const DatePickerWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-8, 8px);
  flex: 1 0 0;
  align-self: stretch;
`;

const DatePickerContainer = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
`;

const DateSeparator = styled(Typography)`
  display: flex;
  width: 10px;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
`;

const FieldLabel = styled(Box)`
  display: flex;
  width: 72px;
  align-items: flex-start;
`;

const SelectField = styled(Box)`
  ${FieldAreaCss}
  width: 265px;
  height: 36px;
  gap: var(--spacing-16, 16px);
  flex-shrink: 0;
`;

const SelectLabel = styled(Box)`
  display: flex;
  width: 72px;
  align-items: flex-start;
  flex-shrink: 0;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  align-self: stretch;
  width: 100%;
  margin-top: 16px;
`;

const Label = styled(Typography)`
  color: var(--color-text-base, ${(props) => props.theme.colors.text.base}) !important;
  font-family: ${(props) => props.theme.fonts.family.primary} !important;
  font-size: var(--font-size-label-md, ${(props) => props.theme.fonts.size.sm}) !important;
  font-style: normal !important;
  font-weight: var(
    --font-weight-regular,
    ${(props) => props.theme.fonts.weight.regular}
  ) !important;
  line-height: 130% !important;
`;

export const searchForm = {
  Container,
  Row,
  DateField,
  DateRangeField,
  DatePickerWrapper,
  DatePickerContainer,
  DateSeparator,
  FieldLabel,
  SelectField,
  SelectLabel,
  ButtonContainer,
  Label,
};
