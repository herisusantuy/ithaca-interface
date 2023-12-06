import { StateCreator } from 'zustand';
import dayjs from 'dayjs';
import { Contract, IthacaNetwork, IthacaSDK, Order, ReferencePrice, SystemInfo } from '@ithaca-finance/sdk';
import { PublicClient, WalletClient } from 'wagmi';

export interface AuctionTimes {
  hour: number;
  minute: number;
  second: number;
  milliseconds: number;
}

export interface ContractDetails {
  [strike: string]: Contract & ReferencePrice;
}

interface ContractList {
  [currencyPair: string]: {
    [expiry: string]: {
      [payoff: string]: ContractDetails;
    };
  };
}

export interface IthacaSDKSlice {
  isLoading: boolean;
  isAuthenticated: boolean;
  ithacaSDK: IthacaSDK;
  systemInfo: SystemInfo;
  nextAuction: AuctionTimes;
  currentExpiryDate: number;
  currentCurrencyPair: string;
  currentSpotPrice: number;
  currencyPrecision: { underlying: number; strike: number };
  contractList: ContractList;
  unFilteredContractList: Contract[];
  expiryList: number[];
  referencePrices: ReferencePrice[];
  spotPrices: { [currencyPair: string]: number };
  toastNotifications: Omit<Order, "collateral">[];
  newToast?:  Omit<Order, "collateral">
  initIthacaSDK: (publicClient: PublicClient, walletClient?: WalletClient) => void;
  initIthacaProtocol: () => Promise<void>;
  fetchNextAuction: () => Promise<void>;
  fetchSpotPrices: () => Promise<void>;
  getContractsByPayoff: (payoff: string) => ContractDetails;
  getContractsByExpiry: (expiry: string, payoff: string) => ContractDetails;
  setCurrentExpiryDate: (date: number) => void;
}

export const createIthacaSDKSlice: StateCreator<IthacaSDKSlice> = (set, get) => ({
  isLoading: true,
  isAuthenticated: false,
  ithacaSDK: new IthacaSDK(
    IthacaNetwork.ARBITRUM_GOERLI,
    undefined,
    undefined,
    "https://api.salt.develop.ithacanoemon.tech/api/v1"
  ),
  systemInfo: {
    chainId: 0,
    fundlockAddress: '' as `0x${string}`,
    tokenAddress: {},
    tokenDecimals: {},
    currencyPrecision: {},
    tokenManagerAddress: '' as `0x${string}`,
    networks: [],
  },
  nextAuction: {
    hour: 0,
    minute: 0,
    second: 0,
    milliseconds: 0,
  },
  currentExpiryDate: 0,
  currentCurrencyPair: 'WETH/USDC',
  currentSpotPrice: 0,
  currencyPrecision: { underlying: 0, strike: 0 },
  contractList: {},
  unFilteredContractList: [],
  expiryList: [],
  referencePrices: [],
  spotPrices: {},
  toastNotifications: [],
  newToast: undefined,
  initIthacaSDK: async (publicClient, walletClient) => {
    const ithacaSDK = new IthacaSDK(
      IthacaNetwork.ARBITRUM_GOERLI,
      walletClient,
      {
        onClose: (ev: CloseEvent) => { 
          console.log(ev)
         },
        onError: (ev: Event) => { 
          console.log(ev)
         },
        onMessage: (payload: Omit<Order, "collateral">) => { 
          set({newToast: payload});
          set({toastNotifications: [...get().toastNotifications, payload]})
         },
        onOpen: (ev: Event) => { 
          console.log(ev)
         }
      },
      // undefined,
      "https://api.salt.develop.ithacanoemon.tech/api/v1"
    );
    
    if (walletClient) {
      const ithacaSession = localStorage.getItem('ithaca.session');
      if (ithacaSession) {
        try {
          const currentSession = await ithacaSDK.auth.getSession();
          if (ithacaSession === JSON.stringify(currentSession)) {
            set({ ithacaSDK, isAuthenticated: true });
            return;
          }
        } catch (error) {
          console.error('Session has timed out');
        }
      }

      try {
        const newSession = await ithacaSDK.auth.login();
        localStorage.setItem('ithaca.session', JSON.stringify(newSession));
        set({ ithacaSDK, isAuthenticated: true });
        return;
      } catch (error) {
        console.error('Failed to log in');
      }
    }
    set({ ithacaSDK, isAuthenticated: false });
  },
  initIthacaProtocol: async () => {
    const { ithacaSDK, currentCurrencyPair } = get();

    const systemInfo = await ithacaSDK.protocol.systemInfo();
    const contractList = await ithacaSDK.protocol.contractList();
    const referencePrices = await ithacaSDK.market.referencePrices(0, currentCurrencyPair);
    const spotPrices = await ithacaSDK.market.spotPrices();

    const [underlyingCurrency, strikeCurrency] = currentCurrencyPair.split('/');
    const currencyPrecision = {
      underlying: systemInfo.currencyPrecision[underlyingCurrency],
      strike: systemInfo.currencyPrecision[strikeCurrency],
    };

    const contractsWithReferencePrices: { [key: string]: Contract & ReferencePrice } = {};
    contractList.forEach(contract => {
      contractsWithReferencePrices[contract.contractId] = {
        ...contractsWithReferencePrices[contract.contractId],
        ...contract,
      };
    });
    referencePrices.forEach(ref => {
      contractsWithReferencePrices[ref.contractId] = { ...contractsWithReferencePrices[ref.contractId], ...ref };
    });
    const filteredContractList = Object.values(contractsWithReferencePrices).reduce<ContractList>(
      (result, contract) => {
        const {
          economics: { currencyPair, expiry, strike },
          payoff,
        } = contract;

        if (!result[currencyPair]) result[currencyPair] = {};
        if (!result[currencyPair][expiry]) result[currencyPair][expiry] = {};
        if (!result[currencyPair][expiry][payoff]) result[currencyPair][expiry][payoff] = {};

        result[currencyPair][expiry][payoff][strike ?? '-'] = contract;

        return result;
      },
      {}
    );
    const expiryList = Object.keys(filteredContractList[currentCurrencyPair]).map(expiry => parseInt(expiry));
    const currentExpiryDate = expiryList[1];
    const currentSpotPrice = spotPrices[currentCurrencyPair];

    set({
      isLoading: false,
      systemInfo,
      currencyPrecision,
      contractList: filteredContractList,
      unFilteredContractList: contractList,
      expiryList,
      currentExpiryDate,
      referencePrices,
      spotPrices,
      currentSpotPrice,
    });
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
  fetchSpotPrices: async () => {
    const spotPrices = await get().ithacaSDK.market.spotPrices();
    const currentCurrencyPair = get().currentCurrencyPair;
    set({ spotPrices, currentSpotPrice: spotPrices[currentCurrencyPair] });
  },
  getContractsByPayoff: (payoff: string) => {
    const { contractList, currentCurrencyPair, currentExpiryDate } = get();
    return contractList[currentCurrencyPair][currentExpiryDate][payoff];
  },
  getContractsByExpiry: (expiry: string, payoff: string) => {
    const { contractList, currentCurrencyPair } = get();
    return contractList[currentCurrencyPair][expiry][payoff];
  },
  setCurrentExpiryDate: (date: number) => {
    set({ currentExpiryDate: date });
  },
});
