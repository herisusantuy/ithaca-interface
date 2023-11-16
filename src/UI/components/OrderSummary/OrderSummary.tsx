// Components
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

// Types
type OrderSummaryProps = {
  limit: string | number;
  collatarelETH: string | number;
  collatarelUSDC: string | number;
  premium: string | number;
  fee: string | number;
  submitAuction: () => void;
};

const OrderSummary = ({ limit, collatarelETH, collatarelUSDC, premium, fee, submitAuction }: OrderSummaryProps) => {
  return (
    <Panel margin='br-22 p-20 mt-125'>
      <Flex direction='row-space-between' gap='gap-24'>
        <h3 className='mb-0 full-width'>Order Summary</h3>
        <Flex direction='column' gap='gap-6'>
          <h5>Order Limit</h5>
          <CurrencyDisplay amount={limit} symbol={<LogoUsdc />} currency='USDC' />
        </Flex>
        <Flex direction='column' gap='gap-6'>
          <h5>Collateral Requirement</h5>
          <Flex gap='gap-10'>
            <CurrencyDisplay amount={collatarelETH} symbol={<LogoEth />} currency='WETH' />
            <CurrencyDisplay amount={collatarelUSDC} symbol={<LogoUsdc />} currency='USDC' />
          </Flex>
        </Flex>
        <Flex direction='column' gap='gap-6'>
          <h5 className='color-white'>Total Premium</h5>
          <CurrencyDisplay amount={premium} symbol={<LogoUsdc />} currency='USDC' />
        </Flex>
        <Flex direction='column' gap='gap-6'>
          <h5 className='fs-xxs'>Platform Fee</h5>
          <CurrencyDisplay amount={fee} symbol={<LogoUsdc />} currency='USDC' size='sm' />
        </Flex>
        <Button size='lg' title='Click to submit to auction' onClick={() => submitAuction()}>
          Submit to Auction
        </Button>
      </Flex>
    </Panel>
  );
};

export default OrderSummary;
