import { DATE_FORMAT } from './Constant';
import dayjs from 'dayjs';
import { Func } from '../models/TypeUtil';

export const createDebounce = () => {
  let timeout: ReturnType<typeof setTimeout>;

  return (callback: Func, delay: number = 300) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, delay);
  };
};

export const debounce = (() => {
  const map = new Map<string, ReturnType<typeof createDebounce>>();
  return (key: string, callback: () => void, delay: number = 300) => {
    if (!map.has(key)) {
      map.set(key, createDebounce());
    }

    map.get(key)!(() => {
      callback();

      map.delete(key);
    }, delay);
  };
})();

export const nextTick = async (callback: () => void) =>
  new Promise((resolve, reject) =>
    queueMicrotask(() => {
      try {
        resolve(callback());
      } catch (error) {
        reject(error);
      }
    })
  );

/**
 * @param date
 * @param format
 * @returns
 */
export const getFormattedDate = (
  date?: string,
  format: keyof typeof DATE_FORMAT = 'YYYYMMDD'
): string => {
  //빈 문자열인 경우
  if (date?.length === 0) {
    return '';
  }
  // 날짜 유효성 검사
  if (date && !dayjs(date).isValid()) {
    return date;
  }

  // 기본 형식 설정
  const dateFormat = DATE_FORMAT[format] || DATE_FORMAT.YYYYMMDD;

  return dayjs(date).format(dateFormat);
};

export const isEmpty = (value: unknown) => {
  return (
    typeof value === 'undefined' ||
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null' ||
    value === 'Invalid Date' ||
    (Array.isArray(value) && value.length === 0)
  );
};
export const isString = (value: any): value is string => typeof value === 'string';

export const isNumber = (value: any): value is number => typeof value === 'number';

export const isFunction = (value: any): value is Func => typeof value === 'function';

export const isObject = (value: any): value is Record<string, any> => Object(value) === value;

export const isNull = (value: any): value is null | undefined => value == null;

export const getWeekDay = (date: string) => dayjs(date).format('d');

// 스트링 -> JSON 변환 (없으면 빈 Array 반환)
export const toJson = (jsonString: any) => {
  try {
    const parsed = JSON.parse((jsonString as unknown as string) || '[]');
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      return new Map(Object.entries(parsed));
    } else {
      return [];
    }
  } catch (e) {
    console.error('Invalid JSON string:', e);
    return [];
  }
};

export const durationToSecond = (timeStamp: number) =>
  `${((Date.now() - timeStamp) / 1000).toFixed(2)}s`;

export const formatTimeString = (hour: number, minute: string): string => {
  return `${hour.toString().padStart(2, '0')}${minute}`;
};

export const getNextTimeInfo = (hour: number, minute: string): { hour: number; minute: string } => {
  const nextMinute = (parseInt(minute) + 15) % 60;
  const nextHour = minute === '45' ? hour + 1 : hour;
  return {
    hour: nextHour,
    minute: nextMinute.toString().padStart(2, '0'),
  };
};
