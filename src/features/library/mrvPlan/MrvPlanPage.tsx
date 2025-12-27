import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Stack } from '@mui/material';
import { Worker } from '@react-pdf-viewer/core';
// 뷰어의 코어 스타일을 가져옵니다.
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { rotatePlugin } from '@react-pdf-viewer/rotate';
import { Viewer, LocalizationMap, SpecialZoomLevel, RotateDirection } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import chevronRight from '@/assets/images/chevron-right.svg';
import menuSvg from '@/assets/images/menu.svg';
import plusSvg from '@/assets/images/plus.svg';
import minusSvg from '@/assets/images/minus.svg';
// import presentationSvg from '@/assets/images/presentation.svg';
import horizontalSvg from '@/assets/images/horizontal-fit.svg';
import verticalSvg from '@/assets/images/vertical-fit.svg';
import rotateSvg from '@/assets/images/rotate-90.svg';
import downloadSvg from '@/assets/images/round-download.svg';
import printSvg from '@/assets/images/round-print.svg';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { buttonForm } from '@/assets/style';
import { Service } from '@models/common/Service';
import { callApi, Method } from '@utils/ApiUtil';
import { useNotify } from '@hooks/useNotify';
// import deleteText from '@/assets/images/delete-text.svg';
// import icPlus from '@/assets/images/ic-plus.svg';

// 기본 레이아웃 플러그인과 스타일을 가져옵니다.

import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import ko from '@react-pdf-viewer/locales/lib/ko_KR.json';
import { EtsInput, EtsSelect, EtsButton, EtsModal, EtsFileUpload } from '@/components/EtsCommon';

const HeaderArea = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const NavigationItem = styled(Typography)`
  color: var(--color-brand-darkblue-100, #051766);
  font-weight: 700;
  font-size: 12px !important;
  line-height: 24px;
`;

const ViewerWrapper = styled(Box)`
  .rpv-default-layout__sidebar-headers {
    display: none;
  }

  .rpv-default-layout__sidebar-body {
    // 헤더가 사라지면서 생긴 불필요한 상단 여백을 제거합니다.
    padding-top: 0;
  }

  .rpv-page-navigation__current-page-input > .rpv-core__textbox {
    /* 줌 비율 텍스트와 유사한 크기로 조정합니다. */
    color: #fff;
    text-align: center;
    font-family: 'Sans';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .rpv-toolbar__label {
    color: #fff;
    text-align: center;
    font-family: 'Sans';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const MrvPlan = () => {
  // 기본 레이아웃 플러그인 인스턴스를 생성합니다.
  const koreanLocalization: LocalizationMap = {
    ...ko,
    scrollMode: {
      horizontalScrolling: '수평 스크롤링',
      verticalScrolling: '수직 스크롤링',
      pageScrolling: '페이지 스크롤링',
      wrappedScrolling: '자동줄바꿈 스크롤링',
      singlePage: '단일 페이지',
      dualPage: '이중 페이지',
      dualPageCover: '이중 페이지(표지 포함)',
    },
  };

  const zoomPluginInstance = zoomPlugin();
  const rotatePluginInstance = rotatePlugin();

  const [data, setData] = useState<any[]>([]);
  const { toast } = useNotify();
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const createMrvPlan = async (formData: FormData) => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/library/mrv-plan',
      method: Method.POST, // POST 메서드로 변경
      config: { isLoading: true, isFile: true },
      params: {
        bodyParams: formData,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      toast.success('등록 되었습니다.');
      // 모달 닫고 상태 초기화
      setIsNew(false);
      setNewLabel('');
      setNewSelectedFile(null);
      // 목록 새로고침
      mrvPlanList();
    });
  };

  const deleteMrvPlan = async (fileId: number) => {
    callApi({
      service: Service.POSTMAN,
      url: `/api/v1/library/mrv-plan/${fileId}`,
      method: Method.DELETE,
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      toast.success('삭제되었습니다.');
      setIsDelete(false); // 모달 닫기
      mrvPlanList(); // 목록 새로고침
    });
  };

  const updatePdfUrl = async (fileId: number, formData: FormData) => {
    callApi({
      service: Service.POSTMAN,
      url: `/api/v1/library/mrv-plan/${fileId}`,
      method: Method.PUT,
      config: { isLoading: true, isFile: true },
      params: {
        bodyParams: formData,
      },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      toast.success('수정 되었습니다.');
      setIsEditable(false); // 모달 닫기
      mrvPlanList();
    });
  };

  const searchPdfUrl = async (fileId: number) => {
    callApi({
      service: Service.POSTMAN,
      url: `/api/v1/library/mrv-plan/${fileId}`,
      method: Method.GET,
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const fullS3Url = res.data as string;
      if (!fullS3Url) {
        setPdfUrl('');
        return;
      }

      setPdfUrl(fullS3Url);
    });
  };

  const mrvPlanList = () => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/v1/library/mrv-plan',
      method: Method.GET,
      config: { isLoading: true },
    }).then((res) => {
      if (res.successOrNot !== 'Y') {
        return toast.error(res.HeaderMsg);
      }

      const initialData = res.data.map((item: any) => ({
        ...item,
        label: item.fileName,
        value: item.fileUrl,
      }));

      setData(initialData);

      // 데이터가 있을 경우 첫 번째 항목을 기본값으로 설정
      if (initialData.length > 0) {
        const firstItem = initialData[0];
        setFileValue(firstItem.value);
        setFileLabel(firstItem.label);
        setFileId(firstItem.id);
        searchPdfUrl(firstItem.id);
      } else {
        // 데이터가 없을 경우 모든 상태를 초기화
        setFileValue(null);
        setFileLabel('');
        setFileId(null);
        setPdfUrl('');
      }
    });
  };

  // 화면 최초 진입
  useEffect(() => {
    mrvPlanList();
  }, []);

  const [isEditable, setIsEditable] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [newLabel, setNewLabel] = useState<string | null>('');
  const [newSelectedFile, setNewSelectedFile] = useState<File | null>(null);

  const [isDelete, setIsDelete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { Rotate } = rotatePluginInstance;

  const [fitMode, setFitMode] = useState<'width' | 'actualSize'>('actualSize');
  const [fileLabel, setFileLabel] = useState<string | null>('');
  const [fileValue, setFileValue] = useState<string | null>('');
  const [fileId, setFileId] = useState<number | null>(0);

  // const defaultLayoutPluginInstance = defaultLayoutPlugin(); // DEFAULT UI
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
      <Toolbar>
        {(slots: ToolbarSlot) => {
          return (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
              }}
            >
              {/* 1. 파일 이름 표시 영역 */}
              <button
                className="rpv-core__minimal-button"
                style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: '32px' }}
              >
                <img
                  src={menuSvg}
                  alt="menu"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    defaultLayoutPluginInstance.toggleTab(0);
                  }}
                />
              </button>

              {/* 2. 중앙: 페이지 이동 및 줌 컨트롤 */}
              <Box
                sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {/* 왼쪽 영역: 페이지 이동 */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {fileValue ? fileValue.split('/').pop() : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box className="rpv-toolbar__item">
                      <slots.GoToPreviousPage />
                    </Box>
                    <Box className="rpv-toolbar__item">
                      <slots.CurrentPageInput />
                    </Box>
                    <Box className="rpv-toolbar__item">
                      <Box className="rpv-toolbar__label">
                        / <slots.NumberOfPages />
                      </Box>
                    </Box>
                    <Box className="rpv-toolbar__item">
                      <slots.GoToNextPage />
                    </Box>
                  </Box>
                </Box>

                {/* 중앙 영역: 줌 컨트롤 */}
                <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 16px' }}>
                  <Box
                    sx={{ borderLeft: '1px solid #BDBDC7', height: '24px', marginRight: '16px' }}
                  />
                  <slots.ZoomOut>
                    {(props) => (
                      <button className="rpv-core__minimal-button" onClick={props.onClick}>
                        <img
                          src={minusSvg}
                          alt="Zoom Out"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </button>
                    )}
                  </slots.ZoomOut>
                  <Box style={{ padding: '0px 8px' }}>
                    <slots.Zoom />
                  </Box>
                  <slots.ZoomIn>
                    {(props) => (
                      <button className="rpv-core__minimal-button" onClick={props.onClick}>
                        <img
                          src={plusSvg}
                          alt="Zoom In"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </button>
                    )}
                  </slots.ZoomIn>
                  <Box
                    sx={{ borderLeft: '1px solid #BDBDC7', height: '24px', marginLeft: '16px' }}
                  />
                </Box>

                {/* 오른쪽 영역: 보기 모드 및 회전 */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <button
                    className="rpv-core__minimal-button"
                    onClick={() => {
                      if (fitMode === 'width') {
                        setFitMode('actualSize');
                        zoomPluginInstance.zoomTo(SpecialZoomLevel.ActualSize);
                      } else {
                        setFitMode('width');
                        zoomPluginInstance.zoomTo(SpecialZoomLevel.PageWidth);
                      }
                    }}
                  >
                    <img
                      src={fitMode === 'width' ? verticalSvg : horizontalSvg}
                      alt="Toggle Fit Mode"
                      style={{ width: '24px', height: '24px' }}
                    />
                  </button>
                  <Rotate direction={RotateDirection.Forward}>
                    {(props) => (
                      <button className="rpv-core__minimal-button" onClick={props.onClick}>
                        <img
                          src={rotateSvg}
                          alt="Rotate forward"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </button>
                    )}
                  </Rotate>
                </Box>
              </Box>

              {/* 3. 우측: 기타 도구 */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  minWidth: '100px',
                  justifyContent: 'flex-end',
                }}
              >
                <slots.Download>
                  {(props) => (
                    <button className="rpv-core__minimal-button" onClick={props.onClick}>
                      <img
                        src={downloadSvg}
                        alt="Download"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </button>
                  )}
                </slots.Download>
                <slots.Print>
                  {(props) => (
                    <button className="rpv-core__minimal-button" onClick={props.onClick}>
                      <img src={printSvg} alt="Print" style={{ width: '24px', height: '24px' }} />
                    </button>
                  )}
                </slots.Print>
              </Box>
            </Box>
          );
        }}
      </Toolbar>
    ),
  });

  const { pathname } = useLocation();

  const createNavigation = () => {
    const pathSegments = pathname.split('/').filter((segment: any) => segment.length > 0);
    const navigationItems = ['Home']; // 항상 Home으로 시작

    // 각 path segment를 처리하여 네비게이션 아이템 생성
    pathSegments.forEach((segment: any) => {
      const formattedSegment = segment
        .replace(/-/g, ' ') // '-'를 ' '로 치환
        .replace(/\b\w/g, (l: any) => l.toUpperCase()) // 각 단어의 첫 글자를 대문자로
        .replace(/\B\w+/g, (l: any) => l.toLowerCase()); // 첫 글자를 제외한 나머지를 소문자로

      navigationItems.push(formattedSegment);
    });

    return navigationItems;
  };

  const navigationItems = createNavigation();

  return (
    <>
      <Container maxWidth={false} disableGutters sx={{ width: '100%', mx: 0 }}>
        <HeaderArea direction={'row'}>
          {/* 페이지 제목 */}
          <Typography className="label-lg" component="h1" sx={{ mt: 3 }}>
            MRV Plan
          </Typography>
          {/* 네비게이션 영역 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navigationItems.map((item, index) => (
              <React.Fragment key={index}>
                <NavigationItem
                  sx={{ fontWeight: index === navigationItems.length - 1 ? '700' : '500' }}
                >
                  {item}
                </NavigationItem>
                {index < navigationItems.length - 1 && (
                  <NavigationItem sx={{ display: 'flex', alignItems: 'end' }}>
                    <img src={chevronRight} alt="chevron-right" />
                  </NavigationItem>
                )}
              </React.Fragment>
            ))}
          </Box>
        </HeaderArea>
        {/* 콤보 박스 영역 */}
        <Box
          sx={{
            display: 'flex',
            paddingTop: '24px',
            paddingBottom: '12px',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            alignSelf: 'stretch',
          }}
        >
          <Box display="flex" alignItems="center">
            <Stack direction="row" alignItems="center" gap={'16px'} sx={{ height: '36px' }}>
              <Typography className="label" style={{ marginLeft: '0px !important' }}>
                File Name
              </Typography>
            </Stack>
            <Box ml={2}>
              <EtsSelect
                value={fileValue}
                name={fileLabel ?? undefined}
                onChange={(e) => {
                  const newValue = e.target.value as string;
                  const selectedOption = data.find((option) => option.value === newValue);

                  // fileValue와 fileLabel 상태를 함께 업데이트합니다.
                  setFileValue(newValue);
                  if (selectedOption) {
                    setFileLabel(selectedOption.label);
                    setFileId(selectedOption.id);
                    searchPdfUrl(selectedOption.id);
                  }
                }}
                options={data}
                sx={{ width: 300 }}
              />
            </Box>
          </Box>
          {/* 버튼 영역 */}
          <Box>
            <buttonForm.Container>
              <buttonForm.Row>
                <EtsButton
                  type="grey"
                  onClick={() => {
                    setIsDelete(true);
                  }}
                >
                  Delete
                </EtsButton>
                <EtsButton
                  type="grey"
                  onClick={() => {
                    setIsNew(true);
                  }}
                >
                  New
                </EtsButton>
                <EtsButton
                  type="grey"
                  onClick={() => {
                    setIsEditable(true);
                  }}
                >
                  Edit
                </EtsButton>
              </buttonForm.Row>
            </buttonForm.Container>
          </Box>
        </Box>

        {/* 삭제 모달 영역 */}
        <EtsModal open={isDelete} size={420} onClose={() => setIsDelete(false)}>
          <EtsModal.Header onClose={() => setIsDelete(false)} />
          <EtsModal.Body>
            <Typography className="label-modal-sm" component="h1">
              Delete PDF
            </Typography>
            <Typography className="modal-body-text" mt={3}>
              파일을 삭제하시겠습니까?
            </Typography>
            <Typography className="modal-body-text-sub" mt={3}>
              ※ 삭제된 파일은 복구할 수 없습니다.
            </Typography>
          </EtsModal.Body>
          <EtsModal.Footer>
            <>
              <EtsButton
                className="modal-foot-text-cancel"
                type="outlined"
                variant="outlined"
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </EtsButton>
              <EtsButton
                className="modal-foot-text-cancel"
                type="contained"
                variant="contained"
                onClick={() => {
                  if (!fileId) {
                    toast.error('삭제할 파일을 선택해주세요.');
                    return;
                  }
                  deleteMrvPlan(fileId);
                }}
              >
                Save
              </EtsButton>
            </>
          </EtsModal.Footer>
        </EtsModal>

        {/* NEW 모달 영역 */}
        <EtsModal
          open={isNew}
          size={420}
          onClose={() => {
            setIsNew(false);
            setNewSelectedFile(null);
            setNewLabel('');
          }}
        >
          <EtsModal.Header
            onClose={() => {
              setIsNew(false);
              setNewSelectedFile(null);
              setNewLabel('');
            }}
          />
          <EtsModal.Body>
            <Typography className="label-modal-sm" component="h1">
              Add File
            </Typography>
            <Typography className="modal-body-text" mt={2} mb={2}>
              파일을 새로 추가 합니다.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EtsInput
                sx={{ width: 300 }}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="제목을 지정해주세요."
              />
            </Box>
            <EtsFileUpload
              key="new-file-upload"
              multiple={false}
              accept=".pdf"
              onChange={(files) => {
                setNewSelectedFile(files ? files[0] : null);
              }}
            />
          </EtsModal.Body>
          <EtsModal.Footer>
            <>
              <EtsButton
                variant="outlined"
                type="outlined"
                onClick={() => {
                  setIsNew(false);
                  setNewSelectedFile(null);
                  setNewLabel('');
                }}
              >
                Cancel
              </EtsButton>
              <EtsButton
                variant="contained"
                type="contained"
                onClick={() => {
                  if (!newLabel) {
                    return toast.error('파일 이름을 입력해주세요.');
                  }
                  if (!newSelectedFile) {
                    return toast.error('업로드할 파일을 선택해주세요.');
                  }

                  const formData = new FormData();
                  formData.append('fileName', newLabel);
                  formData.append('file', newSelectedFile);

                  createMrvPlan(formData);
                }}
              >
                Save
              </EtsButton>
            </>
          </EtsModal.Footer>
        </EtsModal>
        {/* Edit 모달 영역 */}
        <EtsModal
          open={isEditable}
          size={420}
          onClose={() => {
            setIsEditable(false);
            setSelectedFile(null);
          }}
        >
          <EtsModal.Header
            onClose={() => {
              setIsEditable(false);
              setSelectedFile(null);
            }}
          />
          <EtsModal.Body>
            <Typography className="label-modal-sm" component="h1">
              Edit File
            </Typography>
            <Typography className="modal-body-text" mt={2} mb={2}>
              파일을 수정 합니다.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EtsInput
                sx={{ width: 300 }}
                value={fileLabel}
                onChange={(e) => setFileLabel(e.target.value)}
                placeholder="제목을 지정해주세요."
              />
            </Box>
            <EtsFileUpload
              key={fileValue}
              multiple={false}
              accept=".pdf"
              onChange={(files) => {
                setSelectedFile(files ? files[0] : null);
              }}
            />
            {(() => {
              const currentItem = data.find((item) => item.value === fileValue);
              if (currentItem) {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      padding: 'var(--size-8, 8px) var(--size-16, 16px)',
                      alignItems: 'center',
                      alignSelf: 'stretch',
                      borderRadius: 'var(--radius-sm, 8px)',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'var(--color-text-label, #051766)',
                        fontFamily: 'var(--font-family-hanjingroup-sans, "Sans")',
                        fontSize: 'var(--font-body-sm, 14px)',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '150%',
                        wordBreak: 'break-all',
                      }}
                    >
                      {currentItem.value.split('/').pop()}
                    </Typography>
                  </Box>
                );
              }
              return null;
            })()}
          </EtsModal.Body>
          <EtsModal.Footer>
            <>
              <EtsButton
                variant="outlined"
                type="outlined"
                onClick={() => {
                  setIsEditable(false);
                  setSelectedFile(null); // 임시 파일 선택 취소
                }}
              >
                Cancel
              </EtsButton>
              <EtsButton
                variant="contained"
                type="contained"
                onClick={() => {
                  if (!fileId) {
                    toast.error('파일 ID가 없습니다.');
                    return;
                  }
                  if (!fileLabel) {
                    toast.error('파일 이름을 입력해주세요.');
                    return;
                  }

                  const formData = new FormData();
                  formData.append('fileName', fileLabel);

                  // 사용자가 새 파일을 선택한 경우에만 file을 추가
                  if (selectedFile) {
                    formData.append('file', selectedFile);
                  }

                  updatePdfUrl(fileId, formData);
                }}
              >
                Save
              </EtsButton>
            </>
          </EtsModal.Footer>
        </EtsModal>
        <Worker workerUrl={pdfjsWorker}>
          <ViewerWrapper
            sx={{
              width: '100%',
              height: 'calc(100vh - 240px)', // 원하는 그리드 최대 높이 지정
              overflow: 'auto', // 내부 스크롤
            }}
          >
            {pdfUrl && (
              <Viewer
                theme="dark"
                defaultScale={SpecialZoomLevel.ActualSize}
                localization={koreanLocalization}
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance, zoomPluginInstance, rotatePluginInstance]}
              />
            )}
          </ViewerWrapper>
        </Worker>
      </Container>
    </>
  );
};

export default MrvPlan;
