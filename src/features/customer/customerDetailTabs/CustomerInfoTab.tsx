import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, MenuItem, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountKeyOptions, rollingFee } from '@/models/common/CommonSelectCodes';
import { useNotify } from '@/hooks/useNotify';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { useGroupTypeStore } from '@/store/groupType';

type CustomerInfoTabProps = {
  detail?: any | null;
  onDeleted?: () => void;
};

type SettingsSectionTone = 'primary' | 'danger';

type PercentOptionsArgs = {
  max: number; // 예: 2.0
  step: number; // 예: 0.5
  current?: number; // 예: 1.5 (현재 값이 리스트에 없으면 포함)
};

const selectMenuProps = { disableScrollLock: true } as const;

// 항상 소수점 1자리 고정 표기 (요구사항: 1 -> 1.0%)
const formatPct = (n: number) => `${n.toFixed(2)}%`;

// max를 기준으로 step씩 끊어서 0 ~ max 리스트 생성
// current가 스텝과 다르게 들어와도(예: 1.7) 옵션에 포함시켜 select value mismatch 방지
const buildPercentOptions = ({ max, step, current }: PercentOptionsArgs) => {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 0.5;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const safeCurrent =
    typeof current === 'number' && Number.isFinite(current) && current >= 0 ? current : undefined;

  // max가 0/누락이어도 current 값(예: 4.55)은 select mismatch 방지를 위해 포함
  const effectiveMax = safeCurrent != null ? Math.max(safeMax, safeCurrent) : safeMax;

  const getDecimals = (n: number) => {
    if (!Number.isFinite(n)) return 0;
    const s = n.toString();

    const eIndex = s.toLowerCase().indexOf('e-');
    if (eIndex >= 0) {
      const exponent = Number(s.slice(eIndex + 2));
      const base = s.slice(0, eIndex);
      const dot = base.indexOf('.');
      const baseDecimals = dot >= 0 ? base.length - dot - 1 : 0;
      return Math.min(6, exponent + baseDecimals);
    }

    const dotIndex = s.indexOf('.');
    if (dotIndex < 0) return 0;
    return Math.min(6, s.length - dotIndex - 1);
  };

  const decimals = Math.min(
    6,
    Math.max(getDecimals(safeStep), getDecimals(effectiveMax), getDecimals(safeCurrent ?? 0))
  );
  const scale = 10 ** decimals;

  const stepInt = Math.round(safeStep * scale);
  const maxInt = Math.round(effectiveMax * scale);
  if (stepInt <= 0 || maxInt <= 0) return [0];

  const valueInts = new Set<number>();
  for (let vInt = 0; vInt <= maxInt; vInt += stepInt) {
    valueInts.add(vInt);
  }
  valueInts.add(maxInt);

  if (safeCurrent != null) {
    valueInts.add(Math.round(safeCurrent * scale));
  }

  return Array.from(valueInts)
    .filter((vInt) => vInt >= 0 && vInt <= maxInt)
    .sort((a, b) => a - b)
    .map((vInt) => vInt / scale);
};

const parsePctInput = (v: unknown) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v.replace('%', '').trim());
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

const toFiniteNumber = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toBoolean = (v: unknown) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const s = v.trim().toUpperCase();
    if (s === 'Y' || s === 'TRUE' || s === '1') return true;
    if (s === 'N' || s === 'FALSE' || s === '0' || s === '') return false;
  }
  return Boolean(v);
};

// 라이트 모드에서 contained 버튼 톤이 너무 강하지 않게(스크린샷처럼 연한 느낌)
// 다크 모드는 기존처럼 선명하게 유지
const lightContainedButtonSx = (theme: any) => {
  const isDark = theme.palette.mode === 'dark';

  // 다크 모드에서도 라이트처럼 '연한 tint' 버튼을 기본으로 사용
  // (예외: error/warning 버튼 = 비밀번호 2버튼은 개별 sx로 관리)
  return {
    // 기본 contained(주로 primary) 버튼만 톤다운
    '&.MuiButton-contained:not(.MuiButton-containedError):not(.MuiButton-containedWarning):not(.MuiButton-containedInfo)':
      {
        boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, isDark ? 0.28 : 0.14)}`,
        backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.22 : 0.1),
        color: isDark ? 'rgba(255,255,255,0.92)' : alpha(theme.palette.primary.main, 0.9),
        '&:hover': {
          boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, isDark ? 0.36 : 0.2)}`,
          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.3 : 0.16),
        },
      },
    // info(저장 버튼 등)도 다크에서 너무 튀지 않게 tint 처리
    '&.MuiButton-containedInfo': {
      boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.info.main, isDark ? 0.28 : 0.16)}`,
      backgroundColor: alpha(theme.palette.info.main, isDark ? 0.22 : 0.12),
      color: isDark ? 'rgba(255,255,255,0.92)' : alpha(theme.palette.info.main, 0.95),
      '&:hover': {
        boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.info.main, isDark ? 0.36 : 0.22)}`,
        backgroundColor: alpha(theme.palette.info.main, isDark ? 0.3 : 0.18),
      },
    },
  };
};

// 공통 아웃라인 스타일을 모아둠 (TextField 재사용)
const outlinedSx = (theme: any) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.55)
        : theme.palette.divider,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.75)
        : alpha(theme.palette.primary.main, 0.25),
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  // Select의 드롭다운 아이콘(오른쪽 화살표) 가시성 개선
  '& .MuiSelect-icon': {
    color:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.85)
        : alpha(theme.palette.text.primary, 0.6),
  },
  '& .MuiOutlinedInput-root:hover .MuiSelect-icon': {
    color:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.95)
        : alpha(theme.palette.text.primary, 0.78),
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiSelect-icon': {
    color: theme.palette.primary.main,
  },
});

// Select 드롭다운 항목 hover/selected 대비(특히 라이트 모드) 강화
const menuItemSx = (theme: any) => ({
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.2)
        : alpha(theme.palette.primary.main, 0.12),
  },
  '&.Mui-selected': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.4)
        : alpha(theme.palette.primary.main, 0.22),
    fontWeight: 800,
    ...(theme.palette.mode === 'dark' ? { color: 'rgba(255,255,255,0.96)' } : {}),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      backgroundColor: theme.palette.primary.main,
      opacity: theme.palette.mode === 'dark' ? 0.9 : 0.6,
    },
  },
  '&.Mui-selected:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.46)
        : alpha(theme.palette.primary.main, 0.28),
  },
});

const styles = {
  formGrid: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
    },
    alignItems: 'start',
  },
  sectionPaper: (theme: any) => ({
    borderRadius: 0,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.black, 0.22)
        : alpha(theme.palette.background.paper, 0.95),
  }),
  sectionHeader: (tone: SettingsSectionTone) => (theme: any) => {
    const base = tone === 'danger' ? theme.palette.error : theme.palette.primary;

    return {
      px: 2,
      py: 1.5,
      backgroundColor:
        theme.palette.mode === 'dark' ? alpha(base.main, 0.55) : alpha(base.main, 0.08),
      borderBottom: `1px solid ${
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.common.white, 0.12)
          : alpha(base.main, 0.12)
      }`,
    };
  },
  sectionTitle: (theme: any) => ({
    fontWeight: 800,
    color:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.96)'
        : alpha(theme.palette.text.primary, 0.92),
  }),
  sectionBody: { p: 2 },
  sectionActions: (theme: any) => ({
    px: 2,
    pb: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1,
    borderTop: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.1)
        : alpha(theme.palette.common.black, 0.1)
    }`,
    pt: 2,
    '& .MuiButton-root': lightContainedButtonSx(theme),
  }),
  switchRowBox: (theme: any) => ({
    minHeight: 54,
    px: 1,
    borderRadius: 1,
    border: `1px solid ${theme.palette.divider}`,
  }),
  switchRowBoxWrap: (theme: any) => ({
    ...styles.switchRowBox(theme),
    flexWrap: 'wrap',
    gap: 1,
  }),
  switchScale: { transform: 'scale(1.2)' },
  switchLabel: (theme: any) => ({ color: theme.palette.text.primary, fontWeight: 700 }),
  outlinedField: (theme: any) => outlinedSx(theme),
  menuItem: (theme: any) => menuItemSx(theme),
  sectionDivider: (theme: any) => ({
    pt: 1,
    borderTop: `1px solid ${
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.1)
        : alpha(theme.palette.common.black, 0.1)
    }`,
  }),
  passwordForceResetButton: (theme: any) =>
    theme.palette.mode === 'dark'
      ? {}
      : {
          backgroundColor: alpha(theme.palette.error.main, 0.14),
          color: alpha(theme.palette.error.main, 0.95),
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.2),
            boxShadow: 'none',
          },
        },
  passwordChangeButton: (theme: any) => ({
    ...(theme.palette.mode === 'dark'
      ? {
          backgroundColor: '#F1C40F',
          '&:hover': { backgroundColor: '#D4AC0D' },
        }
      : {
          backgroundColor: alpha('#F1C40F', 0.18),
          color: alpha('#6E5500', 0.92),
          '&:hover': { backgroundColor: alpha('#F1C40F', 0.26) },
        }),
  }),
} as const;

const SettingsSection = ({
  title,
  tone = 'primary',
  children,
  actions,
}: {
  title: string;
  tone?: SettingsSectionTone;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <Paper elevation={0} sx={styles.sectionPaper}>
      <Box sx={styles.sectionHeader(tone)}>
        <Typography sx={styles.sectionTitle}>{title}</Typography>
      </Box>
      <Box sx={styles.sectionBody}>{children}</Box>
      {actions ? <Box sx={styles.sectionActions}>{actions}</Box> : null}
    </Paper>
  );
};

type CustomerInfoFormState = {
  blocked: boolean;
  blockMessage: string;

  grantEgg: boolean;
  revokeEgg: boolean;

  adminPw: string;
  adminPwConfirm: string;

  rollingSlotPct: number;
  rollingCasinoPct: number;

  rollingSlotMaxPct: number;
  rollingCasinoMaxPct: number;

  losingSlotPct: number;
  losingCasinoPct: number;

  losingSlotMaxPct: number;
  losingCasinoMaxPct: number;

  rollingFee: number;

  phone: string;
  bankName: string;
  account: string;
  depositor: string;
};

const defaultFormState: CustomerInfoFormState = {
  blocked: false,
  blockMessage: '',
  grantEgg: false,
  revokeEgg: false,
  adminPw: '',
  adminPwConfirm: '',
  rollingSlotPct: 0,
  rollingCasinoPct: 0,
  rollingSlotMaxPct: 0,
  rollingCasinoMaxPct: 0,
  losingSlotPct: 0,
  losingCasinoPct: 0,
  losingSlotMaxPct: 0,
  losingCasinoMaxPct: 0,
  rollingFee: 0,
  phone: '',
  bankName: '',
  account: '',
  depositor: '',
};

const BlockSettings = ({
  userKey,
  blocked,
  message,
  onChangeBlocked,
  onChangeMessage,
}: {
  userKey?: string;
  blocked: boolean;
  message: string;
  onChangeBlocked: (next: boolean) => void;
  onChangeMessage: (next: string) => void;
}) => {
  const { toast, confirm } = useNotify();

  const onSaveBlock = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 차단 설정을 저장할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/block',
      method: blocked ? Method.POST : Method.DELETE,
      params: {
        bodyParams: blocked
          ? {
              user_key: userKey,
              block_type: 'USER_BLOCK',
              block_message: message,
            }
          : {
              user_key: userKey,
            },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success(blocked ? '차단이 등록되었습니다.' : '차단이 해제되었습니다.');
  };

  return (
    <SettingsSection
      title="차단 관리"
      tone="danger"
      actions={
        <>
          <Button variant="contained" color="primary" disableElevation onClick={onSaveBlock}>
            저장
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={styles.switchRowBox}>
          <Switch
            checked={blocked}
            onChange={(e) => onChangeBlocked(e.target.checked)}
            sx={styles.switchScale}
          />
          <Typography sx={styles.switchLabel}>차단상태</Typography>
        </Stack>
        <TextField
          name="blockMessage"
          id="customer-block-message"
          autoComplete="off"
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder="차단메세지"
          fullWidth
          sx={styles.outlinedField}
        />
      </Stack>
    </SettingsSection>
  );
};

const AccountDeleteSettings = ({
  userKey,
  onDeleted,
}: {
  userKey?: string;
  onDeleted?: () => void;
}) => {
  const { toast, confirm } = useNotify();

  const onDeleteAccount = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 계정을 삭제할 수 없습니다.');
      return;
    }

    const ok = await confirm(
      '정말로 이 계정을 삭제하시겠습니까?\n삭제된 계정은 복구할 수 없습니다.'
    );
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user',
      method: Method.DELETE,
      params: {
        bodyParams: {
          user_key: userKey,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('계정이 삭제되었습니다.');
    onDeleted?.();
  };

  return (
    <SettingsSection
      title="계정 삭제"
      tone="danger"
      actions={
        <>
          <Button variant="contained" color="error" disableElevation onClick={onDeleteAccount}>
            계정 삭제
          </Button>
        </>
      }
    >
      <Box sx={{ minHeight: 54, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
          계정을 삭제하면 복구할 수 없습니다.
        </Typography>
      </Box>
    </SettingsSection>
  );
};

const EggPermissionSettings = ({
  userKey,
  grantEgg,
  revokeEgg,
  onChangeGrantEgg,
  onChangeRevokeEgg,
}: {
  userKey?: string;
  grantEgg: boolean;
  revokeEgg: boolean;
  onChangeGrantEgg: (next: boolean) => void;
  onChangeRevokeEgg: (next: boolean) => void;
}) => {
  const { toast, confirm } = useNotify();

  const onSaveEggPermission = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 알권한을 변경할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user/permission',
      method: Method.PATCH,
      params: {
        bodyParams: {
          user_key: userKey,
          user_grant: grantEgg,
          user_return: revokeEgg,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('알권한이 변경되었습니다.');
  };

  return (
    <SettingsSection
      title="알권한"
      actions={
        <>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={onSaveEggPermission}
          >
            저장
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" sx={styles.switchRowBoxWrap}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Switch
              checked={grantEgg}
              onChange={(e) => onChangeGrantEgg(e.target.checked)}
              sx={styles.switchScale}
            />
            <Typography sx={styles.switchLabel}>알지급</Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Switch
              checked={revokeEgg}
              onChange={(e) => onChangeRevokeEgg(e.target.checked)}
              sx={styles.switchScale}
            />
            <Typography sx={styles.switchLabel}>알회수</Typography>
          </Stack>
        </Stack>
      </Stack>
    </SettingsSection>
  );
};

const PasswordSettings = ({
  userKey,
  pw,
  pw2,
  onChangePw,
  onChangePw2,
}: {
  userKey?: string;
  pw: string;
  pw2: string;
  onChangePw: (next: string) => void;
  onChangePw2: (next: string) => void;
}) => {
  const { toast, confirm } = useNotify();

  const onForceChangePassword = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 비밀번호를 변경할 수 없습니다.');
      return;
    }

    if (!pw?.trim()) {
      toast.info('변경할 비밀번호를 입력해주세요.');
      return;
    }

    if (pw !== pw2) {
      toast.info('비밀번호가 일치하지 않습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user/changePassword',
      method: Method.POST,
      params: {
        bodyParams: {
          userKey,
          newPassword: pw,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('비밀번호가 변경되었습니다.');
  };

  const onResetPassword = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 비밀번호를 초기화할 수 없습니다.');
      return;
    }

    const ok = await confirm('비밀번호를 초기화하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user/changePassword',
      method: Method.POST,
      params: {
        bodyParams: {
          userKey,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    onChangePw('');
    onChangePw2('');
    toast.success('비밀번호가 초기화되었습니다.');
  };

  return (
    <SettingsSection
      title="비밀번호 설정"
      actions={
        <>
          <Button
            variant="contained"
            color="error"
            disableElevation
            sx={styles.passwordForceResetButton}
            onClick={onForceChangePassword}
          >
            비밀번호 강제 변경
          </Button>
          <Button
            variant="contained"
            color="warning"
            disableElevation
            sx={styles.passwordChangeButton}
            onClick={onResetPassword}
          >
            비밀번호 초기화
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          name="adminNewPassword"
          id="customer-admin-new-password"
          autoComplete="off"
          value={pw}
          onChange={(e) => onChangePw(e.target.value)}
          placeholder="변경할 비밀번호"
          fullWidth
          inputProps={{ style: { WebkitTextSecurity: 'disc' } as React.CSSProperties }}
          sx={styles.outlinedField}
        />
        <TextField
          name="adminNewPasswordConfirm"
          id="customer-admin-new-password-confirm"
          autoComplete="off"
          value={pw2}
          onChange={(e) => onChangePw2(e.target.value)}
          placeholder="비밀번호확인"
          fullWidth
          inputProps={{ style: { WebkitTextSecurity: 'disc' } as React.CSSProperties }}
          sx={styles.outlinedField}
        />
      </Stack>
    </SettingsSection>
  );
};

const PersonalInfoSettings = ({
  userKey,
  phone,
  bankName,
  account,
  depositor,
  onChangePhone,
  onChangeBankName,
  onChangeAccount,
  onChangeDepositor,
}: {
  userKey?: string;
  phone: string;
  bankName: string;
  account: string;
  depositor: string;
  onChangePhone: (next: string) => void;
  onChangeBankName: (next: string) => void;
  onChangeAccount: (next: string) => void;
  onChangeDepositor: (next: string) => void;
}) => {
  const { toast, confirm } = useNotify();

  const onSavePersonalInfo = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 개인정보를 변경할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/account-record',
      method: Method.POST,
      params: {
        bodyParams: {
          user_key: userKey,
          user_phone: phone,
          user_bank_key: bankName,
          user_bank_won: depositor,
          user_bank_account: account,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('개인정보가 변경되었습니다.');
  };

  return (
    <SettingsSection
      title="개인 정보 설정"
      actions={
        <>
          <Button variant="contained" color="primary" disableElevation onClick={onSavePersonalInfo}>
            개인정보 변경
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          name="customerPhone"
          id="customer-phone"
          autoComplete="off"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          label="전화번호"
          fullWidth
          sx={styles.outlinedField}
        />

        <Box sx={styles.sectionDivider} />

        <TextField
          select
          name="customerBankName"
          id="customer-bank-name"
          autoComplete="off"
          value={bankName}
          onChange={(e) => onChangeBankName(e.target.value)}
          label="은행명"
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          <MenuItem value="" sx={styles.menuItem}>
            선택안함
          </MenuItem>
          {AccountKeyOptions.filter((o) => o.value !== 'ALL').map((o) => (
            <MenuItem key={o.value} value={o.value} sx={styles.menuItem}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="customerBankAccountNo"
          id="customer-bank-account-no"
          autoComplete="off"
          value={account}
          onChange={(e) => onChangeAccount(e.target.value)}
          label="계좌번호"
          fullWidth
          sx={styles.outlinedField}
        />
        <TextField
          name="customerBankDepositor"
          id="customer-bank-depositor"
          autoComplete="off"
          value={depositor}
          onChange={(e) => onChangeDepositor(e.target.value)}
          label="예금주"
          fullWidth
          sx={styles.outlinedField}
        />
      </Stack>
    </SettingsSection>
  );
};

const RollingSettings = ({
  userKey,
  slot,
  casino,
  slotMaxPct,
  casinoMaxPct,
  onChangeSlot,
  onChangeCasino,
}: {
  userKey?: string;
  slot: number;
  casino: number;
  slotMaxPct: number;
  casinoMaxPct: number;
  onChangeSlot: (next: number) => void;
  onChangeCasino: (next: number) => void;
}) => {
  const { toast, confirm } = useNotify();

  // 예시: max=2.0 기준 0.5 단위
  const slotOptions = useMemo(
    () => buildPercentOptions({ max: slotMaxPct, step: 0.05, current: slot }),
    [slot, slotMaxPct]
  );

  const casinoOptions = useMemo(
    () => buildPercentOptions({ max: casinoMaxPct, step: 0.05, current: casino }),
    [casino, casinoMaxPct]
  );

  const onSaveRollingPct = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 롤링을 변경할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user',
      method: Method.PATCH,
      params: {
        bodyParams: {
          user_key: userKey,
          user_rolling_s: slot,
          user_rolling_c: casino,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('롤링 설정이 변경되었습니다.');
  };

  return (
    <SettingsSection
      title="롤링 설정"
      actions={
        <>
          <Button variant="contained" color="primary" disableElevation onClick={onSaveRollingPct}>
            롤링 변경
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          select
          name="rollingSlotPct"
          id="customer-rolling-slot-pct"
          autoComplete="off"
          value={slot}
          onChange={(e) => onChangeSlot(parsePctInput(e.target.value))}
          label={`롤링 % (슬롯) 최대 -${Number(slotMaxPct).toFixed(2)}%`}
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          {slotOptions.map((v) => (
            <MenuItem key={String(v)} value={v} sx={styles.menuItem}>
              {formatPct(v)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="rollingCasinoPct"
          id="customer-rolling-casino-pct"
          autoComplete="off"
          value={casino}
          onChange={(e) => onChangeCasino(parsePctInput(e.target.value))}
          label={`롤링 % (카지노) 최대 -${Number(casinoMaxPct).toFixed(2)}%`}
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          {casinoOptions.map((v) => (
            <MenuItem key={String(v)} value={v} sx={styles.menuItem}>
              {formatPct(v)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </SettingsSection>
  );
};

const LosingSettings = ({
  userKey,
  slot,
  casino,
  slotMaxPct,
  casinoMaxPct,
  onChangeSlot,
  onChangeCasino,
}: {
  userKey?: string;
  slot: number;
  casino: number;
  slotMaxPct: number;
  casinoMaxPct: number;
  onChangeSlot: (next: number) => void;
  onChangeCasino: (next: number) => void;
}) => {
  const { toast, confirm } = useNotify();

  const slotOptions = useMemo(
    () => buildPercentOptions({ max: slotMaxPct, step: 0.05, current: slot }),
    [slot, slotMaxPct]
  );

  const casinoOptions = useMemo(
    () => buildPercentOptions({ max: casinoMaxPct, step: 0.05, current: casino }),
    [casino, casinoMaxPct]
  );

  const onSaveLosingPct = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 루징을 변경할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user',
      method: Method.PATCH,
      params: {
        bodyParams: {
          user_key: userKey,
          user_bonus_s: slot,
          user_bonus_c: casino,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('루징 설정이 변경되었습니다.');
  };

  return (
    <SettingsSection
      title="루징 설정"
      actions={
        <>
          <Button variant="contained" color="primary" disableElevation onClick={onSaveLosingPct}>
            루징 변경
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextField
          select
          name="losingSlotPct"
          id="customer-losing-slot-pct"
          autoComplete="off"
          value={slot}
          onChange={(e) => onChangeSlot(parsePctInput(e.target.value))}
          label={`루징 % (슬롯) 최대 -${Number(slotMaxPct).toFixed(2)}%`}
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          {slotOptions.map((v) => (
            <MenuItem key={String(v)} value={v} sx={styles.menuItem}>
              {formatPct(v)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name="losingCasinoPct"
          id="customer-losing-casino-pct"
          autoComplete="off"
          value={casino}
          onChange={(e) => onChangeCasino(parsePctInput(e.target.value))}
          label={`루징 % (카지노) 최대 -${Number(casinoMaxPct).toFixed(2)}%`}
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          {casinoOptions.map((v) => (
            <MenuItem key={String(v)} value={v} sx={styles.menuItem}>
              {formatPct(v)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </SettingsSection>
  );
};

const RollingFeeSettings = ({
  userKey,
  value,
  onChange,
}: {
  userKey?: string;
  value: number;
  onChange: (next: number) => void;
}) => {
  const { toast, confirm } = useNotify();

  const onSaveRollingFee = async () => {
    if (!userKey) {
      toast.error('회원 키(userKey)가 없어 롤링 수수료를 변경할 수 없습니다.');
      return;
    }

    const ok = await confirm('저장하시겠습니까?');
    if (!ok) return;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/user',
      method: Method.PATCH,
      params: {
        bodyParams: {
          user_key: userKey,
          user_rolling_fee: value,
        },
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }

    toast.success('롤링 수수료 설정이 변경되었습니다.');
  };

  return (
    <SettingsSection
      title="롤링 수수료 설정"
      actions={
        <>
          <Button variant="contained" color="primary" disableElevation onClick={onSaveRollingFee}>
            롤링 수수료 변경
          </Button>
        </>
      }
    >
      <Box sx={{ minHeight: 54, display: 'flex', alignItems: 'center' }}>
        <TextField
          select
          name="rollingFee"
          id="customer-rolling-fee"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          label="롤링 수수료 %"
          fullWidth
          SelectProps={{ MenuProps: selectMenuProps }}
          sx={styles.outlinedField}
        >
          {rollingFee.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={styles.menuItem}>
              {opt.label}%
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </SettingsSection>
  );
};

const CustomerInfoTab = ({ detail, onDeleted }: CustomerInfoTabProps) => {
  const [form, setForm] = useState<CustomerInfoFormState>(defaultFormState);

  useEffect(() => {
    if (!detail) return;

    const nextBlocked = toBoolean(detail?.blockStatus);
    const nextBlockMessage = (detail?.blockMessage ?? '') as string;
    const rollingSlotPct = toFiniteNumber(detail?.user_rolling_s, 0);
    const rollingCasinoPct = toFiniteNumber(detail?.user_rolling_c, 0);
    const losingSlotPct = toFiniteNumber(detail?.user_bonus_s, 0);
    const losingCasinoPct = toFiniteNumber(detail?.user_bonus_c, 0);
    const rollingSlotMaxPct = toFiniteNumber(detail?.user_max_rolling_s, 0);
    const rollingCasinoMaxPct = toFiniteNumber(detail?.user_max_rolling_c, 0);
    const losingSlotMaxPct = toFiniteNumber(detail?.user_max_bonus_s, 0);
    const losingCasinoMaxPct = toFiniteNumber(detail?.user_max_bonus_c, 0);
    const rollingFeeValue = toFiniteNumber(detail?.user_rolling_fee, 0);
    const nextGrantEgg = toBoolean(detail?.user_grant);
    const nextRevokeEgg = toBoolean(detail?.user_return);
    const nextPhone = (detail?.user_phone ?? '') as string;
    const nextBankName = (detail?.user_bank_key ?? '') as string;
    const nextAccount = (detail?.user_bank_account ?? '') as string;
    const nextDepositor = (detail?.user_bank_won ?? '') as string;

    setForm((prev) => ({
      ...prev,
      blocked: nextBlocked,
      blockMessage: nextBlockMessage,
      rollingSlotPct,
      rollingCasinoPct,
      rollingSlotMaxPct,
      rollingCasinoMaxPct,
      losingSlotPct,
      losingCasinoPct,
      losingSlotMaxPct,
      losingCasinoMaxPct,
      rollingFee: rollingFeeValue,
      grantEgg: nextGrantEgg,
      revokeEgg: nextRevokeEgg,
      phone: nextPhone,
      bankName: nextBankName,
      account: nextAccount,
      depositor: nextDepositor,
    }));
  }, [detail]);

  return (
    <Box component="form" autoComplete="off" sx={styles.formGrid}>
      {/* 왼쪽 컬럼 */}
      <Stack spacing={2}>
        <BlockSettings
          userKey={detail?.user_key}
          blocked={form.blocked}
          message={form.blockMessage}
          onChangeBlocked={(next) => setForm((p) => ({ ...p, blocked: next }))}
          onChangeMessage={(next) => setForm((p) => ({ ...p, blockMessage: next }))}
        />
        <RollingSettings
          userKey={detail?.user_key}
          slot={form.rollingSlotPct}
          casino={form.rollingCasinoPct}
          slotMaxPct={form.rollingSlotMaxPct}
          casinoMaxPct={form.rollingCasinoMaxPct}
          onChangeSlot={(next) => setForm((p) => ({ ...p, rollingSlotPct: next }))}
          onChangeCasino={(next) => setForm((p) => ({ ...p, rollingCasinoPct: next }))}
        />
        {useGroupTypeStore.getState().groupType === 'HQ' && (
          <EggPermissionSettings
            userKey={detail?.user_key}
            grantEgg={form.grantEgg}
            revokeEgg={form.revokeEgg}
            onChangeGrantEgg={(next) => setForm((p) => ({ ...p, grantEgg: next }))}
            onChangeRevokeEgg={(next) => setForm((p) => ({ ...p, revokeEgg: next }))}
          />
        )}
        {useGroupTypeStore.getState().groupType === 'HQ' && (
          <AccountDeleteSettings userKey={detail?.user_key} onDeleted={onDeleted} />
        )}
      </Stack>

      {/* 오른쪽 컬럼 */}
      <Stack spacing={2}>
        <PasswordSettings
          userKey={detail?.user_key}
          pw={form.adminPw}
          pw2={form.adminPwConfirm}
          onChangePw={(next) => setForm((p) => ({ ...p, adminPw: next }))}
          onChangePw2={(next) => setForm((p) => ({ ...p, adminPwConfirm: next }))}
        />
        <LosingSettings
          userKey={detail?.user_key}
          slot={form.losingSlotPct}
          casino={form.losingCasinoPct}
          slotMaxPct={form.losingSlotMaxPct}
          casinoMaxPct={form.losingCasinoMaxPct}
          onChangeSlot={(next) => setForm((p) => ({ ...p, losingSlotPct: next }))}
          onChangeCasino={(next) => setForm((p) => ({ ...p, losingCasinoPct: next }))}
        />
        {useGroupTypeStore.getState().groupType === 'HQ' && (
          <RollingFeeSettings
            userKey={detail?.user_key}
            value={form.rollingFee}
            onChange={(next) => setForm((p) => ({ ...p, rollingFee: next }))}
          />
        )}
        <PersonalInfoSettings
          userKey={detail?.user_key}
          phone={form.phone}
          bankName={form.bankName}
          account={form.account}
          depositor={form.depositor}
          onChangePhone={(next) => setForm((p) => ({ ...p, phone: next }))}
          onChangeBankName={(next) => setForm((p) => ({ ...p, bankName: next }))}
          onChangeAccount={(next) => setForm((p) => ({ ...p, account: next }))}
          onChangeDepositor={(next) => setForm((p) => ({ ...p, depositor: next }))}
        />
      </Stack>
    </Box>
  );
};

export default CustomerInfoTab;
