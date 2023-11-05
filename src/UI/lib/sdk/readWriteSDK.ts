import { createPublicClient, http, createWalletClient, custom, WalletClient } from 'viem'
import { arbitrumGoerli, polygonMumbai } from 'viem/chains'
import { IthacaSDK, IthacaNetwork, Order } from '@ithaca-finance/sdk';
import { erc20Abi } from '@/UI/constants/erc20Abi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

export interface MetaMaskError {
    message: string;
    code: number;
    data?: any;
}

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

    getAccount = async () => {
        if (!this.isMetaMaskSupported()) {
            this.dispatchMetaMaskNotFoundEvent()
            return Promise.reject('Please install MetaMask.')
        }
        try {
            const accounts = await this.walletClient.requestAddresses()
            return Promise.resolve(accounts[0].toLowerCase() as `0x${string}`)
        } catch (error: any) {
            console.log('Failed to get accounts')
            this.dispatchMetaMaskError(error)
            return Promise.reject(error)
        }
    }

    async faucet(tokenAddress: `0x${string}`, account: `0x${string}`, amount: bigint) {
        try {
            if (this.walletClient) {
                const chain = this.walletClient.chain;
                return this.walletClient.writeContract({
                    account: await this.getAccount(),
                    address: tokenAddress,
                    abi: erc20Abi,
                    chain,
                    functionName: 'mint',
                    args: [account, amount],
                })
            }
        } catch (error) {
            console.error('failed to mint tokens => ', error)
        }
    }

    getFundLockState = async () => {
        try {
            return await this.sdk?.client.fundLockState()
        } catch (error) {
            console.error('Failed to get fund lock state ', error)
        }
    }

    dispatchMetaMaskError(error: MetaMaskError) {
        if (typeof error === 'string') {
            console.error({ cause: error })
        } else if (typeof error === 'object') {
            console.error({ cause: `MetaMask Error [${error.code}]`, details: error.message })
        }
    }

    dispatchMetaMaskNotFoundEvent() {
        console.error({
            cause: 'MetaMask not found.',
            details: `Please install <a class="underline text-blue-400" href="${process.env.META_MASK_DOWNLOAD_URL}" target="_blank">MetaMask</a> extension`,
        })
    }
}
const readWriteSDK = new ReadWriteSDK()
export default readWriteSDK