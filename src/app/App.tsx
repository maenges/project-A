import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AliveScope } from 'react-activation';
// import { callApi, Method } from '@utils/ApiUtil';
// import { Service } from '@models/common/Service';
import CssBaseline from '@mui/material/CssBaseline';
// import { setLocalRefreshToken, isInvalidRefreshToken } from '@/services/auth/authUtil';

import AppLayout from '@layout/AppLayout';
import { GlobalStyles } from '@style/GlobalStyles';
import { ThemeModeProvider } from '@/contexts/ThemeContext';
// import axios from 'axios';

// import { DashboardPage } from '@/features/dashboard';
// import DashboardLoginPage from '@/features/DashboardLoginPage';
import NotifyProvider from '@/components/Provider/NotifyProvider';
import EtsLoading from '@/components/EtsCommon/EtsLoading';
import { useLoadingStore } from '@/store/loading';
import PrivateRoute from '@/services/router/PrivateRoute';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';

// New
import {
  SystemNoticePage,
  SystemAccountChangePage,
  SystemLoginRecordPage,
  SystemAnswerPage,
  SystemMessagePage,
  SystemBlockPage,
  SystemIpBlockPage,
} from '@/features/system';
import { TransAlTransferPage, TransTransferPage } from '@features/trans';
import { PartnerListPage, PartnerDetailPage } from '@/features/partner';
import {
  CustomerWaitPage,
  CustomerAccessorPage,
  CustomerListPage,
  CustomerDetailPage,
} from '@features/customer';
import { BetBetListPage, BetLosePage } from '@features/bet';
import { GameRecordDailyPage, GameRecordOriginPage } from '@/features/gameRecord';
// import { SettlementLoosingPage } from '@/features/settlement';
// import DashboardLoginPage from '@/features/DashboardLoginPage';
import LoginPage from '@/features/LoginPage';
import ClientLayout from '@layout/ClientLayout';
import { ClientHomePage } from '@/features/client';
import ClientMenuPage from '@/features/client/ClientMenuPage';

function App() {
  const { isLoading } = useLoadingStore();

  return (
    <ThemeModeProvider>
      <GlobalStyles />
      <NotifyProvider providerId="notify-root">
        <CssBaseline />
        <Router>
          <AliveScope>
            <EtsLoading open={isLoading} />
            {/* {sessionLoaded ? ( */}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientHomePage />} />
                <Route path="menu/:key" element={<ClientMenuPage />} />
                <Route path="*" element={<Navigate to="/client" replace />} />
              </Route>
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <div className="App">
                        <Routes>
                          {/* <Route path="/" element={<DashboardPage />} /> */}
                          <Route
                            path="/system/notice"
                            element={
                              <PrivateRoute>
                                <SystemNoticePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/accountChange"
                            element={
                              <PrivateRoute>
                                <SystemAccountChangePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/loginRecord"
                            element={
                              <PrivateRoute>
                                <SystemLoginRecordPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/answer"
                            element={
                              <PrivateRoute>
                                <SystemAnswerPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/message"
                            element={
                              <PrivateRoute>
                                <SystemMessagePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/block"
                            element={
                              <PrivateRoute>
                                <SystemBlockPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/system/ipBlock"
                            element={
                              <PrivateRoute>
                                <SystemIpBlockPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/trans/alTransfer"
                            element={
                              <PrivateRoute>
                                <TransAlTransferPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/trans/transfer"
                            element={
                              <PrivateRoute>
                                <TransTransferPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/partner/partnerList"
                            element={
                              <PrivateRoute>
                                <PartnerListPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/partner/partnerDetail"
                            element={
                              <PrivateRoute>
                                <PartnerDetailPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/customer/customerList"
                            element={
                              <PrivateRoute>
                                <CustomerListPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/customer/customerDetail"
                            element={
                              <PrivateRoute>
                                <CustomerDetailPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/customer/customerWait"
                            element={
                              <PrivateRoute>
                                <CustomerWaitPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/customer/accessor"
                            element={
                              <PrivateRoute>
                                <CustomerAccessorPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/bet/betList"
                            element={
                              <PrivateRoute>
                                <BetBetListPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/bet/lose"
                            element={
                              <PrivateRoute>
                                <BetLosePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/gameRecord/daily"
                            element={
                              <PrivateRoute>
                                <GameRecordDailyPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/gameRecord/origin"
                            element={
                              <PrivateRoute>
                                <GameRecordOriginPage />
                              </PrivateRoute>
                            }
                          />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                    </AppLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </AliveScope>
        </Router>
      </NotifyProvider>
    </ThemeModeProvider>
  );
}

export default App;
