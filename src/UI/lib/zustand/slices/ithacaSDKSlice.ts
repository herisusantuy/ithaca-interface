import { StateCreator } from 'zustand';
import { getNumber } from '../../../utils/Numbers';
import dayjs from 'dayjs';
import { Contract, IthacaNetwork, IthacaSDK, ReferencePrice, SystemInfo } from '@ithaca-finance/sdk';
import { createPublicClient, http } from 'viem';
import { arbitrumGoerli } from 'viem/chains';
import { PublicClient, WalletClient } from 'wagmi';

export interface AuctionTimes {
  hour: number;
  minute: number;
  second: number;
  milliseconds: number;
}

export interface IthacaSDKSlice {
  ithacaSDK: IthacaSDK;
  systemInfo: SystemInfo;
  nextAuction: AuctionTimes;
  currentExpiryDate: number;
  contractList: Contract[];
  referencePrices: ReferencePrice[];
  initIthacaSDK: (publicClient: PublicClient, walletClient: WalletClient) => void;
  fetchSystemInfo: () => Promise<void>;
  fetchNextAuction: () => Promise<void>;
  fetchContractList: () => Promise<void>;
  fetchReferencePrices: () => Promise<void>;
}

export const createIthacaSDKSlice: StateCreator<IthacaSDKSlice> = (set, get) => ({
  ithacaSDK: IthacaSDK.init({
    network: IthacaNetwork.ARBITRUM_GOERLI,
    publicClient: createPublicClient({
      chain: arbitrumGoerli,
      transport: http(),
    }),
  }),
  systemInfo: {
    chainId: 0,
    fundlockAddress: '',
    tokenAddress: {},
    tokenDecimals: {},
    currencyPrecision: {},
    tokenManagerAddress: '',
    networks: [],
  },
  nextAuction: {
    hour: 0,
    minute: 0,
    second: 0,
    milliseconds: 0,
  },
  currentExpiryDate: 0,
  contractList: [],
  referencePrices: [],
  initIthacaSDK: async (publicClient, walletClient) => {
    const ithacaSDK = IthacaSDK.init({
      network: IthacaNetwork.ARBITRUM_GOERLI,
      publicClient,
      walletClient,
    });
    set({ ithacaSDK });
    await ithacaSDK.auth.login();
  },
  fetchSystemInfo: async () => {
    const systemInfo = await get().ithacaSDK.protocol.systemInfo();
    set({ systemInfo: systemInfo });
  },
  fetchNextAuction: async () => {
    const nextAuction = dayjs(await get().ithacaSDK.protocol.nextAuction());
    const currentTime = dayjs();
    set({
      nextAuction: {
        hour: nextAuction.diff(currentTime, 'hour'),
        minute: nextAuction.diff(currentTime, 'minute') % 60,
        second: nextAuction.diff(currentTime, 'second') % 60,
        milliseconds: nextAuction.diff(currentTime),
      },
    });
  },
  fetchContractList: async () => {
    const contractList = await get().ithacaSDK.protocol.contractList();
    const filteredList = contractList.reduce((obj, val) => {
      if (obj[val.economics.expiry]) {
        obj[val.economics.expiry].push(val);
      } else {
        obj[val.economics.expiry] = [val];
      }
      return obj;
    }, {});
    set({ contractList, currentExpiryDate: getNumber(Object.keys(filteredList)[1]) });
  },
  fetchReferencePrices: async () => {
    const referencePrices = await get().ithacaSDK.market.referencePrices(0, 'WETH/USDC');
    set({ referencePrices: referencePrices });
  },
});
