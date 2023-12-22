import { StateCreator } from 'zustand';
import dayjs from 'dayjs';
import { Contract, IthacaNetwork, IthacaSDK, Order, ReferencePrice, SystemInfo } from '@ithaca-finance/sdk';
import { PublicClient, WalletClient } from 'wagmi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isLocalhost } from '@/UI/utils/RainbowKit';
dayjs.extend(customParseFormat);

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
  toastNotifications: Omit<Order, 'collateral'>[];
  openOrdersCount: number;
  newToast?: Omit<Order, 'collateral'>;
  spotContract: Contract & ReferencePrice;
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
    isLocalhost() ? IthacaNetwork.GANACHE : IthacaNetwork.ARBITRUM_GOERLI,
    undefined,
    undefined,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_WS_URL
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
  spotContract: {
    contractId: 0,
    payoff: 'Spot',
    tradeable: true,
    referencePrice: 0,
    lowRange: 0,
    highRange: 0,
    lastPrice: 0,
    updateAt: '',
    economics: {
      currencyPair: 'WETH/USDC',
      expiry: 0,
      priceCurrency: '',
      qtyCurrency: '',
    },
  },
  openOrdersCount: 0,
  toastNotifications: [],
  newToast: undefined,
  initIthacaSDK: async (publicClient, walletClient) => {
    const ithacaSDK = new IthacaSDK(
      isLocalhost() ? IthacaNetwork.GANACHE : IthacaNetwork.ARBITRUM_GOERLI,
      walletClient,
      {
        onClose: (ev: CloseEvent) => {
          console.log(ev);
        },
        onError: (ev: Event) => {
          console.log(ev);
        },
        // TODO: add totalOpenOrdersCount in the Order object if needed
        onMessage: (payload: Omit<Order, 'collateral'> & { totalOpenOrdersCount?: number }) => {
          set({
            openOrdersCount: payload?.totalOpenOrdersCount,
            newToast: payload,
            toastNotifications: [...get().toastNotifications, payload],
          });
        },
        onOpen: (ev: Event) => {
          console.log(ev);
        },
      },
      // undefined,
      process.env.NEXT_PUBLIC_BACKEND_URL,
      process.env.NEXT_PUBLIC_WS_URL
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
    let spotContract = undefined;
    const filteredContractList = Object.values(contractsWithReferencePrices).reduce<ContractList>(
      (result, contract) => {
        const {
          economics: { currencyPair, expiry, strike },
          payoff,
        } = contract;
        if (payoff === 'Spot') {
          spotContract = contract;
          return result;
        }
        const date = parseInt(dayjs(expiry.toString(), 'YYMMDDHHm').format('YYYYMMDD'));
        if (!result[currencyPair]) result[currencyPair] = {};
        if (!result[currencyPair][date]) result[currencyPair][date] = {};
        if (!result[currencyPair][date][payoff]) result[currencyPair][date][payoff] = {};

        result[currencyPair][date][payoff][strike ?? '-'] = contract;

        return result;
      },
      {}
    );
    const expiryList = Object.keys(filteredContractList[currentCurrencyPair]).reduce((arr: number[], expiry) => {
      if (Object.keys(filteredContractList[currentCurrencyPair][expiry]).length > 4) {
        arr.push(parseInt(expiry));
      }
      return arr;
    }, []);
    const currentExpiryDate = expiryList[0];
    const currentSpotPrice = spotPrices[currentCurrencyPair];

    set({
      spotContract: spotContract || get().spotContract,
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
