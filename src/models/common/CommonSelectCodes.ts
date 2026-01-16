// import { EtsSelectOption } from '@/components/EtsCommon';

export const DOM_INT = [
  { value: 'all', label: 'ALL' },
  { value: 'DOM', label: 'Dom' },
  { value: 'INT', label: 'Int' },
];

export const DOM_INT_TYPE_2 = [
  { value: 'all', label: 'ALL' },
  { value: 'DOM', label: 'Dom' },
  { value: 'INT', label: 'Int' },
  { value: 'EU', label: 'Eu' },
];

export const PAX_CGO = [
  { value: 'all', label: 'ALL' },
  { value: 'P', label: 'Pax' },
  { value: 'C', label: 'Cgo' },
];

export const SERVICE = [
  { value: 'all', label: 'I. Total Flight' },
  { value: 'R', label: 'II. Revenue Flight' },
  { value: 'N', label: 'III. Non_Revenue Flight' },
  { value: 'M', label: 'a.Maintenance Flight' },
  { value: 'T', label: 'b.Training Flight' },
  { value: 'F', label: 'c.Ferry Flight' },
  { value: 'A', label: 'd.Adopt Flight' },
];

export const OFFSET = [
  { value: 'all', label: 'ALL' },
  { value: 'Y', label: 'Y' },
  { value: 'N', label: 'N' },
];

export const MANUAL = [
  { value: 'N', label: 'N' },
  { value: 'Y', label: 'Y' },
];

export const TYPE = [
  { value: 'all', label: 'ALL' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'payload', label: 'Payload' },
];

export const SEG = [
  { value: 'all', label: 'ALL' },
  { value: '제주', label: '제주' },
  { value: '내륙', label: '내륙' },
  { value: '안전', label: '안전' },
  { value: '기타', label: '기타' },
];

export const EVENT = [
  { value: 'all', label: 'ALL' },
  { value: 'kafka', label: 'Kafka' },
  { value: 'kafka_aft', label: 'Kafka After' },
  { value: 'batch', label: 'Batch' },
];

export const UNIT = [
  { label: 'USG', value: 'USG' },
  { label: 'LT', value: 'LT' },
];

// 신규

export const PartnerOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'PARTNER', label: '파트너' },
  { value: 'CUSTOMER', label: '고객' },
];

export const MemberTypeOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'SH', label: '부본사' },
  { value: 'BR', label: '지사' },
  { value: 'DM', label: '총판' },
  { value: 'ST', label: '매장' },
  { value: 'CU', label: '고객' },
];

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
];
