import { Contract, Payoff, ReferencePrice } from '@ithaca-finance/sdk';
import { Strategy } from '../components/PositionBuilderRow/PositionBuilderRow';
import { StrategyType } from '../constants/tableStrategy';

const toPrecision = (value: number, precision: number): number => {
  return parseFloat(value.toFixed(precision));
};

const multiply = (a: number, b: number, precision: number): number => {
  return toPrecision(a * b, precision);
};

export const calculateNetPrice = (
  legs: { side: 'BUY' | 'SELL'; quantity: string; referencePrice?: number }[],
  precision: number,
  unitSize = 1
) => {
  return legs.reduce((netPrice, { quantity, referencePrice, side }) => {
    if (parseFloat(quantity) <= 0 || !referencePrice || referencePrice <= 0) return 0;
    const limit = multiply(parseFloat(quantity) / unitSize, referencePrice, precision);
    const signedLimit = side === 'SELL' ? limit * -1 : limit;
    return netPrice + signedLimit;
  }, 0);
};

export const getStrike = (contractId: number, contractList: Contract[], expiry: number): string => {
  const contract = contractList.find(ctr => ctr.contractId === contractId && ctr.economics.expiry === expiry);
  return `${contract?.economics.strike ? contract.economics.strike : '-'}`;
};

export const getContractId = (
  product: string,
  strike: number,
  currentExpiryDate: number,
  contractList: Contract[]
) => {
  const contract = contractList.find(
    c => c.payoff.toUpperCase() === product.toUpperCase() && c.economics.expiry === currentExpiryDate && (product === Payoff.FORWARD || c.economics.strike === strike)
  );
  return contract?.contractId || 0;
};

export const getUnitPrice = (contractId: number, prices: ReferencePrice[]) => {
  const contract = prices.find(price => contractId === price.contractId);
  return contract?.referencePrice;
};

export const getLeg = (strategy: Strategy) => {
  return {
    contractId: strategy.contractId,
    quantity: `${strategy.size}` as `${number}`,
    side: strategy.side as 'BUY' | 'SELL',
  };
};

export const getStrategy = (strategy: Strategy) => {
  return {
    ...strategy,
    side: strategy.side === 'BUY' ? '+' : '-',
  };
};

export const getStrategyPrices = (list: StrategyType[]) => {
  return list.map(i => i.enterPrice);
};

export const getStrategyTotal = (list: StrategyType[]) => {
  return list.reduce((n, val) => val.size + n, 0);
};
