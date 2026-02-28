import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '@hooks/useNotify';
import { MemberTypeOptions } from '@models/common/CommonSelectCodes';
import CustomerInfoTab from './customerDetailTabs/CustomerInfoTab';
import RecentLoginTab from './customerDetailTabs/RecentLoginTab';

import BalanceHistoryTab from './customerDetailTabs/BalanceHistoryTab';
import DepositWithdrawTab from './customerDetailTabs/DepositWithdrawTab';
import GameHistoryTab from './customerDetailTabs/GameHistoryTab';

type TabDef = { label: string; icon: React.ReactElement };

const MEMBER_TYPE_LABEL_BY_VALUE = new Map(
  MemberTypeOptions.map((x) => [String(x.value).toUpperCase(), x.label] as const)
);

const getMemberTypeLabel = (value: unknown) => {
  if (value === null || value === undefined) return '';
  const key = String(value).toUpperCase();
  return MEMBER_TYPE_LABEL_BY_VALUE.get(key) ?? String(value);
};

const styles = {
  root: { width: '100%' },
  tabPanel: { py: 2 },

  infoCardPaper: (theme: Theme) => ({
    p: 2,
    borderRadius: 0,
    minHeight: 72,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.04)
        : theme.palette.background.paper,
    border: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.08)
        : alpha(theme.palette.common.black, 0.08)
    }`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 10px 24px rgba(0,0,0,0.45)'
        : '0 10px 24px rgba(0,0,0,0.10)',
    ...(theme.palette.mode === 'dark' ? { backdropFilter: 'blur(2px)' } : {}),
  }),
  infoCardLabel: (theme: Theme) => ({
    fontWeight: 600,
    color: theme.palette.text.secondary,
    letterSpacing: 0.2,
  }),
  infoCardValue: (theme: Theme) => ({
    mt: 0.5,
    fontWeight: 700,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  errorPaper: (theme: Theme) => ({
    mb: 2,
    p: 2,
    borderRadius: 0,
    border: `1px solid ${alpha(
      theme.palette.error.main,
      theme.palette.mode === 'dark' ? 0.35 : 0.25
    )}`,
    backgroundColor: alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
  }),
  errorText: (theme: Theme) => ({ color: theme.palette.error.main, fontWeight: 700 }),

  summaryPaper: (theme: Theme) => ({
    width: '100%',
    p: 2,
    borderRadius: 0,
    border: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.22)
        : alpha(theme.palette.common.black, 0.12)
    }`,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.black, 0.18)
        : alpha(theme.palette.background.paper, 0.9),
  }),
  summaryGrid: (count: number) => ({
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: `repeat(${count}, minmax(0, 1fr))`,
    },
  }),

  tabsWrapper: (theme: Theme) => ({
    mt: 2,
    borderBottom: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.14)
        : alpha(theme.palette.common.black, 0.12)
    }`,
  }),
  tabs: (theme: Theme) => ({
    minHeight: 44,
    '& .MuiTabs-indicator': {
      height: 2,
      backgroundColor: theme.palette.primary.main,
    },
  }),
  tab: (theme: Theme) => ({
    minHeight: 44,
    textTransform: 'none',
    fontWeight: 700,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  }),
};

const a11yProps = (index: number) => ({
  id: `customer-detail-tab-${index}`,
  'aria-controls': `customer-detail-tabpanel-${index}`,
});

const TabPanel = ({
  value,
  index,
  children,
}: {
  value: number;
  index: number;
  children: React.ReactNode;
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`customer-detail-tabpanel-${index}`}
      aria-labelledby={`customer-detail-tab-${index}`}
      sx={styles.tabPanel}
    >
      {value === index ? children : null}
    </Box>
  );
};

const CustomerDetail: React.FC = () => {
  const { toast } = useNotify();
  const [tabIndex, setTabIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const userKey = (location.state as any)?.userKey as string | undefined;

  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!userKey) {
      toast.error('잘못된 접근입니다. 고객 목록으로 이동합니다.');
      navigate('/customer/customerList', { replace: true });
      return;
    }

    const onSearch = async (key: string) => {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/user/detail',
        method: Method.GET,
        params: {
          queryParams: { userKey: key },
        },
        config: { isLoading: true },
      });

      if (cancelled) return;

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg);
        setDetail(null);
        return;
      }

      setDetail(res.data);
    };

    onSearch(userKey);

    return () => {
      cancelled = true;
    };
  }, [navigate, toast, userKey]);

  const formatMoney = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';

    const normalizedNumber =
      typeof value === 'number' ? value : Number(String(value).replace(/,/g, '').trim());

    if (Number.isFinite(normalizedNumber)) {
      return new Intl.NumberFormat('ko-KR').format(normalizedNumber);
    }

    return String(value);
  };

  const summary: Array<{ label: string; value: React.ReactNode }> = [
    { label: '회원 구분', value: getMemberTypeLabel(detail?.user_type ?? detail?.userType) },
    { label: '회원 ID', value: detail?.user_id },
    { label: '닉네임', value: detail?.user_nick },
    { label: '보유금액', value: formatMoney(detail?.user_money) },
    { label: '롤링금액', value: formatMoney(detail?.user_rolling_money) },
    // { label: '루징금액', value: formatMoney(detail?.user_bonus_money) },
  ];

  const tabs: TabDef[] = useMemo(
    () => [
      { label: '회원정보', icon: <AccountBoxOutlinedIcon fontSize="small" /> },
      { label: '최근 로그인 기록', icon: <LoginOutlinedIcon fontSize="small" /> },
      { label: '알 이력', icon: <PaidOutlinedIcon fontSize="small" /> },
      { label: '충/환전 이력', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
      { label: '게임 이력', icon: <SportsEsportsOutlinedIcon fontSize="small" /> },
    ],
    []
  );

  const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Paper elevation={0} sx={styles.infoCardPaper}>
      <Typography variant="caption" sx={styles.infoCardLabel}>
        {label}
      </Typography>
      <Typography variant="body1" sx={styles.infoCardValue}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={styles.root}>
      <Paper elevation={0} sx={styles.summaryPaper}>
        <Box sx={styles.summaryGrid(summary.length)}>
          {summary.map((item) => (
            <InfoCard key={String(item.label)} label={item.label} value={item.value} />
          ))}
        </Box>
      </Paper>

      <Box sx={styles.tabsWrapper}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={styles.tabs}
        >
          {tabs.map((t, idx) => (
            <Tab
              key={t.label}
              icon={t.icon}
              iconPosition="start"
              label={t.label}
              {...a11yProps(idx)}
              sx={styles.tab}
            />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <CustomerInfoTab
          detail={detail}
          onDeleted={() => {
            sessionStorage.removeItem('customerList.uiState');
            navigate('/customer/customerList', { replace: true });
          }}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <RecentLoginTab userId={detail?.user_id} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <BalanceHistoryTab userId={detail?.user_id} groupKey={detail?.group_key} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <DepositWithdrawTab userId={detail?.user_id} groupKey={detail?.group_key} />
      </TabPanel>
      <TabPanel value={tabIndex} index={4}>
        <GameHistoryTab userId={detail?.user_id} groupKey={detail?.group_key} />
      </TabPanel>
    </Box>
  );
};

export default CustomerDetail;
