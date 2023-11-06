// Packages
import { TABLE_COLLATERAL_DATA } from '@/UI/constants/TableCollateral';
import Panel from '@/UI/layouts/Panel/Panel';
import readWriteSDK from '@/UI/lib/sdk/readWriteSDK';
import { useAppStore } from '@/UI/lib/zustand/store';
import { useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import TableCollateral from '../TableCollateral/TableCollateral';
import styles from './CollateralPanel.module.scss';
// Styles

const CollateralPanel = () => {
    const { systemInfo } = useAppStore();
    const [data, setData] = useState(TABLE_COLLATERAL_DATA);
    useEffect(() => {
        readWriteSDK.getFundLockState().then((res) => {
            setData(d => d.map((row) => {
                const assetData = res?.find((a) => a.currency === row.asset)
                if (assetData) {
                    return {
                        asset: assetData.asset,
                        balance: 0,
                        fundLock: assetData.fundLockValue,
                        netOrders: 0,
                        liveOrderValue: 0
                    }
                }
                else return row;
            }))
        })
    }, [])

    const getFaucet = useCallback(async (asset: string) => {
        const account = await readWriteSDK.getAccount();
        await readWriteSDK.faucet(systemInfo.tokenAddress[asset] as `0x${string}`, account, parseUnits('5000', 6));
    }, [systemInfo.tokenAddress]);

    const fundLock = useCallback(async (asset: string) => {
        const account = await readWriteSDK.getAccount();
        await readWriteSDK.fundLockDeposit(
            systemInfo.tokenAddress[asset] as `0x${string}`,
            account,
            parseUnits('10', 6),
            systemInfo.fundlockAddress as `0x${string}`,
            systemInfo.tokenManagerAddress  as `0x${string}`
            )
    }, [systemInfo])

    return (<Panel>
        <div className={styles.collateralWrapper}>
            <h3 className='color-white mb-10'>Collateral</h3>
            <TableCollateral data={data}
                deposit={(asset) => fundLock(asset)}
                withdraw={(asset) => {
                    console.log(asset)
                }}
                faucet={(asset) => getFaucet(asset)} />
        </div>
    </Panel>
    )
};

export default CollateralPanel;
