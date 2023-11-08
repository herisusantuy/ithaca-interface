import { StateCreator } from "zustand";
import { IthacaNetwork, IthacaSDK } from "@ithaca-finance/sdk";
import { createPublicClient, http, WalletClient } from "viem";
import { arbitrumGoerli } from "viem/chains";

const publicClient = createPublicClient({
    chain: arbitrumGoerli,
    transport: http()
});

export interface SdkSlice {
    walletSDK: IthacaSDK | undefined,
    initSdk: (walletClient: WalletClient) => Promise<IthacaSDK>;
    currentAccount: string | undefined
    setCurrentAccount: (session?: string) => void;
}

export const createSdkSlice: StateCreator<SdkSlice> = (set) => ({
    walletSDK: undefined,
    currentAccount: undefined,
    initSdk: async (walletClient) => {
        const sdk = await IthacaSDK.init({
            network: IthacaNetwork.ARBITRUM_GOERLI,
            publicClient,
            walletClient
        });
        set({walletSDK: sdk})
        return sdk;
    },
    setCurrentAccount: (session) => {
        set({currentAccount: session})
    }
})