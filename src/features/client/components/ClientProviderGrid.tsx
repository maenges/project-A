import styled from 'styled-components';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';

import banner1 from '@/assets/images/banner/banner_1.png';
import banner2 from '@/assets/images/banner/banner_2.png';
import banner3 from '@/assets/images/banner/banner_3.png';
import banner4 from '@/assets/images/banner/banner_4.png';
import banner5 from '@/assets/images/banner/banner_5.png';
import banner6 from '@/assets/images/banner/banner_6.png';
import banner7 from '@/assets/images/banner/banner_7.png';
import banner8 from '@/assets/images/banner/banner_8.png';
import banner9 from '@/assets/images/banner/banner_9.png';
import banner10 from '@/assets/images/banner/banner_10.png';
import banner11 from '@/assets/images/banner/banner_11.png';
import banner12 from '@/assets/images/banner/banner_12.png';
import banner13 from '@/assets/images/banner/banner_13.png';

import mobileBanner1 from '@/assets/images/banner/mobile/banner_1.png';
import mobileBanner2 from '@/assets/images/banner/mobile/banner_2.png';
import mobileBanner3 from '@/assets/images/banner/mobile/banner_3.png';
import mobileBanner4 from '@/assets/images/banner/mobile/banner_4.png';
import mobileBanner5 from '@/assets/images/banner/mobile/banner_5.png';
import mobileBanner6 from '@/assets/images/banner/mobile/banner_6.png';
import mobileBanner7 from '@/assets/images/banner/mobile/banner_7.png';
import mobileBanner8 from '@/assets/images/banner/mobile/banner_8.png';
import mobileBanner9 from '@/assets/images/banner/mobile/banner_9.png';
import mobileBanner10 from '@/assets/images/banner/mobile/banner_10.png';
import mobileBanner11 from '@/assets/images/banner/mobile/banner_11.png';
import mobileBanner12 from '@/assets/images/banner/mobile/banner_12.png';
import mobileBanner13 from '@/assets/images/banner/mobile/banner_13.png';

import pragmatic_c from '@/assets/images/logo/casino/pragmatic.png';
import evolution_c from '@/assets/images/logo/casino/evolution.png';
import cq9_c from '@/assets/images/logo/casino/cq9.png';
import sexy_c from '@/assets/images/logo/casino/sexy.png';
import vota_c from '@/assets/images/logo/casino/vota.png';
import dowinn_c from '@/assets/images/logo/casino/dowinn.png';
import vivo_c from '@/assets/images/logo/casino/vivo.png';
import ag_c from '@/assets/images/logo/casino/ag.png';
import tomhornMojo_c from '@/assets/images/logo/casino/tomhorn-mojo.png';
import tomhornAbsolute_c from '@/assets/images/logo/casino/tomhron-absolute.png';
import micro_c from '@/assets/images/logo/casino/micro.png';
import dream_c from '@/assets/images/logo/casino/dream.png';
import sa_c from '@/assets/images/logo/casino/sa.png';
// import oriental_c from '@/assets/images/logo/casino/oriental.png';

import { useEffect, useState, type CSSProperties } from 'react';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { ensureClientLoggedIn } from '@/utils/clientAuthGuard';

export type ProviderTab = 'casino' | 'slot';

type Platform = 'WEB' | 'MOBILE';

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

  const platform: Platform = isMobile ? 'MOBILE' : 'WEB';

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

    const popup = window.open('about:blank', 'clientGamePopup', features);
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

  const launchGame = async (name: string) => {
    // 모바일 브라우저는 팝업(크기/위치 제어)이 불안정하거나 새 탭으로 열리는 경우가 많아서
    // 모바일에서는 팝업 대신 현재 페이지에서 게임 URL로 이동합니다.
    const usePopup = platform === 'WEB';
    const popup = usePopup ? openGamePopup() : null;
    if (usePopup && !popup) {
      window.alert('팝업이 차단되어 게임을 열 수 없습니다. 이 사이트의 팝업을 허용해주세요.');
      return;
    }

    const ok = await ensureClientLoggedIn({ openModal: true });
    if (!ok) {
      popup?.close();
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
      return;
    }

    // 백엔드 계약: res.data에 { result, url }이 항상 존재.
    // - result: 0 성공 / 1 실패
    // - 실패 시 message로 사유 전달
    const data: any = (res as any)?.data;

    if (data.result !== 0) {
      window.alert('서버 점검 중 입니다.');
      popup?.close();
      return;
    }

    const url = data.url;

    if (typeof url !== 'string' || !url) {
      window.alert('게임 URL을 받지 못했습니다.');
      popup?.close();
      return;
    }

    try {
      if (!usePopup) {
        window.location.href = url;
        return;
      }

      popup!.location.href = url;
      popup!.focus();
    } catch {
      popup?.close();
      window.alert('팝업에서 게임을 여는 데 실패했습니다.');
    }
  };

  const desktopCardBgs = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner5,
    banner6,
    banner7,
    banner8,
    banner9,
    banner10,
    banner11,
    banner12,
    banner13,
  ];

  // 현재 mobile/banner_1.png 한 장으로 먼저 모델링 (추후 mobile/banner_2~ 추가되면 배열만 늘리면 됩니다)
  const mobileCardBgs = [
    mobileBanner1,
    mobileBanner2,
    mobileBanner3,
    mobileBanner4,
    mobileBanner5,
    mobileBanner6,
    mobileBanner7,
    mobileBanner8,
    mobileBanner9,
    mobileBanner10,
    mobileBanner11,
    mobileBanner12,
    mobileBanner13,
  ];

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
      name: 'VOTA',
      sub: '보타 카지노',
      labelImage: vota_c,
      logoScale: 1.5,
      marginLeft: 25,
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

  // 슬롯은 아직 미등록 상태: 추후 slotCards를 채우면 됩니다.
  const slotCards: typeof casinoCards = [];

  const cards = tab === 'slot' ? slotCards : casinoCards;

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
              onClick={() => void launchGame(c.name)}
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
    </Wrap>
  );
};

export default ClientProviderGrid;
