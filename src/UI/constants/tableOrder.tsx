// Types
export type TableRowData = {
  details: string;
  orderDate: string;
  currencyPair: string;
  product: string;
  side: string;
  tenor: string;
  wethAmount: number;
  usdcAmount: number;
  orderLimit: number;
};

// Table order headers
export const TABLE_ORDER_HEADERS: string[] = [
  'Details',
  'Order Date',
  'Currency Pair',
  'Product',
  'Side',
  'Tenor',
  'Collateral Amount',
  'Order Limit',
  '',
];

// Table order data
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDateParts(): { day: number; month: string; year: number } {
  const month = getRandomInt(1, 12);
  const day = getRandomInt(1, 28);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day,
    month: months[month - 1],
    year: 23, // Assuming the year is always '23'
  };
}

function getRandomData(): TableRowData {
  const { day, month, year } = getRandomDateParts();
  const orderDate = `${day} ${month} ${year} 17:46`;
  const tenor = `${day} ${month} ${year}`;
  const products = [
    'Option - Call',
    'Option - Put',
    'Digital Option - Call',
    'Digital Option - Put',
    'Forward (8 Oct23)',
    'Forward (Next Auction)',
    'Bet - Inside Range',
    'No Gain No Payin',
    'Barrier - Knock Out',
  ];
  const sides = ['+', '-'];
  const currencyPairs = ['WETH / USDC'];

  return {
    details: '',
    orderDate,
    currencyPair: currencyPairs[getRandomInt(0, currencyPairs.length - 1)],
    product: products[getRandomInt(0, products.length - 1)],
    side: sides[getRandomInt(0, sides.length - 1)],
    tenor,
    wethAmount: getRandomInt(1, 20),
    usdcAmount: getRandomInt(400, 500),
    orderLimit: getRandomInt(400, 450),
  };
}

export const TABLE_ORDER_DATA: TableRowData[] = new Array(20).fill({}).map(() => getRandomData());
