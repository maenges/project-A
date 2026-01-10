import React from 'react';
import { useMemo, useState } from 'react';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

const CustomerDetail: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const summary: Array<{ label: string; value: React.ReactNode }> = [
    { label: '회원 구분', value: '고객' },
    { label: '회원 ID', value: 'star' },
    { label: '닉네임', value: '스타' },
    { label: '보유머니', value: 0 },
    { label: '롤링금', value: 0 },
  ];

  const tabs = useMemo(
    () => [
      { label: '회원정보', icon: <AccountBoxOutlinedIcon fontSize="small" /> },
      { label: '최근 로그인 기록', icon: <LoginOutlinedIcon fontSize="small" /> },
      { label: '쪽지', icon: <MailOutlineIcon fontSize="small" /> },
      { label: '보유머니변동내역', icon: <PaidOutlinedIcon fontSize="small" /> },
      { label: '게임내역', icon: <SportsEsportsOutlinedIcon fontSize="small" /> },
      { label: '정산/입출금', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
      { label: '관리이력', icon: <ManageAccountsOutlinedIcon fontSize="small" /> },
      { label: '접속/활동이력', icon: <HistoryOutlinedIcon fontSize="small" /> },
    ],
    []
  );

  const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Paper
      elevation={0}
      sx={(theme) => ({
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
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(2px)' : undefined,
      })}
    >
      <Typography
        variant="caption"
        sx={(theme) => ({
          fontWeight: 600,
          color: theme.palette.text.secondary,
          letterSpacing: 0.2,
        })}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={(theme) => ({
          mt: 0.5,
          fontWeight: 700,
          color: theme.palette.text.primary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        })}
      >
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
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
        })}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: `repeat(${summary.length}, minmax(0, 1fr))`,
            },
          }}
        >
          {summary.map((item) => (
            <InfoCard key={String(item.label)} label={item.label} value={item.value} />
          ))}
        </Box>
      </Paper>

      <Box
        sx={(theme) => ({
          mt: 2,
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.14)
              : alpha(theme.palette.common.black, 0.12)
          }`,
        })}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={(theme) => ({
            minHeight: 44,
            '& .MuiTabs-indicator': {
              height: 2,
              backgroundColor: theme.palette.primary.main,
            },
          })}
        >
          {tabs.map((t) => (
            <Tab
              key={t.label}
              icon={t.icon}
              iconPosition="start"
              label={t.label}
              sx={(theme) => ({
                minHeight: 44,
                textTransform: 'none',
                fontWeight: 700,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              })}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
          {tabs[tabIndex]?.label} 콘텐츠 영역
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerDetail;
