export const formatWon = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export const normalizeAmount = (raw: string) => {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '0';
  return Number(digits).toLocaleString('ko-KR');
};

export const parseAmountText = (raw: string) => {
  const n = Number(String(raw ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
