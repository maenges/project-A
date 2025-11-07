export type Menu = {
  userId: string;
  menuId: string;
  serviceId?: string;
  projectCode?: string;
  permit?: string;
  description: string;
};

export interface TopMenuProps {
  menus: Menu[];
}
