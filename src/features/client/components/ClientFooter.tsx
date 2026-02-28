import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CLIENT_MAX_WIDTH, CLIENT_SIDE_PADDING } from './clientStyleTokens';
import brandLogo from '@/assets/images/logo/brand/golden9.png';

const FooterBar = styled.footer`
  margin-top: 34px;
  padding: 22px 0 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at 20% 0%, rgba(255, 205, 120, 0.12), transparent 55%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.45));
  backdrop-filter: blur(10px);

  /* 모바일에선 하단 고정 네비가 있으므로 footer는 숨김 */
  @media (max-width: 980px) {
    display: none;
  }
`;

const Inner = styled.div`
  max-width: ${CLIENT_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 ${CLIENT_SIDE_PADDING};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const Brand = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  text-align: left;

  img {
    height: clamp(56px, 6vw, 88px);
    width: auto;
    display: block;
    filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.55));
  }

  .text {
    display: grid;
    gap: 2px;
  }

  .title {
    font-weight: 1100;
    letter-spacing: -0.6px;
    color: rgba(255, 255, 255, 0.92);
    line-height: 1.1;
    font-size: 20px;
  }

  .sub {
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.2px;
    color: rgba(255, 255, 255, 0.62);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 205, 120, 0.55);
    outline-offset: 4px;
    border-radius: 12px;
  }
`;

// const Links = styled.div`
//   display: inline-flex;
//   align-items: center;
//   gap: 10px;
//   color: rgba(255, 255, 255, 0.6);
//   font-weight: 900;
//   font-size: 12px;

//   button {
//     border: 1px solid rgba(255, 255, 255, 0.12);
//     background: rgba(255, 255, 255, 0.04);
//     color: rgba(255, 255, 255, 0.82);
//     border-radius: 999px;
//     padding: 8px 10px;
//     cursor: pointer;

//     &:hover {
//       border-color: rgba(255, 205, 120, 0.28);
//       background: rgba(255, 205, 120, 0.08);
//     }
//   }

//   @media (max-width: 720px) {
//     justify-content: center;
//   }
// `;

const Copy = styled.div`
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.58);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.1px;
`;

const ClientFooter = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <FooterBar aria-label="site footer">
      <Inner>
        <Brand type="button" aria-label="go home" onClick={() => navigate('/client')}>
          <img src={brandLogo} alt="GOLDEN" />
          <div className="text">
            <div className="title">GOLDEN</div>
            <div className="sub">CASINO &amp; SLOT</div>
          </div>
        </Brand>
      </Inner>

      <Inner>
        <Copy>Copyright © {year} GOLDEN. All rights reserved.</Copy>
      </Inner>
    </FooterBar>
  );
};

export default ClientFooter;
