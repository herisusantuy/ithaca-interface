// Packages
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { parseUnits } from 'viem';

// Constants
import { TableCollateralSummary } from '@/UI/constants/tableCollateral';
import { MODAL_TABS } from '@/UI/constants/tabs';

// Store
import { useAppStore } from '@/UI/lib/zustand/store';

// Utils
import { getNumberValue } from '@/UI/utils/Numbers';

// Icons
import LogoArbitrum from '../Icons/LogoArbitrum';

// Components
import Balance, { Currency } from '@/UI/components/Balance/Balance';
import Button from '@/UI/components/Button/Button';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
import Tabs from '@/UI/components/Tabs/Tabs';
import Input from '@/UI/components/Input/Input';
import Loader from '../Loader/Loader';
const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false,
});

interface ManageFundsModalProps {
  modalTab: string;
  setModalTab: (item: string) => void;
  isOpen: boolean;
  selectedCurrency: { name: string; value: string } | undefined;
  setSelectedCurrency: (currency: { name: string; value: string } | undefined) => void;
  collateralSummary: TableCollateralSummary;
}
const ManageFundsModal = (props: ManageFundsModalProps) => {
  const { modalTab, setModalTab, isOpen, selectedCurrency, setSelectedCurrency, collateralSummary } = props;
  const { systemInfo, ithacaSDK } = useAppStore();
  const [modalAmount, setModalAmount] = useState('');
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCurrency) return;
    setIsTransactionInProgress(true);
    const currency = systemInfo.tokenAddress[selectedCurrency.value];
    const amount = parseUnits(modalAmount, systemInfo.tokenDecimals[selectedCurrency.value]);

    try {
      if (modalTab === 'deposit') {
        await ithacaSDK.fundlock.deposit(currency, amount);
      } else {
        await ithacaSDK.fundlock.withdraw(currency, amount);
      }
    } catch (error) {
      console.log(`Failed to ${modalTab}`, error);
    }
    setModalAmount('');
    setSelectedCurrency(undefined);
    setIsTransactionInProgress(false);
  };

  const modalFooterText = useMemo(() => {
    if (isTransactionInProgress) {
      return <Loader />;
    }
    return modalTab === 'deposit' ? 'Deposit' : 'Withdraw';
  }, [isTransactionInProgress, modalTab]);

  return (
    <Modal
      title='Manage Funds'
      isOpen={isOpen}
      onCloseModal={() => setSelectedCurrency(undefined)}
      isLoading={isTransactionInProgress}
      hideFooter={true}
    >
      <Tabs tabs={MODAL_TABS} className='mb-20' activeTab={modalTab} onChange={setModalTab} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
        <div style={{ flex: 1 }}>
          <DropdownMenu
            hasDropdown={false}
            className='full-width'
            options={[
              {
                name: 'Arbitrum',
                value: 'Arbitrum',
              },
            ]}
            value={{
              name: 'Arbitrum',
              value: 'Arbitrum',
            }}
            iconStart={<LogoArbitrum />}
          />
        </div>
        <div style={{ flex: 1 }}>
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
        </div>
        <div style={{ flex: 1 }}>
          <Input
            className='full-width'
            containerClassName='full-width'
            value={modalAmount}
            onChange={({ target }) => setModalAmount(getNumberValue(target.value))}
          />
        </div>
        <Button
          variant='secondary'
          size='sm'
          title='Select All Assets'
          onClick={() => selectedCurrency && setModalAmount(collateralSummary[selectedCurrency.value].walletBalance)}
        >
          All
        </Button>
      </div>
      {selectedCurrency && (
        <Balance
          selectedCurrency={selectedCurrency.value as Currency}
          fundLock={collateralSummary[selectedCurrency.value].fundLockValue}
          balance={collateralSummary[selectedCurrency.value].walletBalance}
          margin='mtb-20'
        />
      )}
      <Button
        disabled={modalAmount == ''}
        title='Click to deposit'
        variant='primary'
        size='sm'
        role='button'
        onClick={handleSubmit}
        className='full-width'
      >
        {modalFooterText}
      </Button>
    </Modal>
  );
};

export default ManageFundsModal;
