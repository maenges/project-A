import { Box, Button } from '@mui/material';
import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useCommonOptionsStore } from '@/store/commonCodes';

const DashboardLoginPage = () => {
  const setFromApi = useCommonOptionsStore((s) => s.setFromApi);

  function base64(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  const handleLocalLogin = async () => {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const payload = {
      sub: 'h.jban05',
      name: '반지운',
      email: 'h.jban05@kepartner.com',
      jti: 'test-jwt-id-' + Date.now(),
      group: 'ADMIN',
      employeeNumber: '5120030',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const encodedHeader = base64(JSON.stringify(header));
    const encodedPayload = base64(JSON.stringify(payload));
    const jwtToken = `${encodedHeader}.${encodedPayload}.dummy-signature`;

    document.cookie = `idToken=${jwtToken}`;

    const res = await callApi({
      service: Service.POSTMAN,
      url: '/api/v1/session',
      method: Method.POST,
    });

    sessionStorage.setItem('userGroup', res.data?.userGroup);
    sessionStorage.setItem('userName', res.data?.userName);
    sessionStorage.setItem('userMenus', JSON.stringify(res.data?.userMenus));

    const optRes = await callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/options',
      method: Method.GET,
    });

    // 공통 옵션을 스토어에 저장
    setFromApi(optRes.data ?? {});

    window.location.replace('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ width: 240, height: 56, fontSize: 20 }}
        onClick={handleLocalLogin}
      >
        로그인
      </Button>
    </Box>
  );
};

export default DashboardLoginPage;
