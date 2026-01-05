import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const StyledAgGridSelectionBox = styled(Box)(() => ({
  // 1. 선택된 행 내부의 모든 셀에 배경색 적용 (경계선 유지)
  '.ag-row-selected .ag-cell': {
    backgroundColor: 'rgba(5, 23, 102, 0.08) !important',
  },

  // 2. 포커스된 셀의 스타일을 명확하게 제어
  '.ag-cell-focus': {
    // 포커스 시 나타나는 기본 외곽선만 제거 (border는 유지)
    outline: 'none !important',
  },

  // 3. 선택용 컬럼(프리셋) 셀 중앙 정렬
  '.ets-selection-cell': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 헤더: select-all 체크박스를 헤더 셀 중앙에 고정 (AG Grid 헤더 DOM 차이를 타지 않게 absolute 사용)
  '.ets-selection-header': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
  },

  // selection 헤더는 텍스트/정렬 아이콘 영역이 필요 없어서 숨김 (레이아웃 영향 제거)
  '.ets-selection-header .ag-header-cell-comp-wrapper': {
    display: 'none !important',
  },

  // 헤더 체크박스 자체도 margin 없이 중앙
  '.ets-selection-header .ag-header-select-all': {
    margin: '0 !important',
    position: 'static !important',
    inset: 'unset !important',
    width: 'auto !important',
    height: 'auto !important',
    display: 'flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
  },

  // notice처럼 헤더 전체선택을 끈 경우: 헤더 체크박스 DOM 자체를 숨김
  '.ets-selection-header--no-selectall .ag-header-select-all': {
    display: 'none !important',
  },

  // AG Grid가 넣는 label(align-right용)이 공간을 차지하는 경우를 방지
  '.ets-selection-header .ag-header-select-all .ag-label': {
    display: 'none !important',
  },

  // 실제 체크박스(사각형)를 헤더 셀 정중앙에 고정
  '.ets-selection-header .ag-header-select-all .ag-checkbox-input-wrapper': {
    position: 'static !important',
    top: 'auto !important',
    left: 'auto !important',
    margin: '0 !important',
    transform: 'none !important',
  },

  // 4. 커스텀 체크박스 스타일 (데이터 행 + 헤더)
  '.ag-selection-checkbox .ag-checkbox-input-wrapper, .ag-header-select-all .ag-checkbox-input-wrapper':
    {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #051766',
      borderRadius: '4px',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      cursor: 'pointer',
    },

  // 실제 input에도 손모양 커서 적용 (브라우저/테마별 hit-area 차이 보완)
  '.ag-selection-checkbox input[type="checkbox"], .ag-header-select-all input[type="checkbox"]': {
    cursor: 'pointer',
  },

  // 5. AG-Grid 기본 체크 아이콘 숨기기 (데이터 행 + 헤더)
  '.ag-selection-checkbox .ag-checkbox-input-wrapper::after, .ag-header-select-all .ag-checkbox-input-wrapper::after':
    {
      content: '""',
      display: 'none',
    },

  // 6. 체크되었을 때 배경색 변경 (데이터 행 + 헤더)
  '.ag-selection-checkbox .ag-checkbox-input-wrapper.ag-checked, .ag-header-select-all .ag-checkbox-input-wrapper.ag-checked':
    {
      backgroundColor: '#051766',
    },

  // 7. 체크되었을 때 커스텀 아이콘 추가 (데이터 행 + 헤더)
  '.ag-selection-checkbox .ag-checkbox-input-wrapper.ag-checked::before, .ag-header-select-all .ag-checkbox-input-wrapper.ag-checked::before':
    {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '12px',
      height: '10px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='10' viewBox='0 0 12 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5.00003L4.44444 8.33336L11 1.66669' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
    },
}));

export default StyledAgGridSelectionBox;
