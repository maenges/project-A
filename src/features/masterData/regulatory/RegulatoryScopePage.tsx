import { useState, useRef, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { searchForm, buttonForm } from '@/assets/style';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
import { useCommonOptionsStore } from '@/store/commonCodes';
import dayjs from 'dayjs';

import { EtsGridRef, EtsColumnPreset } from '@/components/EtsGrid';
import { EtsYearSelect, EtsButton, EtsTabs, EtsModal } from '@/components/EtsCommon';
import { EtsYearSelectComponent, EtsSelectComponent } from '@components/EtsComponents';
import { TabSearchArea, TabBottomArea } from '@/components/Teamplate';
import { useActivate } from 'react-activation';

type Country = {
  id: number;
  country: string;
  countryCode: string;
  countryCode2: string;
  corsia: boolean;
  euEts: boolean;
  ukEts: boolean;
  [key: string]: any;
};

type Airport = {
  id: number;
  countryName: string;
  airportName: string;
  iataPort: string;
  icaoPort: string;
  refuelEuYn: boolean;
  [key: string]: any;
};

type ApiCountry = {
  etsYear: string;
  countryId: number;
  code3ltr: string;
  code2ltr: string;
  nameEng: string;
  corsiaYn: boolean;
  euEtsYn: boolean;
  ukEtsYn: boolean;
  [key: string]: any;
};

type ApiAirport = {
  etsYear: string;
  airportId: number;
  iataPort: string;
  icaoPort: string;
  countryName: string;
  airportName: string;
  refuelEuYn: boolean;
  [key: string]: any;
};

const RegulatoryScopePage = () => {
  const [isEditableCountry, setIsEditableCountry] = useState(false);
  const [isEditableAirport, setIsEditableAirport] = useState(false);
  const [currentIsEditable, setCurrentIsEditable] = useState(false);

  const gridRefCountry = useRef<EtsGridRef<Country>>(null);
  const gridRefAirport = useRef<EtsGridRef<Airport>>(null);
  const [countryEtsYears, setCountryEtsYears] = useState([]);
  const [airportEtsYears, setAirportEtsYears] = useState([]);
  const regionAllOptions = useCommonOptionsStore((s) => s.regionAllOptions);
  const originRegulationOptions = useCommonOptionsStore((s) => s.regulationOptions).filter(
    (item) => item.label !== 'K-ETS'
  );

  // 리스트 재정렬
  const regulationOptions = [
    originRegulationOptions.find((opt) => opt.label === 'ALL'), // 0. ALL
    originRegulationOptions.find((opt) => opt.label === 'CORSIA'), // 1. CORSIA
    originRegulationOptions.find((opt) => opt.label === 'EU-ETS'), // 2. EU-ETS
    originRegulationOptions.find((opt) => opt.label === 'UK-ETS'), // 3. UK-ETS
    originRegulationOptions.find((opt) => opt.label === 'Refuel EU'), // 4. Refuel EU
  ].filter(Boolean);

  const tabList = [
    { label: 'Country', value: 'country' },
    { label: 'Airport', value: 'airport' },
  ];

  const [saveOpen, setSaveOpen] = useState(false);
  const [newSaveOpen, setNewSaveOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const fetchYearsData = async () => {
    const countryPromise = callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/country-ets-years',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });
    const airportPromise = callApi({
      service: Service.POSTMAN,
      url: '/api/v1/common/airport-ets-years',
      method: Method.GET,
      params: {},
      config: { isLoading: true },
    });

    const [countryRes, airportRes] = await Promise.all([countryPromise, airportPromise]);

    if (countryRes.successOrNot === 'Y') {
      setCountryEtsYears(countryRes.data);
    } else {
      toast.error(countryRes.HeaderMsg);
    }

    if (airportRes.successOrNot === 'Y') {
      setAirportEtsYears(airportRes.data);
    } else {
      toast.error(airportRes.HeaderMsg);
    }
  };

  useEffect(() => {
    fetchYearsData();
  }, []);

  const columnDefsCountry: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'countryId',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'etsYear',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'nameEng',
      headerName: 'Country',
      width: 303,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'code3ltr',
      headerName: 'Country Code',
      width: 303,
      flex: 1,
    }),
    EtsColumnPreset.TextPreset({
      field: 'code2ltr',
      headerName: 'Country Code (2 Letter)',
      width: 303,
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'corsiaYn',
      headerName: 'CORSIA',
      width: 303,
      cellDataType: 'boolean',
      editable: isEditableCountry,
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'euEtsYn',
      headerName: 'EU-ETS',
      width: 303,
      cellDataType: 'boolean',
      editable: isEditableCountry,
      flex: 1,
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'ukEtsYn',
      headerName: 'UK-ETS',
      width: 303,
      flex: 1,
      cellDataType: 'boolean',
      editable: isEditableCountry,
    }),
  ];

  const columnDefsAirport: ColDef[] = [
    EtsColumnPreset.IdPreset({
      field: 'id',
      headerName: 'id',
      hide: true,
    }),
    EtsColumnPreset.IdPreset({
      field: 'airportId',
      headerName: 'airportId',
      hide: true,
    }),
    EtsColumnPreset.IdPreset({
      field: 'regulationTypeId',
      headerName: 'regulationTypeId',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'etsYear',
      headerName: 'etsYear',
      hide: true,
    }),
    EtsColumnPreset.TextPreset({
      field: 'countryName',
      headerName: 'Country',
      width: 364,
    }),
    EtsColumnPreset.TextPreset({
      field: 'airportName',
      headerName: 'Airport',
      width: 364,
    }),
    EtsColumnPreset.TextPreset({
      field: 'iataPort',
      headerName: 'IATA Airport Code',
      width: 364,
    }),
    EtsColumnPreset.TextPreset({
      field: 'icaoPort',
      headerName: 'ICAO Airport Code',
      width: 364,
      cellDataType: 'boolean',
    }),
    EtsColumnPreset.CheckBoxPreset({
      field: 'refuelEuYn',
      headerName: 'ReFuelEU',
      width: 364,
      flex: 1,
      cellDataType: 'boolean',
      editable: isEditableAirport,
    }),
    EtsColumnPreset.TextPreset({
      field: 'userId',
      headerName: 'userId',
      hide: true,
    }),
  ];

  type FormValues = {
    year: string;
    region: string;
    regulation: string;
    selectedTab: string;
  };

  const { handleSubmit, control, watch, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      year: dayjs().format('YYYY'),
      region: regionAllOptions[0].value,
      regulation: 'ALL',
      selectedTab: tabList[0].value,
    },
    mode: 'onChange',
  });

  const [addDateValue, setAddDateValue] = useState<string>(dayjs().format('YYYY'));
  const [loadDateValue, setLoadDateValue] = useState<string>(dayjs().format('YYYY'));

  const [apiCountry, setApiCountry] = useState<ApiCountry[]>([]);
  const [apiAirport, setApiAirport] = useState<ApiAirport[]>([]);
  const { toast } = useNotify();

  const tab = watch('selectedTab');

  useActivate(() => {
    if (tab === 'country') {
      if (isEditableCountry) {
        setIsEditableCountry(false);
      }
      if (apiCountry.length > 0) {
        handleSubmit(onSearch)();
      }
    } else {
      if (isEditableAirport) {
        setIsEditableAirport(false);
      }
      if (apiAirport.length > 0) {
        handleSubmit(onSearch)();
      }
    }
  });

  // 승계받는 데이터 탭 변경시 값 필터링 및 초기화
  const filteredLoadYears = useMemo(() => {
    const sourceList = tab === 'country' ? countryEtsYears : airportEtsYears;
    return sourceList.filter((year) => year !== addDateValue);
  }, [tab, countryEtsYears, airportEtsYears, addDateValue]);

  // 'addDateValue'가 변경되어 'loadDateValue'가 목록에서 제외될 경우, 값을 재설정합니다.
  useEffect(() => {
    if (filteredLoadYears.length > 0 && !filteredLoadYears.includes(loadDateValue as never)) {
      setLoadDateValue(filteredLoadYears[0]);
    } else if (filteredLoadYears.length === 0) {
      setLoadDateValue(''); // 선택할 수 있는 연도가 없으면 비웁니다.
    }
  }, [filteredLoadYears, loadDateValue]);

  const addableYears = useMemo(() => {
    const currentYear = dayjs().year();
    const baseYears = Array.from({ length: 6 }, (_, i) => String(currentYear + i));

    // 현재 탭에 따라 이미 존재하는 연도를 가져옵니다.
    const existingYears = tab === 'country' ? countryEtsYears : airportEtsYears;

    // 이미 존재하는 연도를 제외하고 목록을 반환합니다.
    return baseYears.filter((year) => !existingYears.includes(year as never));
  }, [tab, countryEtsYears, airportEtsYears]);

  useEffect(() => {
    if (addableYears.length > 0 && !addableYears.includes(addDateValue)) {
      setAddDateValue(addableYears[0]);
    } else if (addableYears.length === 0) {
      setAddDateValue(''); // 선택할 수 있는 연도가 없으면 비웁니다.
    }
  }, [addableYears, addDateValue]);

  useEffect(() => {
    // 현재 선택된 연도 값을 가져옵니다.
    const currentYear = getValues('year');
    let targetYearList: string[] = [];

    // 현재 탭에 맞는 연도 목록을 선택합니다.
    if (tab === 'country') {
      targetYearList = countryEtsYears;
    } else if (tab === 'airport') {
      targetYearList = airportEtsYears;
    }

    // 연도 목록이 있고, 현재 연도가 목록에 없는 경우
    if (targetYearList.length > 0 && !targetYearList.includes(currentYear)) {
      // 목록의 첫 번째 값으로 'year' 필드를 업데이트합니다.
      setValue('year', targetYearList[0]);
    }
  }, [tab, countryEtsYears, airportEtsYears, getValues, setValue]);

  const onSearch: SubmitHandler<FormValues> = async () => {
    const { year, region, regulation, selectedTab } = getValues();

    // const regulation = watch('regulation');
    if (['1', '3', '4'].includes(regulation as string)) {
      setValue('selectedTab', 'country');
    } else if (regulation === '2') {
      setValue('selectedTab', 'airport');
    }

    const searchCountry = () => {
      const sendParams = {
        etsYear: year,
        regionId: region === 'ALL' ? '' : region,
      };

      callApi({
        service: Service.POSTMAN,
        url: '/api/v1/regulatory/country',
        method: Method.GET,
        params: {
          queryParams: sendParams,
        },
        config: { isLoading: true },
      }).then((res) => {
        if (res.successOrNot !== 'Y') {
          toast.error(res.HeaderMsg);
          return;
        }

        let filteredData = res.data.map((row: any) => ({
          ...row,
          corsiaYn: row.corsiaYn === true,
          euEtsYn: row.euEtsYn === true,
          ukEtsYn: row.ukEtsYn === true,
        }));

        if (regulation === '1') {
          filteredData = res.data.filter((row: any) => row.corsiaYn === true);
        } else if (regulation === '3') {
          filteredData = res.data.filter((row: any) => row.euEtsYn === true);
        } else if (regulation === '4') {
          filteredData = res.data.filter((row: any) => row.ukEtsYn === true);
        }

        setApiCountry(filteredData);
      });
    };

    const searchAirport = () => {
      const sendParams = {
        etsYear: year,
        regionId: region === 'ALL' ? '' : region,
      };
      callApi({
        service: Service.POSTMAN,
        url: '/api/v1/regulatory/airport',
        method: Method.GET,
        params: {
          queryParams: sendParams,
        },
        config: { isLoading: true },
      }).then((res) => {
        if (res.successOrNot !== 'Y') {
          toast.error(res.HeaderMsg);
          return;
        }

        let filteredData = res.data;
        // 예시: regulation === '2'일 때만 airport 데이터 사용
        if (regulation === '2') {
          filteredData = res.data.filter((row: any) => row.refuelEuYn === true);
        }
        setApiAirport(filteredData);
      });
    };

    if (regulation === 'ALL') {
      await Promise.all([searchCountry(), searchAirport()]);
    } else if (selectedTab === 'country') {
      searchCountry();
    } else if (selectedTab === 'airport') {
      searchAirport();
    }
  };

  useEffect(() => {
    tab === 'country'
      ? setCurrentIsEditable(isEditableCountry)
      : setCurrentIsEditable(isEditableAirport);
  }, [currentIsEditable]);

  const changeEditable = (item: boolean) => {
    tab === 'country' ? setIsEditableCountry(item) : setIsEditableAirport(item);
  };

  const searchComponent = (
    <form onSubmit={handleSubmit(onSearch)}>
      <searchForm.Container>
        <searchForm.Row>
          {tab === 'country' && (
            <EtsYearSelectComponent
              control={control}
              name="year"
              label="Year"
              list={countryEtsYears}
            />
          )}
          {tab === 'airport' && (
            <EtsYearSelectComponent
              control={control}
              name="year"
              label="Year"
              list={airportEtsYears}
            />
          )}
          <EtsSelectComponent
            control={control}
            name="region"
            label="Region"
            options={regionAllOptions}
          />
          <EtsSelectComponent
            control={control}
            name="regulation"
            label="Regulation"
            options={regulationOptions}
            onChange={(event, field) => {
              const value = event.target.value;
              field.onChange(value);
              // 키 값에 따라 탭 변경되게 해둠
              if (['1', '3', '4'].includes(value as string)) {
                setValue('selectedTab', 'country');
              } else if (value === '2') {
                setValue('selectedTab', 'airport');
              }
            }}
          />
        </searchForm.Row>
      </searchForm.Container>
      <searchForm.ButtonContainer>
        <searchForm.Row sx={{ justifyContent: 'flex-end' }}>
          <EtsButton
            type="blue"
            onClick={() => {
              handleSubmit(onSearch)();
              changeEditable(false);
            }}
          >
            Search
          </EtsButton>
        </searchForm.Row>
      </searchForm.ButtonContainer>
    </form>
  );

  const tabComponent = (
    <EtsTabs
      tabs={tabList}
      value={watch('selectedTab')}
      onChange={(setSelectedTab) => setValue('selectedTab', setSelectedTab)}
      sx={{ mb: 1 }}
    />
  );

  const subSelect = (
    <Box display="flex" alignItems="center">
      <Typography className="label">ETS YEAR: {watch('year')}</Typography>
    </Box>
  );

  const buttonComponentCountry = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditableCountry ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRefCountry.current) {
                  gridRefCountry.current.api.stopEditing();
                }
                handleSubmit(onSearch)();
                setIsEditableCountry(false);
              }}
            >
              Cancel
            </EtsButton>
            <EtsButton
              type="blue"
              onClick={async () => {
                if (gridRefCountry.current) {
                  gridRefCountry.current.api.stopEditing();
                }
                setSaveOpen(true);
              }}
            >
              Save
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton
              type="grey"
              onClick={async () => {
                setNewOpen(true);
              }}
            >
              New
            </EtsButton>
            {apiCountry.length > 0 && (
              <EtsButton
                type="grey"
                onClick={async () => {
                  setIsEditableCountry(true);
                }}
              >
                Edit
              </EtsButton>
            )}
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const buttonComponentAirport = (
    <buttonForm.Container>
      <buttonForm.Row>
        {isEditableAirport ? (
          <>
            <EtsButton
              type="grey"
              onClick={() => {
                if (gridRefAirport.current) {
                  gridRefAirport.current.api.stopEditing();
                }
                handleSubmit(onSearch)();
                setIsEditableAirport(false);
              }}
            >
              Cancel
            </EtsButton>
            <EtsButton
              type="blue"
              onClick={async () => {
                if (gridRefAirport.current) {
                  gridRefAirport.current.api.stopEditing();
                }
                setSaveOpen(true);
              }}
            >
              Save
            </EtsButton>
          </>
        ) : (
          <>
            <EtsButton
              type="grey"
              onClick={async () => {
                setNewOpen(true);
              }}
            >
              New
            </EtsButton>
            {apiAirport.length > 0 && (
              <EtsButton
                type="grey"
                onClick={async () => {
                  setIsEditableAirport(true);
                }}
              >
                Edit
              </EtsButton>
            )}
          </>
        )}
      </buttonForm.Row>
    </buttonForm.Container>
  );

  const handleNewData = async () => {
    const inputParams = {
      sourceYear: String(loadDateValue),
      targetYear: String(addDateValue),
    };
    const res = await callApi({
      service: Service.POSTMAN,
      url: `/api/v1/regulatory/${tab}`,
      method: Method.POST,
      params: {
        bodyParams: inputParams,
      },
      config: { isLoading: true },
    });

    if (res.successOrNot !== 'Y') {
      toast.error(res.HeaderMsg);
      return;
    }
    toast.success('저장 하였습니다.');
  };

  const handleModifiedData = async (gridRef: any) => {
    const modifiedData = gridRef.current?.getRowsByStatus() || {
      delete: [],
      update: [],
      insert: [],
      all: [],
    };

    const apiConfigs = [
      { key: 'insert', method: Method.POST, success: '등록 되었습니다.', fail: '등록 실패' },
      { key: 'update', method: Method.PUT, success: '수정 되었습니다.', fail: '수정 실패' },
      { key: 'delete', method: Method.DELETE, success: '삭제 되었습니다.', fail: '삭제 실패' },
    ] as const;

    // 각 API 호출을 Promise로 묶어서 처리
    const promises = apiConfigs.map(({ key, method, success }) => {
      const filtered = modifiedData[key as keyof typeof modifiedData];
      if (filtered.length > 0) {
        return callApi({
          service: Service.POSTMAN,
          url: `/api/v1/regulatory/${tab}`,
          method,
          params: {
            bodyParams: filtered,
          },
          config: { isLoading: true },
        }).then((res) => {
          if (res.successOrNot !== 'Y') {
            toast.error(res.HeaderMsg);
            return;
          }
          toast.success(success);
          return res;
        });
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  };

  const mainComponent = (() => {
    return (
      <Box>
        <TabSearchArea title="Regulatory Scope" searchComponent={searchComponent} />
        {tabComponent}
        <TabBottomArea
          visible={tab === 'country'}
          gridRef={gridRefCountry}
          columnDefs={columnDefsCountry}
          rowData={apiCountry}
          buttonComponent={buttonComponentCountry}
          subSelect={subSelect}
        />
        <TabBottomArea
          visible={tab === 'airport'}
          gridRef={gridRefAirport}
          columnDefs={columnDefsAirport}
          rowData={apiAirport}
          buttonComponent={buttonComponentAirport}
          subSelect={subSelect}
        />
      </Box>
    );
  })();

  const newModal = (
    <>
      <EtsModal open={newOpen} size={420} onClose={() => setNewOpen(false)}>
        <EtsModal.Header onClose={() => setNewOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            New Reporting
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            추가하실 Reporting Year를 지정하세요.
          </Typography>
          <EtsYearSelect
            sx={{ mt: 2 }}
            value={addDateValue}
            onChange={(event) => {
              const year = event.target.value as string;
              setAddDateValue(year);
            }}
            list={addableYears}
          />
          <Typography className="modal-body-text" mt={2}>
            데이터를 승계받을 연도를 고르세요.
          </Typography>
          <Box display="flex" alignItems="flex-start" mt={2}>
            {tab === 'country' && (
              <EtsYearSelect
                value={loadDateValue}
                onChange={(event) => {
                  const year = event.target.value as string;
                  setLoadDateValue(year);
                }}
                list={filteredLoadYears}
              />
            )}
            {tab === 'airport' && (
              <EtsYearSelect
                value={loadDateValue}
                onChange={(event) => {
                  const year = event.target.value as string;
                  setLoadDateValue(year);
                }}
                list={filteredLoadYears}
              />
            )}
          </Box>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              variant="outlined"
              type="outlined"
              onClick={() => setNewOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              variant="contained"
              type="contained"
              onClick={() => {
                setNewSaveOpen(true);
                changeEditable(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  const saveModal = (
    <>
      <EtsModal open={saveOpen} size={420} onClose={() => setSaveOpen(false)}>
        <EtsModal.Header onClose={() => setSaveOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Save Reporting
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            변경된 설정을 저장하시겠습니까?
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              type="outlined"
              variant="outlined"
              onClick={() => setSaveOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              type="contained"
              variant="contained"
              onClick={async () => {
                const ref = tab === 'country' ? gridRefCountry : gridRefAirport;
                if (ref.current) {
                  ref.current.api.stopEditing();
                }
                await handleModifiedData(ref);
                await handleSubmit(onSearch)();

                setSaveOpen(false);
                changeEditable(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  const newSaveModal = (
    <>
      <EtsModal open={newSaveOpen} size={420} onClose={() => setNewSaveOpen(false)}>
        <EtsModal.Header onClose={() => setNewSaveOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Save Reporting
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            저장하시겠습니까?
          </Typography>
        </EtsModal.Body>
        <EtsModal.Footer>
          <>
            <EtsButton
              className="modal-foot-text-cancel"
              type="outlined"
              variant="outlined"
              onClick={() => setNewSaveOpen(false)}
            >
              Cancel
            </EtsButton>
            <EtsButton
              className="modal-foot-text-cancel"
              type="contained"
              variant="contained"
              onClick={async () => {
                await handleNewData();
                await fetchYearsData();
                setNewSaveOpen(false);
                setNewOpen(false);
              }}
            >
              Save
            </EtsButton>
          </>
        </EtsModal.Footer>
      </EtsModal>
    </>
  );

  return (
    <Box>
      {mainComponent}
      {saveModal}
      {newModal}
      {newSaveModal}
    </Box>
  );
};

export default RegulatoryScopePage;
