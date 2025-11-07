import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  align-self: stretch;
`;

const Row = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: flex-end;
`;

const Frame = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 40px;
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

export const buttonForm = {
  Container,
  Row,
  Label,
  Frame,
};
