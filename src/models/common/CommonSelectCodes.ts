export const PartnerOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'PARTNER', label: '파트너' },
  { value: 'CUSTOMER', label: '고객' },
];

export const MemberTypeOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'HQ', label: '본사' },
  { value: 'SH', label: '부본사' },
  { value: 'BR', label: '지사' },
  { value: 'DM', label: '총판' },
  { value: 'ST', label: '매장' },
  { value: 'CU', label: '고객' },
];

/** groupType 계층 순서 (상위 → 하위) */
const MEMBER_TYPE_HIERARCHY = ['HQ', 'SH', 'BR', 'DM', 'ST', 'CU'] as const;

/**
 * 현재 사용자의 groupType 등급 이하의 MemberTypeOptions만 반환
 * - HQ: 전체, 본사, 부본사, 지사, 총판, 매장
 * - SH: 전체, 부본사, 지사, 총판, 매장
 * - BR: 전체, 지사, 총판, 매장
 * - DM: 전체, 총판, 매장
 * - ST: 전체, 매장
 */
export const getMemberTypeOptionsByGroupType = (groupType: string) => {
  const idx = MEMBER_TYPE_HIERARCHY.indexOf(groupType as any);
  // 알 수 없는 groupType이면 전체 반환
  if (idx < 0) return MemberTypeOptions;
  const allowed = new Set(MEMBER_TYPE_HIERARCHY.slice(idx));
  allowed.add('ALL' as any);
  return MemberTypeOptions.filter((o) => allowed.has(o.value as any));
};

export const AccountKeyOptions = [
  { value: 'ALL', label: '전체' },
  { value: '004', label: '국민은행' },
  { value: '088', label: '신한은행' },
  { value: '020', label: '우리은행' },
  { value: '081', label: '하나은행' },
  { value: '003', label: '기업은행(IBK)' },
  { value: '011', label: '농협은행(NH)' },
  { value: '023', label: 'SC제일은행' },
  { value: '027', label: '한국씨티은행' },

  { value: '031', label: '대구은행' },
  { value: '032', label: '부산은행' },
  { value: '034', label: '광주은행' },
  { value: '035', label: '제주은행' },
  { value: '037', label: '전북은행' },
  { value: '039', label: '경남은행' },

  { value: '089', label: '케이뱅크' },
  { value: '090', label: '카카오뱅크' },
  { value: '092', label: '토스뱅크' },

  { value: '007', label: '수협은행' },
  { value: '048', label: '신협' },
  { value: '045', label: '새마을금고' },
  { value: '071', label: '우체국' },
];

export const processStatusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '대기' },
  { value: 'COMPLETED', label: '완료' },
];

export const blockStatusOptions = [
  { value: 'BLOCKED', label: '차단' },
  { value: 'UNBLOCKED', label: '정상' },
  { value: 'ALL', label: '전체' },
];

export const transactionStatusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'PAYOUT', label: '지급' },
  { value: 'RECOVERY', label: '회수' },
  { value: 'CONVERT', label: '롤링' },
];

export const transStatusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'RECHARGE', label: '충전' },
  { value: 'EXCHANGE', label: '환전' },
];

export const rollingFee = [
  { value: 0, label: '0' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
  { value: 100, label: '100' },
];

export const hourOptions = [
  { value: '00', label: '00시' },
  { value: '01', label: '01시' },
  { value: '02', label: '02시' },
  { value: '03', label: '03시' },
  { value: '04', label: '04시' },
  { value: '05', label: '05시' },
  { value: '06', label: '06시' },
  { value: '07', label: '07시' },
  { value: '08', label: '08시' },
  { value: '09', label: '09시' },
  { value: '10', label: '10시' },
  { value: '11', label: '11시' },
  { value: '12', label: '12시' },
  { value: '13', label: '13시' },
  { value: '14', label: '14시' },
  { value: '15', label: '15시' },
  { value: '16', label: '16시' },
  { value: '17', label: '17시' },
  { value: '18', label: '18시' },
  { value: '19', label: '19시' },
  { value: '20', label: '20시' },
  { value: '21', label: '21시' },
  { value: '22', label: '22시' },
  { value: '23', label: '23시' },
];

export const gameSortOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'casino', label: '카지노' },
  { value: 'slot', label: '슬롯' },
];

export const sortOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'BET', label: '베팅' },
  { value: 'WIN', label: '당첨' },
];
