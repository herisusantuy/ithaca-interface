// Types
export type TableRowData = {
  clientOrderId: number;
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

export type TableExpandedRowData = {
  type: string;
  side: string;
  expiryDate: string;
  size: number;
  strike: number;
  enterPrice: number;
};

export type TableRowDataWithExpanded = TableRowData & {
  expandedInfo?: TableExpandedRowData[];
};

type TableHeaders = {
  name: string;
  alignment: string;
}

// Table order headers
export const TABLE_ORDER_HEADERS: TableHeaders[] = [
  {name: 'Details', alignment: 'initial'},
  {name: 'Order Date', alignment: 'initial'},
  {name: 'Currency Pair', alignment: 'initial'},
  {name: 'Product', alignment: 'initial'},
  {name: 'Side', alignment: 'initial'},
  {name: 'Tenor', alignment: 'initial'},
  {name: 'Collateral Amount', alignment: 'flex-end'},
  {name: 'Order Limit', alignment: 'flex-end'},
];

export const TABLE_ORDER_LIVE_ORDERS: TableHeaders[] = [
  ...TABLE_ORDER_HEADERS,
  {name: 'Cancel All', alignment: 'flex-end'},
];

export const TABLE_ORDER_HEADERS_FOR_POSITIONS: string[] = ['Details', 'Product', 'Strike', 'Type', 'Quantity'];

export type TableDescriptionProps = {
  possibleReleaseX: number;
  possibleReleaseY: number;
  postOptimisationX: number;
  postOptimisationY: number;
  // totalCollateral: number;
};

// Table order expanded headers
export const TABLE_ORDER_EXPANDED_HEADERS: TableHeaders[] = [
  {name: '', alignment: 'flex-start'},
  {name: 'Type', alignment: 'flex-start'},
  {name: '', alignment: 'flex-start'},
  {name: '', alignment: 'flex-start'},
  {name: 'Side', alignment: 'flex-start'},
  {name: 'Expiry Date', alignment: 'flex-start'},
  {name: 'Size', alignment: 'flex-end'},
  {name: 'Strike', alignment: 'flex-end'},
  {name: '', alignment: 'flex-start'}
];

export const TABLE_ORDER_EXPANDED_HEADERS_FOR_POSITIONS: string[] = ['Type', 'Collateral (ETH)', 'Collateral (USDC)', 'Order Limit'];

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
    year: 23,
  };
}

// Table order data
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
    clientOrderId: Math.random(),
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

// Table order expanded data
function getRandomExpandedData(): TableExpandedRowData {
  const types = ['Call', 'Put'];
  const expiryDate = getRandomDateParts();
  const size = getRandomInt(1, 20);
  const strike = getRandomInt(400, 500);
  const enterPrice = getRandomInt(400, 450);

  return {
    type: types[getRandomInt(0, types.length - 1)],
    expiryDate: `${expiryDate.day} ${expiryDate.month} ${expiryDate.year}`,
    side: getRandomInt(0, 1) > 0 ? 'Buy' : 'Sell',
    size,
    strike,
    enterPrice,
  };
}

function getRandomDataWithExpanded(): TableRowDataWithExpanded {
  const expandedData = Array.from({ length: 4 }, () => getRandomExpandedData());

  return {
    ...getRandomData(),
    expandedInfo: expandedData,
  };
}

export const TABLE_ORDER_DATA_WITH_EXPANDED: TableRowDataWithExpanded[] = Array.from({ length: 90 }, () =>
  getRandomDataWithExpanded()
);
