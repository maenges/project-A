import React from 'react';
import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { StatusCode } from '@models/common/CommonResponse';
import { useNotify } from '../hooks/useNotify';

const LoginTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : undefined,
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : undefined,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : undefined,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#90caf9' : undefined,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined,
    '&.Mui-focused': {
      color: theme.palette.mode === 'dark' ? '#fff' : undefined,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.mode === 'dark' ? '#fff' : undefined,
  },
}));

async function getPublicIp(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3000);

  try {
    const r = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { ip?: string };
    return typeof j?.ip === 'string' && j.ip.length > 0 ? j.ip : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

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

  const handleLocalLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const loginIp = await getPublicIp();
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/auth/login',
        method: Method.POST,
        params: {
          bodyParams: {
            id: id,
            password: password,
            loginIp,
          },
        },
      });

      if (res.successOrNot !== 'Y') {
        if (res.statusCode === StatusCode.UNKNOWN_ERROR) {
          return toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
        return toast.error(res.HeaderMsg);
      }

      navigate('/', { replace: true });
      return;
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
          <LoginTextField
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            disabled={isSubmitting}
            fullWidth
          />
          <LoginTextField
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
