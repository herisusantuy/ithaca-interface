// Packages
import { TABLE_ORDER_DATA } from '@/UI/constants/tableOrder';
import Panel from '@/UI/layouts/Panel/Panel';
import TableOrder from '../TableOrder/TableOrder';
import styles from './OrderPanel.module.scss';
// Styles

const OrderPanel = () => {

    return (<Panel>
        <div className={styles.orderWrapper}>
            <TableOrder data={TABLE_ORDER_DATA} />
        </div>
    </Panel>
    )
};

export default OrderPanel;
