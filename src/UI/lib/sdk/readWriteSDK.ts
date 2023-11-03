import { createPublicClient, http, createWalletClient, custom, WalletClient } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { IthacaSDK, IthacaNetwork, Order } from '@ithaca-finance/sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

class ReadWriteSDK {
    private walletClient!: WalletClient
    private publicClient = createPublicClient({
        chain: polygonMumbai,
        transport: http('https://polygon-mumbai.infura.io/v3/c351135c3bb54a779bf258ea5f1077d6'),
    })

    private isBrowser = typeof window !== 'undefined'
    private isMetaMaskSupported = () => this.isBrowser && typeof window.ethereum !== 'undefined'

    public sdk: IthacaSDK | undefined
    private wsCallbacks = {
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

    constructor() {
        if (this.isMetaMaskSupported()) {
            this.walletClient = createWalletClient({
                chain: polygonMumbai,
                transport: custom(window.ethereum),
            })
            this.sdk = IthacaSDK.init({
                network: IthacaNetwork.MUMBAI,
                publicClient: this.publicClient, // Refer: https://viem.sh/docs/clients/public.html
                walletClient: this.walletClient,
                wsCallbacks: this.wsCallbacks
            });
        } else {
            console.log('Please install metamask')
        }
    }
}
const readWriteSDK = new ReadWriteSDK()
export default readWriteSDK