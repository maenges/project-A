import React from 'react';
import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
// import { getRecaptchaToken } from '@/utils/recaptcha';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

    console.log('login response:', res);
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
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLocalLogin}
          >
            로그인
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
