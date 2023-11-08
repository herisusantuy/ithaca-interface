// Packages
import { TABLE_COLLATERAL_DATA } from '@/UI/constants/tableCollateral';
import useFromStore from '@/UI/hooks/useFromStore';
import Panel from '@/UI/layouts/Panel/Panel';
import web3Service from '@/UI/lib/sdk/web3Service';
import { useAppStore, useSDKStore } from '@/UI/lib/zustand/store';
import { FundLockState } from '@ithaca-finance/sdk';
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

    useEffect(() => {
        web3Service.getAccount().then(account => {
            Promise.all([walletSDK?.client.fundLockState(),
            ...currencies.map((cur) => web3Service.erc20BalanceOf(
                systemInfo.tokenAddress[cur.currency] as `0x${string}`,
                account as `0x${string}`
            )
            )]).then(res => {
                const lockData = res.shift();
                setData(d =>
                    d.map(row => {
                        const rowBalance = currencies.reduce((obj: Record<string, bigint>, val, i) => {
                            obj[val.currency] = res[i] as bigint || BigInt(0);
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
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const getFaucet = useCallback(
        async (asset: string) => {
            const account = await web3Service.getAccount();
            const amountToMint = currencies.find(c => c.currency === asset);
            await web3Service.faucet(
                systemInfo.tokenAddress[asset] as `0x${string}`,
                account,
                amountToMint?.amountToMint || currencies[0].amountToMint
            );
        },
        [systemInfo.tokenAddress]
    );

    const fundLock = useCallback(async () => {
        const account = await web3Service.getAccount();
        const amountToMint = parseUnits(depositAmount, systemInfo.tokenDecimals[selectedAsset]);
        await web3Service.fundLockDeposit(
            systemInfo.tokenAddress[selectedAsset] as `0x${string}`,
            account,
            amountToMint,
            systemInfo.fundlockAddress as `0x${string}`,
            systemInfo.tokenManagerAddress as `0x${string}`
        );
    }, [systemInfo, selectedAsset, depositAmount]);

    return (
        <>
            <Panel margin='p-30 mt-15'>
                <h3>Collateral</h3>
                <TableCollateral
                    data={data}
                    deposit={(asset: string) => {
                        setSelectedAsset(asset);
                        setModalOpen(true);
                    }}
                    withdraw={asset => {
                        console.log(asset);
                    }}
                    faucet={asset => getFaucet(asset)}
                />
            </Panel>
            <Modal
                title='Manage Funds'
                isOpen={modalOpen}
                onCloseModal={() => setModalOpen(false)}
                onSubmitOrder={() => fundLock()}
            >
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
