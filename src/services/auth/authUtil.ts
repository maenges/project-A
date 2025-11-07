const refreshTokenKey = 'Refresh-Token';
const refreshTokenExpiredKey = 'Refresh-Token-Expired-At';
const authorizationKey = 'Authorization';

const getLocalRefreshToken = () => localStorage.getItem(refreshTokenKey);
const getLocalRefreshTokenExpiredAt = () =>
  Number(localStorage.getItem(refreshTokenExpiredKey) ?? '');

const setLocalRefreshToken = (refreshToken: string, expiredAt: number) => {
  localStorage.setItem(refreshTokenKey, refreshToken);
  localStorage.setItem(refreshTokenExpiredKey, expiredAt.toString());
};

const removeLocalRefreshToken = () => {
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(refreshTokenExpiredKey);
};

const removeLocalAuthorization = () => {
  localStorage.removeItem(authorizationKey);
};

const isInvalidRefreshToken = () => {
  const currentToken = getLocalRefreshToken();
  const expiredAt = getLocalRefreshTokenExpiredAt();

  return !currentToken || !expiredAt || new Date().getTime() > expiredAt;
};

export {
  getLocalRefreshToken,
  setLocalRefreshToken,
  removeLocalRefreshToken,
  removeLocalAuthorization,
  isInvalidRefreshToken,
};
