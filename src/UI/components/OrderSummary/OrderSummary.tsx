// Components
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';
import styles from './OrderSummary.module.scss';
import { useAppStore } from '@/UI/lib/zustand/store';
import Warning from '../Icons/Warning';
import ArrowUpRight from '../Icons/ArrowUpRight';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { formatNumber, getNumberValue } from '@/UI/utils/Numbers';
import Modal from '../Modal/Modal';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import Input from '../Input/Input';
import Balance, { Currency } from '../Balance/Balance';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import { TABLE_COLLATERAL_SUMMARY } from '@/UI/constants/tableCollateral';
import { useDevice } from '@/UI/hooks/useDevice';

// Types
type OrderSummaryMarketsProps = {
  limit: string | number;
  collatarelETH: string | number;
  collatarelUSDC: string | number;
  premium?: string | number;
  fee: string | number;
  submitAuction: () => void;
  asContainer?: boolean;
};

const OrderSummaryMarkets = ({
  limit,
  collatarelETH,
  collatarelUSDC,
  premium = '-',
  fee,
  submitAuction,
  asContainer = true,
}: OrderSummaryMarketsProps) => {
  const { isAuthenticated, ithacaSDK, systemInfo } = useAppStore();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const [collateralSummary, setCollateralSummary] = useState(TABLE_COLLATERAL_SUMMARY);
  const [selectedCurrency, setSelectedCurrency] = useState<{ name: string; value: string }>({
    name: 'USDC',
    value: 'USDC',
  });
  const [modalAmount, setModalAmount] = useState('');
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const device = useDevice();

  useBalance({
    address,
    token: systemInfo.tokenAddress['WETH'] as `0x${string}`,
    watch: true,
    onSuccess(balanceWETH) {
      setCollateralSummary(summary => ({
        ...summary,
        WETH: { ...summary['WETH'], walletBalance: balanceWETH.formatted },
      }));
    },
  });

  useBalance({
    address,
    token: systemInfo.tokenAddress['USDC'] as `0x${string}`,
    watch: true,
    onSuccess(balanceUSDC) {
      setCollateralSummary(summary => ({
        ...summary,
        USDC: { ...summary['USDC'], walletBalance: balanceUSDC.formatted },
      }));
    },
  });

  const fetchFundlockState = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const fundlockState = await ithacaSDK.client.fundLockState();
      const fundlockWETH = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'WETH')];
      const fundlockUSDC = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'USDC')];
      setCollateralSummary(summary => ({
        ['WETH']: { ...summary['WETH'], ...fundlockWETH },
        ['USDC']: { ...summary['USDC'], ...fundlockUSDC },
      }));
    } catch (e) {
      console.log(e);
    }
  }, [ithacaSDK, isAuthenticated]);

  useEffect(() => {
    fetchFundlockState();
  }, [fetchFundlockState]);

  const handleSubmitToAuction = () => {
    if (Number(premium) >= collateralSummary['USDC'].fundLockValue) {
      setModalOpen(true);
    } else {
      submitAuction();
    }
  };

  const Container = ({ children }: { children: ReactNode }) =>
    asContainer ? (
      <Panel margin={`'br-20 p-20 ${device === 'desktop' ? 'mt-125' : 'mt-16'}`}>{children}</Panel>
    ) : (
      <>{children}</>
    );

  return (
    <Container>
      {!asContainer && <h3 className={`mb-12 mt-10 ${device !== 'desktop' && 'full-width'}`}>Order Summary</h3>}
      <Flex
        direction={device === 'desktop' ? 'row-space-between' : 'column-space-between'}
        gap={device !== 'desktop' ? 'gap-16' : 'gap-6'}
      >
        {asContainer && <h3 className={`mb-0 ${device !== 'desktop' && 'full-width'}`}>Order Summary</h3>}
        <div className={styles.orderWrapper}>
          <Flex direction={device === 'desktop' ? 'column' : 'row-space-between'} gap='gap-6'>
            <h5>Order Limit</h5>
            <CurrencyDisplay amount={limit} symbol={<LogoUsdc />} currency='USDC' />
          </Flex>
        </div>
        <Flex direction={device === 'desktop' ? 'column' : 'row-space-between'} gap='gap-6'>
          <h5>Collateral Requirement</h5>
          <Flex direction={device === 'desktop' ? 'row' : 'justify-end'} gap='gap-10'>
            <CurrencyDisplay amount={collatarelETH} symbol={<LogoEth />} currency='WETH' />
            <CurrencyDisplay amount={collatarelUSDC} symbol={<LogoUsdc />} currency='USDC' />
          </Flex>
        </Flex>
        <div className={styles.platformWrapper}>
          <Flex direction={device === 'desktop' ? 'column' : 'row-space-between'} gap='gap-6'>
            <h5 className=''>Platform Fee</h5>
            <CurrencyDisplay amount={fee} symbol={<LogoUsdc />} currency='USDC' />
          </Flex>
        </div>
        <Flex direction={device === 'desktop' ? 'column' : 'row-space-between'} gap='gap-6'>
          <h5 className='color-white'>Total Premium</h5>
          <CurrencyDisplay
            amount={premium !== '-' ? formatNumber(Number(premium), 'string') : '-'}
            symbol={<LogoUsdc />}
            currency='USDC'
          />
        </Flex>
        <Flex direction='column'>
          <Button size='lg' title='Click to submit to auction' onClick={handleSubmitToAuction}>
            Submit to Auction
          </Button>
          {Number(premium) > collateralSummary['USDC'].fundLockValue && (
            <div className={styles.balanceWarning}>
              <Warning /> <div className={styles.balanceText}>Insufficient Balance</div> <ArrowUpRight />
            </div>
          )}
        </Flex>
      </Flex>
      <Modal
        title='Manage Funds'
        isOpen={modalOpen}
        isLoading={transactionInProgress}
        onCloseModal={() => setModalOpen(false)}
        onSubmitOrder={async () => {
          setTransactionInProgress(true);
          const currency = systemInfo.tokenAddress[selectedCurrency.value];
          const amount = parseUnits(modalAmount, systemInfo.tokenDecimals[selectedCurrency.value]);

          try {
            const hash = await ithacaSDK.fundlock.deposit(currency, amount);
            await publicClient.waitForTransactionReceipt({ hash });
            setTimeout(fetchFundlockState, 5000);
          } catch (error) {
            console.log(`Failed to Deposit`, error);
          }
          setModalAmount('');
          setSelectedCurrency({
            name: 'USDC',
            value: 'USDC',
          });
          setTransactionInProgress(false);
        }}
      >
        <Flex direction='row-space-between' gap='gap-15'>
          <DropdownMenu
            className='full-width'
            options={[
              {
                name: 'WETH',
                value: 'WETH',
              },
              {
                name: 'USDC',
                value: 'USDC',
              },
            ]}
            value={selectedCurrency}
            onChange={option => setSelectedCurrency({ name: option, value: option })}
            iconStart={selectedCurrency && collateralSummary[selectedCurrency.value].currencyLogo}
          />
          <Input
            className='full-width'
            containerClassName='full-width'
            value={modalAmount}
            onChange={({ target }) => setModalAmount(getNumberValue(target.value))}
          />
          <Button
            variant='secondary'
            size='sm'
            title='Select All Assets'
            onClick={() => selectedCurrency && setModalAmount(collateralSummary[selectedCurrency.value].walletBalance)}
          >
            All
          </Button>
        </Flex>
        {selectedCurrency && (
          <Balance
            selectedCurrency={selectedCurrency.value as Currency}
            fundLock={collateralSummary[selectedCurrency.value].fundLockValue}
            balance={collateralSummary[selectedCurrency.value].walletBalance}
            margin='mtb-20'
          />
        )}
      </Modal>
    </Container>
  );
};

export default OrderSummaryMarkets;
