import { isObject } from './FunctionUtil';

export const generateVerifier = () => {
  const length = 48;
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const generateChallenge = async (codeVerifier: string, method: string) => {
  if (method === 'S256') {
    const hashed = await sha256(codeVerifier);
    return convertBufferToBase64(hashed);
  } else {
    // 'plain' 메소드를 사용할 경우, codeVerifier를 그대로 반환
    return codeVerifier;
  }
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
};

const convertBufferToBase64 = (buffer: ArrayBuffer) => {
  const hashArray = Array.from(new Uint8Array(buffer)); // convert buffer to byte array
  // const _hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string (미사용)

  // const binary = encodeBinaryString(buffer);
  return btoa(hashArray.map((byte) => String.fromCharCode(byte)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const table = new WeakMap<object, string>();

let cursor = 0;

export const stableHash = (arg: any): string => {
  const type = typeof arg;
  const isDate = arg instanceof Date;

  let result: string;

  if (!isDate && isObject(arg) && !(arg instanceof RegExp)) {
    result = table.get(arg)!;
    if (result) return result;
    result = '~' + cursor++;

    if (Array.isArray(arg)) result = '@[' + arg.map(stableHash).join(',') + ']';
    if (arg?.constructor === Object)
      result =
        '#{' +
        Object.keys(arg)
          .sort((a, b) => a.localeCompare(b, 'en'))
          .reduce((prev, key) => {
            const value = (arg as Record<string, any>)[key];
            // for normalization
            if (value == undefined) return prev;
            return prev + `${key}:${stableHash(value)}`;
          }, '') +
        '}';
    table.set(arg, result);

    return result;
  }

  if (isDate) return (arg as Date).toJSON();
  if (type === 'symbol') return arg.toString();
  if (type === 'string') return JSON.stringify(arg);
  return '' + arg;
};

export const compare = (a?: any, b?: any): boolean => stableHash(a) === stableHash(b);
