import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { isNoticeRead, markNoticeRead, clearExpiredNoticeReads } from '@/store/clientBalance';

type NoticeItem = {
  notice_key: string;
  notice_title: string;
  notice_content: string;
  notice_target_type: string;
  notice_order: string;
  created: string;
};

// HTML 태그 제거 + HTML 엔티티 디코딩 유틸
const stripHtmlTags = (html: string): string => {
  const withoutTags = html.replace(/<[^>]*>/g, '');
  const textarea = document.createElement('textarea');
  textarea.innerHTML = withoutTags;
  return textarea.value.trim();
};

/* ─── Styled Components ─── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 20px;
  gap: 24px;
  overflow-y: auto;

  @media (max-width: 980px) {
    align-items: center;
    padding: 20px;
  }

  @media (min-width: 981px) {
    position: fixed;
  }
`;

// PC: 각 팝업 위치 지정 — 가로: 왼쪽~중앙 사이(25%)부터 오른쪽으로 일렬, 세로: 위~중앙 사이(30%)
const POPUP_WIDTH = 340;
const POPUP_GAP = 20;
const MAX_VISIBLE = 3; // 3개까지 정상 간격, 이후 겹침

/** 3개까지: index * (340+20) 간격, 4번째부터: 1번째 위치로 돌아가며 20px 씩 오프셋 */
const getLeftOffset = (index: number): string => {
  if (index < MAX_VISIBLE) {
    return `calc(25% + ${index * (POPUP_WIDTH + POPUP_GAP)}px)`;
  }
  // 4번째(index=3) → 1번째(index=0)와 겹침 + 작은 오프셋
  const wrapIndex = index - MAX_VISIBLE;
  return `calc(25% + ${wrapIndex * (POPUP_WIDTH + POPUP_GAP) + 30}px)`;
};

const PopupWrapper = styled.div<{ $index: number; $total: number }>`
  display: flex;
  align-items: flex-start;

  @media (min-width: 981px) {
    position: absolute;
    z-index: ${({ $index }) => 1 + $index};
    top: ${({ $index }) => `calc(20% + ${$index >= MAX_VISIBLE ? 20 : 0}px)`};
    left: ${({ $index }) => getLeftOffset($index)};
  }

  @media (max-width: 980px) {
    position: static;
    margin-top: 0;
  }
`;

const PopupContainer = styled.div`
  width: ${POPUP_WIDTH}px;
  height: 450px;
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.neutral[30]};
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 980px) {
    width: 100%;
    max-width: 400px;
    height: 400px;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.primary.main};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[30]};

  h3 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100% - 40px);
  }
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const PopupBody = styled.div`
  flex: 1;
  min-height: 0; /* flex child 스크롤 활성화 */
  overflow-y: auto;
  padding: 20px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[50]};
    border-radius: 3px;
  }

  .content {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.8;
    white-space: pre-wrap;
    letter-spacing: 0.2px;
  }
`;

const PopupFooter = styled.div`
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.background.paper};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[30]};
  display: flex;
  align-items: center;
  justify-content: space-between;

  .date {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 12px;
    font-weight: 500;
  }
`;

const ConfirmBtn = styled.button`
  height: 34px;
  padding: 0 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary.main};
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

/* ─── Component ─── */

interface AdminNoticePopupProps {
  groupType: string;
}

const AdminNoticePopup: React.FC<AdminNoticePopupProps> = ({ groupType }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [unreadNotices, setUnreadNotices] = useState<NoticeItem[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [closedNoticeKeys, setClosedNoticeKeys] = useState<Set<string>>(new Set());

  const fetchAndShowNotices = useCallback(async () => {
    // 만료된 읽음 처리 정리
    clearExpiredNoticeReads();

    try {
      // 파트너 전용: 클라이언트 공지 API 사용 (서버에서 대상 유형 필터링)
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/client/noticeList',
        method: Method.GET,
        params: {
          queryParams: { noticeTargetType: 'PARTNER' },
        },
        config: { isLoading: false },
      });

      if (res.successOrNot !== 'Y') return;

      const notices: NoticeItem[] = res.data ?? [];

      // 읽지 않은 공지만
      const unread = notices.filter((n) => !isNoticeRead(n.notice_key));

      if (unread.length > 0) {
        setUnreadNotices(unread);
        setPopupOpen(true);
      }
    } catch {
      // 조용히 무시
    }
  }, []);

  const location = useLocation();
  const initialLoaded = useRef(false);

  // 파트너만 공지 조회 (HQ는 제외) — 최초 로드
  useEffect(() => {
    if (!groupType || groupType === 'HQ') return;
    initialLoaded.current = true;
    void fetchAndShowNotices();
  }, [groupType, fetchAndShowNotices]);

  // 페이지 이동 시 만료된 공지 재확인 (팝업이 닫혀 있을 때만)
  useEffect(() => {
    if (!initialLoaded.current) return;
    if (!groupType || groupType === 'HQ') return;
    if (popupOpen) return; // 이미 팝업이 열려 있으면 스킵
    void fetchAndShowNotices();
  }, [location.pathname]);

  if (!popupOpen || unreadNotices.length === 0) return null;

  // 개별 공지 닫기 핸들러
  const handleClose = (noticeKey: string) => {
    markNoticeRead(noticeKey);
    const newClosed = new Set(closedNoticeKeys);
    newClosed.add(noticeKey);
    setClosedNoticeKeys(newClosed);

    // 모든 공지가 닫혔는지 확인
    const remainingCount = unreadNotices.filter((n) => !newClosed.has(n.notice_key)).length;
    if (remainingCount === 0) {
      setPopupOpen(false);
      setUnreadNotices([]);
      setClosedNoticeKeys(new Set());
      setCurrentNoticeIndex(0);
    }
  };

  // 모바일 공지 닫기 (순차 표시)
  const handleMobileClose = () => {
    markNoticeRead(unreadNotices[currentNoticeIndex].notice_key);
    if (currentNoticeIndex < unreadNotices.length - 1) {
      setCurrentNoticeIndex((prev) => prev + 1);
    } else {
      setPopupOpen(false);
      setUnreadNotices([]);
      setCurrentNoticeIndex(0);
    }
  };

  return (
    <Overlay>
      {/* PC: 모든 공지 동시 표시 */}
      {typeof window !== 'undefined' && window.innerWidth > 980
        ? unreadNotices.map((notice, idx) => {
            if (closedNoticeKeys.has(notice.notice_key)) return null;

            return (
              <PopupWrapper
                key={notice.notice_key}
                $index={idx}
                $total={unreadNotices.length}
                onClick={(e) => e.stopPropagation()}
              >
                <PopupContainer>
                  <PopupHeader>
                    <h3>
                      <CampaignIcon fontSize="small" />
                      {notice.notice_title}
                    </h3>
                    <CloseBtn type="button" onClick={() => handleClose(notice.notice_key)}>
                      <CloseIcon style={{ fontSize: 18 }} />
                    </CloseBtn>
                  </PopupHeader>
                  <PopupBody>
                    <div className="content">{stripHtmlTags(notice.notice_content)}</div>
                  </PopupBody>
                  <PopupFooter>
                    <div className="date">{notice.created}</div>
                    <ConfirmBtn type="button" onClick={() => handleClose(notice.notice_key)}>
                      확인
                    </ConfirmBtn>
                  </PopupFooter>
                </PopupContainer>
              </PopupWrapper>
            );
          })
        : /* 모바일: 현재 공지 하나만 가운데에 표시 */
          unreadNotices[currentNoticeIndex] && (
            <PopupContainer onClick={(e) => e.stopPropagation()}>
              <PopupHeader>
                <h3>
                  <CampaignIcon fontSize="small" />
                  {unreadNotices[currentNoticeIndex].notice_title}
                </h3>
                <CloseBtn type="button" onClick={handleMobileClose}>
                  <CloseIcon style={{ fontSize: 18 }} />
                </CloseBtn>
              </PopupHeader>
              <PopupBody>
                <div className="content">
                  {stripHtmlTags(unreadNotices[currentNoticeIndex].notice_content)}
                </div>
              </PopupBody>
              <PopupFooter>
                <div className="date">{unreadNotices[currentNoticeIndex].created}</div>
                <ConfirmBtn type="button" onClick={handleMobileClose}>
                  확인
                </ConfirmBtn>
              </PopupFooter>
            </PopupContainer>
          )}
    </Overlay>
  );
};

export default AdminNoticePopup;
