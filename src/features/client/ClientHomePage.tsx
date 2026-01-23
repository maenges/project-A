import styled from 'styled-components';
import { useState } from 'react';
import {
  ClientSiteHeader,
  ClientHeroBanner,
  ClientCategoryRow,
  ClientProviderGrid,
  ClientHomeInfoGrid,
} from './components';

const Page = styled.div`
  min-height: 100vh;
  background: transparent;
  color: inherit;
`;

const Spacer = styled.div`
  height: 10px;
`;

type HomeTab = 'casino' | 'slot';

const ClientHomePage = () => {
  const [tab, setTab] = useState<HomeTab>('casino');

  return (
    <Page id="top">
      <ClientSiteHeader />
      <ClientHeroBanner />
      <ClientCategoryRow activeTab={tab} onChange={setTab} />
      <Spacer />
      <ClientProviderGrid tab={tab} />
      <ClientHomeInfoGrid />
    </Page>
  );
};

export default ClientHomePage;
