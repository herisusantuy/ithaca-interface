import { Payoff } from "@ithaca-finance/sdk";

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
    payoff?: Payoff;
    economics: Economics;
    tradeable: boolean;
  }

  
export type PayoffMap = Record<string, number>;


const range = (start: number, stop: number, step: number = 10) => Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)


export function estimateOrderPayoff(legs: OptionLeg[]): PayoffMap[] {
    const payoffFunctions = {
        'Call': (price: number, strike: number) => Math.max(0, price - strike),
        'Put': (price: number, strike: number) => Math.max(0, strike - price),
        'BinaryCall': (price: number, strike: number) => price > strike ? 1 : 0,
        'BinaryPut': (price: number, strike: number) => price < strike ? 1 : 0,
        'Forward': (price: number, strike: number) => price - strike,
    }

    const prices = range(1300, 2000, 10)

    const payoffs = prices.map(price => {
      const payoff: PayoffMap = { x: price, total: 0 };
      legs.forEach((leg, idx) => {
        const side = leg.side == "BUY" ? 1 : -1;
        // const premium = leg.payoff != 'Forward' ?  -leg.premium * side : 0;
        const premium = 0;
        const intrinsicValue = side * payoffFunctions[leg.payoff as keyof typeof payoffFunctions](price, leg.economics.strike || 0) + premium;
        payoff[`leg${idx+1}`] = intrinsicValue * parseInt(leg.quantity);
        payoff.total += intrinsicValue * parseInt(leg.quantity)
      });
      return payoff;
    });
    return payoffs;
}


