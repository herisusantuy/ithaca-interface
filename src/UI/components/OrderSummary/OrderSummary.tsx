// Packages
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '../Button/Button';
import LogoEth from '../Icons/LogoEth';
import LogoUsdc from '../Icons/LogoUsdc';

// Styles
import styles from './OrderSummary.module.scss';
// Types
type OrderSummaryProps = {
  limit: string;
  collatarelETH: string;
  collatarelUSDC: string;
  premium: string;
  submitAuction: Function;
};

const OrderSummary = ({ limit, collatarelETH, collatarelUSDC, premium, submitAuction }: OrderSummaryProps) => (
  <Panel>
    <div className={styles.wrapper}>
      <Flex>
        <h3 className='nowrap color-white mt-10 mr-50'>Order Summary</h3>
        <Flex direction='column'>
          <h5 className='color-grey-400'>Order Limit</h5>
          <div className='nowrap'>
            <div className='mt-5'>
              <Flex>
                <h3 className='color-white mr-2'>{limit}</h3>
                <LogoUsdc />
                <p className='color-grey-400 ml-2'>USDC</p>
              </Flex>
            </div>
          </div>
        </Flex>
        <Flex direction='column'>
          <div className='mr-100'>
            <h5 className='color-grey-400 nowrap'>Collateral Requirement</h5>
            <div className='nowrap'>
              <div className='mt-5'>
                <Flex>
                  <h3 className='color-white mr-2'>{collatarelETH}</h3>
                  <LogoEth />
                  <p className='color-grey-400 ml-2'> WETH</p>
                </Flex>
              </div>
            </div>
          </div>
        </Flex>
        <div className='color-white mt-14 mr-50 nowrap'>
          <Flex>
            <h3 className='color-white mr-2'>{collatarelUSDC}</h3>
            <LogoUsdc />
            <p className='color-grey-400 ml-2'> USDC</p>
          </Flex>
        </div>
        <Flex direction='column'>
          <h5 className='color-white'>Total Premium</h5>
          <div className='nowrap'>
            <Flex>
              <h3 className='color-white mr-2'>{premium}</h3>
              <LogoUsdc />
              <p className='color-grey-400 ml-2'> USDC</p>
            </Flex>
          </div>
        </Flex>
        <Button size='sm' title='Click to add to Submit to Auction' onClick={() => submitAuction()}>
          Submit to Auction
        </Button>
      </Flex>
    </div>
  </Panel>
);

export default OrderSummary;
