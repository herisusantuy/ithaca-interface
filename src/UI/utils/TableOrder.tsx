// Packages
import { Fragment } from 'react';

// Constants
import { TableRowData } from '@/UI/constants/tableOrder';

// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Plus from '@/UI/components/Icons/Plus';
import Minus from '@/UI/components/Icons/Minus';
import Button from '@/UI/components/Button/Button';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';

// Styles
import styles from '../components/TableOrder/TableOrder.module.scss';

// orderDate Sort
export const orderDateSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
  } else {
    data.sort((a: TableRowData, b: TableRowData) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
  console.log(data);
  return data;
};

// orderLimit Sort
export const orderLimitSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => Number(a.orderLimit) - Number(b.orderLimit));
  } else {
    data.sort((a: TableRowData, b: TableRowData) => Number(b.orderLimit) - Number(a.orderLimit));
  }
  console.log(data);
  return data;
};

// tenor Sort
export const tenorSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => new Date(a.tenor).getTime() - new Date(b.tenor).getTime());
  } else {
    data.sort((a: TableRowData, b: TableRowData) => new Date(b.tenor).getTime() - new Date(a.tenor).getTime());
  }
  console.log(data);
  return data;
};

// side filter
export const sideFilter = (data: TableRowData[], filterItem: string) => {
  //   const filteredData = data.filter((item: TableRowData) => item.side === '+');
  const filteredData = data.filter((item: TableRowData) => item.side === filterItem);
  console.log(filteredData);
  return filteredData;
};

// Product filter(in this case filter value is Forward, Call)
export const productFilter = (data: TableRowData[], filterArray: string[]) => {
  //   const filterArray = ['Forward', 'Call'];
  const filteredData = data.filter((item: TableRowData) => filterArray.includes(item.product));
  console.log(filteredData);
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
  return side === '+' ? <Plus /> : <Minus />;
};

// Get table header icons
export const getHeaderIcon = (header: string) => {
  switch (header) {
    case 'Order Date':
    case 'Tenor':
    case 'Collateral Amount':
    case 'Order Limit':
      return (
        <Button title='Click to sort column' className={styles.sort}>
          <Sort />
        </Button>
      );
    case 'Currency Pair':
    case 'Product':
    case 'Side':
      return (
        <Button title='Click to view filter options' className={styles.filter}>
          <Filter />
        </Button>
      );
    default:
      return null;
  }
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
