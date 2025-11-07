import { useEffect, useState, useRef, useCallback } from 'react';
import { Stack } from '@mui/material';
import styled from 'styled-components';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 동적으로 모든 국가 이미지를 import
const countryImages = import.meta.glob('/src/assets/images/countries/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// 아이콘 이미지들을 import
import airportTerminalIcon from '/src/assets/images/airport-terminal.svg';
import flightSideIcon from '/src/assets/images/flight-side.svg';

// 국가 코드로 이미지 URL을 가져오는 헬퍼 함수
const getCountryImageUrl = (countryCode: string): string | null => {
  const imagePath = `/src/assets/images/countries/${countryCode}.svg`;
  return countryImages[imagePath] || null;
};

// 커스텀 툴팁 컴포넌트 (useCustomTooltip 방식)
const MapTooltipDiv = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.98);
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  pointer-events: none;
  z-index: 10001;
  display: none;
  width: fit-content;
  max-width: 17rem;
  font-family: var(--font-family-hanjingroup-sans, 'Arial', sans-serif);
`;

// 이미지 존재 리스트 (추후 개발시 리스트 enum등 빼야할듯)
const corsiaCountries = [
  'BH',
  'AE',
  'AM',
  'AT',
  'AU',
  'AZ',
  'BR',
  'BV',
  'CA',
  'CH',
  'CL',
  'CN',
  'CZ',
  'DE',
  'DO',
  'EG',
  'ES',
  'ET',
  'FR',
  'GB',
  'GE',
  'GH',
  'GR',
  'HK',
  'HU',
  'ID',
  'IN',
  'IT',
  'JP',
  'KH',
  'KR',
  'KZ',
  'LK',
  'MA',
  'MM',
  'MN',
  'MO',
  'MT',
  'MX',
  'MY',
  'NL',
  'NP',
  'NZ',
  'PE',
  'PH',
  'PL',
  'PT',
  'SA',
  'SE',
  'SG',
  'SK',
  'TH',
  'TR',
  'TW',
  'TZ',
  'US',
  'UZ',
  'VN',
];

// 지도용 툴팁 훅 (useCustomTooltip 패턴 적용)
const useMapTooltip = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mouseMoveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null);

  // 마우스 움직임 이벤트 핸들러
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!tooltipRef.current || tooltipRef.current.style.display === 'none') return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || 240;
    const tooltipHeight = tooltipRect.height || 180;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = mouseX + 15;
    let y = mouseY - tooltipHeight - 10;

    if (x + tooltipWidth > windowWidth) {
      x = mouseX - tooltipWidth - 15;
    }
    if (y < 0) {
      y = mouseY + 15;
    }
    if (y + tooltipHeight > windowHeight) {
      y = windowHeight - tooltipHeight - 10;
    }
    if (x < 0) {
      x = 10;
    }

    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  }, []);

  // 툴팁 표시
  const showTooltip = useCallback(
    (countryName: string, countryCode: string, event: any) => {
      if (!tooltipRef.current) return;

      // 국가 이미지 URL 가져오기
      const countryImageUrl = getCountryImageUrl(countryCode);

      // 툴팁 HTML 생성
      const tooltipHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
            <div style="width: 2.5rem; height: 2.5rem; min-width: 2.5rem; min-height: 2.5rem; max-width: 2.5rem; max-height: 2.5rem; border-radius: 50%; background: #57bbeb; display: flex; align-items: center; justify-content: center; overflow: hidden;">
              ${
                countryImageUrl
                  ? `<img src="${countryImageUrl}" alt="${countryName} flag" style="max-width: 100%; max-height: 100%;" onerror="this.style.display='none'; this.parentElement.style.background='#57BBEB';" />`
                  : ''
              }
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #2c3e50; margin-bottom: 0.25rem;">${countryName}</div>
              <div style="display: flex; gap: 0.9375rem;">
                <div style="display: flex; align-items: center; gap: 0.3125rem;">
                  <img src="${airportTerminalIcon}" style="width: 1.25rem; height: 1.25rem;" />
                  <div style="font-size: 1rem;">10</div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3125rem;">
                  <img src="${flightSideIcon}" style="width: 1.25rem; height: 1.25rem;" />
                  <div style="font-size: 1rem; color: #57bbeb; font-weight: 700;">10</div>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
            ${['CORSIA', 'ReFuelEU', 'EU-ETS', 'UK-ETS', 'K-ETS']
              .map(
                (label) =>
                  `<div style="font-size: 0.875rem; border-radius: 0.5rem; border: 1px solid #d9d9d9; padding: 0.25rem 0.375rem;">${label}</div>`
              )
              .join('')}
          </div>
        </div>
      `;

      tooltipRef.current.innerHTML = tooltipHTML;
      tooltipRef.current.style.display = 'block';

      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }

      mouseMoveHandlerRef.current = handleMouseMove;
      document.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(event.nativeEvent || event);
    },
    [handleMouseMove]
  );

  // 툴팁 숨김
  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
        mouseMoveHandlerRef.current = null;
      }
    }
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (mouseMoveHandlerRef.current) {
        document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
    };
  }, []);

  const TooltipComponent = () => <MapTooltipDiv ref={tooltipRef} />;

  return { showTooltip, hideTooltip, TooltipComponent };
};

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 15vh;
  margin-top: 0.5rem; /* 8px */
  position: relative;
  flex: 1;
  overflow: hidden;

  .leaflet-container {
    height: 100%;
    width: 100%;
    min-height: 15vh;
    background-color: #a7c7e7;
  }
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// 지도 하단 설명
// const Legend = styled.div`
//   position: absolute;
//   bottom: 20px;
//   right: 20px;
//   padding: 10px;
//   font-size: 14px;
//   line-height: 24px;
//   color: #555;
//   background: rgba(255, 255, 255, 0.9);
//   box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
//   border-radius: 5px;
//   z-index: 1000;

//   h4 {
//     margin: 0 0 10px 0;
//     font-size: 16px;
//     font-weight: bold;
//   }

//   .legend-item {
//     display: flex;
//     align-items: center;
//     margin-bottom: 5px;

//     .legend-color {
//       width: 18px;
//       height: 18px;
//       margin-right: 8px;
//       opacity: 0.8;
//       border: 1px solid #777;
//     }
//   }
// `;

export default function DestinationControl() {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const currentHoveredLayer = useRef<L.Path | null>(null);

  // 새로운 툴팁 훅 사용
  const { showTooltip, hideTooltip, TooltipComponent } = useMapTooltip();

  useEffect(() => {
    // GeoJSON 데이터 로딩
    fetch('/countries.geo.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('GeoJSON 파일 로딩 오류:', error);
        setLoading(false);
      });
  }, []);

  // 국가별 색상을 결정하는 함수
  const getCountryStyle = (feature: any) => {
    const countryCode = feature.properties.POSTAL;
    let fillColor = '#FFFFFF'; // 기본 흰색 지도
    const isCorsia = corsiaCountries.includes(countryCode);

    // if (isEuEts && isCorsia) {
    //   fillColor = '#1177A7'; // 중복 적용: 초록색
    // } else if (isEuEts) {
    //   fillColor = '#fd7e14'; // EU-ETS 단독: 주황색
    // } else if (isCorsia) {
    //   fillColor = '#051766'; // CORSIA 단독: 파란색
    // }
    if (isCorsia) {
      fillColor = '#051766'; // 중복 적용: 초록색
    }

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: '#E4E7EC',
      fillOpacity: 0.8,
    };
  };

  // 각 국가 피처에 이벤트 핸들러 추가
  const onEachFeature = (feature: any, layer: L.Path) => {
    const countryName = feature.properties.NAME;
    const countryCode = feature.properties.POSTAL;

    // 마우스 이벤트 추가
    layer.on({
      mouseover: function (e) {
        const targetLayer = e.target;

        // 이전 호버된 레이어 스타일 복원
        if (currentHoveredLayer.current && currentHoveredLayer.current !== targetLayer) {
          const prevFeature = (currentHoveredLayer.current as any).feature;
          if (prevFeature) {
            currentHoveredLayer.current.setStyle(getCountryStyle(prevFeature));
          }
        }

        // 스타일 변경
        targetLayer.setStyle({
          fillOpacity: 0.9,
          fillColor: '#1177A7',
        });

        currentHoveredLayer.current = targetLayer;

        // 새로운 툴팁 표시
        showTooltip(countryName, countryCode, e.originalEvent);
      },

      mouseout: function () {
        const targetLayer = currentHoveredLayer.current;

        if (targetLayer) {
          // 스타일 복원
          const result = getCountryStyle(feature);
          targetLayer.setStyle(result);
        }

        // 툴팁 숨기기
        hideTooltip();
        currentHoveredLayer.current = null;
      },
    });
  };

  if (loading) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: '100%', marginTop: '16px' }}
      >
        지도 데이터를 불러오는 중...
      </Stack>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapWrapper>
        <StyledMapContainer>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{
              height: '100%',
              width: '100%',
              // 바다 색상
              backgroundColor: '#F7F7F7',
            }}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
            boxZoom={false}
            keyboard={false}
            dragging={true}
            // autopan 관련 설정 완전 비활성화
            closePopupOnClick={false}
            bounceAtZoomLimits={false}
          >
            {geoData && (
              <GeoJSON data={geoData} style={getCountryStyle} onEachFeature={onEachFeature} />
            )}
          </MapContainer>
        </StyledMapContainer>
      </MapWrapper>
      <TooltipComponent />
    </div>
  );
}
