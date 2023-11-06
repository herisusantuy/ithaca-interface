// Types
export type TableRowData = {
  details: string;
  orderDate: string;
  currencyPair: string;
  product: string;
  side: string;
  tenor: string;
  wethAmount: string;
  usdcAmount: string;
  orderLimit: string;
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

function getRandomDate(): string {
  const month = getRandomInt(1, 12);
  const day = getRandomInt(1, 28);
  return `${day} ${
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]
  } 23 17:46`;
}

function getRandomData(): TableRowData {
  const products = ['Call', 'Put', 'Binary', 'Forward'];
  const sides = ['+', '-'];
  const currencyPairs = ['WETH / USDC'];

  return {
    details: '',
    orderDate: getRandomDate(),
    currencyPair: currencyPairs[getRandomInt(0, currencyPairs.length - 1)],
    product: products[getRandomInt(0, products.length - 1)],
    side: sides[getRandomInt(0, sides.length - 1)],
    tenor: getRandomDate(),
    wethAmount: `${getRandomInt(1, 20)}`,
    usdcAmount: `${getRandomInt(400, 500)}`,
    orderLimit: `${getRandomInt(400, 450)}`,
  };
}

export const TABLE_ORDER_DATA: TableRowData[] = new Array(20).fill({}).map(() => getRandomData());
