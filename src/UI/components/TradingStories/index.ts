import { ClientConditionalOrder, OrderLock } from '@ithaca-finance/sdk';
import { ReactElement } from 'react';

export interface TradingStoriesProps {
  showInstructions: boolean;
  compact: boolean;
  chartHeight: number;
  radioChosen?: string;
  onRadioChange?: (option: string | ReactElement) => void;
}

export interface OrderDetails {
  order: ClientConditionalOrder;
  orderLock: OrderLock;
}

export { default as Bet } from './Bet/Bet';
export { default as Earn } from './Earn/Earn';
export { default as NoGainNoPayin } from './NoGainNoPayin/NoGainNoPayin';
export { default as BonusTwinWin } from './BonusTwinWin/BonusTwinWin';
export { default as Barriers } from './Barriers/Barriers';
