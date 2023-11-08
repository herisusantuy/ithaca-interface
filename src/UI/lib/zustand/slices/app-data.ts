import { StateCreator } from "zustand";
import { getNumber } from '../../../utils/Numbers';
import dayjs from 'dayjs'
import { IthacaNetwork, IthacaSDK, SystemInfo } from "@ithaca-finance/sdk";
import { createPublicClient, http } from "viem";
import { arbitrumGoerli } from "viem/chains";

const publicClient = createPublicClient({
    chain: arbitrumGoerli,
    transport: http()
});
export interface AuctionTimes {
    hour: number,
    minute: number,
    second: number,
    milliseconds: number
}

export interface ReferencePrices {
    contractId: number;
    highRange: number;
    lastPrice: number;
    lowRange: number;
    referencePrice: number;
    updatedAt: string;
}

export interface Contract {
    contractId: number;
    economics: Economics;
    payoff: string;
    tradeable: boolean;
}

export interface Economics {
    currencyPair: string;
    expiry: number;
    priceCurrency: string;
    qtyCurrency: string;
    strike: number;
}


export interface AppDataSlice {
    nextAuction: AuctionTimes;
    systemInfo: SystemInfo;
    contractList: Record<string, Contract[]>;
    referencePrices: ReferencePrices[];
    publicSDK: IthacaSDK,
    currentExpiryDate: number;
    setNextAuction: (time: number) => number;
    fetchContractList: () => void;
    fetchReferencePrices: () => void;
    fetchSystemInfo: () => void;
}

export const createAppDataSlice: StateCreator<AppDataSlice> = (set, get) => ({
    nextAuction: {
        hour: 0,
        minute: 0,
        second: 0,
        milliseconds: 0
    },
    systemInfo: {
        chainId: 421613,
        fundlockAddress: '0xc50d980ee2835868a1e7ec37bb0fd4543d6fe536',
        tokenAddress: {
            USDC: '0x5c96109d6535e8ad49189950aee836b84a1bc10b',
            WETH: '0x43aeb2b2bc97d32d3e5418b4441225a164eb3726'
        },
        tokenDecimals: {
            WETH: 18,
            USDC: 6
        },
        currencyPrecision: {
            WETH: 7,
            USDC: 4
        },
        tokenManagerAddress: '0xc218b1f70e0e9c464ef78fb50e67004f2cd6e581',
        networks: []
    },
    contractList: {},
    currentExpiryDate: 0,
    referencePrices: [],
    publicSDK: IthacaSDK.init({
        network: IthacaNetwork.ARBITRUM_GOERLI,
        publicClient,
    }),
    setNextAuction: (time: number) => {
        const nextAuction = dayjs(time);
        const currentTime = dayjs();
        const milliseconds = nextAuction.diff(currentTime);
        set({
            nextAuction: {
                hour: nextAuction.diff(currentTime, 'hour'),
                minute: nextAuction.diff(currentTime, 'minute') % 60,
                second: nextAuction.diff(currentTime, 'second') % 60,
                milliseconds
            }
        })
        return milliseconds;
    },
    fetchContractList: async () => {
        const { publicSDK } = get();
        const contractList = await publicSDK.protocol.contractList();
        const filteredList = contractList.reduce((obj, val) => {
            if (obj[val.economics.expiry]) {
                obj[val.economics.expiry].push(val)
            }
            else {
                obj[val.economics.expiry] = [val];
            }
            return obj;
        }, {});
        set({ contractList: filteredList, currentExpiryDate: getNumber(Object.keys(filteredList)[1]) });
    },
    fetchReferencePrices: async () => {
        const { publicSDK } = get();
        const referencePrices = await publicSDK.market.referencePrices(0, 'WETH/USDC');
        set({ referencePrices: referencePrices })
    },
    fetchSystemInfo: async () => {
        const { publicSDK } = get();
        const systemInfo = await publicSDK.protocol.systemInfo()
        set({ systemInfo: systemInfo })
    },
})