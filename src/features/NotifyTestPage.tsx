import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Divider, Stack } from '@mui/material';
import { useNotify } from '../hooks/useNotify';

const NotifyTestPage: React.FC = () => {
  const { confirm, alert, toast } = useNotify();
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);

  console.log('NotifyTestPage rendered, toast methods:', {
    toast,
    info: toast.info,
    success: toast.success,
  });

  // Modal 테스트 함수들
  const simpleTextConfirm = async () => {
    const answer = await confirm('단순 텍스트 확인창입니다.');
    setConfirmResult(answer);
  };

  const multiOptionTextConfirm = async () => {
    const answer = await confirm({
      title: '제목이 있는 확인창',
      message: '다중 옵션 텍스트 확인창입니다.\n여러 줄로 표시될 수 있습니다.',
      size: 'MD',
    });
    setConfirmResult(answer);
  };

  const largeConfirm = async () => {
    const answer = await confirm({
      title: '큰 사이즈 확인창',
      message:
        '이것은 큰 사이즈의 확인창입니다.\n\n다음과 같은 내용이 포함되어 있습니다:\n- 첫 번째 항목\n- 두 번째 항목\n- 세 번째 항목\n\n정말로 진행하시겠습니까?',
      size: 'LG',
    });
    setConfirmResult(answer);
  };

  const simpleTextAlert = () => {
    alert('단순 Alert 확인창입니다.');
  };

  const multiOptionTextAlert = () => {
    alert({
      title: '경고',
      message: '다중 옵션 Alert 확인창입니다.\n이 작업은 되돌릴 수 없습니다.',
      size: 'MD',
    });
  };

  // Toast 테스트 함수들
  const testToastInfo = () => {
    console.log('Toast info 호출됨');
    const result = toast.info('정보 메시지입니다. 참고하세요!');
    console.log('Toast result:', result);
  };

  const testToastSuccess = () => {
    console.log('Toast success 호출됨');
    const result = toast.success('성공적으로 완료되었습니다!');
    console.log('Toast result:', result);
  };

  const testToastWarning = () => {
    toast.warning('주의가 필요한 상황입니다.');
  };

  const testToastError = () => {
    toast.error('오류가 발생했습니다. 다시 시도해주세요.');
  };

  const testToastConfirm = () => {
    toast.confirm('확인 처리가 완료되었습니다!');
  };

  const testLongToast = () => {
    toast.info(
      '이것은 매우 긴 메시지입니다. 토스트가 어떻게 표시되는지 확인하기 위한 테스트 메시지로, 한줄로 최대한 표현됩니다.'
    );
  };

  // 기본 toast 테스트 (라이브러리 직접 호출)
  const testDirectToast = () => {
    console.log('직접 toast 호출');
    import('react-toastify').then(({ toast: directToast }) => {
      const result = directToast('기본 toast 테스트!');
      console.log('Direct toast result:', result);
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Notify 시스템 테스트 페이지
      </Typography>

      <Stack direction="row" spacing={1}>
        <Stack sx={{ width: '50%' }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              Modal 테스트
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Confirm 결과값:{' '}
                <strong>{confirmResult !== null ? String(confirmResult) : '아직 없음'}</strong>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Confirm 테스트
              </Typography>

              <Button variant="outlined" onClick={simpleTextConfirm} fullWidth>
                단순 CONFIRM 호출
              </Button>

              <Button variant="outlined" onClick={multiOptionTextConfirm} fullWidth>
                옵션 CONFIRM 호출 (MD 사이즈)
              </Button>

              <Button variant="outlined" onClick={largeConfirm} fullWidth>
                큰 사이즈 CONFIRM 호출 (LG 사이즈)
              </Button>

              <Divider sx={{ my: 1 }} />

              <Typography variant="h6" sx={{ mb: 1 }}>
                Alert 테스트
              </Typography>

              <Button variant="outlined" onClick={simpleTextAlert} fullWidth>
                단순 ALERT 호출
              </Button>

              <Button variant="outlined" onClick={multiOptionTextAlert} fullWidth>
                옵션 ALERT 호출
              </Button>
            </Box>
          </Paper>
        </Stack>
        {/* Toast 테스트 섹션 */}
        <Stack sx={{ width: '50%' }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              Toast 테스트
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              화면 하단 중앙에 토스트 메시지가 표시됩니다.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" color="info" onClick={testToastInfo} fullWidth>
                Toast Info 호출
              </Button>

              <Button variant="contained" color="success" onClick={testToastSuccess} fullWidth>
                Toast Success 호출
              </Button>

              <Button variant="contained" color="warning" onClick={testToastWarning} fullWidth>
                Toast Warning 호출
              </Button>

              <Button variant="contained" color="error" onClick={testToastError} fullWidth>
                Toast Error 호출
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                onClick={testToastConfirm}
                fullWidth
              >
                Toast Confirm 호출
              </Button>

              <Divider sx={{ my: 1 }} />

              <Button variant="outlined" onClick={testLongToast} fullWidth>
                긴 메시지 Toast 테스트
              </Button>

              <Button variant="contained" color="secondary" onClick={testDirectToast} fullWidth>
                직접 Toast 테스트 (디버깅용)
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotifyTestPage;
