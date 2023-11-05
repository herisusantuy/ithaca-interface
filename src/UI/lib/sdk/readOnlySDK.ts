import { createPublicClient, http } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { IthacaSDK, IthacaNetwork, Order } from '@ithaca-finance/sdk';

const publicClient = createPublicClient({ 
    chain: polygonMumbai,
    transport: http()
});

const wsCallbacks = {
    onClose: (ev: CloseEvent) => { 
        console.log('close', ev) 
    },
    onError: (ev: Event) => {
        console.log('error', ev) 
    },
    onMessage: (payload: Omit<Order, "collateral">) => {
        console.log('message', payload) 
    },
    onOpen: (ev: Event) => {
        console.log('open', ev) 
    },
  }

export const readOnlySDK = IthacaSDK.init({
    network: IthacaNetwork.MUMBAI,
    publicClient, // Refer: https://viem.sh/docs/clients/public.html
    wsCallbacks
});
