import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';

import { desktopBanners, mobileBanners } from '@/assets/images/banner/banners';

import pragmatic_c from '@/assets/images/logo/casino/pragmatic.png';
import evolution_c from '@/assets/images/logo/casino/evolution.png';
import cq9_c from '@/assets/images/logo/casino/cq9.png';
import sexy_c from '@/assets/images/logo/casino/sexy.png';
// import vota_c from '@/assets/images/logo/casino/vota.png';
import dowinn_c from '@/assets/images/logo/casino/dowinn.png';
import vivo_c from '@/assets/images/logo/casino/vivo.png';
import ag_c from '@/assets/images/logo/casino/ag.png';
import tomhornMojo_c from '@/assets/images/logo/casino/tomhorn-mojo.png';
import tomhornAbsolute_c from '@/assets/images/logo/casino/tomhron-absolute.png';
import micro_c from '@/assets/images/logo/casino/micro.png';
import dream_c from '@/assets/images/logo/casino/dream.png';
import sa_c from '@/assets/images/logo/casino/sa.png';
import oriental_c from '@/assets/images/logo/casino/oriental.png';

// 슬롯 이미지
import slot_booongo from '@/assets/images/slot/slot_booongo.png';
import slot_cq9 from '@/assets/images/slot/slot_cq9.png';
import slot_redtiger from '@/assets/images/slot/slot_redtiger.png';
import slot_pragmatic from '@/assets/images/slot/slot_pragmatic_slot.png';
import slot_netent from '@/assets/images/slot/slot_netent.png';
import slot_btg from '@/assets/images/slot/slot_btg.png';
import slot_habanero from '@/assets/images/slot/slot_habanero.png';
import slot_hacksaw from '@/assets/images/slot/slot_hacksaw_slot.png';
import slot_micro from '@/assets/images/slot/slot_MICRO_Slot.png';
import slot_nlc from '@/assets/images/slot/slot_nlc.png';
import slot_tomhorn from '@/assets/images/slot/slot_TOMHORN_SLOT.png';
import slot_playngo from '@/assets/images/slot/slot_PLAYNGO.png';

// import slot_1x2 from '@/assets/images/slot/slot_1x2.png';
// import slot_belatra from '@/assets/images/slot/slot_belatra.png';
// import slot_bfgames from '@/assets/images/slot/slot_bfgames.png';
// import slot_conceptgaming from '@/assets/images/slot/slot_conceptgaming.png';
// import slot_egp from '@/assets/images/slot/slot_egp.png';
// import slot_gameart from '@/assets/images/slot/slot_gameart.png';
// import slot_gamefishglobal from '@/assets/images/slot/slot_gamefishglobal.png';
// import slot_kagaming from '@/assets/images/slot/slot_kagaming.png';
// import slot_legaplay from '@/assets/images/slot/slot_legaplay.png';
// import slot_macaw from '@/assets/images/slot/slot_macaw.png';
// import slot_mplay from '@/assets/images/slot/slot_mplay.png';
// import slot_onetouch from '@/assets/images/slot/slot_onetouch.png';
// import slot_patagonia from '@/assets/images/slot/slot_patagonia.png';
// import slot_playpearls from '@/assets/images/slot/slot_playpearls.png';
// import slot_playson from '@/assets/images/slot/slot_playson.png';
// import slot_redrake from '@/assets/images/slot/slot_redrake.png';
// import slot_vibragaming from '@/assets/images/slot/slot_vibragaming.png';
// import slot_wazdan from '@/assets/images/slot/slot_wazdan.png';

import { useEffect, useRef, useState, type CSSProperties, useMemo } from 'react';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';
import { ClientBalanceEventDispatch } from '@/utils/clientBalanceEventBus';
import { ClientAuthAddEventListeners } from '@/utils/clientAuthEventBus';
import { useGameFrameStore } from '@/store/gameFrame';
import gameCodeData from '@/utils/gameCode.json';

// 게임 코드 데이터 타입
type GameCodeMap = Record<string, Record<string, string[]>>;

export type ProviderTab = 'casino' | 'slot';

type Platform = 'WEB' | 'MOBILE';

// 게임 아이템 타입
type GameItem = {
  gameCode: string;
  provider: string;
  category: string;
  nameEn: string;
  nameKo: string;
  imageUrl: string;
};

// 개발 중 sub(한글 라벨) 스타일을 한 곳에서 빠르게 조절하기 위한 기본값
const SUB_DEV_STYLE = {
  fontSizePx: 19,
  shiftYPx: -10,
  color: 'rgba(255, 205, 120, 0.92)',
  textShadow: '0 10px 22px rgba(0, 0, 0, 0.7)',
  fontWeight: 900,
  letterSpacing: '-0.2px',
  lineHeight: 1.1,
  marginLeft: 0,
} as const;

const Wrap = styled.section`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 12px auto 32px;
  padding: 0 ${CLIENT_SIDE_PADDING} 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  @media (max-width: 420px) {
    gap: 8px;
  }
`;

// 슬롯용 그리드 (이미지가 작으므로 더 많은 열로 배치)
const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

// 슬롯용 카드 (이미지 꽉 채우기)
const SlotCard = styled.button`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.92), rgba(10, 10, 10, 0.92));
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  padding: 0;
  cursor: pointer;
  transform: translateZ(0);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
  will-change: transform;

  .slotImage {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
  }

  .slotLabel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px 8px 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 205, 120, 0.95);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    border-color: rgba(255, 205, 120, 0.35);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 700px) {
    border-radius: 10px;

    .slotLabel {
      font-size: 12px;
      padding: 20px 6px 8px;
    }
  }

  @media (max-width: 420px) {
    .slotLabel {
      font-size: 11px;
    }
  }
`;

// 게임 목록 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: linear-gradient(180deg, #1a1a1f, #0f0f13);
  border: 1px solid rgba(255, 205, 120, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  height: 85vh;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: rgba(255, 205, 120, 0.95);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  outline: none;
  transition:
    border-color 200ms,
    background 200ms;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(255, 205, 120, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ModalCloseBtn = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 28px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: color 150ms;

  &:hover {
    color: rgba(255, 205, 120, 0.95);
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 400px;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const GameGrid = styled.div<{ $isWide?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $isWide }) => ($isWide ? 4 : 5)}, 1fr);
  gap: 12px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(${({ $isWide }) => ($isWide ? 3 : 4)}, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GameCard = styled.button<{ $isWide?: boolean }>`
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 0;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  transition:
    transform 150ms,
    border-color 150ms,
    box-shadow 150ms;

  img {
    width: 100%;
    aspect-ratio: ${({ $isWide }) => ($isWide ? '16 / 9' : '1 / 1')};
    object-fit: cover;
  }

  .gameLabel {
    padding: 10px 8px;
    background: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    border-color: rgba(255, 205, 120, 0.4);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const Card = styled.button<{ $bg?: string }>`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ $bg }) =>
    $bg
      ? `linear-gradient(135deg, rgba(0,0,0,0.32), rgba(0,0,0,0.08)), url(${$bg}) center / cover no-repeat`
      : `radial-gradient(circle at 30% 30%, rgba(255, 205, 120, 0.20), rgba(255, 255, 255, 0.02)),
           linear-gradient(135deg, rgba(40, 40, 40, 0.92), rgba(10, 10, 10, 0.92))`};
  position: relative;
  height: 168px;
  width: 100%;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transform: translateZ(0);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
  will-change: transform;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(255, 205, 120, 0.22), rgba(255, 255, 255, 0.02)),
      linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.42));
    pointer-events: none;
  }

  .label {
    position: absolute;
    left: 8px;
    bottom: 14px;
    z-index: 1;
  }

  .labelMobile {
    display: none;
  }

  .providerLabelImage {
    width: min(460px, 92vw);
    margin-left: -10px;
    max-width: 84%;
    height: 112px;
    object-fit: contain;
    object-position: left center;
    display: block;
    padding: 0;
    border-radius: 0;
    background: transparent;
    border: none;
    box-shadow: none;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
  }

  .sub {
    display: inline-block;
    margin-top: 0;
    transform: translateY(${SUB_DEV_STYLE.shiftYPx}px);
    font-size: ${SUB_DEV_STYLE.fontSizePx}px;
    line-height: ${SUB_DEV_STYLE.lineHeight};
    font-weight: ${SUB_DEV_STYLE.fontWeight};
    letter-spacing: ${SUB_DEV_STYLE.letterSpacing};
    color: ${SUB_DEV_STYLE.color};
    text-shadow: ${SUB_DEV_STYLE.textShadow};
    margin-left: ${SUB_DEV_STYLE.marginLeft}px;
  }

  .mobileMeta {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    min-width: 0;
  }

  .mobileLogo {
    width: 44px;
    height: 44px;
    object-fit: contain;
    flex: 0 0 auto;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.55));
  }

  .mobileText {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-shadow: 0 10px 22px rgba(0, 0, 0, 0.7);
  }

  .mobileSub {
    font-size: 15px;
    line-height: 1.05;
    font-weight: 1000;
    letter-spacing: -0.3px;
    color: rgba(255, 205, 120, 0.92);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .srOnly {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &:hover {
    border-color: rgba(255, 205, 120, 0.35);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media (max-width: 700px) {
    height: auto;
    aspect-ratio: 1 / 1;
    border-radius: 14px;

    .label {
      display: none;
    }

    .labelMobile {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 1;
    }

    .mobileLogo {
      width: 28px;
      height: 28px;
    }

    .mobileSub {
      font-size: 11px;
    }
  }

  @media (max-width: 420px) {
    .mobileMeta {
      left: 8px;
      right: 8px;
      bottom: 8px;
      gap: 6px;
    }

    .mobileLogo {
      width: 24px;
      height: 24px;
    }

    .mobileSub {
      font-size: 10px;
    }
  }
`;

type Props = {
  tab: ProviderTab;
};

const MOBILE_BP_PX = 700;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${MOBILE_BP_PX}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP_PX}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();

    mq.addEventListener?.('change', onChange);
    // Safari fallback
    mq.addListener?.(onChange);

    return () => {
      mq.removeEventListener?.('change', onChange);
      mq.removeListener?.(onChange);
    };
  }, []);

  return isMobile;
};

const ClientProviderGrid = ({ tab }: Props) => {
  const isMobile = useIsMobile();

  // 슬롯 게임 목록 모달 상태
  const [selectedSlotProvider, setSelectedSlotProvider] = useState<string | null>(null);
  const [selectedSlotName, setSelectedSlotName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 선택된 슬롯 provider의 게임 목록
  const slotGameList = useMemo<GameItem[]>(() => {
    if (!selectedSlotProvider) return [];

    const gameMap = gameCodeData as GameCodeMap;
    const providerData = gameMap[selectedSlotProvider];
    if (!providerData) return [];

    return Object.entries(providerData).map(([gameCode, arr]) => ({
      gameCode,
      provider: arr[0] ?? '',
      category: arr[1] ?? '',
      nameEn: arr[2] ?? '',
      nameKo: arr[3] ?? '',
      imageUrl: arr[4] ?? '',
    }));
  }, [selectedSlotProvider]);

  // 검색어로 필터링된 게임 목록
  const filteredGameList = useMemo<GameItem[]>(() => {
    if (!searchQuery.trim()) return slotGameList;

    const query = searchQuery.toLowerCase().trim();
    return slotGameList.filter(
      (game) =>
        game.nameEn.toLowerCase().includes(query) || game.nameKo.toLowerCase().includes(query)
    );
  }, [slotGameList, searchQuery]);

  const platform: Platform = isMobile ? 'MOBILE' : 'WEB';

  const popupClosePollerRef = useRef<number | null>(null);
  const popupWindowRef = useRef<Window | null>(null);
  const popupWindowName = 'clientGamePopup';

  const closeGamePopup = (reason: 'logout' | 'unmount') => {
    if (popupClosePollerRef.current) {
      window.clearInterval(popupClosePollerRef.current);
      popupClosePollerRef.current = null;
    }

    // popupWindowRef에 저장된 창만 닫기 (window.open으로 빈 창 열지 않음)
    const popup = popupWindowRef.current;
    popupWindowRef.current = null;

    try {
      if (popup && !popup.closed) popup.close();
    } catch {
      // ignore
    }

    // 모바일 iframe 게임도 닫기
    if (reason === 'logout') {
      useGameFrameStore.getState().closeGame();
      void ClientBalanceEventDispatch('refreshBalance', { source: 'logout-close-popup' });
    }
  };

  useEffect(() => {
    return () => {
      closeGamePopup('unmount');
    };
  }, []);

  useEffect(() => {
    return ClientAuthAddEventListeners('logout', () => {
      closeGamePopup('logout');
    });
  }, []);

  const openGamePopup = (): Window | null => {
    if (typeof window === 'undefined') return null;

    // 가로가 잘리는 경우가 많아서 화면에 최대한 가깝게(거의 꽉 차게) 띄웁니다.
    // 너무 큰 값은 브라우저가 자동 보정하므로 min/max만 현실적으로 잡습니다.
    const width = Math.min(1600, Math.max(1100, Math.round(window.innerWidth * 0.98)));
    const height = Math.min(980, Math.max(720, Math.round(window.innerHeight * 0.94)));
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));

    // 팝업 차단을 피하려면 사용자 클릭 이벤트 내에서 즉시 window.open을 호출해야 합니다.
    const features = [
      'popup=yes',
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=yes',
      'toolbar=no',
      'menubar=no',
      'location=no',
      'status=no',
    ].join(',');

    const popup = window.open('about:blank', popupWindowName, features);
    try {
      popup?.document?.write(
        '<!doctype html><title>Loading...</title><body style="margin:0;font-family:system-ui;background:#0f0f13;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;">게임 로딩 중...</body>'
      );
      popup?.document?.close();
    } catch {
      // ignore
    }
    return popup;
  };

  const launchGame = async (name: string, game: string = '') => {
    // 모바일 브라우저는 팝업(크기/위치 제어)이 불안정하거나 새 탭으로 열리는 경우가 많아서
    // 모바일에서는 팝업 대신 현재 페이지에서 게임 URL로 이동합니다.
    const usePopup = platform === 'WEB';
    const popup = usePopup ? openGamePopup() : null;
    if (usePopup && !popup) {
      window.alert('팝업이 차단되어 게임을 열 수 없습니다. 이 사이트의 팝업을 허용해주세요.');
      return;
    }

    if (usePopup) {
      popupWindowRef.current = popup;
    }

    const ok = await ensureClientLoggedIn({ openModal: true });
    if (!ok) {
      popup?.close();
      if (popupWindowRef.current === popup) popupWindowRef.current = null;
      return;
    }

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/group/game/excute',
      method: Method.GET,
      redirect: false,
      params: {
        queryParams: {
          name,
          platform,
          game,
          method: name === 'netent' ? 'transfer' : '',
        },
      },
    });

    // 1) 프론트-백 통신 규격 레벨 체크
    // - successOrNot: 'N'이면 통신문제/인증/서버에러 등
    // - 이때는 HeaderMsg를 사용자에게 그대로 노출
    if ((res as any)?.successOrNot !== 'Y') {
      const msg = (res as any)?.HeaderMsg ?? (res as any)?.message ?? '요청에 실패했습니다.';
      window.alert(msg);
      popup?.close();
      if (popupWindowRef.current === popup) popupWindowRef.current = null;
      return;
    }

    // 백엔드 계약: res.data에 { result, url }이 항상 존재.
    // - result: 0 성공 / 1 실패
    // - 실패 시 message로 사유 전달
    const data: any = (res as any)?.data;

    if (data.result !== 0) {
      window.alert('서버 점검 중 입니다.');
      popup?.close();
      if (popupWindowRef.current === popup) popupWindowRef.current = null;
      return;
    }

    const url = data.url;

    if (typeof url !== 'string' || !url) {
      window.alert('게임 URL을 받지 못했습니다.');
      popup?.close();
      if (popupWindowRef.current === popup) popupWindowRef.current = null;
      return;
    }

    try {
      if (!usePopup) {
        // 모바일: iframe으로 열어서 WebSocket 연결 유지 + 로그아웃 시 닫기 가능
        useGameFrameStore.getState().openGame(url);
        return;
      }

      popup!.location.href = url;
      popup!.focus();

      // 팝업이 닫히는 순간을 감지해서 balance를 새로고침합니다.
      // (교차 도메인 이동 후에도 popup.closed 조회는 가능합니다)
      if (popupClosePollerRef.current) {
        window.clearInterval(popupClosePollerRef.current);
      }
      popupClosePollerRef.current = window.setInterval(() => {
        if (!popup || popup.closed) {
          if (popupClosePollerRef.current) {
            window.clearInterval(popupClosePollerRef.current);
            popupClosePollerRef.current = null;
          }
          if (popupWindowRef.current === popup) popupWindowRef.current = null;
          void ClientBalanceEventDispatch('refreshBalance', { source: 'popup-close' });
        }
      }, 600);
    } catch {
      popup?.close();
      if (popupWindowRef.current === popup) popupWindowRef.current = null;
      window.alert('팝업에서 게임을 여는 데 실패했습니다.');
    }
  };

  const desktopCardBgs = desktopBanners;
  const mobileCardBgs = mobileBanners;

  const casinoCards: Array<{
    name: string;
    sub: string;
    labelImage?: string;
    logoScale?: number;
    marginLeft?: number;
    // 개발 중 카드별로 sub 스타일을 빠르게 오버라이드할 때 사용
    subStyle?: CSSProperties;

    // 모바일 카드(3열)에서 미세 조절용
    mobileLogoScale?: number;
    mobileLogoSizePx?: number;
    mobileLogoShiftXPx?: number;
    mobileLogoShiftYPx?: number;
    mobileLogoStyle?: CSSProperties;
    mobileSubStyle?: CSSProperties;
    mobileMetaStyle?: CSSProperties;
  }> = [
    {
      name: 'pragmatic_casino',
      sub: '프라그마틱 카지노',
      labelImage: pragmatic_c,
      logoScale: 1.5,
      mobileLogoScale: 3.5,
    },
    {
      name: 'evolution',
      sub: '에볼루션 카지노',
      labelImage: evolution_c,
      logoScale: 1.5,
      marginLeft: 10,
      mobileLogoScale: 2.0,
    },
    {
      name: 'cq9_casino',
      sub: '씨큐9 카지노',
      labelImage: cq9_c,
      logoScale: 1.5,
      marginLeft: 20,
      mobileLogoScale: 2.0,
    },
    {
      name: 'SEXYBCRT',
      sub: '섹시 카지노',
      labelImage: sexy_c,
      logoScale: 1.5,
      marginLeft: 20,
      mobileLogoScale: 2.0,
    },
    {
      name: 'oriental',
      sub: '오리엔탈 카지노',
      labelImage: oriental_c,
      logoScale: 1.0,
      marginLeft: 0,
      mobileLogoScale: 2.0,
    },
    {
      name: 'dowin',
      sub: '두윈 카지노',
      labelImage: dowinn_c,
      logoScale: 1.5,
      marginLeft: 30,
      mobileLogoScale: 2.0,
    },
    {
      name: 'TOMHORN_VIVO',
      sub: '비보 카지노',
      labelImage: vivo_c,
      logoScale: 1.5,
      marginLeft: 25,
      mobileLogoScale: 2.0,
    },
    {
      name: 'AGIN',
      sub: '아시아 게이밍 카지노',
      labelImage: ag_c,
      logoScale: 1.5,
      mobileLogoScale: 2.0,
    },
    {
      name: 'dream',
      sub: '드림게임 카지노',
      labelImage: dream_c,
      logoScale: 1.5,
      marginLeft: 10,
      mobileLogoScale: 2.0,
    },
    {
      name: 'MICRO_Casino',
      sub: '마이크로소프트 게임',
      labelImage: micro_c,
      logoScale: 1.5,
      marginLeft: 15,
      mobileLogoScale: 2.0,
    },
    {
      name: 'TOMHORN_7Mojos',
      sub: '탐혼 7모조 카지노',
      labelImage: tomhornMojo_c,
      logoScale: 1.4,
      mobileLogoScale: 2.0,
    },
    {
      name: 'TOMHORN_AbsoluteLive',
      sub: '탐혼 앱솔루트 카지노',
      labelImage: tomhornAbsolute_c,
      logoScale: 1.5,
      mobileLogoScale: 2.0,
    },
    {
      name: 'sa',
      sub: '에스에이 카지노',
      labelImage: sa_c,
      logoScale: 1.5,
      marginLeft: 15,
      mobileLogoScale: 2.0,
    },
  ];

  // 슬롯 카드 목록 (gameKey: gameCodeV2.json의 키, name: API 게임 런칭용)
  const slotCards: Array<(typeof casinoCards)[number] & { gameKey?: string }> = [
    { name: 'netent', gameKey: 'netent', sub: '넷엔트', labelImage: slot_netent },
    { name: 'redtiger', gameKey: 'redtiger', sub: '레드타이거', labelImage: slot_redtiger },
    {
      name: 'pragmatic_slot',
      gameKey: 'pragmatic_slot',
      sub: '프라그마틱 슬롯',
      labelImage: slot_pragmatic,
    },
    { name: 'cq9_slot', gameKey: 'cq9', sub: 'CQ9 슬롯', labelImage: slot_cq9 },
    { name: 'booongo', gameKey: 'booongo', sub: '부옹고', labelImage: slot_booongo },
    { name: 'TOMHORN_SLOT', gameKey: 'TOMHORN_SLOT', sub: '탐혼 슬롯', labelImage: slot_tomhorn },
    { name: 'habanero', gameKey: 'habanero', sub: '하바네로', labelImage: slot_habanero },
    // { name: 'playson', sub: '플레이손', labelImage: slot_playson },
    // { name: '1x2gaming', sub: '1x2 게이밍', labelImage: slot_1x2 },
    // { name: 'belatra', sub: '벨라트라', labelImage: slot_belatra },
    // { name: 'bfgames', sub: 'BF 게임즈', labelImage: slot_bfgames },
    // { name: 'conceptgaming', sub: '컨셉 게이밍', labelImage: slot_conceptgaming },
    // { name: 'egp', sub: 'EGP 슬롯', labelImage: slot_egp },
    // { name: 'gameart', sub: '게임아트', labelImage: slot_gameart },
    // { name: 'gamefishglobal', sub: '게임피쉬 글로벌', labelImage: slot_gamefishglobal },
    // { name: 'kagaming', sub: 'KA 게이밍', labelImage: slot_kagaming },
    // { name: 'legaplay', sub: '레가플레이', labelImage: slot_legaplay },
    // { name: 'macaw', sub: '마카우', labelImage: slot_macaw },
    // { name: 'mplay', sub: '엠플레이', labelImage: slot_mplay },
    // { name: 'onetouch', sub: '원터치', labelImage: slot_onetouch },
    // { name: 'patagonia', sub: '파타고니아', labelImage: slot_patagonia },
    // { name: 'playpearls', sub: '플레이펄스', labelImage: slot_playpearls },
    // { name: 'redrake', sub: '레드레이크', labelImage: slot_redrake },
    // { name: 'vibragaming', sub: '비브라 게이밍', labelImage: slot_vibragaming },
    // { name: 'wazdan', sub: '와즈단', labelImage: slot_wazdan },
    { name: 'PLAYNGO', gameKey: 'PLAYNGO', sub: '플레이앤고', labelImage: slot_playngo },
    { name: 'MICRO_Slot', gameKey: 'MICRO_Slot', sub: '마이크로 슬롯', labelImage: slot_micro },
    { name: 'btg', gameKey: 'btg', sub: '빅타임 게이밍', labelImage: slot_btg },
    { name: 'nlc', gameKey: 'nlc', sub: '노리밋시티', labelImage: slot_nlc },
    { name: 'hacksaw', gameKey: 'hacksaw_slot', sub: '핵쏘 게이밍', labelImage: slot_hacksaw },
  ];

  const cards = tab === 'slot' ? slotCards : casinoCards;
  const isSlot = tab === 'slot';

  return (
    <Wrap aria-label="provider grid">
      {cards.length === 0 ? (
        <div
          style={{
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.10)',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: 18,
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 900,
            letterSpacing: '-0.2px',
          }}
        >
          슬롯 목록은 아직 준비 중입니다.
        </div>
      ) : isSlot ? (
        <SlotGrid>
          {slotCards.map((c) => (
            <SlotCard
              key={c.name}
              type="button"
              onClick={() => {
                // gameKey가 있으면 모달로 게임 목록 표시, 없으면 바로 게임 런칭
                if (c.gameKey) {
                  setSelectedSlotProvider(c.gameKey);
                  setSelectedSlotName(c.sub);
                } else {
                  void launchGame(c.name, '');
                }
              }}
            >
              <img className="slotImage" src={c.labelImage} alt={`${c.name} logo`} />
              <span className="slotLabel">{c.sub}</span>
            </SlotCard>
          ))}
        </SlotGrid>
      ) : (
        <Grid>
          {cards.map((c, idx) => (
            <Card
              key={c.name}
              type="button"
              $bg={
                isMobile
                  ? (mobileCardBgs[idx] ?? mobileCardBgs[0])
                  : desktopCardBgs[idx % desktopCardBgs.length]
              }
              onClick={() => void launchGame(c.name, '')}
            >
              <div className="label">
                <img
                  className="providerLabelImage"
                  src={c.labelImage}
                  alt={`${c.name} label`}
                  style={{
                    transform: `scale(${c.logoScale ?? 1})`,
                    transformOrigin: 'left center',
                  }}
                />
                <span
                  className="sub"
                  style={{
                    ...(c.marginLeft != null ? { marginLeft: c.marginLeft } : {}),
                    ...c.subStyle,
                  }}
                >
                  {c.sub}
                </span>
                <span className="srOnly">{c.name}</span>
              </div>

              <div className="labelMobile" aria-hidden="true">
                <div className="mobileMeta" style={c.mobileMetaStyle}>
                  <div className="mobileText">
                    {c.labelImage ? (
                      <img
                        className="mobileLogo"
                        src={c.labelImage}
                        alt=""
                        style={{
                          ...(c.mobileLogoSizePx != null
                            ? { width: c.mobileLogoSizePx, height: c.mobileLogoSizePx }
                            : {}),
                          ...(c.mobileLogoScale != null ||
                          c.mobileLogoShiftXPx != null ||
                          c.mobileLogoShiftYPx != null
                            ? (() => {
                                const scale = c.mobileLogoScale ?? 1;
                                const shiftX = c.mobileLogoShiftXPx ?? 0;
                                const autoShiftY = scale > 1 ? -Math.round((scale - 1) * 12) : 0;
                                const shiftY = c.mobileLogoShiftYPx ?? autoShiftY;
                                return {
                                  transform: `translate(${shiftX}px, ${shiftY}px) scale(${scale})`,
                                  transformOrigin: 'left top',
                                };
                              })()
                            : {}),
                          ...c.mobileLogoStyle,
                        }}
                      />
                    ) : null}
                    <div className="mobileSub" style={c.mobileSubStyle}>
                      {c.sub}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {/* 슬롯 게임 목록 모달 */}
      {selectedSlotProvider && (
        <ModalOverlay
          onClick={() => {
            setSelectedSlotProvider(null);
            setSearchQuery('');
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="header-top">
                <h2>{selectedSlotName} 게임 목록</h2>
                <ModalCloseBtn
                  onClick={() => {
                    setSelectedSlotProvider(null);
                    setSearchQuery('');
                  }}
                >
                  ×
                </ModalCloseBtn>
              </div>
              <SearchInput
                type="text"
                placeholder="게임 이름으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </ModalHeader>
            <ModalBody>
              {filteredGameList.length === 0 ? (
                <EmptyMessage>
                  {searchQuery.trim() ? '검색 결과가 없습니다.' : '게임 목록이 없습니다.'}
                </EmptyMessage>
              ) : (
                <GameGrid
                  $isWide={
                    selectedSlotProvider === 'netent' ||
                    selectedSlotProvider === 'redtiger' ||
                    selectedSlotProvider === 'booongo'
                  }
                >
                  {filteredGameList.map((game) => (
                    <GameCard
                      key={game.gameCode}
                      type="button"
                      $isWide={
                        selectedSlotProvider === 'netent' ||
                        selectedSlotProvider === 'redtiger' ||
                        selectedSlotProvider === 'booongo'
                      }
                      onClick={() => {
                        setSelectedSlotProvider(null);
                        void launchGame(selectedSlotProvider!, game.gameCode);
                      }}
                    >
                      <img
                        src={game.imageUrl}
                        alt={game.nameKo || game.nameEn}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23666" font-size="12">No Image</text></svg>';
                        }}
                      />
                      <span className="gameLabel">{game.nameKo || game.nameEn}</span>
                    </GameCard>
                  ))}
                </GameGrid>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrap>
  );
};

export default ClientProviderGrid;
