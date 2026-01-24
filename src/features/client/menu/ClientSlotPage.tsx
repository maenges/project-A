import ClientProviderGrid from '../components/ClientProviderGrid';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const ClientSlotPage = (_props: Props) => {
  return (
    <>
      <ClientProviderGrid tab="slot" />
    </>
  );
};

export default ClientSlotPage;
