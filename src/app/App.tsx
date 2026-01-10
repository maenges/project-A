import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AliveScope, KeepAlive } from 'react-activation';
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
import {
  AircraftPage,
  AirportPage,
  EmissionFactorPage,
  GCDPage,
  RegulatoryScopePage,
} from '@/features/masterData';
import {
  EmissionsPage,
  FlightDetailsPage,
  HistoricalSummaryKEPage,
  HistoricalSummaryOZPage,
  StatisticsPage,
  TKPage,
} from '@/features/monitoring';
import {
  CorsiaPage,
  EuEtsPage,
  UkEtsPage,
  RefuelEuPage,
  KEtsPage,
  VerificationPage,
} from '@features/reporting';
import { FuelDataCleansingPage, FuelDetailPage } from '@features/management';
import { MenuManagementPage, LogManagementPage, CommonCodeManagementPage } from '@features/admin';
import { MrvPlan, SafUsage } from '@features/library';

import TestBobPage from '@/features/TestBobPage';
import EtsGridTestPage from '@/features/EtsGridTestPage';
import NotifyTestPage from '@/features/NotifyTestPage';
import NotifyProvider from '@/components/Provider/NotifyProvider';
import EtsLoading from '@/components/EtsCommon/EtsLoading';
import { useLoadingStore } from '@/store/loading';
import PrivateRoute from '@/services/router/PrivateRoute';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import EtsGridEditorTestPage from '@/features/EtsGridEditorTestPage';
import GridPaginationTestPage from '@/features/GridPaginationTestPage';
import EventLogManagementPage from '@/features/admin/eventLogManagement/EventLogManagementPage';
import PayloadCleansingPage from './../features/management/payloadCleansing/PayloadCleansingPage';

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
import { TransTransferPage, TransRechargePage, TransExchangePage } from '@features/trans';
import { PartnerPartnerListPage } from '@/features/partner';
import {
  CustomerWaitPage,
  CustomerAccessorPage,
  CustomerListPage,
  CustomerDetailPage,
} from '@features/customer';
import { BetBetListPage, BetLosePage } from '@features/bet';
import { GameRecordStatisticsPage } from '@/features/gameRecord';
import { SettlementLoosingPage } from '@/features/settlement';
// import DashboardLoginPage from '@/features/DashboardLoginPage';
import LoginPage from '@/features/LoginPage';

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
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <div className="App">
                        <Routes>
                          <Route path="/" />
                          <Route
                            path="/testbob"
                            element={
                              <PrivateRoute>
                                <TestBobPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/ets-grid-test"
                            element={
                              <PrivateRoute>
                                <EtsGridTestPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/pagetest"
                            element={
                              <PrivateRoute>
                                <GridPaginationTestPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/EtsGridEditorTestPage"
                            element={
                              <PrivateRoute>
                                <EtsGridEditorTestPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/notify-test"
                            element={
                              <PrivateRoute>
                                <NotifyTestPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/master-data/aircraft"
                            element={
                              <KeepAlive id="master-data-aircraft">
                                <PrivateRoute>
                                  <AircraftPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/master-data/airport"
                            element={
                              <KeepAlive id="master-data-airport">
                                <PrivateRoute>
                                  <AirportPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/master-data/gcd"
                            element={
                              <KeepAlive id="master-data-gcd">
                                <PrivateRoute>
                                  <GCDPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/master-data/emission-factor"
                            element={
                              <KeepAlive id="master-data-emission-factor">
                                <PrivateRoute>
                                  <EmissionFactorPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/master-data/regulatory-scope"
                            element={
                              <KeepAlive id="master-data-regulatory-scope">
                                <PrivateRoute>
                                  <RegulatoryScopePage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/flight-detail"
                            element={
                              <KeepAlive id="monitoring-flight-detail">
                                <PrivateRoute>
                                  <FlightDetailsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/tk"
                            element={
                              <KeepAlive id="monitoring-tk">
                                <PrivateRoute>
                                  <TKPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/emissions"
                            element={
                              <KeepAlive id="monitoring-emission">
                                <PrivateRoute>
                                  <EmissionsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/statistics"
                            element={
                              <KeepAlive id="monitoring-statistics">
                                <PrivateRoute>
                                  <StatisticsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/historical-summary-ke"
                            element={
                              <KeepAlive id="monitoring-historical-summary-ke">
                                <PrivateRoute>
                                  <HistoricalSummaryKEPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/monitoring/historical-summary-oz"
                            element={
                              <KeepAlive id="monitoring-historical-summary-oz">
                                <PrivateRoute>
                                  <HistoricalSummaryOZPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/corsia"
                            element={
                              <KeepAlive id="reporting-corsia">
                                <PrivateRoute>
                                  <CorsiaPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/refueleu"
                            element={
                              <KeepAlive id="reporting-refuel-Eu">
                                <PrivateRoute>
                                  <RefuelEuPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/eu-ets"
                            element={
                              <KeepAlive id="reporting-eu-ets">
                                <PrivateRoute>
                                  <EuEtsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/uk-ets"
                            element={
                              <KeepAlive id="reporting-uk-ets">
                                <PrivateRoute>
                                  <UkEtsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/k-ets"
                            element={
                              <KeepAlive id="reporting-k-ets">
                                <PrivateRoute>
                                  <KEtsPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/reporting-verification/verification-data"
                            element={
                              <KeepAlive id="reporting-verification-data">
                                <PrivateRoute>
                                  <VerificationPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/management/fuel-cleansing"
                            element={
                              <KeepAlive id="management-fuel-cleansing">
                                <PrivateRoute>
                                  <FuelDataCleansingPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/management/payload-cleansing"
                            element={
                              <KeepAlive id="management">
                                <PrivateRoute>
                                  <PayloadCleansingPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/management/fuel-detail"
                            element={
                              <KeepAlive id="management">
                                <PrivateRoute>
                                  <FuelDetailPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/admin/menu-management"
                            element={
                              <KeepAlive id="admin-menu-management">
                                <PrivateRoute>
                                  <MenuManagementPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/admin/event-log-management"
                            element={
                              <KeepAlive id="admin">
                                <PrivateRoute>
                                  <EventLogManagementPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/admin/log-management"
                            element={
                              <KeepAlive id="admin-log-management">
                                <PrivateRoute>
                                  <LogManagementPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/admin/common-code-management"
                            element={
                              <KeepAlive id="admin-common-code-management">
                                <PrivateRoute>
                                  <CommonCodeManagementPage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/library/mrv-plan"
                            element={
                              <KeepAlive id="library-mrv-plan">
                                <PrivateRoute>
                                  <MrvPlan />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
                          <Route
                            path="/library/saf-usage"
                            element={
                              <KeepAlive id="library-saf-usage">
                                <PrivateRoute>
                                  <SafUsage />
                                </PrivateRoute>
                              </KeepAlive>
                            }
                          />
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
                            path="/trans/transfer"
                            element={
                              <PrivateRoute>
                                <TransTransferPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/trans/recharge"
                            element={
                              <PrivateRoute>
                                <TransRechargePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/trans/exchange"
                            element={
                              <PrivateRoute>
                                <TransExchangePage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/partner/partnerList"
                            element={
                              <PrivateRoute>
                                <PartnerPartnerListPage />
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
                            path="/gameRecord/statistics"
                            element={
                              <PrivateRoute>
                                <GameRecordStatisticsPage />
                              </PrivateRoute>
                            }
                          />
                          <Route
                            path="/settlement/loosing"
                            element={
                              <PrivateRoute>
                                <SettlementLoosingPage />
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
