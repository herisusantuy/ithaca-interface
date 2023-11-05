// Packages
import { TABLE_ORDER_DATA } from '@/UI/constants/TableOrder';
import Panel from '@/UI/layouts/Panel/Panel';
import readWriteSDK from '@/UI/lib/sdk/readWriteSDK';
import { useAppStore } from '@/UI/lib/zustand/store';
import { useCallback, useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import TableCollateral from '../TableCollateral/TableCollateral';
import TableOrder from '../TableOrder/TableOrder';
import styles from './OrderPanel.module.scss';
// Styles

const OrderPanel = () => {
    const { systemInfo } = useAppStore();
    const [data, setData] = useState(TABLE_ORDER_DATA);
    useEffect(() => {

    }, [])

    const fundLock = useCallback(async (asset: string) => {

    }, [])

    return (<Panel>
        <div className={styles.orderWrapper}>
            <TableOrder data={TABLE_ORDER_DATA} />
        </div>
    </Panel>
    )
};

export default OrderPanel;
