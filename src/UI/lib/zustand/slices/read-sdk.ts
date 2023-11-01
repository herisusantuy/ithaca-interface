import { StateCreator } from "zustand";
import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { IthacaSDK, IthacaNetwork } from '@ithaca-finance/sdk';
import dayjs from 'dayjs'

const publicClient = createPublicClient({ 
    chain: polygonMumbai,
    transport: http()
});

const ithacaSDK = IthacaSDK.init({
    network: IthacaNetwork.MUMBAI,
    publicClient // Refer: https://viem.sh/docs/clients/public.html
});

export interface AuctionTimes {
    hour: number,
    minute: number,
    second: number,
    milliseconds: number
}

export interface ReadSdkSlice {
    nextAuction: AuctionTimes;
    fetchNextAuction: () => void;
}

export const createReadSdkSlice: StateCreator<ReadSdkSlice> = (set) => ({
    nextAuction: {
        hour: 0,
        minute: 0,
        second: 0,
        milliseconds: 0
    },
    fetchNextAuction: async () => {
        const nextAuction = dayjs(await ithacaSDK.protocol.nextAuction());
        const currentTime = dayjs();
        set({ nextAuction: {
            hour: nextAuction.diff(currentTime, 'hour'),
            minute: nextAuction.diff(currentTime, 'minute')%60,
            second: nextAuction.diff(currentTime, 'second')%60,
            milliseconds: nextAuction.diff(currentTime)
        } })
    },
})