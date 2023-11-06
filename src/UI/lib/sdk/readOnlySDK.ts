import { createPublicClient, http } from 'viem'
import { arbitrumGoerli } from 'viem/chains'
import { IthacaSDK, IthacaNetwork } from '@ithaca-finance/sdk';

const publicClient = createPublicClient({
    chain: arbitrumGoerli,
    transport: http()
});

const wsCallbacks = {
    onClose: () => {
    },
    onError: () => {
    },
    onMessage: () => {
    },
    onOpen: () => {
    },
}

export const readOnlySDK = IthacaSDK.init({
    network: IthacaNetwork.ARBITRUM_GOERLI,
    publicClient, // Refer: https://viem.sh/docs/clients/public.html
    wsCallbacks
});
