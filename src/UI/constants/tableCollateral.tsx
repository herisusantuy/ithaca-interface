// Types
export type CollateralType = {
  asset: string;
  balance: string | number;
  fundLock: number;
  netOrders: number;
  liveOrderValue: number;
};

export const TABLE_COLLATERAL_HEADERS: string[] = [
  'Asset',
  'Balance',
  'Fundlock Value',
  'Net of Current Orders',
  'Live Order Collateral Net Value',
  '',
];

// Table strategy data
export const TABLE_COLLATERAL_DATA: CollateralType[] = [
  {
    asset: 'USDC',
    balance: 0,
    fundLock: 0,
    netOrders: 0,
    liveOrderValue: 0,
  },
  {
    asset: 'WETH',
    balance: 0,
    fundLock: 0,
    netOrders: 0,
    liveOrderValue: 0,
  },
];
