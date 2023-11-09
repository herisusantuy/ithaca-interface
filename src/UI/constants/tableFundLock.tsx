// Styles
import styles from '../components/TableFundLock/TableFundLock.module.scss';

// Table fund lock headers
export const TABLE_FUND_LOCK_HEADERS: string[] = ['Order Date', 'Currency', 'Auction', 'Amount'];

// Define a type for the data structure
export type TableFundLockDataProps = {
  orderData: string;
  asset: string;
  auction: string;
  amount: string;
  currency: string;
};

// Function to generate a random date string
const getRandomDate = (): string => {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date().getTime();
  const randomDate = new Date(start + Math.random() * (end - start));

  return randomDate
    .toLocaleString('en-US', {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/,\s?/, '')
    .replace(' ', '');
};

// The renderDate function now should work with the output of getRandomDate.
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

// Function to generate random data
const getRandomDataWithExpanded = (): TableFundLockDataProps => {
  const actions = ['Deposit', 'Withdraw'];
  const currencies = ['USDC', 'WETH'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  const randomAmount = (Math.random() * 2000).toFixed(2);

  return {
    orderData: getRandomDate(),
    asset: randomCurrency,
    auction: randomAction,
    amount: randomAmount,
    currency: randomCurrency,
  };
};

// Generate an array of random data
export const TABLE_FUND_LOCK_DATA: TableFundLockDataProps[] = Array.from({ length: 20 }, getRandomDataWithExpanded);
