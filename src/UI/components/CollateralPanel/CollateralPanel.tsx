// Packages
import { TABLE_COLLATERAL_DATA } from '@/UI/constants/tableCollateral';
import useFromStore from '@/UI/hooks/useFromStore';
import Panel from '@/UI/layouts/Panel/Panel';
import { useAppStore } from '@/UI/lib/zustand/store';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import Input from '../Input/Input';
import TableCollateral from '../TableCollateral/TableCollateral';

const currencies = [
    { currency: 'WETH', amountToMint: parseUnits('10', 18) },
    { currency: 'USDC', amountToMint: parseUnits('5000', 6) },
];

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
    ssr: false,
});

const CollateralPanel = () => {
    const { systemInfo } = useAppStore();
    const walletSDK = useFromStore(useSDKStore, state => state.walletSDK)
    const [data, setData] = useState(TABLE_COLLATERAL_DATA);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [depositAmount, setDepositAmount] = useState('');

  // useEffect(() => {
  //   readWriteSDK.getFundLockState().then(res => {
  //     setData(d =>
  //       d.map(row => {
  //         const assetData = res?.find(a => a.currency === row.asset);
  //         if (assetData) {
  //           return {
  //             asset: assetData.currency,
  //             balance: assetData.fundLockValue - assetData.settleValue - assetData.orderValue,
  //             fundLock: assetData.fundLockValue,
  //             netOrders: assetData.settleValue,
  //             liveOrderValue: assetData.orderValue,
  //           };
  //         } else return row;
  //       })
  //     );
  //   });
  // }, []);

  // const getFaucet = useCallback(
  //   async (asset: string) => {
  //     const account = await readWriteSDK.getAccount();
  //     const amountToMint = currencies.find(c => c.currency === asset);
  //     await readWriteSDK.faucet(
  //       systemInfo.tokenAddress[asset] as `0x${string}`,
  //       account,
  //       amountToMint?.amountToMint || currencies[0].amountToMint
  //     );
  //   },
  //   [systemInfo.tokenAddress]
  // );

  // const fundLock = useCallback(async () => {
  //   const account = await readWriteSDK.getAccount();
  //   const amountToMint = parseUnits(depositAmount, systemInfo.tokenDecimals[selectedAsset]);
  //   console.log(selectedAsset);
  //   console.log(amountToMint);
  //   await readWriteSDK.fundLockDeposit(
  //     systemInfo.tokenAddress[selectedAsset] as `0x${string}`,
  //     account,
  //     amountToMint,
  //     systemInfo.fundlockAddress as `0x${string}`,
  //     systemInfo.tokenManagerAddress as `0x${string}`
  //   );
  // }, [systemInfo, selectedAsset, depositAmount]);

  return (
    <>
      <Panel margin='p-30 mt-15'>
        <h3>Collateral</h3>
        <TableCollateral
          data={data}
          deposit={(asset: string) => {
            console.log(asset);
            setSelectedAsset(asset);
            setModalOpen(true);
          }}
          withdraw={asset => {
            console.log(asset);
          }}
          faucet={asset => {}}
        />
      </Panel>
      <Modal title='Manage Funds' isOpen={modalOpen} onCloseModal={() => setModalOpen(false)} onSubmitOrder={() => {}}>
        {selectedAsset}
        <Input
          onChange={value => {
            const val = value.target.value;
            setDepositAmount(val);
          }}
        />
        {/* <Tabs tabs={} /> */}
      </Modal>
    </>
  );
};

export default CollateralPanel;
