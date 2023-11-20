// Packages
import dynamic from 'next/dynamic';
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { parseAbi, parseUnits } from 'viem';

// Constants
import { TABLE_COLLATERAL_SUMMARY } from '@/UI/constants/tableCollateral';
import { MODAL_TABS } from '@/UI/constants/tabs';

// Store
import { useAppStore } from '@/UI/lib/zustand/store';

// Utils
import { getNumberValue } from '@/UI/utils/Numbers';

// Components
import Balance from '@/UI/components/Balance/Balance';
import Button from '@/UI/components/Button/Button';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import Tabs from '@/UI/components/Tabs/Tabs';
import Input from '@/UI/components/Input/Input';
import TableCollateral from '@/UI/components/TableCollateral/TableCollateral';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false,
});

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

const CollateralPanel = () => {
  const { systemInfo, ithacaSDK, isAuthenticated } = useAppStore();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [collateralSummary, setCollateralSummary] = useState(TABLE_COLLATERAL_SUMMARY);
  const [selectedCurrency, setSelectedCurrency] = useState<{ name: string; value: string }>();
  const [modalAmount, setModalAmount] = useState('');
  const [modalTab, setModalTab] = useState<string>('deposit');
  const [transactionInProgress, setTransactionInProgress] = useState(false);

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
    const fundlockState = await ithacaSDK.client.fundLockState();
    const fundlockWETH = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'WETH')];
    const fundlockUSDC = fundlockState[fundlockState.findIndex(fundlock => fundlock.currency === 'USDC')];
    setCollateralSummary(summary => ({
      ['WETH']: { ...summary['WETH'], ...fundlockWETH },
      ['USDC']: { ...summary['USDC'], ...fundlockUSDC },
    }));
  }, [ithacaSDK]);

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
      console.error('Failed to claim faucet', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFundlockState();
  }, [isAuthenticated, fetchFundlockState]);

  return (
    <>
      <Panel margin='p-30'>
        <h3>Collateral</h3>
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
        {!address && <DisconnectedWallet />}
      </Panel>
      <Modal
        title='Manage Funds'
        isOpen={!!selectedCurrency}
        onCloseModal={() => setSelectedCurrency(undefined)}
        isLoading={transactionInProgress}
        onSubmitOrder={async () => {
          if (!selectedCurrency) return;
          setTransactionInProgress(true);
          const currency = systemInfo.tokenAddress[selectedCurrency.value];
          const amount = parseUnits(modalAmount, systemInfo.tokenDecimals[selectedCurrency.value]);

          try {
            let hash;
            if (modalTab === 'deposit') {
              hash = await ithacaSDK.fundlock.deposit(currency, amount);
            } else {
              hash = await ithacaSDK.fundlock.withdraw(currency, amount);
            }
            await publicClient.waitForTransactionReceipt({ hash });
            setTimeout(fetchFundlockState, 5000);
          } catch (error) {
            console.log(`Failed to ${modalTab}`, error);
          }
          setModalAmount('');
          setSelectedCurrency(undefined);
          setTransactionInProgress(false);
        }}
      >
        <Tabs tabs={MODAL_TABS} className='mb-20' activeTab={modalTab} onChange={setModalTab} />
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
            fundLock={collateralSummary[selectedCurrency.value].fundLockValue}
            balance={collateralSummary[selectedCurrency.value].walletBalance}
            margin='mtb-20'
          />
        )}
      </Modal>
    </>
  );
};

export default CollateralPanel;
