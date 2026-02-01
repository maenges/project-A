import { css } from 'styled-components';
import { alpha } from '@mui/material/styles';

export const agGridStyles = css`
  /**
    @read BOB THEME  
  */

  .ag-root-wrapper {
    border: 0px;
    /* border-bottom: 2px solid #e5e7eb; */
  }
  .ag-theme-material {
    /* 기본 폰트 설정 */
    --ag-font-family: var(--font-family-hanjingroup-sans, 'Arial', sans-serif);
    --ag-font-size: 20px;
    /* --ag-font-weight: 500; */

    /* 그리드 전체 배경색 - 테마 기반 */
    --ag-background-color: ${(props) => props.theme.colors.background.paper};

    /* 컬럼 헤더 기본 스타일 */
    --ag-header-background-color: #f7f7f7; /* 헤더 배경색  */
    --ag-header-foreground-color: #252525; /* 헤더 텍스트 색상 - 진한 회색 */
    --ag-header-cell-hover-background-color: #e5e7eb; /* 헤더 마우스 오버 배경색 */
    --ag-header-cell-moving-background-color: #ddd6fe; /* 헤더 이동 중 배경색 */
    --ag-header-height: 40px; /* 헤더 높이 */

    /* 행(Row) 기본 스타일 */
    --ag-row-height: 40px; /* 행 높이 */

    /* 홀수/짝수 행 색상 (Zebra Striping) - 테마 배경 사용 */
    --ag-odd-row-background-color: ${(props) => props.theme.colors.background.paper};
    --ag-even-row-background-color: ${(props) => props.theme.colors.background.paper};

    /* 마우스 호버 시 행 색상 */
    /* --ag-row-hover-color: #eff6ff; 행 호버 배경색 - 연한 파란색 */

    /* 선택된 행 색상 */

    /* 셀(Cell) 기본 스타일 */
    /* --ag-cell-horizontal-border: solid 1px #e5e7eb; 셀 수평 구분선 */
    /* --ag-cell-text-color: #374151; 셀 텍스트 색상 */

    /* 포커스된 셀 스타일 */
    /* --ag-range-selection-border-style: solid; 셀 범위 선택 테두리 스타일 */

    /* 페이지네이션 스타일 */
    --ag-control-panel-background-color: #f8fafc; /* 페이지네이션 패널 배경색 */
    --ag-control-panel-foreground-color: #374151; /* 페이지네이션 텍스트 색상 */

    /* 필터 및 메뉴 스타일 */
    --ag-popup-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* 팝업 그림자 */
    --ag-menu-background-color: #ffffff; /* 메뉴 배경색 */
    --ag-menu-option-selected-color: #eff6ff; /* 선택된 메뉴 옵션 배경색 */

    /* 스크롤바 스타일 */
    --ag-scrollbar-size: 1px; /* 스크롤바 크기 */

    /* 정렬 아이콘 색상 */
    --ag-icon-color: #6b7280; /* 아이콘 기본 색상 */
  }

  // 그리드 헤더 경계선 표기
  .ag-header-group-cell-with-group,
  .ag-header-cell {
    border-right: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
  }

  /* 다크모드: 행 호버 변수 색상 (공통) */
  body[data-theme='dark'] .ag-theme-material {
    /* MUI action.hover 계열 느낌: rgba(145,158,171,0.08) */
    --ag-row-hover-color: rgba(145, 158, 171, 0.08);
    /* 다크모드: 기본 전경/셀 텍스트를 흰색으로 */
    --ag-foreground-color: #ffffff;
    --ag-cell-text-color: #ffffff;
    /* 다크모드: 선택 행 중립톤 (hover보다 약간 진함) */
    --ag-selected-row-background-color: rgba(145, 158, 171, 0.12);
  }

  .ag-header-row .ag-header-row-column {
    padding: 1.5px 0px !important;
  }

  // 그리드 셀 경계선 표기
  .ag-cell {
    border-top: none !important;
    border-left: none !important;
    border-bottom: none !important;
    border-right: none !important;
    /* border-right: 1px solid var(--color-border-divider-primary, #e5e7eb) !important; */
  }

  /* .ag-cell {
    border-right: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
  } */

  /* 모든 헤더 셀 중앙 정렬 */
  .ag-theme-material .ag-header-cell-label {
    justify-content: center !important; /* 헤더 텍스트 중앙 정렬 */
  }

  /* 정렬/필터 아이콘이 텍스트를 밀어내지 않도록 절대위치로 고정 */
  /* .ag-theme-material .ag-header-cell {
    position: relative !important;
    overflow: visible !important;
  }

  .ag-theme-material .ag-header-cell-label {
    padding-right: 0 !important;
    width: 100% !important;
    position: relative !important;
  }

  .ag-theme-material .ag-header-cell-text {
    width: 100% !important;
    text-align: center !important;
    padding-right: 0 !important;
  } */

  /* 정렬 아이콘들을 절대위치로 오른쪽 상단에 배치 */
  .ag-theme-material .ag-sort-ascending-icon,
  .ag-theme-material .ag-sort-descending-icon,
  .ag-theme-material .ag-sort-none-icon {
    position: absolute !important;
    right: 20px !important;
    top: 45% !important;
    transform: translateY(-50%) !important;
    width: 12px !important;
    height: 12px !important;
    z-index: 10 !important;
  }

  /* 필터 아이콘을 정렬 아이콘 옆에 배치 */
  .ag-theme-material .ag-filter-icon {
    position: absolute !important;
    right: 15px !important;
    top: 45% !important;
    transform: translateY(-50%) !important;
    width: 12px !important;
    height: 12px !important;
    z-index: 10 !important;
  }

  /* 정렬된 상태에서 필터 아이콘 위치 조정 */
  .ag-theme-material .ag-header-cell-sorted .ag-filter-icon {
    right: 20px !important;
  }

  .ag-header-cell-comp-wrapper,
  .ag-theme-material .ag-header-cell-text {
    white-space: normal !important; /* 텍스트 줄바꿈 허용 */
    word-wrap: break-word !important; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word !important; /* 브라우저 호환성 */
    line-height: 1.4 !important; /* 줄 간격 조정 */
    text-align: center !important; /* 모든 셀 텍스트 중앙 정렬 */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* 모든 셀 데이터 중앙 정렬 */
  .ag-theme-material .ag-cell {
    /* text-align: center !important; 모든 셀 텍스트 중앙 정렬 */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* 그리드 컨텐츠 영역(뷰포트/컨테이너) 배경을 테마로 강제 적용 */
  .ag-theme-material .ag-root-wrapper-body,
  .ag-theme-material .ag-center-cols-viewport,
  .ag-theme-material .ag-center-cols-container,
  .ag-theme-material .ag-body-viewport {
    background-color: ${(props) => props.theme.colors.background.paper} !important;
  }

  .ag-theme-material .ag-cell.ag-right-aligned-cell {
    text-align: right !important;
    justify-content: flex-end !important;
    padding-right: 8px !important;
  }

  .ag-theme-material .ag-cell.statistics-grid-font {
    color: var(--color-text-base, #252525) !important;
    text-align: center !important;
    font-family: 'Sans', Arial, sans-serif !important;
    font-size: 11px !important;
    font-style: normal !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 150% !important;
  }

  /* .ag-column-first {
    border-top: 0px !important;
    border-left: 0px !important;
    border-bottom: 0px !important;
  } */
  /* .ag-column-first .ag-header-group-cell-with-group,
  .ag-column-last {
    border-right: none !important;
  } */

  /**
   * @read 컬럼 헤더 색상 클래스들 - 즉시 적용
   */
  .ag-theme-material .ag-header-cell {
    transition: none !important;
    animation: none !important;
    /* background-color: #eef7f2 !important; */
  }

  // default
  .ag-theme-material .ag-header-cell,
  .ag-theme-material .ag-header-group-cell {
    /* SearchPanel과 동일한 브랜드 틴트 적용 (라이트:0.08) */
    background-color: ${(props) =>
      alpha(props.theme.colors?.primary?.main || '#ffffff', 0.08)} !important;
  }

  /* 다크모드용 더 옅은 틴트 (0.06) */
  body[data-theme='dark'] .ag-theme-material .ag-header-cell,
  body[data-theme='dark'] .ag-theme-material .ag-header-group-cell {
    background-color: ${(props) =>
      alpha(props.theme.colors?.primary?.main || '#ffffff', 0.06)} !important;
  }

  .ag-theme-material .ag-header-cell.bg-orange,
  .ag-theme-material .ag-header-group-cell.bg-orange {
    background-color: #fef5ec !important;
    transition: none !important;
  }

  .ag-theme-material .ag-header-cell.bg-red,
  .ag-theme-material .ag-header-group-cell.bg-red {
    background-color: #fae5e5 !important;
    transition: none !important;
  }

  .ag-theme-material .ag-header-cell.bg-teal,
  .ag-theme-material .ag-header-group-cell.bg-teal {
    background-color: #e2f3f2 !important;
    transition: none !important;
  }

  .ag-theme-material .ag-header-cell.bg-mint,
  .ag-theme-material .ag-header-group-cell.bg-mint {
    background-color: #f4f9fb !important;
    transition: none !important;
  }

  .ag-theme-material .ag-header-cell.bg-light-green,
  .ag-theme-material .ag-header-group-cell.bg-light-green {
    background-color: #f0fff4 !important;
    transition: none !important;
  }

  /**
   * @read 컬럼 셀 색상 클래스들
   * 1. default 흰색 (#FFFFFF)
   * 2. orange (#FEF5EC)
   * 3. red (#FAE5E5)
   * 4. teal (#F4F9FB)
   * 5. mint (#E2F3F2)
   */

  /* 특별한 셀 색상 클래스들 */
  .ag-theme-material .ag-cell.bg-orange {
    background-color: #fef5ec !important; /* 오렌지 셀 */
  }

  .ag-theme-material .ag-cell.bg-red {
    background-color: #fae5e5 !important; /* 레드 셀 */
  }

  .ag-theme-material .ag-cell.bg-mint {
    background-color: #e2f3f2 !important; /* 민트 셀 */
  }

  .ag-theme-material .ag-cell.bg-teal {
    background-color: #f4f9fb !important; /* 틸 셀 */
  }

  .ag-theme-material .ag-cell.bg-green {
    background-color: #d8fde7 !important;
  }

  .ag-theme-material .ag-cell.bg-light-green {
    background-color: #f0fff4 !important;
  }

  .ag-theme-material .ag-cell.bold-cell {
    font-weight: bold !important;
  }

  .ag-theme-material .ag-selection-checkbox {
    margin-right: 0 !important;
  }

  .ag-theme-material .ag-ltr .ag-header-select-all {
    margin-left: 0 !important;
  }

  .ag-cell-inline-editing {
    height: 39px !important;
    border: none !important;
    box-shadow: none !important;
    background-color: ${(props) => props.theme.colors.background.paper} !important;
  }
  .ag-cell,
  .ag-full-width-row .ag-cell-wrapper.ag-row-group .ets-grid-editor-text-cell {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  .ag-theme-material .ag-header-cell,
  .ag-theme-material .ag-header-group-cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .ag-theme-material .ag-header-cell-text {
    white-space: pre-line !important; /* \n 줄바꿈 허용 */
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    text-align: center !important;
    line-height: 1.4 !important;
    display: block !important;
  }

  /**
   숫자 형식 셀 스타일
   요구사항 들어올시 사용
   */
  /* 숫자는 오른쪽 정렬 */
  /* 숫자 폰트 균등 간격 */

  /* .ag-theme-material .ag-cell.cell-number {
    text-align: right !important; 
    font-variant-numeric: tabular-nums !important; 
  } */

  /* 상태 인디케이터 스타일 */
  .ag-theme-material .ag-cell.status-active {
    position: relative;
  }

  .ag-theme-material .ag-cell.status-active::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981; /* 활성 상태 - 녹색 점 */
  }

  .ag-theme-material .ag-cell.status-inactive::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ef4444; /* 비활성 상태 - 빨간색 점 */
  }

  /* No Data 상태일 때 최소 높이 보장 */
  .ag-theme-material.ag-no-rows {
    min-height: 300px !important;
  }

  .ag-theme-material.ag-no-rows .ag-center-cols-container {
    min-height: 250px !important;
  }

  /* Enhanced AG-Grid theme customization */
  .ag-theme-material .ag-header {
    background-color: ${(props) => props.theme.colors.neutral[20]} !important;
    border-top: 1px solid ${(props) => props.theme.colors.neutral[90]} !important;
  }

  .ag-theme-material .ag-header-cell .ag-header-cell-label {
    font-weight: ${(props) => props.theme.fonts.weight.bold} !important;
  }

  .ag-theme-material .ag-header-cell-label,
  .ag-theme-material .ag-header-group-cell-label {
    font-weight: ${(props) => props.theme.fonts.weight.bold} !important;
    color: var(--color-neutral-80, #333) !important;
    font-size: ${(props) => props.theme.fonts.size.sm} !important;
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
  }

  /* 다크모드 헤더 텍스트 흰색 처리 */
  body[data-theme='dark'] .ag-theme-material .ag-header-cell-label,
  body[data-theme='dark'] .ag-theme-material .ag-header-group-cell-label {
    color: #ffffff !important;
  }

  .editable-header {
    background-color: var(--color-brand-lightblue-20, #e3f2fd) !important;
    color: var(--color-brand-darkblue-100, #1976d2) !important;
  }

  .ag-theme-material .ag-cell {
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
    font-size: var(--font-body-ms, ${(props) => props.theme.fonts.size.sm}) !important;
    color: var(--color-text-base, ${(props) => props.theme.colors.text.base}) !important;
  }

  /* 다크모드: 셀 텍스트를 확실히 흰색으로 강제 */
  body[data-theme='dark'] .ag-theme-material .ag-cell {
    color: #ffffff !important;
  }

  /* 다크모드: 커스텀 통계 폰트 셀도 흰색으로 */
  body[data-theme='dark'] .ag-theme-material .ag-cell.statistics-grid-font {
    color: #ffffff !important;
  }

  /* .ag-theme-material .ag-cell.ag-cell-focus,
  .ag-theme-material .ag-cell.ag-cell-range-selected,
  .ag-theme-material .ag-cell.ag-cell-range-selected-1,
  .ag-theme-material .ag-cell.ag-cell-range-selected-2,
  .ag-theme-material .ag-cell.ag-cell-range-selected-3,
  .ag-theme-material .ag-cell.ag-cell-range-selected-4 {
    border-color: var(--color-border-divider-primary, #e5e7eb) !important;
    box-shadow: none !important;
  } */

  /* .ag-theme-material .ag-cell.ag-cell-focus:not(.ag-cell-range-selected) {
    border: 0 !important;
    border-right: 1px solid var(--color-border-divider-primary, #e5e7eb) !important;
    outline: none !important;
    box-shadow: none !important;
  } */

  /* 라이트 모드: 행 호버 - primary.light 색상 기반 매우 옅은 배경 (선택 대비, hue 일치) */
  body[data-theme='light'] .ag-theme-material .ag-row-hover {
    background-color: ${(props) =>
      alpha(props.theme.colors?.primary?.light || '#F4ECF9', 0.5)} !important;
  }
  body[data-theme='light'] .ag-theme-material .ag-row-hover .ag-cell {
    background-color: ${(props) =>
      alpha(props.theme.colors?.primary?.light || '#F4ECF9', 0.5)} !important;
  }

  /* 다크모드: 행 호버 공통 컬러 적용 (행과 셀 모두) */
  body[data-theme='dark'] .ag-theme-material .ag-row-hover {
    background-color: rgba(145, 158, 171, 0.08) !important;
  }
  body[data-theme='dark'] .ag-theme-material .ag-row-hover .ag-cell {
    background-color: rgba(145, 158, 171, 0.08) !important;
  }

  /* 라이트 모드: 선택 행은 호버보다 진한 브랜드 틴트
     일부 전역 규칙(.css-**** .ag-row-selected .ag-cell)이 강해져 덮는 경우가 있어
     body[data-theme]를 포함해 특이성을 높여 셀 배경까지 강제한다. */
  body[data-theme='light'] .ag-theme-material .ag-row-selected {
    background-color: ${(props) =>
      props.theme.colors?.primary?.light ||
      alpha(props.theme.colors?.primary?.main || '#1976d2', 0.1)} !important;
  }
  body[data-theme='light'] .ag-theme-material .ag-row-selected .ag-cell {
    background-color: ${(props) =>
      props.theme.colors?.primary?.light ||
      alpha(props.theme.colors?.primary?.main || '#1976d2', 0.1)} !important;
  }

  /* 선택 + 호버 동시일 때도 선택 컬러 유지 */
  body[data-theme='light'] .ag-theme-material .ag-row-selected.ag-row-hover,
  body[data-theme='light'] .ag-theme-material .ag-row-selected.ag-row-hover .ag-cell {
    background-color: ${(props) =>
      props.theme.colors?.primary?.light ||
      alpha(props.theme.colors?.primary?.main || '#1976d2', 0.1)} !important;
  }

  /* 다크 모드: 선택 행은 호버 중립톤(rgba(145,158,171,0.08))보다 살짝만 진하게 같은 hue 사용 */
  body[data-theme='dark'] .ag-theme-material .ag-row-selected,
  body[data-theme='dark'] .ag-theme-material .ag-row-selected .ag-cell {
    background-color: rgba(145, 158, 171, 0.12) !important; /* fallback */
    /* 변수 우선 강제 (일부 테마가 변수 값을 읽어가는 경우) */
    --ag-selected-row-background-color: rgba(145, 158, 171, 0.12);
  }

  /* 다크 모드: 선택 + 호버 동시에도 동일 강도/톤 유지 */
  body[data-theme='dark'] .ag-theme-material .ag-row-selected.ag-row-hover,
  body[data-theme='dark'] .ag-theme-material .ag-row-selected.ag-row-hover .ag-cell {
    background-color: rgba(145, 158, 171, 0.12) !important;
  }

  /* Tooltip: 다크모드에서 기본 툴팁(흰 배경)에 흰 글씨가 겹쳐 안 보이는 현상 방지 */
  .ag-theme-material .ag-tooltip {
    background-color: #ffffff;
    color: #111827;
    border: 1px solid rgba(17, 24, 39, 0.12);
    box-shadow: var(--ag-popup-shadow);
    padding: 8px 10px;
    max-width: 720px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  body[data-theme='dark'] .ag-theme-material .ag-tooltip {
    background-color: rgba(17, 24, 39, 0.96);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.14);
  }

  .ag-theme-material .ag-checkbox-input-wrapper {
    width: 18px !important;
    height: 18px !important;
  }

  .ag-theme-material .ag-checkbox-input-wrapper input[type='checkbox'] {
    width: 18px !important;
    height: 18px !important;
  }

  /* Selection 컬럼(행 체크박스 + 헤더 전체선택)은 더 크게 표시 */
  .ag-theme-material .ag-selection-checkbox .ag-checkbox-input-wrapper,
  .ag-theme-material .ag-header-select-all .ag-checkbox-input-wrapper {
    width: 24px !important;
    height: 24px !important;
  }

  .ag-theme-material .ag-selection-checkbox .ag-checkbox-input-wrapper input[type='checkbox'],
  .ag-theme-material .ag-header-select-all .ag-checkbox-input-wrapper input[type='checkbox'] {
    width: 24px !important;
    height: 24px !important;
  }

  .ag-theme-material .ag-checkbox-input-wrapper.ag-checked {
    background-color: var(
      --color-brand-darkblue-100,
      ${(props) => props.theme.colors.primary.main}
    ) !important;
    border-color: var(
      --color-brand-darkblue-100,
      ${(props) => props.theme.colors.primary.main}
    ) !important;
  }

  /* AG-Grid Pagination */
  .ag-theme-material .ag-paging-panel {
    border-top: 1px solid
      var(--color-border-divider-secondary, ${(props) => props.theme.colors.neutral[30]}) !important;
    background-color: var(
      --color-background-fill-secondary,
      ${(props) => props.theme.colors.background.paper}
    ) !important;
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
  }

  .ag-theme-material .ag-paging-button {
    color: var(--color-text-primary, ${(props) => props.theme.colors.text.primary}) !important;
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
  }

  .ag-theme-material .ag-paging-button:hover {
    background-color: var(--color-background-interaction-hovered, #f5f5f5) !important;
  }

  .ag-theme-material .ag-paging-button.ag-disabled {
    color: var(--color-text-disabled, ${(props) => props.theme.colors.text.disabled}) !important;
  }

  /* AG-Grid Filter */
  .ag-theme-material .ag-filter-toolpanel-header,
  .ag-theme-material .ag-filter-toolpanel-search,
  .ag-theme-material .ag-filter-toolpanel-instance-header {
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
  }

  .ag-theme-material .ag-filter-apply-panel {
    border-top: 1px solid
      var(--color-border-divider-secondary, ${(props) => props.theme.colors.neutral[30]}) !important;
  }

  /* AG-Grid Menu */
  .ag-theme-material .ag-menu {
    border: 1px solid var(--color-border-tertiary, var(--color-neutral-40, #d9d9d9)) !important;
    border-radius: var(--radius-sm, ${(props) => props.theme.radius.sm}) !important;
    box-shadow: var(--shadow-lg, ${(props) => props.theme.shadows.lg}) !important;
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
  }

  .ag-theme-material .ag-menu-option {
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
    font-size: var(--font-body-sm, ${(props) => props.theme.fonts.size.sm}) !important;
  }

  .ag-theme-material .ag-menu-option:hover {
    background-color: var(--color-background-interaction-hovered, #f5f5f5) !important;
  }

  /* AG-Grid Input styles */
  .ag-theme-material .ag-input-field-input {
    font-family: var(
      --font-family-hanjingroup-sans,
      ${(props) => props.theme.fonts.family.primary}
    ) !important;
    font-size: var(--font-body-sm, ${(props) => props.theme.fonts.size.sm}) !important;
    border: 1px solid var(--color-border-tertiary, var(--color-neutral-40, #d9d9d9)) !important;
    border-radius: var(--radius-sm, ${(props) => props.theme.radius.sm}) !important;
  }

  .ag-theme-material .ag-input-field-input:focus {
    border-color: var(
      --color-border-primary,
      ${(props) => props.theme.colors.primary.main}
    ) !important;
    box-shadow: 0 0 0 2px var(--color-brand-darkblue-10, rgba(5, 23, 102, 0.1)) !important;
  }

  /* Custom status colors for cells */
  .ag-cell-status-success {
    background-color: var(--color-system-lightgreen-200, #dff5e5) !important;
    color: var(--color-system-green-200, #086a36) !important;
  }

  .ag-cell-status-warning {
    background-color: var(--color-system-lightorange-200, #ffe8c9) !important;
    color: var(--color-system-orange-200, #b33c00) !important;
  }

  .ag-cell-status-error {
    background-color: var(--color-system-lightred-200, #ffe3e3) !important;
    color: var(--color-system-red-200, #c92317) !important;
  }

  .ag-cell-status-info {
    background-color: var(--color-brand-lightblue-20, #ddf1fb) !important;
    color: var(--color-brand-darkblue-100, #051766) !important;
  }

  /* Scrollbar styling for AG-Grid */
  .ag-theme-material .ag-body-horizontal-scroll::-webkit-scrollbar,
  .ag-theme-material .ag-body-vertical-scroll::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    background: var(--color-background-fill-scroll, #25252540);
  }

  .ag-theme-material .ag-body-horizontal-scroll::-webkit-scrollbar-track,
  .ag-theme-material .ag-body-vertical-scroll::-webkit-scrollbar-track {
    background: var(--color-background-fill-scroll, #25252540);
    border-radius: var(--radius-md, ${(props) => props.theme.radius.md});
  }

  .ag-theme-material .ag-body-horizontal-scroll::-webkit-scrollbar-thumb,
  .ag-theme-material .ag-body-vertical-scroll::-webkit-scrollbar-thumb {
    background: var(--color-neutral-50, ${(props) => props.theme.colors.neutral[50]});
    border-radius: var(--radius-md, ${(props) => props.theme.radius.md});

    &:hover {
      background: var(--color-neutral-70, ${(props) => props.theme.colors.neutral[70]});
    }
  }
  /* rowSpan 병합 셀 시각화 */
  .ag-theme-material .ag-cell.merged-cell {
    background: ${(props) => props.theme.colors.background.paper} !important; /* 테마 배경 */
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #e5e7eb;
  }

  /* agNumberCellEditor를 EtsInput과 동일한 스타일로 적용 */
  .ag-theme-material .ag-cell.ag-number-editor-styled input[type='number'] {
    width: 100% !important;
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    padding: 7px 12px !important;
    border: 1px solid var(--color-border-base, #d9d9d9) !important;
    border-radius: var(--radius-sm, 8px) !important;
    font-family: 'Sans', Arial, sans-serif !important;
    font-size: var(--font-size-label-md, 14px) !important;
    font-weight: var(--font-weight-regular, 400) !important;
    line-height: 130% !important;
    background-color: var(--color-background-base-white, #fff) !important;
    color: #000000 !important;
    box-sizing: border-box !important;
    outline: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: textfield !important;
  }

  .ag-theme-material .ag-cell.ag-number-editor-styled input[type='number']:hover {
    border-color: var(--color-border-primary-darkblue, #051766) !important;
  }

  .ag-theme-material .ag-cell.ag-number-editor-styled input[type='number']:focus {
    border-color: var(--color-border-primary-darkblue, #051766) !important;
    border-width: 1px !important;
    box-shadow: none !important;
  }

  /* 숫자 입력 필드의 스피너 버튼 제거 */
  .ag-theme-material
    .ag-cell.ag-number-editor-styled
    input[type='number']::-webkit-outer-spin-button,
  .ag-theme-material
    .ag-cell.ag-number-editor-styled
    input[type='number']::-webkit-inner-spin-button {
    appearance: none !important;
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  /* 편집 모드일 때 셀의 패딩 제거 */
  /* ag-cell ag-cell-normal-height ag-cell-value ag-cell-focus center ag-cell-not-inline-editing {
    padding: 2px !important;
  } */

  /* =============================================
     Pinned Bottom Row (합계 행) 스타일
     ============================================= */

  /* 공통 스타일 */
  .ag-theme-material .ag-row-pinned {
    font-weight: 600 !important;
    border-top: 1px solid rgba(145, 158, 171, 0.24) !important;
  }

  /* 라이트모드 기본 */
  body[data-theme='light'] .ag-theme-material .ag-row-pinned {
    background-color: #f1f5f9 !important;
  }
  body[data-theme='light'] .ag-theme-material .ag-row-pinned .ag-cell {
    color: #1e293b !important;
  }

  /* 다크모드 기본 */
  body[data-theme='dark'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(145, 158, 171, 0.16) !important;
  }
  body[data-theme='dark'] .ag-theme-material .ag-row-pinned .ag-cell {
    color: #ffffff !important;
  }

  /* 라이트모드 + Green 브랜드 */
  body[data-theme='light'][data-brand='green'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(0, 171, 85, 0.08) !important;
    border-top-color: rgba(0, 171, 85, 0.24) !important;
  }

  /* 라이트모드 + Blue 브랜드 */
  body[data-theme='light'][data-brand='blue'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(25, 118, 210, 0.08) !important;
    border-top-color: rgba(25, 118, 210, 0.24) !important;
  }

  /* 라이트모드 + Purple 브랜드 */
  body[data-theme='light'][data-brand='purple'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(124, 9, 206, 0.08) !important;
    border-top-color: rgba(124, 9, 206, 0.24) !important;
  }

  /* 다크모드 + Green 브랜드 */
  body[data-theme='dark'][data-brand='green'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(0, 171, 85, 0.16) !important;
    border-top-color: rgba(0, 171, 85, 0.32) !important;
  }

  /* 다크모드 + Blue 브랜드 */
  body[data-theme='dark'][data-brand='blue'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(25, 118, 210, 0.16) !important;
    border-top-color: rgba(25, 118, 210, 0.32) !important;
  }

  /* 다크모드 + Purple 브랜드 */
  body[data-theme='dark'][data-brand='purple'] .ag-theme-material .ag-row-pinned {
    background-color: rgba(124, 9, 206, 0.16) !important;
    border-top-color: rgba(124, 9, 206, 0.32) !important;
  }
`;
