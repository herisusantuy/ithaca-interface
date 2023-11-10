// Packages
import { Fragment, ReactElement } from 'react';

// Constants
import { TableRowDataWithExpanded } from '@/UI/constants/tableOrder';

// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Plus from '@/UI/components/Icons/Plus';
import Minus from '@/UI/components/Icons/Minus';

// Styles
import styles from '../components/TableOrder/TableOrder.module.scss';

// orderDate Sort
export const orderDateSort = (data: TableRowDataWithExpanded[], dir: boolean) => {
  if (dir) {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) =>
        new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
    );
  } else {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }
  return data;
};

// orderLimit Sort
export const orderLimitSort = (data: TableRowDataWithExpanded[], dir: boolean) => {
  if (dir) {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) => Number(a.orderLimit) - Number(b.orderLimit)
    );
  } else {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) => Number(b.orderLimit) - Number(a.orderLimit)
    );
  }
  return data;
};

// tenor Sort
export const tenorSort = (data: TableRowDataWithExpanded[], dir: boolean) => {
  if (dir) {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) =>
        new Date(a.tenor).getTime() - new Date(b.tenor).getTime()
    );
  } else {
    data.sort(
      (a: TableRowDataWithExpanded, b: TableRowDataWithExpanded) =>
        new Date(b.tenor).getTime() - new Date(a.tenor).getTime()
    );
  }
  return data;
};

// side filter
export const sideFilter = (data: TableRowDataWithExpanded[], filterArray: string[]) => {
  if (filterArray.length == 0) {
    return data;
  }
  //   const filteredData = data.filter((item: TableRowDataWithExpanded) => item.side === '+');
  const filteredData = data.filter((item: TableRowDataWithExpanded) => filterArray.includes(item.side));
  return filteredData;
};

// Product filter(in this case filter value is Forward, Call)
export const productFilter = (data: TableRowDataWithExpanded[], filterArray: string[]) => {
  //   const filterArray = ['Forward', 'Call'];
  if (filterArray.length == 0) {
    return data;
  }
  const filteredData = data.filter((item: TableRowDataWithExpanded) => filterArray.includes(item.product));
  return filteredData;
};


// Format currency page
export const formatCurrencyPair = (currencyPair: string) => (
  <>
    {currencyPair.split(' / ').map((currency, idx) => (
      <Fragment key={idx}>
        {currency === 'WETH' ? <LogoEth /> : null}
        {currency === 'USDC' ? <LogoUsdc /> : null}
        {currency}
        {idx === 0 ? ' / ' : ''}
      </Fragment>
    ))}
  </>
);

// Get side icon
export const getSideIcon = (side: string) => {

  return side === '+' || side === 'BUY' ? <Plus /> : side === '-' || side === 'SELL'? <Minus /> : '';
};

// Split the dates and render as spans
export const renderDate = (dateStr: string) => {
  const parts = dateStr.split(' ');
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  const time = parts.length > 3 ? parts[3] : '';

  return (
    <div className={styles.date}>
      <span>{day}</span>
      <span>{month}</span>
      <span>{year}</span>
      {time && <span className={styles.time}>{time}</span>}
    </div>
  );
};

// Animation for row expand and collapse
export const variants = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 0, height: 0 },
};

export type FilterItemProps = {
  label: string;
  component: ReactElement | null;
};

export const CURRENCY_PAIR_LABEL: FilterItemProps[] = [
  {
    label: 'USDC',
    component: <LogoUsdc />,
  },
  {
    label: 'WETH',
    component: <LogoEth />,
  },
];

export const PRODUCT_LABEL: string[] = ['Call', 'Put', 'Binary Call', 'Binary Put', 'Forward'];

export const AUCTION_LABEL: string[] = ['Deposit', 'Withdraw'];

export const SIDE_LABEL: FilterItemProps[] = [
  {
    label: 'Buy',
    component: <Plus />,
  },
  {
    label: 'Sell',
    component: <Minus />,
  },
];
