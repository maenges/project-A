import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  TextField,
  Checkbox,
} from '@mui/material';
// 조직 트리 API 및 서비스 상수, 알림 훅 임포트
import { callApi, Method } from '@/utils/ApiUtil';
import { Service } from '@/models/common/Service';
import { useNotify } from '@/hooks/useNotify';
import { alpha } from '@mui/material/styles';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CorporateFare from '@mui/icons-material/CorporateFare';
import Apartment from '@mui/icons-material/Apartment';
import Business from '@mui/icons-material/Business';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Storefront from '@mui/icons-material/Storefront';

export type EtsTreeNode = {
  id: string;
  label: string;
  children?: EtsTreeNode[];
};

export interface EtsLeftTreeProps {
  width?: number | string;
  sx?: any;
  // 선택 이벤트 콜백(선택된 id)
  onSelect?: (id: string) => void;

  /** 값이 변경될 때 트리 데이터를 재조회합니다. */
  reloadKey?: unknown;

  // 체크박스 사용 여부
  checkable?: boolean;
  // 컨트롤드 체크 상태
  checkedIds?: string[];
  // 언컨트롤드 초기 체크 상태
  defaultCheckedIds?: string[];
  // 전체 체크 목록 변경
  onCheckedIdsChange?: (checkedIds: string[]) => void;
  // 단건 체크 변경
  onCheckChange?: (id: string, checked: boolean) => void;
}

const TreeNode: React.FC<{
  node: EtsTreeNode;
  level: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  checkable?: boolean;
  isChecked?: (id: string) => boolean;
  onToggleCheck?: (id: string) => void;
}> = ({ node, level, selectedId, onSelect, checkable, isChecked, onToggleCheck }) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const hasChildren = !!node.children?.length;
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    if (onSelect) onSelect(node.id);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) setOpen((o) => !o);
  };

  const getLevelIcon = (lvl: number) => {
    switch (lvl) {
      case 0:
        return <CorporateFare fontSize="small" />; // 본사
      case 1:
        return <Apartment fontSize="small" />; // 부본사
      case 2:
        return <Business fontSize="small" />; // 지사
      case 3:
        return <LocalShipping fontSize="small" />; // 총판
      case 4:
      default:
        return <Storefront fontSize="small" />; // 매장 및 기타
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={isSelected}
        sx={(theme) => ({
          pl: 0,
          pr: 0.5,
          borderRadius: 0,
          alignItems: 'center',
          color: theme.palette.text.primary,
          transition: 'background-color 120ms ease, color 120ms ease',
          '&.Mui-selected': {
            // Sidebar 메뉴의 선택 색상과 동일하게 고정 0.16 알파 적용
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
            color: theme.palette.primary.main,
            '&:hover': {
              // 선택 상태에서는 hover 시 색 왜곡 방지: 동일 톤 유지
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
          },
          '&:hover': {
            // AG-Grid 호버 컬러와 매칭
            backgroundColor:
              theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.light, 0.5)
                : 'rgba(145, 158, 171, 0.08)',
          },
        })}
      >
        {/* Expand / collapse icon area (left aligned) */}
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            flexShrink: 0,
            cursor: hasChildren ? 'pointer' : 'default',
            color: 'inherit',
            ml: level * 2,
          }}
          onClick={handleIconClick}
        >
          {hasChildren ? (
            open ? (
              <ExpandMore fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )
          ) : null}
        </Box>

        {/* Checkbox (between expand icon and level icon) */}
        {checkable ? (
          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              flexShrink: 0,
              color: 'inherit',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              size="small"
              checked={isChecked?.(node.id) ?? false}
              onChange={() => onToggleCheck?.(node.id)}
              sx={(theme) => ({
                padding: 0,
                color: theme.palette.text.primary,
                '&.Mui-checked': {
                  color:
                    theme.palette.mode === 'dark'
                      ? `${theme.palette.primary.dark}`
                      : `${theme.palette.primary.light}`,
                },
              })}
            />
          </Box>
        ) : null}

        {/* Role icon per organization level */}
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            flexShrink: 0,
            color: 'inherit',
            mr: 0.5,
          }}
        >
          {getLevelIcon(level)}
        </Box>
        {/* Label with indentation based on level */}
        <ListItemText
          primary={node.label}
          primaryTypographyProps={{
            sx: {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            },
          }}
          sx={{ ml: 1 }}
        />
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                checkable={checkable}
                isChecked={isChecked}
                onToggleCheck={onToggleCheck}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// API 데이터 → 트리 변환 유틸
function buildTree(flat: any[]): EtsTreeNode[] {
  const nodeMap = new Map<string, EtsTreeNode>();
  const roots: EtsTreeNode[] = [];
  flat.forEach((item) => {
    nodeMap.set(item.group_key, {
      id: item.group_key,
      label: item.group_name,
      children: [],
    });
  });
  flat.forEach((item) => {
    const node = nodeMap.get(item.group_key)!;
    if (item.group_parent_id && nodeMap.has(item.group_parent_id)) {
      nodeMap.get(item.group_parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  function clean(node: EtsTreeNode) {
    if (node.children && node.children.length === 0) delete node.children;
    else if (node.children) node.children.forEach(clean);
  }
  roots.forEach(clean);
  return roots;
}

const EtsLeftTree: React.FC<EtsLeftTreeProps> = ({
  width,
  sx,
  onSelect,
  reloadKey,
  checkable = false,
  checkedIds,
  defaultCheckedIds,
  onCheckedIdsChange,
  onCheckChange,
}) => {
  const { toast } = useNotify();
  const [treeItems, setTreeItems] = useState<EtsTreeNode[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [orgQuery, setOrgQuery] = useState<string>('');

  const selectedOrgIdRef = useRef<string>('');
  useEffect(() => {
    selectedOrgIdRef.current = selectedOrgId;
  }, [selectedOrgId]);

  const [internalCheckedIds, setInternalCheckedIds] = useState<Set<string>>(
    () => new Set(defaultCheckedIds ?? [])
  );

  const nodeIndex = useMemo(() => {
    const map = new Map<string, EtsTreeNode>();
    const walk = (n: EtsTreeNode) => {
      map.set(n.id, n);
      n.children?.forEach(walk);
    };
    treeItems.forEach(walk);
    return map;
  }, [treeItems]);

  const isChecked = (id: string) => {
    return checkedIds ? checkedIds.includes(id) : internalCheckedIds.has(id);
  };

  const toggleCheck = (id: string) => {
    const nextChecked = !isChecked(id);

    const collectDescendantIds = (node: EtsTreeNode, acc: string[]) => {
      acc.push(node.id);
      node.children?.forEach((child) => collectDescendantIds(child, acc));
    };

    const idsToToggle: string[] = [];
    const targetNode = nodeIndex.get(id);
    if (targetNode) {
      collectDescendantIds(targetNode, idsToToggle);
    } else {
      idsToToggle.push(id);
    }

    const base = checkedIds ? new Set(checkedIds) : new Set(internalCheckedIds);
    if (nextChecked) {
      idsToToggle.forEach((x) => base.add(x));
    } else {
      idsToToggle.forEach((x) => base.delete(x));
    }
    const nextIds = Array.from(base);

    if (!checkedIds) {
      setInternalCheckedIds(base);
    }

    onCheckChange?.(id, nextChecked);
    onCheckedIdsChange?.(nextIds);
  };

  // 트리 데이터 fetch
  useEffect(() => {
    callApi({
      service: Service.POSTMAN,
      url: '/api/group',
      method: Method.GET,
      params: {},
      config: { isLoading: false },
    })
      .then((res) => {
        if (res.successOrNot !== 'Y') {
          toast.error(res.HeaderMsg);
          return Promise.reject(res.HeaderMsg);
        }
        // API 데이터 트리 변환
        setTreeItems(buildTree(res.data ?? []));
        // 최상위 노드 자동 선택(기존 선택 유지 우선)
        if (res.data?.length) {
          const currentSelected = selectedOrgIdRef.current;
          const exists = currentSelected
            ? (res.data ?? []).some((x: any) => String(x?.group_key) === String(currentSelected))
            : false;
          if (!currentSelected || !exists) {
            const nextId = res.data[0].group_key;
            setSelectedOrgId(nextId);
            onSelect?.(nextId);
          }
        }
        return res;
      })
      .catch(() => {
        // ignore
      });
  }, [toast, reloadKey]);

  // 트리 필터링
  const filterTree = (nodes: EtsTreeNode[], q: string): EtsTreeNode[] => {
    const query = q.trim().toLowerCase();
    if (!query) return nodes;
    const walk = (node: EtsTreeNode): EtsTreeNode | null => {
      const labelMatch = node.label.toLowerCase().includes(query);
      if (labelMatch) {
        // 부모가 일치하면 모든 하위를 포함
        return { ...node, children: node.children };
      }
      // 부모가 일치하지 않으면 자식들 필터링
      const filteredChildren = node.children?.map(walk).filter((n): n is EtsTreeNode => !!n) || [];
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return nodes.map(walk).filter((n): n is EtsTreeNode => !!n);
  };
  const filteredTreeItems = useMemo(() => filterTree(treeItems, orgQuery), [treeItems, orgQuery]);

  // 검색 시 첫 매치 자동 선택
  useEffect(() => {
    if (!orgQuery) return;
    const findFirstMatchId = (nodes: EtsTreeNode[], q: string): string | null => {
      const query = q.trim().toLowerCase();
      if (!query) return null;
      const stack: EtsTreeNode[] = [...nodes];
      while (stack.length) {
        const n = stack.shift()!;
        if (n.label.toLowerCase().includes(query)) return n.id;
        if (n.children) stack.unshift(...n.children);
      }
      return null;
    };
    const firstId = findFirstMatchId(treeItems, orgQuery);
    if (firstId) setSelectedOrgId(firstId);
  }, [orgQuery, treeItems]);

  // 선택 이벤트
  const handleTreeSelect = (id: string) => {
    setSelectedOrgId(id);
    if (onSelect) onSelect(id);
  };

  return (
    <Box
      sx={[
        {
          mt: 3,
          width: width ?? 240,
          minWidth: width ?? 240,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 'calc(100vh - 220px)',
          overflow: 'hidden',
        },
        sx,
      ]}
    >
      <TextField
        size="small"
        placeholder="조직명 검색"
        value={orgQuery}
        onChange={(e) => setOrgQuery(e.target.value)}
        variant="outlined"
        sx={(theme) => ({
          m: 1,
          mb: 0.5,
          '& .MuiOutlinedInput-root': {
            height: '36px !important',
            minHeight: '36px',
            maxHeight: '36px',
            boxSizing: 'border-box',
            borderRadius: 8,
            backgroundColor:
              theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
            '& fieldset': {
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor:
                theme.palette.mode === 'light'
                  ? theme.palette.divider
                  : alpha(theme.palette.common.white, 0.24),
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1px',
            },
            '& input': {
              padding: '7px 12px',
              height: '20px !important',
            },
          },
        })}
      />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <List component="nav" sx={{ py: 0 }}>
          {filteredTreeItems.map((item) => (
            <TreeNode
              key={item.id}
              node={item}
              level={0}
              selectedId={selectedOrgId}
              onSelect={handleTreeSelect}
              checkable={checkable}
              isChecked={isChecked}
              onToggleCheck={toggleCheck}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default EtsLeftTree;
