import { createPublicClient, http, createWalletClient, custom, WalletClient } from 'viem'
import { arbitrumGoerli } from 'viem/chains'
import { erc20Abi } from '@/UI/constants/erc20Abi';
import { fundLockAbi } from '@/UI/constants/fundLockAbi';


export interface MetaMaskError {
    message: string;
    code: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

class Web3Service {
    private walletClient!: WalletClient
    private publicClient = createPublicClient({
        chain: arbitrumGoerli,
        transport: http(),
    })

    private isBrowser = typeof window !== 'undefined'
    private isMetaMaskSupported = () => this.isBrowser && typeof window.ethereum !== 'undefined'

    private wsCallbacks = {
        onClose: () => {
        },
        onError: () => {
        },
        onMessage: () => {
        },
        onOpen: () => {
        },
    }

    constructor() {
        if (this.isMetaMaskSupported()) {
            this.walletClient = createWalletClient({
                chain: arbitrumGoerli,
                transport: custom(window.ethereum),
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any    
        } catch (error: any) {
            console.log('Failed to get accounts')
            this.dispatchMetaMaskError(error)
            return Promise.reject(error)
        }
    }

    async erc20BalanceOf(tokenAddress: `0x${string}`, account: `0x${string}`) {
        let balance = BigInt(0)
        try {
            balance = await this.publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [account],
            })
        } catch (error) {
            console.error('failed to fetch erc20 balance => ', error)
        }
        return balance
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


    async fundLockDeposit(tokenAddress: `0x${string}`, account: `0x${string}`, amount: bigint, fundlockAddress: `0x${string}`, tokenManagerAddress: `0x${string}`) {
        try {
            const chain = this.walletClient.chain

            const allowance = await this.erc20Allowance(tokenAddress, account, tokenManagerAddress as `0x${string}`)
            if (amount > allowance) {
                const hash = await this.erc20Approve(tokenAddress, account, tokenManagerAddress as `0x${string}`, amount)
                if (hash) await this.publicClient.waitForTransactionReceipt({ hash })
            }

            return this.walletClient.writeContract({
                account,
                address: fundlockAddress as `0x${string}`,
                abi: fundLockAbi,
                chain,
                functionName: 'deposit',
                args: [tokenAddress, amount],
            })
        }
        catch (error) {
            console.error('failed to deposit tokens => ', error)

        }
    }

    async erc20Allowance(tokenAddress: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) {
        let allowance = BigInt(0)
        try {
            allowance = await this.publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [owner, spender],
            })
        } catch (error) {
            console.error('failed to fetch erc20 allowance => ', error)
        }
        return allowance
    }

    async erc20Approve(tokenAddress: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`, amount: bigint) {
        try {
            const chain = this.walletClient.chain
            return this.walletClient.writeContract({
                account: owner,
                address: tokenAddress,
                abi: erc20Abi,
                chain,
                functionName: 'approve',
                args: [spender, amount],
            })
        } catch (error) {
            console.error('failed to approve tokens => ', error)
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
const web3Service = new Web3Service()
export default web3Service