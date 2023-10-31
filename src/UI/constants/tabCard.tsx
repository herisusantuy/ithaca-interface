// Types
type Tab = {
  id: string;
  title: string;
  description: string;
  contentId: string;
  subTabs?: SubTab[];
};

type SubTab = {
  id: string;
  label: string;
  contentId: string;
};

export const TRADING_MARKET_TABS: Tab[] = [
  {
    id: 'options',
    title: 'Options',
    description:
      'A Call Option is a contract allowing a user to buy an asset at a fixed price at contract expiry, while a Put Option provides the user with the right to sell. Reserve a future sale or purchase without any commitment to follow up on the reservation.',
    contentId: 'optionsChart',
    subTabs: [
      { id: 'call', label: 'Call', contentId: 'optionsCall' },
      { id: 'put', label: 'Put', contentId: 'optionsPut' },
    ],
  },
  {
    id: 'digital-options',
    title: 'Digital Options',
    description:
      'A Digital Call Option pays off if underlying asset price ends up above a certain level at expiry, while a Digital Put Option pays off if underlying asset price ends up below a certain level at expiry. Bet on whether the market will finish above or below your defined level and get paid accordingly.',
    contentId: 'digitalOptionsChart',
    subTabs: [
      { id: 'digital-call', label: 'Call', contentId: 'digitalOptionsCall' },
      { id: 'digital-put', label: 'Put', contentId: 'digitalOptionsPut' },
    ],
  },
  {
    id: 'forwards',
    title: 'Forwards',
    description:
      'A Forward is a contract where the user agrees to buy or sell an asset at a fixed price and date in the future. Gain or loss depends on the difference between the agreed price and the market price at expiry.',
    contentId: 'forwardsChart',
    subTabs: [
      { id: 'expiry-date', label: 'Expiry Date', contentId: 'forwardsExpiryDate' },
      { id: 'next-auction', label: 'Next Auction', contentId: 'forwardsNextAuction' },
    ],
  },
];
