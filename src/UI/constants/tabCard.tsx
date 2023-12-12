// Types
type Tab = {
  id: string;
  title: string;
  selectedTitle?: string;
  description: string;
  contentId: string;
  radioOptions?: {
    option: string;
    value: string;
  }[]
};

export const TRADING_MARKET_TABS: Tab[] = [
  {
    id: 'options',
    title: 'Options',
    selectedTitle: 'Option',
    description:
      'A Call Option is a contract allowing a user to buy an asset at a fixed price at contract expiry, while a Put Option provides the user with the right to sell. ',
    contentId: 'optionsChart',
  },
  {
    id: 'digital-options',
    title: 'Digital Options',
    selectedTitle: 'Digital Option',
    description:
      'A Digital Call Option pays off if underlying asset price ends up above a certain level at expiry, while a Digital Put Option pays off if underlying asset price ends up below a certain level at expiry. Bet on whether the market will finish above or below your defined level and get paid accordingly.',
    contentId: 'digitalOptionsChart',
  },
  {
    id: 'forwards',
    title: 'Forwards',
    selectedTitle: 'Forward',
    description:
      'A Forward is a contract where the user agrees to buy or sell an asset at a fixed price and date in the future. Gain or loss depends on the difference between the agreed price and the market price at expiry.',
    contentId: 'forwardsChart',
  },
];

export const TRADING_STORIES_TABS: Tab[] = [
  {
    id: 'bet',
    title: 'Bet',
    description:
      'Place a Bet on whether an asset price ends up at expiry date inside or outside a user defined range. If order filled expected return shown on your Bet Capital at risk.',
    contentId: 'betChart',
  },
  {
    id: 'earn',
    title: 'Risky Earn | Riskless Earn',
    description: 'Earn risky yield on your capital at risk. Define an asset price target.',
    contentId: 'earnChart',
    radioOptions: [{
      option: 'Risky Earn',
      value: 'Risky Earn'
    },{
      option: 'Riskless Earn',
      value: 'Riskless Earn'
    }]
  },
  {
    id: 'noGainNoPayin',
    title: 'No Gain, No Payin’',
    description: 'Buy an option with maximum downside amount to be lost if asset price ends up at the strike.',
    contentId: 'noGainNoPayinChart',
  },
  {
    id: 'bonusTwinWin',
    title: 'Bonus | Twin-Win',
    description: 'Pay a premium to be long the underlying while protecting downside up to a barrier below the strike.',
    contentId: 'bonusTwinWinChart',
    radioOptions: [{
      option: 'Bonus',
      value: 'Bonus'
    },{
      option: 'Twin-Win',
      value: 'Twin Win'
    }]
  },
  {
    id: 'barriers',
    title: 'Barriers',
    description:
      'Set the upper and lower barriers and control if the price of the underlying asset falls in or outside that range.',
    contentId: 'barriersChart',
  },
];
