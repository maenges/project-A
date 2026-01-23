import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { StatusCode } from '@models/common/CommonResponse';
import { useNotify } from '@/hooks/useNotify';

import brandLogo from '@/assets/images/logo/brand/golden7.png';
import loginVisual from '@/assets/images/logo/login.png';

async function getPublicIp(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3000);

  try {
    const r = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { ip?: string };
    return typeof j?.ip === 'string' && j.ip.length > 0 ? j.ip : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 520;
  background: rgba(0, 0, 0, 0.66);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.18s ease;
`;

const Modal = styled.div<{ $open: boolean; $showVisual: boolean }>`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(${({ $open }) => ($open ? '0' : '10px')});
  /* 우측(입력/버튼) 영역을 줄이면서 전체 모달도 함께 축소 */
  width: ${({ $showVisual }) => ($showVisual ? 'min(92vw, 720px)' : 'min(92vw, 420px)')};
  max-height: min(86vh, 720px);
  z-index: 540;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(16, 15, 19);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  display: grid;
  /* 전체 폭(720px)을 유지하면서 우측 폼이 '뭉개지지' 않게 최소 폭을 확보 */
  grid-template-columns: ${({ $showVisual }) => ($showVisual ? '1fr 340px' : '1fr')};

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    /* 사진2(모바일 단일 패널)에서 영역이 너무 커 보이는 부분을 1/3 축소 */
    max-height: min(86vh, 480px);
  }

  @media (max-width: 520px) {
    /* 모바일에서 좌우 여백(백드롭)이 보이도록 전체 폭도 살짝 축소 */
    width: min(86vw, 520px);
  }
`;

const Left = styled.div`
  position: relative;
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(255, 205, 120, 0.14), transparent 55%),
    radial-gradient(120% 140% at 100% 100%, rgba(255, 205, 120, 0.1), transparent 60%),
    rgba(0, 0, 0, 0.28);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 55% 50%;
    display: block;
    filter: saturate(1.05) contrast(1.03);
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const Right = styled.div`
  position: relative;
  padding: 28px 20px;
  display: grid;
  align-content: start;
  gap: 14px;

  padding-top: 52px;

  @media (max-width: 520px) {
    padding: 22px 12px;
    padding-top: 48px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 14px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 6px;

  /* 헤더 로고처럼 '캔버스+스케일'로 투명 여백이 있어도 또렷하게 */
  .logoCanvas {
    --logoH: 84px;
    --logoW: 320px;
    --logoScale: 3.6;
    height: var(--logoH);
    width: min(100%, var(--logoW));
    overflow: hidden;
    position: relative;
    line-height: 0;
    transform: translateY(4px);
  }

  .logoCanvas img {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 100%;
    width: auto;
    display: block;
    transform: translate(-50%, -50%) scale(var(--logoScale));
    transform-origin: center;
    filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.55));
  }

  @media (max-width: 520px) {
    .logoCanvas {
      --logoW: 280px;
    }
  }
`;

const Field = styled.input`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  padding: 0 14px;
  font-weight: 900;
  letter-spacing: -0.2px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
    font-weight: 800;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 205, 120, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 205, 120, 0.14);
  }
`;

const Btn = styled.button<{ $tone: 'gold' | 'gray' | 'outline' }>`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  font-weight: 1000;
  letter-spacing: -0.2px;
  cursor: pointer;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'gold'
        ? 'rgba(255, 205, 120, 0.75)'
        : $tone === 'outline'
          ? 'rgba(255, 205, 120, 0.75)'
          : 'rgba(255, 255, 255, 0.14)'};
  background: ${({ $tone }) =>
    $tone === 'gold'
      ? 'rgba(255, 205, 120, 0.92)'
      : $tone === 'outline'
        ? 'transparent'
        : 'rgba(255, 255, 255, 0.10)'};
  color: ${({ $tone }) => ($tone === 'gold' ? '#141414' : 'rgba(255, 255, 255, 0.92)')};

  &:hover {
    filter: brightness(1.03);
    background: ${({ $tone }) =>
      $tone === 'gold'
        ? 'rgba(255, 205, 120, 0.98)'
        : $tone === 'outline'
          ? 'rgba(255, 205, 120, 0.08)'
          : 'rgba(255, 255, 255, 0.13)'};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.65);
    outline-offset: 2px;
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
  showVisual?: boolean;
  onLogin?: (payload: { username: string; password: string }) => void;
  onSignup?: () => void;
  onTelegram?: () => void;
};

const ClientLoginModal = ({ open, onClose, onLogin, showVisual = true }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useNotify();

  const canSubmit = useMemo(
    () => username.trim().length > 0 && password.length > 0,
    [username, password]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Prevent background scroll while modal is open.
    // NOTE: Layout shift from scrollbar is handled globally via `scrollbar-gutter: stable` (see GlobalStyles).
    const root = document.documentElement;
    const body = document.body;

    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setUsername('');
    setPassword('');
  }, [open]);

  const submit = async () => {
    if (!canSubmit) return;
    if (isSubmitting) return;

    if (onLogin) {
      onLogin({ username: username.trim(), password });
      return;
    }

    setIsSubmitting(true);
    try {
      const loginIp = await getPublicIp();

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/auth/login',
        method: Method.POST,
        params: {
          bodyParams: {
            id: username.trim(),
            password,
            loginIp,
          },
        },
      });

      if (res.successOrNot !== 'Y') {
        if (res.statusCode === StatusCode.UNKNOWN_ERROR) {
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        alert(res.HeaderMsg);
        return;
      }

      onClose();
      navigate('/client', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Backdrop $open={open} onClick={onClose} />
      <Modal
        $open={open}
        $showVisual={showVisual}
        role="dialog"
        aria-modal="true"
        aria-label="login"
      >
        {showVisual && (
          <Left>
            <img src={loginVisual} alt="" aria-hidden="true" />
          </Left>
        )}

        <Right>
          <CloseBtn type="button" aria-label="close" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </CloseBtn>

          <Logo>
            <div className="logoCanvas">
              <img src={brandLogo} alt="GOLDEN7" />
            </div>
          </Logo>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            style={{ display: 'grid', gap: 12 }}
          >
            <Field
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              autoComplete="username"
              disabled={isSubmitting}
            />
            <Field
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <Btn
              type="submit"
              $tone="gold"
              disabled={!canSubmit || isSubmitting}
              style={{ opacity: canSubmit && !isSubmitting ? 1 : 0.7 }}
            >
              로그인
            </Btn>
          </form>
        </Right>
      </Modal>
    </>
  );
};

export default ClientLoginModal;
