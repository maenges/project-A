import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LabeledOption = { value: string; label: string; disabled?: boolean };
export type regionLabeldOption = { value: string; label: string };
export type countryLabeldOption = {
  value: string;
  label: string;
  region?: number | null;
};
export type airportLabeldOption = {
  value: string;
  label: string;
  region?: number | null;
  country?: number | null;
};

type ApiCommonOptions = {
  actypes?: string[];
  regions?: { key: number; value: string }[];
  countrys?: { key: number; value: string; region: number }[];
  airports?: { key: number; value: string; region: number; country: number }[];
  years?: number[];
  regulations?: { key: number; value: string }[];
  etsyears?: number[];
};

type CommonOptionsState = {
  // 원본
  actypes: string[];
  regions: { key: number; value: string }[];
  countrys: { key: number; value: string; region: number }[];
  airports: { key: number; value: string; region: number; country: number }[];
  years: number[];
  regulations: { key: number; value: string }[];
  etsyears: number[];

  // 셀렉트 옵션
  acTypeOptions: LabeledOption[];
  regionAllOptions: LabeledOption[];
  regionOptions: regionLabeldOption[];
  countryOptions: countryLabeldOption[];
  airportOptions: airportLabeldOption[];
  regulationOptions: LabeledOption[];

  setFromApi: (data: ApiCommonOptions) => void;
  clear: () => void;
};

const toLabelValue = (arr: string[]) => [
  { value: 'ALL', label: 'ALL' },
  ...arr.map((v) => ({ value: v, label: v })),
];

const toRegionAllOptions = (arr: { key: number; value: string }[]) => [
  { value: 'ALL', label: 'ALL' },
  ...arr.map((v) => ({ value: String(v.key), label: v.value })),
];

const toRegionOptions = (arr: { key: number; value: string }[]) => [
  ...arr.map((r) => ({ value: String(r.key), label: r.value })),
];

const toCountryOptions = (arr: { key: number; value: string; region: number }[]) => [
  { value: 'ALL', label: 'ALL' },
  ...arr.map((r) => ({ value: String(r.key), label: r.value, region: r.region })),
];

const toRegulationOptions = (arr: { key: number; value: string }[]) => [
  { value: 'ALL', label: 'ALL' },
  ...arr.map((v) => ({ value: String(v.key), label: v.value })),
];

const toAirportOptions = (
  arr: { key: number; value: string; region: number; country: number }[]
) => [
  { value: 'ALL', label: 'ALL' },
  ...arr.map((r) => ({
    value: String(r.key),
    label: r.value,
    region: r.region,
    country: r.country,
  })),
];

// const toYearOptions = (arr: number[]) => arr.map((y) => ({ value: String(y), label: String(y) }));

export const useCommonOptionsStore = create<CommonOptionsState>()(
  persist(
    (set) => ({
      actypes: [],
      regions: [],
      countrys: [],
      airports: [],
      years: [],
      regulations: [],
      etsyears: [],

      // 초기 렌더 때도 'ALL'이 있어야 하므로 기본 옵션 준비
      acTypeOptions: [{ value: 'ALL', label: 'ALL' }],
      regionAllOptions: [{ value: 'ALL', label: 'ALL' }],
      regionOptions: [],
      countryOptions: [{ value: 'ALL', label: 'ALL', region: null }],
      airportOptions: [{ value: 'ALL', label: 'ALL', region: null, country: null }],
      yearOptions: [],
      regulationOptions: [{ value: 'ALL', label: 'ALL' }],

      setFromApi: (data) =>
        set((s) => {
          const actypes = data.actypes ?? s.actypes;
          const regions = data.regions ?? s.regions;
          const countrys = data.countrys ?? s.countrys;
          const airports = data.airports ?? s.airports;
          const years = data.years ?? s.years;
          const regulations = data.regulations ?? s.regulations;
          const etsyears = data.etsyears ?? s.etsyears;

          return {
            actypes,
            regions,
            countrys,
            years,
            etsyears,
            acTypeOptions: toLabelValue(actypes),
            regionAllOptions: toRegionAllOptions(regions),
            regionOptions: toRegionOptions(regions),
            countryOptions: toCountryOptions(countrys),
            airportOptions: toAirportOptions(airports),
            regulationOptions: toRegulationOptions(regulations),
          };
        }),
      clear: () =>
        set({
          actypes: [],
          regions: [],
          countrys: [],
          airports: [],
          years: [],
          etsyears: [],
          acTypeOptions: [{ value: 'ALL', label: 'ALL' }],
          regionAllOptions: [{ value: 'ALL', label: 'ALL' }],
          regionOptions: [],
          countryOptions: [{ value: 'ALL', label: 'ALL', region: null }],
          airportOptions: [{ value: 'ALL', label: 'ALL', region: null, country: null }],
          regulationOptions: [{ value: 'ALL', label: 'ALL' }],
        }),
    }),
    {
      name: 'common-options',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        actypes: s.actypes,
        regions: s.regions,
        years: s.years,
        etsyears: s.etsyears,
        acTypeOptions: s.acTypeOptions,
        regionAllOptions: s.regionAllOptions,
        regionOptions: s.regionOptions,
        countryOptions: s.countryOptions,
        airportOptions: s.airportOptions,
        regulationOptions: s.regulationOptions,
      }),
    }
  )
);
