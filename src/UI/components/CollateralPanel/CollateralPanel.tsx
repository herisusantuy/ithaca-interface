// Packages
import { CollateralType, TABLE_COLLATERAL_DATA } from '@/UI/constants/tableCollateral';
import Panel from '@/UI/layouts/Panel/Panel';
import { useAppStore } from '@/UI/lib/zustand/store';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseAbi, parseUnits } from 'viem';
import { useWalletClient } from 'wagmi';
import Input from '../Input/Input';
import TableCollateral from '../TableCollateral/TableCollateral';
import { fetchBalance } from '@wagmi/core'
import { FundLockState } from '@ithaca-finance/sdk';
import styles from './CollateralPanel.module.scss';
import Wallet from '../Wallet/Wallet';
import Tabs from '../Tabs/Tabs';
import { MODAL_TABS } from '@/UI/constants/tabs';
import Flex from '@/UI/layouts/Flex/Flex';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import LogoUsdc from '../Icons/LogoUsdc';
import LogoEth from '../Icons/LogoEth';

const currencies = [
  { currency: 'WETH', amountToMint: parseUnits('10', 18) },
  { currency: 'USDC', amountToMint: parseUnits('5000', 6) },
];

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false,
});

const CollateralPanel = () => {
  const { systemInfo, ithacaSDK } = useAppStore();
  const [data, setData] = useState(TABLE_COLLATERAL_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CollateralType>();
  const [depositAmount, setDepositAmount] = useState('');
  const { data: walletClient } = useWalletClient();


  useEffect(() => {
    const address = walletClient?.account.address;
    if (address) {
      Promise.all([ithacaSDK?.client.fundLockState(),
      ...currencies.map((c) =>
        fetchBalance({
          address: address as `0x${string}`,
          token: systemInfo.tokenAddress[c.currency] as `0x${string}`
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]).then((res: any) => {
        const lockData = res.shift();
        setData(d =>
          d.map(row => {
            const rowBalance = currencies.reduce((obj: Record<string, bigint>, val, i) => {
              obj[val.currency] = res[i].value as bigint || BigInt(0);
              return obj
            }, {})
            const assetData = (lockData as FundLockState[])?.find(a => a.currency === row.asset);
            if (assetData) {
              return {
                asset: assetData.currency,
                balance: formatUnits(rowBalance[assetData.currency], systemInfo.tokenDecimals[assetData.currency]),
                fundLock: assetData.fundLockValue,
                netOrders: assetData.settleValue,
                liveOrderValue: assetData.orderValue,
              };
            } else return row;
          })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient?.account.address, systemInfo]);

  const getFaucet = useCallback(
    async (asset: string) => {
      const account = await walletClient?.account.address;
      const amountToMint = currencies.find(c => c.currency === asset);
      const chain = walletClient?.chain
      await walletClient?.writeContract({
        account,
        address: systemInfo.tokenAddress[asset] as `0x${string}`,
        abi: parseAbi(['function mint(address to, uint256 amount) external']),
        chain,
        functionName: 'mint',
        args: [account, amountToMint?.amountToMint || currencies[0].amountToMint],
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [systemInfo.tokenAddress]
  );

  const fundLock = useCallback(async () => {
    if (selectedAsset?.asset) {
      const amountToMint = parseUnits(depositAmount, systemInfo.tokenDecimals[selectedAsset?.asset]);
      await ithacaSDK.fundlock.deposit(systemInfo.tokenAddress[selectedAsset?.asset], amountToMint);
      setSelectedAsset(undefined)
      setDepositAmount('')
      setModalOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemInfo, selectedAsset, depositAmount]);

  return (
    <>
      <Panel margin='p-30 mt-15'>
        <h3>Collateral</h3>
        <div>
          <div className={`${walletClient?.account.address ? '' : styles.hideTable}`}>
            <TableCollateral
              data={data}
              deposit={(asset: string) => {
                const rowData = data.find((d) => d.asset === asset)
                setSelectedAsset(rowData);
                setModalOpen(true);
              }}
              withdraw={asset => {
                console.log(asset);
              }}
              faucet={asset => getFaucet(asset)}
            />
          </div>
          {!walletClient?.account.address && <div className={styles.connectOverlay}>
            <div className='color-white mb-10'>Please connect wallet to check your details.</div>
            <Wallet />
          </div>}
        </div>
      </Panel>
      <Modal title='Manage Funds' isOpen={modalOpen} onCloseModal={() => setModalOpen(false)} onSubmitOrder={() => fundLock()}>
        <Tabs tabs={MODAL_TABS} />
        <div>
        <Flex direction='row-space-between'>
            <DropdownMenu options={[{
              name: 'WETH',
              value: 'WETH'
            }, {
              name: 'USDC',
              value: 'USDC'
            }]} 
            value={selectedAsset?.asset}
              onChange={(val) => {
              const rowData = data.find((d) => d.asset === val)
              setSelectedAsset(rowData)
              setDepositAmount('')
            }} iconStart={selectedAsset?.asset === 'USDC' ? <LogoUsdc /> : <LogoEth />} />
            <Input
              value={depositAmount}
              onChange={value => {
                const val = value.target.value;
                setDepositAmount(val);
              }}
            />
            <Button
              variant='secondary'
              size='sm'
              title='Select All Assets'
              onClick={() => {
                setDepositAmount(selectedAsset?.balance.toString() || '')
              }}
            >All</Button>
          </Flex>
          <Flex direction='row-space-between'>
            <div className={styles.modalBalanceText}>Fund Lock: {selectedAsset?.fundLock || 0}</div>
            <div className={styles.modalBalanceText}>Balance: {selectedAsset?.balance || 0}</div>
          </Flex>
        </div>
        {/* <Tabs tabs={} /> */}
      </Modal>
    </>
  );
};

export default CollateralPanel;
