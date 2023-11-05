import { StateCreator } from "zustand";
import { getNumber } from '../../../utils/Numbers';
import dayjs from 'dayjs'
import { readOnlySDK } from "../../sdk/readOnlySDK";



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


export interface ReadSdkSlice {
    nextAuction: AuctionTimes;
    contractList: Record<string, Contract[]>;
    referencePrices: ReferencePrices[];
    currentExpiryDate: number;
    fetchNextAuction: () => void;
    fetchContractList: () => void;
    fetchReferencePrices: () => void;
}

export const createReadSdkSlice: StateCreator<ReadSdkSlice> = (set) => ({
    nextAuction: {
        hour: 0,
        minute: 0,
        second: 0,
        milliseconds: 0
    },
    contractList: {},
    currentExpiryDate: 0,
    referencePrices: [],
    fetchNextAuction: async () => {
        const nextAuction = dayjs(await readOnlySDK.protocol.nextAuction());
        const currentTime = dayjs();
        set({ nextAuction: {
            hour: nextAuction.diff(currentTime, 'hour'),
            minute: nextAuction.diff(currentTime, 'minute')%60,
            second: nextAuction.diff(currentTime, 'second')%60,
            milliseconds: nextAuction.diff(currentTime)
        } })
    },
    fetchContractList: async () => {
        const contractList = await readOnlySDK.protocol.contractList();
        const filteredList = contractList.reduce((obj, val) => {
            if (obj[val.economics.expiry]) {
                obj[val.economics.expiry].push(val)
            }
            else {
                obj[val.economics.expiry] = [val];
            }
            return obj;
        }, {});
        set({contractList: filteredList, currentExpiryDate: getNumber(Object.keys(filteredList)[1])});
    },
    fetchReferencePrices: async () => {
        const referencePrices = await readOnlySDK.market.referencePrices(0, 'WETH/USDC');
        set({referencePrices: referencePrices})
    },
})