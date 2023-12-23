// Packages
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { FetchBalanceResult } from '@wagmi/core';
import { useCallback, useEffect, useState } from 'react';
import { parseAbi, parseUnits } from 'viem';

// Constants
import { TABLE_COLLATERAL_SUMMARY } from '@/UI/constants/tableCollateral';
import { TABLET_BREAKPOINT } from '@/UI/constants/breakpoints';

// Store
import { useAppStore } from '@/UI/lib/zustand/store';

// Hooks
import useMediaQuery from '@/UI/hooks/useMediaQuery';
import useToast from '@/UI/hooks/useToast';

// Components
import Button from '@/UI/components/Button/Button';
import TableCollateral from '@/UI/components/TableCollateral/TableCollateral';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';
import Toast from '@/UI/components/Toast/Toast';
import ManageFundsModal from './ManageFundsModal';
// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

const CollateralPanel = () => {
  const { systemInfo, ithacaSDK, isAuthenticated } = useAppStore();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const tabletBreakpoint = useMediaQuery(TABLET_BREAKPOINT);
  const [collateralSummary, setCollateralSummary] = useState(TABLE_COLLATERAL_SUMMARY);
  const [selectedCurrency, setSelectedCurrency] = useState<{ name: string; value: string }>();
  const [modalTab, setModalTab] = useState<string>('deposit');
  const { toastList, position, showToast } = useToast();

  const handleSuccess = (item: 'WETH' | 'USDC') => (balance: FetchBalanceResult) => {
    setCollateralSummary(summary => ({
      ...summary,
      [item]: { ...summary[item], walletBalance: balance.formatted },
    }));
  };

  useBalance({
    address,
    token: systemInfo.tokenAddress['WETH'] as `0x${string}`,
    watch: true,
    onSuccess: handleSuccess('WETH'),
  });

  useBalance({
    address,
    token: systemInfo.tokenAddress['USDC'] as `0x${string}`,
    watch: true,
    onSuccess: handleSuccess('USDC'),
  });

  const fetchFundlockState = useCallback(async () => {
    const fundlockState = await ithacaSDK.client.fundLockState();
    const fundlockWETH = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'WETH')];
    const fundlockUSDC = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'USDC')];
    setCollateralSummary(summary => ({
      ['WETH']: { ...summary['WETH'], ...fundlockWETH },
      ['USDC']: { ...summary['USDC'], ...fundlockUSDC },
    }));
  }, [ithacaSDK]);

  // Refetch fundlock state every X seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated) return;
      fetchFundlockState();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchFundlockState, isAuthenticated]);

  const getFaucet = async (currency: string) => {
    if (!walletClient) return;
    try {
      const hash = await walletClient.writeContract({
        address: systemInfo.tokenAddress[currency] as `0x${string}`,
        abi: parseAbi(['function mint(address to, uint256 amount) external']),
        functionName: 'mint',
        args: [walletClient.account.address, parseUnits('100', systemInfo.tokenDecimals[currency])],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      showToast(
        {
          id: Math.floor(Math.random() * 1000),
          title: 'Faucet Failed',
          message: 'Faucet Failed, please try again.',
          type: 'error',
        },
        'top-right'
      );
      console.error('Failed to claim faucet', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFundlockState();
  }, [isAuthenticated, fetchFundlockState]);

  const showModal = (type: string) => {
    setModalTab(type);
    setSelectedCurrency({ name: Object.keys(collateralSummary)[0], value: Object.keys(collateralSummary)[0] });
  };

  return (
    <>
      <Panel margin='p-desktop-30 p-tablet-16'>
        <h3>Collateral</h3>
        <Toast toastList={toastList} position={position} />
        <TableCollateral
          collateralSummary={collateralSummary}
          deposit={(currency: string) => {
            setModalTab('deposit');
            setSelectedCurrency({ name: currency, value: currency });
          }}
          withdraw={(currency: string) => {
            setModalTab('withdraw');
            setSelectedCurrency({ name: currency, value: currency });
          }}
          faucet={currency => getFaucet(currency)}
        />
        {tabletBreakpoint && (
          <Flex direction='row-center' gap='gap-8' margin='mt-16'>
            <Button
              title='Click to deposit'
              variant='secondary'
              size='sm'
              role='button'
              onClick={() => showModal('deposit')}
              className='full-width'
            >
              Deposit
            </Button>
            <Button
              title='Click to withdraw'
              size='sm'
              variant='primary'
              onClick={() => showModal('withdraw')}
              className='full-width'
            >
              Withdraw
            </Button>

            {/** TO DO(issue): Add onClick handlers for Faucet. In this here we have to use specific design for chossing the currency for this function.*/}
            <Button title='Click to faucet' size='sm' variant='primary' onClick={() => {}} className='full-width'>
              Faucet
            </Button>
          </Flex>
        )}
        {!address && <DisconnectedWallet />}
      </Panel>
      <ManageFundsModal
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        isOpen={!!selectedCurrency}
        collateralSummary={collateralSummary}
        modalTab={modalTab}
        setModalTab={setModalTab}
      />
    </>
  );
};

export default CollateralPanel;
