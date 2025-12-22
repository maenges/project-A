import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useUserStore } from '@/store/cookieStore';
// import { getRecaptchaToken } from '@/utils/recaptcha';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const setUser = useUserStore((s) => s.setUser);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleLocalLogin();
  };

  // login page mounted 시
  useEffect(() => {
    if (document.getElementById('awswaf-js')) return;

    const s = document.createElement('script');
    s.id = 'awswaf-js';
    s.src = 'https://797593cbf480.edge.captcha-sdk.awswaf.com/797593cbf480/jsapi.js';
    s.async = true;
    document.head.appendChild(s);

    return () => {
      // 필요하면 제거
      // document.getElementById('awswaf-js')?.remove();
    };
  }, []);

  const handleLocalLogin = async () => {
    // const recaptchaToken = await getRecaptchaToken('admin_login');
    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/auth/login',
      method: Method.POST,
      params: {
        bodyParams: {
          id: id,
          password: password,
        },
      },
    });

    if (res?.successOrNot === 'Y') {
      const payload = (res?.data ?? res?.resultData ?? res?.result ?? {}) as any;

      const userId = payload?.userId ?? payload?.memberId ?? payload?.id ?? null;
      const role = payload?.role ?? payload?.roleType ?? null;
      const groupKey = payload?.groupKey ?? payload?.deptCode ?? payload?.group ?? null;

      if (userId) {
        setUser({ userId: String(userId), role, groupKey: groupKey ? String(groupKey) : '' });
      }

      navigate('/', { replace: true });
    } else {
      console.warn('Login failed:', res);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 360 }}>
        <Stack spacing={2}>
          <TextField
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" fullWidth>
            로그인
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
