const extractTrailingNumber = (path: string): number => {
  // e.g. /src/assets/images/banner/banner_13.png -> 13
  const m = path.match(/_(\d+)\.[a-zA-Z0-9]+$/);
  if (!m) return Number.POSITIVE_INFINITY;
  return Number(m[1]);
};

const sortByNumericSuffix = ([a]: [string, string], [b]: [string, string]) => {
  const na = extractTrailingNumber(a);
  const nb = extractTrailingNumber(b);
  if (na !== nb) return na - nb;
  return a.localeCompare(b);
};

const desktopModules = import.meta.glob('/src/assets/images/banner/banner_*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const mobileModules = import.meta.glob('/src/assets/images/banner/mobile/banner_*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export const desktopBanners = Object.entries(desktopModules)
  .sort(sortByNumericSuffix)
  .map(([, src]) => src);

export const mobileBanners = Object.entries(mobileModules)
  .sort(sortByNumericSuffix)
  .map(([, src]) => src);
