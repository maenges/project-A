import React from 'react';
import * as S from './DashboardPage.style';
import { Stack } from '@mui/system';
import performanceRankingIcon from '@/assets/images/performance-ranking.svg';
import actypeIcon from '@/assets/images/actype.svg';
import excessBaggageIcon from '@/assets/images/excess-baggage.svg';
import flightSideIcon from '@/assets/images/flight-side.svg';
import airportInformationIcon from '@/assets/images/airport-information.svg';
import AircraftFleetStatus from './helper/AircraftFleetStatus';
import DestinationControl from './helper/DestinationControl';
import EmissionIntensity from './helper/EmissionIntensity';
import MonthlyEmissions from './helper/MonthlyEmissions';
import EmissionStatus from './helper/EmissionStatus';
import FlightFrequency from './helper/FlightFrequency';

const DashboardPage: React.FC = () => {
  const HeaderFrontArea = ({
    icon,
    titleContent,
  }: {
    icon: React.ReactNode;
    titleContent: React.ReactNode;
  }) => {
    return (
      <Stack
        direction={'row'}
        gap={'0.5rem'}
        alignItems={'center'}
        sx={{
          '@media (max-height: 1050px)': {
            gap: '0.25rem',
          },
          '@media (max-height: 700px)': {
            gap: '0.125rem',
          },
          '@media (max-height: 600px)': {
            gap: '0.0625rem',
          },
          '& img': {
            '@media (max-height: 1050px)': {
              width: '18px',
              height: '18px',
            },
            '@media (max-height: 700px)': {
              width: '14px',
              height: '14px',
            },
            '@media (max-height: 600px)': {
              width: '10px',
              height: '10px',
            },
          },
        }}
      >
        {icon}
        {titleContent}
      </Stack>
    );
  };

  const HeaderDownArea = () => {
    return (
      <Stack
        direction={'row'}
        gap={'1rem'}
        alignItems={'center'}
        justifyContent={'end'}
        paddingTop={'0.75rem'}
        color={'#051766'}
        sx={{
          '@media (max-height: 1050px)': {
            gap: '0.5rem',
            paddingTop: '0.1rem',
            fontSize: '0.75rem',
          },
          '@media (max-height: 700px)': {
            gap: '0.25rem',
            paddingTop: '0.1rem',
            fontSize: '0.5rem',
          },
          '@media (max-height: 600px)': {
            gap: '0.125rem',
            paddingTop: '0.1',
            fontSize: '0.375rem',
          },
        }}
      >
        <Stack
          direction={'row'}
          gap={'0.5rem'}
          alignItems={'center'}
          border="none"
          sx={{
            '@media (max-height: 1050px)': {
              gap: '0.25rem',
            },
            '@media (max-height: 700px)': {
              gap: '0.125rem',
            },
            '@media (max-height: 600px)': {
              gap: '0.0625rem',
            },
          }}
        >
          <Stack
            direction={'row'}
            gap={'0.5rem'}
            sx={{
              '@media (max-height: 1050px)': {
                gap: '0.25rem',
              },
              '@media (max-height: 700px)': {
                gap: '0.125rem',
              },
              '@media (max-height: 600px)': {
                gap: '0.0625rem',
              },
            }}
          >
            <S.IntCircle />
            <S.IntPatternCircle />
          </Stack>
          International
        </Stack>
        <Stack
          direction={'row'}
          gap={'0.5rem'}
          alignItems={'center'}
          border="none"
          sx={{
            '@media (max-height: 1050px)': {
              gap: '0.25rem',
            },
            '@media (max-height: 700px)': {
              gap: '0.125rem',
            },
            '@media (max-height: 600px)': {
              gap: '0.0625rem',
            },
          }}
        >
          <Stack
            direction={'row'}
            gap={'0.5rem'}
            sx={{
              '@media (max-height: 1050px)': {
                gap: '0.25rem',
              },
              '@media (max-height: 700px)': {
                gap: '0.125rem',
              },
              '@media (max-height: 600px)': {
                gap: '0.0625rem',
              },
            }}
          >
            <S.DomCircle />
            <S.DomPatternCircle />
          </Stack>
          Domestic
        </Stack>
      </Stack>
    );
  };

  return (
    <S.Container gap={'0.75rem'}>
      <S.ParentArea>
        <Stack direction={'row'} gap={'1rem'} width={'100%'} alignItems={'center'}>
          <S.TopHeaderArea width={'fit-content'} flexShrink={0}>
            <HeaderFrontArea
              icon={<img src={actypeIcon} alt="performance ranking" />}
              titleContent={
                <S.HeaderFrontContent gap={'0.5rem'}>
                  항공기 보유 현황 :
                  <S.HeaderFrontContent style={{ fontWeight: '700' }}> 165</S.HeaderFrontContent>
                  <S.HeaderFrontContent style={{ fontWeight: '400', fontSize: '0.75rem' }}>
                    2025.08
                  </S.HeaderFrontContent>
                </S.HeaderFrontContent>
              }
            />
          </S.TopHeaderArea>
          <Stack flex={1} minWidth={0}>
            <AircraftFleetStatus />
          </Stack>
        </Stack>
      </S.ParentArea>
      <S.InnerContainer direction={'row'}>
        <S.FlexArea3_5>
          <S.InnerHeader $isborder={true}>
            <HeaderFrontArea
              icon={<img src={airportInformationIcon} alt="performance ranking" />}
              titleContent={<S.HeaderFrontContent>취항지 규제 현황</S.HeaderFrontContent>}
            />
            <S.HeaderBackText>Total : 300</S.HeaderBackText>
          </S.InnerHeader>
          <DestinationControl />
        </S.FlexArea3_5>
        <S.InnerContainer sx={{ flex: 1 }}>
          <S.SubParentArea sx={{ maxHeight: '22vh !important' }}>
            <S.InnerHeader $isborder={true}>
              <HeaderFrontArea
                icon={<img src={performanceRankingIcon} alt="performance ranking" />}
                titleContent={<S.HeaderFrontContent>배출집약도 Top</S.HeaderFrontContent>}
              />
              <S.HeaderBackText>*km당</S.HeaderBackText>
            </S.InnerHeader>
            <EmissionIntensity />
          </S.SubParentArea>
          <S.SubParentArea>
            <S.InnerHeader $isborder={true}>
              <HeaderFrontArea
                icon={<img src={flightSideIcon} alt="performance ranking" />}
                titleContent={<S.HeaderFrontContent>운항횟수 현황</S.HeaderFrontContent>}
              />
              <S.HeaderBackText>*회</S.HeaderBackText>
            </S.InnerHeader>
            <HeaderDownArea />
            <FlightFrequency />
          </S.SubParentArea>
        </S.InnerContainer>
      </S.InnerContainer>
      <S.InnerContainer sx={{ flex: 0.6 }} direction={'row'}>
        <S.FlexArea3_5>
          <S.InnerHeader $isborder={true}>
            <HeaderFrontArea
              icon={<img src={excessBaggageIcon} alt="performance ranking" />}
              titleContent={
                <S.HeaderFrontContent gap={'0.5rem'}>
                  연간 월별 배출량 현황
                  <S.HeaderFrontContent style={{ fontWeight: '700' }}> 2025</S.HeaderFrontContent>
                </S.HeaderFrontContent>
              }
            />
            <S.HeaderBackText>*tCO2</S.HeaderBackText>
          </S.InnerHeader>
          <HeaderDownArea />
          <MonthlyEmissions />
          {/* <MonthlyEmissionsMUI /> */}
        </S.FlexArea3_5>
        <S.InnerContainer sx={{ flex: 1 }}>
          <S.SubParentArea>
            <S.InnerHeader $isborder={true}>
              <HeaderFrontArea
                icon={<img src={excessBaggageIcon} alt="performance ranking" />}
                titleContent={<S.HeaderFrontContent>배출량 현황</S.HeaderFrontContent>}
              />
              <S.HeaderBackText>*tCO2</S.HeaderBackText>
            </S.InnerHeader>
            <HeaderDownArea />
            <EmissionStatus />
          </S.SubParentArea>
        </S.InnerContainer>
      </S.InnerContainer>
    </S.Container>
  );
};

export default DashboardPage;
