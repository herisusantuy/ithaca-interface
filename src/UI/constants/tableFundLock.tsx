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

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date string
const getRandomDate = (): string => {
  const month = getRandomInt(1, 12);
  const day = getRandomInt(1, 28);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month - 1]} ${23} 17:46`;
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
