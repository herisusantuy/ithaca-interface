import { FundLockState } from '@ithaca-finance/sdk';
import LogoEth from '../components/Icons/LogoEth';
import LogoUsdc from '../components/Icons/LogoUsdc';

// Types
export interface CollateralSummary extends FundLockState {
  currencyLogo: JSX.Element;
  walletBalance: string;
}

export const TABLE_COLLATERAL_HEADERS: string[] = [
  'Asset',
  'Balance',
  'FundLock Value',
  'Net of Current Orders',
  'Live Order Collateral Net Value',
  '',
];

// Table strategy data
export const TABLE_COLLATERAL_SUMMARY: { [token: string]: CollateralSummary } = {
  WETH: {
    currency: 'WETH',
    currencyLogo: <LogoEth />,
    walletBalance: '0',
    fundLockValue: 0,
    orderValue: 0,
    settleValue: 0,
  },
  USDC: {
    currency: 'USDC',
    currencyLogo: <LogoUsdc />,
    walletBalance: '0',
    fundLockValue: 0,
    orderValue: 0,
    settleValue: 0,
  },
};
