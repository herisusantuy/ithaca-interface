import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { IthacaSDK, IthacaNetwork } from '@ithaca-finance/sdk';

const publicClient = createPublicClient({ 
    chain: polygonMumbai,
    transport: http()
});

export interface Leg {
	contractId: number;
	side: string;
	quantity: number;
}

export interface ConditionalOrder {
	clientOrderId: number;
	orderType: string;
	timeInForce: string;
	totalNetPrice: number;
	clientEthAddress: string;
	orderGenesis?: string;
	legs: Leg[];
	fwdPrice?: number;
	spotPrice?: number;
	addCollateral?: boolean;
	numeraireY?: boolean;
}

const ithacaSDK = IthacaSDK.init({
    network: IthacaNetwork.MUMBAI,
    publicClient // Refer: https://viem.sh/docs/clients/public.html
});

export const estimateLock = async (order: ConditionalOrder) => {
    return await ithacaSDK.calculation.estimateOrderLock(order);
};