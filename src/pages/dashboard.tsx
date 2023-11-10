// Packages
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';

// Constants
import { TABLE_FUND_LOCK_DATA } from '@/UI/constants/tableFundLock';

// Components
import Meta from '@/UI/components/Meta/Meta';
import CollateralPanel from '@/UI/components/CollateralPanel/CollateralPanel';
import Tabs from '@/UI/components/Tabs/Tabs';
import { TABLE_TYPE } from '@/UI/components/TableOrder/TableOrder';
import TableFundLock from '@/UI/components/TableFundLock/TableFundLock';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';

const TableOrder = dynamic(() => import('@/UI/components/TableOrder/TableOrder'), {
  ssr: false,
});

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';

const Dashboard = () => {
  const { isDisconnected } = useAccount();

  const renderDisconnectedMessage = () => isDisconnected && <DisconnectedWallet showButton={false} />;

  const DASHBOARD_TABS = [
    {
      id: 'liveOrders',
      label: 'Live Orders',
      content: (
        <>
          <TableOrder type={TABLE_TYPE.LIVE} isDisconnected={isDisconnected} />
          {renderDisconnectedMessage()}
        </>
      ),
    },
    {
      id: 'positions',
      label: 'Positions',
      content: (
        <>
          <TableOrder type={TABLE_TYPE.ORDER} isDisconnected={isDisconnected} />
          {renderDisconnectedMessage()}
        </>
      ),
    },
    {
      id: 'tradeHistory',
      label: 'Trade History',
      content: (
        <>
          <TableOrder type={TABLE_TYPE.TRADE} isDisconnected={isDisconnected} />
          {renderDisconnectedMessage()}
        </>
      ),
    },
    {
      id: 'fundLockHistory',
      label: 'Fund Lock History',
      content: (
        <>
          <TableFundLock data={TABLE_FUND_LOCK_DATA} isDisconnected={isDisconnected} />
          {renderDisconnectedMessage()}
        </>
      ),
    },
  ];

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <CollateralPanel isDisconnected={isDisconnected} />
          <Panel margin='p-30 mt-15'>
            <Tabs tabs={DASHBOARD_TABS} />
          </Panel>
        </Container>
      </Main>
    </>
  );
};

export default Dashboard;
