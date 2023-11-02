// Types
import { DotTypes } from '@/UI/components/Dot/Dot';

// Strategy table header
export const STRATEGY_TABLE_HEADER: string[] = ['Type', 'Side', 'Size', 'Strike', 'Enter Price', ''];

// Strategy table dummy Data
export type StrategyType = {
  type: DotTypes;
  side: '+' | '-';
  size: number;
  strike: number;
  enterPrice: number;
};

export type CompareDataProp = {
  from: string;
  to: string;
};

export type CollateralDataProp = {
  from: {
    val: number;
    icon: string;
    name: string;
  };
  to: {
    val: number;
    icon: string;
    name: string;
  };
};

export type RowType = {
  type: string;
  value?: string;
  compare?: CompareDataProp;
  collateral?: CollateralDataProp;
};

export type TableListProps = {
  data: RowType[];
};

export const DUMMY_STRATEGY_DATA: StrategyType[] = [
  {
    type: 'Call',
    side: '+',
    size: 120,
    strike: 6500,
    enterPrice: 800,
  },
  {
    type: 'Put',
    side: '-',
    size: 90,
    strike: 7200,
    enterPrice: 950,
  },
  {
    type: 'Forward (10 Nov 23)',
    side: '+',
    size: 80,
    strike: 6800,
    enterPrice: 900,
  },
  {
    type: 'Call',
    side: '-',
    size: 150,
    strike: 7100,
    enterPrice: 1100,
  },
  {
    type: 'Put',
    side: '+',
    size: 110,
    strike: 6900,
    enterPrice: 850,
  },
];

export type TableOrderHeaderType = {
  name?: string;
  dir?: string;
  type?: string;
};

export const DUMMY_TABLEORDER_HEADER: TableOrderHeaderType[] = [
  {
    name: 'Detail',
    dir: 'left',
  },
  {
    name: 'Order Date',
    dir: 'left',
    type: 'sort',
  },
  {
    name: 'Currency Pair',
    dir: 'left',
    type: 'filter',
  },
  {
    name: 'Product',
    dir: 'left',
    type: 'filter',
  },
  {
    name: 'Side',
    dir: 'left',
    type: 'color_filter',
  },
  {
    name: 'Tenor',
    dir: 'left',
    type: 'sort',
  },
  {
    name: 'Collateral Amount',
    dir: 'left',
    type: 'sort',
  },
  {
    name: 'Order Limit',
    dir: 'left',
    type: 'sort',
  },
  {
    name: 'action',
    dir: 'left',
  },
];

export const DUMMY_TABLEDATA_ROW: RowType[] = [
  {
    type: 'detail',
    value: '',
  },
  { type: 'text', value: '30 Oct 23 17:46' },
  { type: 'compare', compare: { from: 'WETH', to: 'USDC' } },
  { type: 'text', value: 'Call' },
  { type: 'side', value: 'plus' },
  { type: 'text', value: '30 Oct 23' },
  {
    type: 'collateral',
    collateral: { from: { val: 18.95, icon: 'eth', name: 'WETH' }, to: { val: 430, icon: 'usdc', name: 'USDC' } },
  },
  { type: 'text', value: '430' },
  { type: 'close', value: 'close' },
];

export const DUMMY_TABLE_DATA: TableListProps[] = [
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
  { data: DUMMY_TABLEDATA_ROW },
];
