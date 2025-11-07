import React from 'react';
import * as XLSX from 'xlsx';
import { useLoadingStore } from '@/store/loading';

export interface EtsExportProps {
  gridRef: React.RefObject<any>;
  fileName: string;
}

const EtsExport = ({ gridRef, fileName }: EtsExportProps) => {
  if (gridRef.current && gridRef.current.api) {
    // 로딩 시작
    useLoadingStore.getState().showLoading();

    // 대용량 데이터를 위해 충분한 시간을 두고 로딩
    setTimeout(() => {
      try {
        // 1. CSV 데이터 추출
        const csv = gridRef.current.api.getDataAsCsv();

        // 2. CSV를 SheetJS로 파싱
        const workbook = XLSX.read(csv, { type: 'string' });
        const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // 3. Blob으로 변환 후 다운로드
        const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        // 로딩 종료
        useLoadingStore.getState().hideLoading();
      }
    }, 50);
  }
};

export default EtsExport;
