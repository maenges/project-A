import { Fragment, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { EtsButton, EtsModal } from '@/components/EtsCommon';
import { buttonForm, tableForm } from '@/assets/style';
import { TableTemplate } from '@/components/Teamplate';
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { toast } from 'react-toastify';

export type EmissionFactorTierModalProps = {
  open: boolean;
  onClose?: () => void;
};

// 타입 정의
interface CommonCodeData {
  id: number;
  groupCode: string;
  codeName: string;
  codeValue: string;
  useYn: boolean;
}

interface TierData {
  id: number;
  useYn?: boolean;
  codeValue?: string;
  description: string;
}

type TierDataMap = {
  EU_ETS: TierData;
  UK_ETS: TierData;
  CORSIA: TierData;
  REFUEL_EU: TierData;
};

const TIER_CONFIG = {
  EU_ETS: { type: 'boolean', description: 'EU_ETS Emission Value' },
  UK_ETS: { type: 'boolean', description: 'UK_ETS Emission Value' },
  CORSIA: { type: 'string', description: 'CORSIA Emission Value' },
  REFUEL_EU: { type: 'string', description: 'REFUEL_EU Emission Value' },
} as const;

const EmissionFactorTierModal = ({ open, onClose }: EmissionFactorTierModalProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [tierData, setTierData] = useState<TierDataMap | null>(null);
  const [originalData, setOriginalData] = useState<TierDataMap | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/admin/common-code',
        method: Method.GET,
        params: {
          queryParams: {
            groupCode: 'EMI_FAC_TIER1',
            useYn: true,
          },
        },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg || '데이터 조회에 실패했습니다.');
        return;
      }

      const dataArray = res.data as CommonCodeData[];
      const parsedData = parseResponseData(dataArray);

      setTierData(parsedData);
      setOriginalData(parsedData);
    } catch (error) {
      console.error('fetchData error:', error);
      toast.error('데이터 조회 중 오류가 발생했습니다.');
    }
  };

  const parseResponseData = (dataArray: CommonCodeData[]): TierDataMap => {
    const result: Partial<TierDataMap> = {};

    dataArray.forEach((item) => {
      const config = TIER_CONFIG[item.codeName as keyof typeof TIER_CONFIG];
      if (!config) return;

      result[item.codeName as keyof TierDataMap] = {
        id: item.id,
        description: config.description,
        ...(config.type === 'boolean' ? { useYn: item.useYn } : { codeValue: item.codeValue }),
      };
    });

    return result as TierDataMap;
  };

  const handleSave = async () => {
    if (!tierData) return;

    try {
      const commonCodeList = Object.entries(tierData).map(([codeName, data]) => ({
        id: data.id,
        action: 'U',
        groupCode: 'EMI_FAC_TIER1',
        codeName,
        codeValue: data.codeValue || '',
        relatedGroupCode: '',
        relatedValue: '',
        description: data.description,
        useYn: data.useYn ?? true,
      }));

      const res = await callApi({
        service: Service.POSTMAN,
        url: '/api/v1/admin/common-code',
        method: Method.POST,
        params: {
          bodyParams: { commonCodeList },
        },
        config: { isLoading: true },
      });

      if (res.successOrNot !== 'Y') {
        toast.error(res.HeaderMsg || '저장에 실패했습니다.');
        return;
      }

      toast.success('저장되었습니다.');
      setIsEditable(false);
      await fetchData();
    } catch (error) {
      console.error('handleSave error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setTierData(originalData);
    setIsEditable(false);
  };

  const updateTierData = (
    key: keyof TierDataMap,
    field: 'useYn' | 'codeValue',
    value: boolean | string
  ) => {
    if (!tierData) return;

    setTierData({
      ...tierData,
      [key]: {
        ...tierData[key],
        [field]: value,
      },
    });
  };

  if (!tierData) {
    return null;
  }

  const component = (
    <Fragment>
      <buttonForm.Container>
        <buttonForm.Row>
          {isEditable ? (
            <>
              <EtsButton type="grey" onClick={handleCancel}>
                Cancel
              </EtsButton>
              <EtsButton type="blue" onClick={() => setSaveOpen(true)}>
                Save
              </EtsButton>
            </>
          ) : (
            <EtsButton type="grey" onClick={() => setIsEditable(true)}>
              Edit
            </EtsButton>
          )}
        </buttonForm.Row>
      </buttonForm.Container>
      <tableForm.table>
        <tableForm.thead>
          <tableForm.tr className="label-modal-grid-header">
            <tableForm.td variant="base">Regulatory</tableForm.td>
            <tableForm.td variant="orange">EU_ETS</tableForm.td>
            <tableForm.td variant="orange">UK_ETS</tableForm.td>
            <tableForm.td variant="orange">CORSIA</tableForm.td>
            <tableForm.td variant="orange">REFUEL_EU</tableForm.td>
          </tableForm.tr>
        </tableForm.thead>
        <tableForm.tbody>
          <tableForm.tr className="label-modal-grid-column">
            <tableForm.td variant="base">CO2 Factor</tableForm.td>
            <tableForm.td className="modal-body-text">
              <tableForm.EditableCell
                isEditable={isEditable}
                type="check"
                value={tierData.EU_ETS?.useYn ?? false}
                onChange={(e) => updateTierData('EU_ETS', 'useYn', e as boolean)}
              />
            </tableForm.td>
            <tableForm.td className="modal-body-text">
              <tableForm.EditableCell
                isEditable={isEditable}
                type="check"
                value={tierData.UK_ETS?.useYn ?? false}
                onChange={(e) => updateTierData('UK_ETS', 'useYn', e as boolean)}
              />
            </tableForm.td>
            <tableForm.td className="modal-body-text">
              <tableForm.EditableCell
                isEditable={isEditable}
                value={tierData.CORSIA?.codeValue ?? ''}
                onChange={(e) => updateTierData('CORSIA', 'codeValue', e.target.value)}
              />
            </tableForm.td>
            <tableForm.td className="modal-body-text">
              <tableForm.EditableCell
                isEditable={isEditable}
                value={tierData.REFUEL_EU?.codeValue ?? ''}
                onChange={(e) => updateTierData('REFUEL_EU', 'codeValue', e.target.value)}
              />
            </tableForm.td>
          </tableForm.tr>
        </tableForm.tbody>
      </tableForm.table>
    </Fragment>
  );

  const saveModal = (
    <>
      <EtsModal open={saveOpen} size={420} onClose={() => setSaveOpen(false)}>
        <EtsModal.Header onClose={() => setSaveOpen(false)} />
        <EtsModal.Body>
          <Typography className="label-modal-sm" component="h1">
            Save Data
          </Typography>
          <Typography className="modal-body-text" mt={2}>
            변경된 데이터를 저장하시겠습니까?
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
                await handleSave();
                setSaveOpen(false);
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
    <>
      {saveModal}
      <TableTemplate
        open={open}
        onClose={onClose || (() => {})}
        title="Emission Factor - Tier 1"
        component={component}
      />
    </>
  );
};

export default EmissionFactorTierModal;
