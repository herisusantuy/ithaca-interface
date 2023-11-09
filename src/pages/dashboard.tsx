// Packages
import dynamic from 'next/dynamic';

// Components
import Meta from '@/UI/components/Meta/Meta';

// Components
import CollateralPanel from '@/UI/components/CollateralPanel/CollateralPanel';
import Tabs from '@/UI/components/Tabs/Tabs';
import { TABLE_TYPE } from '@/UI/components/TableOrder/TableOrder';

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
      content: <TableOrder type={TABLE_TYPE.LIVE} />,
    },
    {
      id: 'positions',
      label: 'Positions',
      content: <TableOrder type={TABLE_TYPE.ORDER} />,
    },
    {
      id: 'tradeHistory',
      label: 'Trade History',
      content: <TableOrder type={TABLE_TYPE.TRADE} />,
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
