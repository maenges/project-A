import { Box, Typography } from '@mui/material';
import { Fragment } from 'react';
import dayjs from 'dayjs';
import { tableForm } from '@/assets/style';
import { TableTemplate } from '@/components/Teamplate';

// 숫자 포맷 유틸리티 함수 (소수점 2자리)
const formatNumber = (value: string | number): string => {
  if (value === '' || value === null || value === undefined) return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return value.toString();

  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Tonne-Kilometer 전용 포맷 함수 (소수점 3자리)
const formatTonneKilometer = (value: string | number): string => {
  if (value === '' || value === null || value === undefined) return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return value.toString();

  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

// 정수 포맷 함수 (소수점 없이)
const formatInteger = (value: string | number): string => {
  if (value === '' || value === null || value === undefined) return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return value.toString();

  return Math.round(numValue).toLocaleString('en-US');
};

type FlightInfo = {
  fltNo: string;
  acReg: string;
  fltType: string;
  svcType: string;
  acType: string;
  acVer: string;
  dep: string;
  depIcao: string;
  depLoc: string;
  depGmt: string;
  arr: string;
  arrIcao: string;
  arrLoc: string;
  arrGmt: string;
};

type FuelInfo = {
  prvRampInRemainFuel: string;
  prvRampInRemainFuelKg: string;
  rampOutRemainFuel: string;
  rampOutRemainFuelKg: string;
  rampInRemainFuel: string;
  rampInRemainFuelKg: string;
  fuelComsumptionCalc: string;
  fuelComsumptionCalcKg: string;
  fuelComsuptionFinal: string;
  fuelComsuptionFinalKg: string;
  routeMaximumValue: string;
  routeMaximumValueKg: string;
  fuelUpliftLbs: string;
  fuelUplift: string;
  fuelUpliftUnit: string;
  fuelDensity: string;
  fuelDensityUnit: string;
};

type PayloadInfo = {
  adult: string;
  child: string;
  infant: string;
  positioningCrew: string;
  totalNumberPassenger: string;
  totalMassPassengerIcao: string;
  totalMassPassengerEuets: string;
  totalMassFreightMail: string;
};

type TkInfo = {
  totalPassengerTkIcao: string;
  totalPassengerTkEuets: string;
  totalFreightTkIcao: string;
  totalFreightTkEuets: string;
  totalTkIcao: string;
  totalTkEuets: string;
};

export type FlightDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  header: { fltNo: string; date: string };
  flightInfo: FlightInfo;
  fuelConsumption: FuelInfo;
  tonneKilometer: TkInfo;
  payload: PayloadInfo;
  gcd: { gcdIcao: string; gcdEuets: string };
};

const FlightDetailsModal = ({
  open,
  onClose,
  header,
  flightInfo,
  fuelConsumption,
  tonneKilometer,
  payload,
  gcd,
}: FlightDetailsModalProps) => {
  const component = (
    <Fragment>
      <Box
        sx={{
          '& table td': {
            height: '40px !important',
            lineHeight: '1.2 !important',
            boxSizing: 'border-box !important',
          },
          '& table td.label-modal-grid-header': {
            textAlign: 'left !important',
          },
          '& table td .label-modal-grid-header': {
            textAlign: 'left !important',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
        }}
      >
        <tableForm.BodyTopContent>
          <tableForm.BodyTopContentDiv>
            <tableForm.BodyContentDivText>
              <Typography className="sub-title" sx={{ flex: '1 0 0' }}>
                Flight Information
              </Typography>
            </tableForm.BodyContentDivText>
            <tableForm.table>
              <tableForm.tr className="label-modal-grid-column">
                <tableForm.td variant="base">FLT No</tableForm.td>
                <tableForm.td variant="base">A/C Reg</tableForm.td>
                <tableForm.td variant="base">FLT Type</tableForm.td>
                <tableForm.td variant="base">SVC Type</tableForm.td>
                <tableForm.td variant="base">A/C Type</tableForm.td>
                <tableForm.td variant="base">A/C Ver</tableForm.td>
                <tableForm.td variant="orange">Dep</tableForm.td>
                <tableForm.td variant="orange">ICAO</tableForm.td>
                <tableForm.td variant="orange">LOC</tableForm.td>
                <tableForm.td variant="orange">GMT</tableForm.td>
                <tableForm.td variant="red">Arr</tableForm.td>
                <tableForm.td variant="red">ICAO</tableForm.td>
                <tableForm.td variant="red">LOC</tableForm.td>
                <tableForm.td variant="red" style={{ borderRight: '1px solid #ffffff' }}>
                  GMT
                </tableForm.td>
              </tableForm.tr>
              <tableForm.tbody>
                <tableForm.tr className="label-modal-grid-column">
                  <tableForm.td variant="td">{flightInfo.fltNo || ''}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.acReg}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.fltType}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.svcType}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.acType}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.acVer}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.dep}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.depIcao}</tableForm.td>
                  <tableForm.td variant="td">
                    {dayjs(flightInfo.depLoc).format('YY.MM.DD HH:mm')}
                  </tableForm.td>
                  <tableForm.td variant="td">
                    {dayjs(flightInfo.depGmt).format('YY.MM.DD HH:mm')}
                  </tableForm.td>
                  <tableForm.td variant="td">{flightInfo.arr}</tableForm.td>
                  <tableForm.td variant="td">{flightInfo.arrIcao}</tableForm.td>
                  <tableForm.td variant="td">
                    {dayjs(flightInfo.arrLoc).format('YY.MM.DD HH:mm')}
                  </tableForm.td>
                  <tableForm.td variant="td" style={{ borderRight: '1px solid #ffffff' }}>
                    {dayjs(flightInfo.arrGmt).format('YY.MM.DD HH:mm')}
                  </tableForm.td>
                </tableForm.tr>
              </tableForm.tbody>
            </tableForm.table>
          </tableForm.BodyTopContentDiv>
        </tableForm.BodyTopContent>

        <tableForm.BodyContent>
          <tableForm.BodyContentFram>
            <tableForm.BodyContentFramDiv>
              <tableForm.BodyContentDivText>
                <Typography className="sub-title" sx={{ flex: '1 0 0' }}>
                  Fuel Consumption
                </Typography>
              </tableForm.BodyContentDivText>
              <tableForm.table>
                <tableForm.tbody>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      PRV Ramp In Remain Fuel
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.prvRampInRemainFuel)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.prvRampInRemainFuelKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Ramp Out Remain Fuel
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.rampOutRemainFuel)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.rampOutRemainFuelKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Ramp In Remain Fuel
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.rampInRemainFuel)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.rampInRemainFuelKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Fuel Consumption (Method B)
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelComsumptionCalc)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelComsumptionCalcKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Fuel Consumption (Block)
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelComsuptionFinal)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelComsuptionFinalKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Route Maximum Value
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.routeMaximumValue)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.routeMaximumValueKg)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Fuel Uplift
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelUpliftLbs)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            lbs
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(fuelConsumption.fuelUplift)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            {fuelConsumption.fuelUpliftUnit}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-sm" className="label-modal-grid-header">
                      Fuel Density
                    </tableForm.td>
                    <tableForm.td variant="lg">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatNumber(fuelConsumption.fuelDensity)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            {fuelConsumption.fuelDensityUnit}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                </tableForm.tbody>
              </tableForm.table>
            </tableForm.BodyContentFramDiv>
            <tableForm.BodyContentFramBottomDiv>
              <tableForm.BodyContentDivText>
                <Typography className="sub-title" sx={{ flex: '1 0 0' }}>
                  Tonne-Kilometer
                </Typography>
              </tableForm.BodyContentDivText>
              <tableForm.table>
                <tableForm.tbody>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Passenger Tonne-Kilometer (ICAO)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalPassengerTkIcao)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Passenger Tonne-Kilometer (EU ETS)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalPassengerTkEuets)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Freight Tonne-Kilometer (ICAO)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalFreightTkIcao)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Freight Tonne-Kilometer (EU ETS)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalFreightTkEuets)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Tonne-Kilometer (ICAO)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalTkIcao)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Tonne-Kilometer (EU ETS)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatTonneKilometer(tonneKilometer.totalTkEuets)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            TK
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                </tableForm.tbody>
              </tableForm.table>
            </tableForm.BodyContentFramBottomDiv>
          </tableForm.BodyContentFram>

          <tableForm.BodyContentSecondFram sx={{ flex: '1 0 0' }}>
            {/* Payload */}
            <tableForm.BodyContentFramBottomDiv>
              <tableForm.BodyContentDivText>
                <Typography className="sub-title" sx={{ flex: '1 0 0' }}>
                  Payload
                </Typography>
              </tableForm.BodyContentDivText>
              <tableForm.table>
                <tableForm.tbody>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Adult
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.adult)}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Child
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.child)}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Infant
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.infant)}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Positioning Crew
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.positioningCrew)}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Number of Passenger
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.totalNumberPassenger)}
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Mass of Passenger (ICAO)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.totalMassPassengerIcao)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Mass of Passenger (EU ETS)
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.totalMassPassengerEuets)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg" className="label-modal-grid-header">
                      Total Mass of Freight & Mail
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatInteger(payload.totalMassFreightMail)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            kg
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                </tableForm.tbody>
              </tableForm.table>
            </tableForm.BodyContentFramBottomDiv>
            {/* GCD */}
            <tableForm.BodyContentFramBottomDiv>
              <tableForm.BodyContentDivText>
                <Typography className="sub-title" sx={{ flex: '1 0 0' }}>
                  GCD
                </Typography>
              </tableForm.BodyContentDivText>
              <tableForm.table>
                <tableForm.tbody>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg">
                      <Typography className="label-modal-grid-header">GCD (ICAO)</Typography>
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatNumber(gcd.gcdIcao)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            km
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                  <tableForm.tr>
                    <tableForm.td variant="hd-lg">
                      <Typography className="label-modal-grid-header">GCD+95km (EU ETS)</Typography>
                    </tableForm.td>
                    <tableForm.td variant="md">
                      <tableForm.LabelTextArea>
                        <tableForm.LabelText>
                          <tableForm.LabelTypography className="label-modal-grid-column">
                            {formatNumber(gcd.gcdEuets)}
                          </tableForm.LabelTypography>
                          <tableForm.LabelTypography
                            className="label-modal-grid-column"
                            sx={{ width: '38px' }}
                          >
                            km
                          </tableForm.LabelTypography>
                        </tableForm.LabelText>
                      </tableForm.LabelTextArea>
                    </tableForm.td>
                  </tableForm.tr>
                </tableForm.tbody>
              </tableForm.table>
            </tableForm.BodyContentFramBottomDiv>
          </tableForm.BodyContentSecondFram>
        </tableForm.BodyContent>
      </Box>
    </Fragment>
  );

  return (
    <Fragment>
      <TableTemplate
        open={open}
        onClose={onClose || (() => {})}
        title={header.fltNo}
        subTitle={dayjs(header.date).format('YYYY.MM.DD')}
        component={component}
      />
    </Fragment>
  );
};

export default FlightDetailsModal;
