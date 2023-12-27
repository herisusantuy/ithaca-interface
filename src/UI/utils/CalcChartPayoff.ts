export interface Economics {
  currencyPair: string;
  expiry: number;
  strike?: number;
  priceCurrency: string;
  qtyCurrency: string;
}

export interface OptionLeg {
  contractId: number;
  quantity: string;
  side: string;
  payoff?: string;
  economics: Economics;
  tradeable: boolean;
  premium: number;
}

export type LabelPositionProp = {
  x: number;
  y: number;
  offset: number;
};

export type CustomRange = {
  min: number;
  max: number;
};

export type PayoffMap = Record<string, number>;
export type PayoffMapWithIndex = PayoffMap & { index: number };

const range = (start: number, stop: number, step: number = 10) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const calculateRange = (legs: OptionLeg[], customRange?: CustomRange) => {
  const legsSorted = legs.map(leg => (leg.payoff === 'Forward' ? leg.premium : leg.economics?.strike || 1000)).sort();
  return customRange
    ? range(customRange.min, customRange.max, 1)
    : range(legsSorted[0] - 500, legsSorted[legsSorted.length - 1] + 500, 1);
};

const payoffMap = {
  Call: 'C',
  Put: 'P',
  BinaryCall: 'BC',
  BinaryPut: 'BP',
  Forward: 'F',
};

type PAYOFF_TYPE = 'Call' | 'Put' | 'BinaryCall' | 'BinaryPut' | 'Forward';

export function estimateOrderPayoff(legs: OptionLeg[], customRange?: CustomRange): PayoffMap[] {
  const payoffFunctions = {
    Call: (price: number, strike: number) => Math.max(0, price - strike),
    Put: (price: number, strike: number) => Math.max(0, strike - price),
    BinaryCall: (price: number, strike: number) => (price > strike ? 1 : 0),
    BinaryPut: (price: number, strike: number) => (price < strike ? 1 : 0),
    Forward: (price: number, strike: number) => price - strike,
    Spot: (price: number, strike: number) => price - strike,
  };

  const prices = calculateRange(legs, customRange);

  const payoffs = prices.map(price => {
    const payoff: PayoffMap = { x: price, total: 0 };
    legs.forEach((leg, index) => {
      const side = leg.side === 'BUY' ? 1 : -1;
      const premium = leg.payoff !== 'Forward' ? -leg.premium * side : 0;
      const strike = leg.payoff !== 'Forward' && leg.payoff !== 'Spot' ? leg.economics.strike : leg.premium;
      const intrinsicValue =
        side * payoffFunctions[leg.payoff as keyof typeof payoffFunctions](price, strike || 0) + premium;
      const label = `${payoffMap[leg.payoff as PAYOFF_TYPE]}@${index}`;
      payoff[label] = intrinsicValue * parseInt(leg.quantity);
      payoff.total += intrinsicValue * parseInt(leg.quantity);
    });
    Object.keys(payoff).forEach(key => {
      if (key != 'x' && Math.abs(payoff[key]) > Math.abs(payoff['total'] * 1.25)) {
        delete payoff[key];
      }
    });
    return payoff;
  });

  const mean = payoffs.reduce((sum, payoff) => sum + payoff.total, 0) / payoffs.length;

  const stdDev = Math.sqrt(payoffs.reduce((sq, payoff) => sq + Math.pow(payoff.total - mean, 2), 0) / payoffs.length);

  const significantChanges = calculateSignificantChanges(payoffs, stdDev);
  const mod10 = adjustPayoffs(payoffs, significantChanges);

  sortPayoffs(payoffs, mod10);

  return payoffs;
}

const calculateSignificantChanges = (payoffs: PayoffMap[], stdDev: number) => {
  let preTanValue = 0;
  return payoffs.reduce((acc: PayoffMapWithIndex[], payoff, i) => {
    if (i === payoffs.length - 1) return acc;
    const tanValue = (payoff.total - payoffs[i + 1].total) / (payoff.x - payoffs[i + 1].x);
    if (
      preTanValue !== tanValue &&
      Math.round((preTanValue / tanValue) * 10) / 10 !== 1 &&
      Math.abs(payoff.total - payoffs[i + 1].total) > 0.25 * stdDev
    ) {
      preTanValue = tanValue;
      if (i !== 0) acc.push({ ...payoff, index: i });
    }
    return acc;
  }, []);
};

const adjustPayoffs = (payoffs: PayoffMap[], significantChanges: PayoffMapWithIndex[]) => {
  let mod10 = false;
  significantChanges.forEach(change => {
    if (change.index < payoffs.length - 1) {
      const nextPayoff = payoffs[change.index + (Math.abs(change.x) % 10 !== 0 ? 0 : 1)];
      mod10 = mod10 || Math.abs(change.x) % 10 !== 0;
      payoffs.push({ ...nextPayoff, x: change.x + (mod10 ? 1 : 0) });
    }
  });
  return mod10;
};

const sortPayoffs = (payoffs: PayoffMap[], mod10: boolean) => {
  payoffs.sort((a, b) => {
    if (a.x !== b.x) {
      return a.x - b.x;
    }
    if (mod10) {
      if (a.total < b.total) {
        return a.total - b.total;
      } else {
        return b.total - a.total;
      }
    } else {
      if (a.total < b.total) {
        return b.total - a.total;
      } else {
        return a.total - b.total;
      }
    }
  });
};
