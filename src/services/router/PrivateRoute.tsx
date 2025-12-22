import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/cookieStore';

// interface UserMenu {
//   menuPath: string;
//   allowed: boolean;
//   active: boolean;
// }

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const userId = useUserStore((s) => s.userId);

  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

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
