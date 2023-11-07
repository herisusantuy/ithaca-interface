// Packages
import dynamic from 'next/dynamic';

// Components
import Meta from '@/UI/components/Meta/Meta';

// Constants
import { TABLE_ORDER_DATA_WITH_EXPANDED } from '@/UI/constants/tableOrder';

// Components
import CollateralPanel from '@/UI/components/CollateralPanel/CollateralPanel';
import Tabs from '@/UI/components/Tabs/Tabs';

const TableOrder = dynamic(() => import('@/UI/components/TableOrder/TableOrder'), {
  ssr: false,
});

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';

const Dashboard = () => {
  const DASHBOARD_TABS = [
    {
      id: 'liveOrders',
      label: 'Live Orders',
      content: <TableOrder data={TABLE_ORDER_DATA_WITH_EXPANDED} />,
    },
    {
      id: 'positions',
      label: 'Positions',
      content: <p>Coming soon.</p>,
    },
    {
      id: 'tradeHistory',
      label: 'Trade History',
      content: <p>Coming soon.</p>,
    },
    {
      id: 'fundLockHistory',
      label: 'Fund Lock History',
      content: <p>Coming soon.</p>,
    },
  ];

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <CollateralPanel />
          <Panel margin='p-30 mt-15'>
            <Tabs tabs={DASHBOARD_TABS} />
          </Panel>
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;
