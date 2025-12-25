import React from 'react';
import { useLocation } from 'react-router-dom';

// interface UserMenu {
//   menuPath: string;
//   allowed: boolean;
//   active: boolean;
// }

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  // 쿠키(access_token)가 HttpOnly면 프론트에서 로그인 여부를 판단할 수 없습니다.
  // 실제 접근 제어는 서버(401) + API 인터셉터(/login 리다이렉트)에 위임합니다.
  // 이 컴포넌트는 라우트 구조를 유지하기 위한 패스스루로 둡니다.
  useLocation();

  // const rawMenus = sessionStorage.getItem('userMenus');
  // const userMenus: UserMenu[] = rawMenus ? JSON.parse(rawMenus) : [];

  // // 현재 접속하려는 경로(URL)가 메뉴 목록에 있는지 확인합니다.
  // const targetMenu = userMenus.find((menu) => menu.menuPath === location.pathname);

  // // 1. 메뉴 목록에 아예 존재하지 않거나,
  // // 2. 메뉴는 있지만 'allowed'가 false이거나,
  // // 3. 'active'가 false인 경우
  // // 홈('/')으로 리디렉션합니다.
  // if (!targetMenu || !targetMenu.allowed || !targetMenu.active) {
  //   // 단, 홈('/') 자체는 항상 접근 가능해야 하므로 예외 처리합니다.
  //   if (location.pathname === '/') {
  //     return children;
  //   }
  //   console.warn(`'${location.pathname}' 경로에 대한 접근 권한이 없습니다. 홈으로 리디렉션합니다.`);
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default PrivateRoute;
