// Packages
import { useState } from 'react';

// Components
import Meta from '@/UI/components/Meta/Meta';
import TabCard from '@/UI/components/TabCard/TabCard';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import TradingLayout from '@/UI/layouts/TradingLayout/TradingLayout';

// Constants
import { TRADING_MARKET_TABS } from '@/UI/constants/tabCard';
import { Currency } from '@/UI/components/Currency';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <TradingLayout/>
          <Currency
            setOrderSummary
            setChartData
            setPositionBuilderStrategies
          />
          <TabCard
            className='mt-39'
            tabs={TRADING_MARKET_TABS}
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        </Container>
      </Main>
    </>
  );
};

export default Index;
