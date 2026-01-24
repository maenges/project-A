import ClientProviderGrid from '../components/ClientProviderGrid';
import type { MenuInfo, MenuKey } from '../ClientMenu.types';

type Props = {
  menuKey: MenuKey;
  menu: MenuInfo;
};

const ClientCasinoPage = (_props: Props) => {
  return (
    <>
      <ClientProviderGrid tab="casino" />
    </>
  );
};

export default ClientCasinoPage;
