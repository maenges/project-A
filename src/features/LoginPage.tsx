import React from 'react';
import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useNotify } from '../hooks/useNotify';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useNotify();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleLocalLogin();
  };

  // login page mounted 시
  // useEffect(() => {
  //   if (document.getElementById('awswaf-js')) return;

  //   const s = document.createElement('script');
  //   s.id = 'awswaf-js';
  //   s.src = 'https://797593cbf480.edge.captcha-sdk.awswaf.com/797593cbf480/jsapi.js';
  //   s.async = true;
  //   document.head.appendChild(s);

  //   return () => {
  //     // 필요하면 제거
  //     // document.getElementById('awswaf-js')?.remove();
  //   };
  // }, []);

  const handleLocalLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
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
      console.log(res);
      if (res.successOrNot !== 'Y') {
        return toast.error('아이디 또는 비밀번호가 올바르지 않습니다.');
      }

      navigate('/', { replace: true });
      return;
    } catch (e) {
      toast.error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(e);
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isSubmitting}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            로그인
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
