import React from 'react';
import { Box, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
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
  items: EtsTreeNode[];
  selectedId?: string;
  width?: number | string;
  onSelect?: (id: string) => void;
  sx?: any;
}

const TreeNode: React.FC<{
  node: EtsTreeNode;
  level: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
}> = ({ node, level, selectedId, onSelect }) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const hasChildren = !!node.children?.length;
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    if (hasChildren) setOpen((o) => !o);
    if (!hasChildren && onSelect) onSelect(node.id);
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
          onClick={(e) => {
            if (!hasChildren) return;
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {hasChildren ? (
            open ? (
              <ExpandMore fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )
          ) : null}
        </Box>
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
          primaryTypographyProps={{ noWrap: true }}
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
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const EtsLeftTree: React.FC<EtsLeftTreeProps> = ({
  items,
  selectedId,
  width = 240,
  onSelect,
  sx,
}) => {
  return (
    <Box
      sx={(theme) => ({
        width,
        minWidth: width,
        height: '100%',
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        borderRight:
          theme.palette.mode === 'light'
            ? '1px solid rgba(0,0,0,0.12)'
            : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 0,
        p: 0,
        overflow: 'auto',
        ...sx,
      })}
    >
      <List component="nav" sx={{ py: 0 }}>
        {items.map((item) => (
          <TreeNode
            key={item.id}
            node={item}
            level={0}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </List>
    </Box>
  );
};

export default EtsLeftTree;
