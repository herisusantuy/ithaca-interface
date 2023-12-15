// Packages
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import CollateralPanel from '@/UI/components/CollateralPanel/CollateralPanel';
import Tabs from '@/UI/components/Tabs/Tabs';
import { TABLE_TYPE } from '@/UI/components/TableOrder/TableOrder';
import TableFundLock from '@/UI/components/TableFundLock/TableFundLock';

const TableOrder = dynamic(() => import('@/UI/components/TableOrder/TableOrder'), {
  ssr: false,
});

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';

const DASHBOARD_TABS = [
  {
    id: 'liveOrders',
    label: 'Live Orders',
    content: <TableOrder type={TABLE_TYPE.LIVE} />,
  },
  {
    id: 'positions',
    label: 'Positions',
    content: <TableOrder type={TABLE_TYPE.ORDER} cancelOrder={false} description={false} />,
  },
  {
    id: 'tradeHistory',
    label: 'Trade History',
    content: <TableOrder type={TABLE_TYPE.TRADE} cancelOrder={false} description={false} />,
  },
  {
    id: 'fundLockHistory',
    label: 'Fund Lock History',
    content: <TableFundLock />,
  },
];

const Dashboard = () => {
  const [dashboardTab, setDashboardTab] = useState(DASHBOARD_TABS[0].id);

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <CollateralPanel />
          <Panel margin='p-desktop-30 mt-15 p-tablet-16'>
            <Tabs tabs={DASHBOARD_TABS} activeTab={dashboardTab} onChange={setDashboardTab} />
          </Panel>
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;
