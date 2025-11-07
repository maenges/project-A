import { Box, Typography } from '@mui/material';
import { isEmpty } from '../../../utils/FunctionUtil';
import icNodata from '@/assets/images/ic-nodata.svg';

type Props = {
  noRowsMessage: string;
  pinnedBottomRowData?: any[];
};

export default function EtsNoDataLayout(props: Props) {
  let noRowsMessage = props.noRowsMessage ?? 'No data found';
  let paddingBottom = '0px';

  // 특정 화면에서 bottomRow 영역에 대한 처리 (필요에 따라 커스터마이징)
  if (props.noRowsMessage && props.noRowsMessage.includes('|bottom')) {
    noRowsMessage = props.noRowsMessage.split('|bottom')[0];
    paddingBottom = '250px';
  }
  if (
    props.noRowsMessage &&
    props.noRowsMessage.includes('|bottom') &&
    isEmpty(props.pinnedBottomRowData)
  ) {
    paddingBottom = '0px';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: paddingBottom,
        minHeight: '200px',
        gap: '4px',
      }}
    >
      <img src={icNodata} alt="NO DATA ICON" style={{ height: '36px', width: '36px' }} />
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#252525',
        }}
      >
        {noRowsMessage}
      </Typography>
    </Box>
  );
}
