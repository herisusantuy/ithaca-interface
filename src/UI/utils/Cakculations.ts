import { ReferencePrices } from "../lib/zustand/slices/read-sdk";
import { getNumber } from "./Numbers";

const toPrecision = (value: number, precision: number): number => {
	return parseFloat(value.toFixed(precision));
};

const multiply = (a: number, b: number, precision: number): number => {
	return toPrecision(a * b, precision);
};

export const calculateNetPrice = (
	legs: { side: "BUY" | "SELL"; quantity: string; referencePrice?: number }[],
	precision: number,
	unitSize = 1
) => {
	return legs.reduce((netPrice, { quantity, referencePrice, side }) => {
		if (parseFloat(quantity) <= 0 || !referencePrice || referencePrice <= 0) return 0;
		const limit = multiply(parseFloat(quantity) / unitSize, referencePrice, precision); 
		const signedLimit = side === "SELL" ? limit * -1 : limit;
		return netPrice + signedLimit;
	}, 0);
};

export const calculateCollateral = (
	product: string,
	side: string,
	size: number,
	contractId: number,
	contractList: ReferencePrices,
	expiry: number
) => {
	if (side === 'BUY') return 0
	const strike = getNumber(getStrike(contractId, contractList, expiry))
	if (product === 'Put') return toPrecision(size * strike, 4)
	return size
}

export const getStrike = (contractId: number, contractList: ReferencePrices, expiry: number): string => {
    const contract = contractList[expiry].find((ctr) => ctr.contractId === contractId)
    return `${contract?.economics.strike ? contract.economics.strike : '-'}`
}

export const getContractId = (product: string, strike: number, currentExpiryDate: number, contractList: any) => {
	const contractsByDate = contractList[currentExpiryDate];
	const contract = contractsByDate.find((c) => c.payoff === product && (product === 'Forward' || c.economics.strike === strike) );
	return contract?.contractId || 0;
}

export const calculatePremium = (unitPrice: number, size: number) => {
	if (!unitPrice || !size) return 0
	return toPrecision(unitPrice * size, 4)
}

export const getUnitPrice = (contractId: number, prices: ReferencePrices[]) => {
	const contract = prices.find((price) => contractId === price.contractId);
	return contract?.referencePrice;
}