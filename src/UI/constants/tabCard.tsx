import { MainTab } from '../components/TabCard/TabCard';

export const TRADING_MARKET_TABS: MainTab[] = [
  {
    id: 'options',
    title: 'Options',
    selectedTitle: 'Option',
    description:
      'A Call Option is a contract providing the user with the right to buy an asset at a fixed price at contract expiry, while a Put Option provides the user with the equivalent right to sell.',
    contentId: 'optionsChart',
  },
  {
    id: 'digital-options',
    title: 'Digital Options',
    selectedTitle: 'Digital Option',
    description:
      'A Digital Call Option pays off if underlying asset price ends up above the strike at expiry, while a Digital Put Option pays off if underlying asset price ends up below the strike at expiry. Bet on whether the market will finish above or below the strike and get paid accordingly.',
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

export const TRADING_STORIES_TABS: MainTab[] = [
  {
    id: 'bet',
    title: 'Bet',
    description:
      'Place a Bet on whether an asset price ends up at expiry date inside or outside a user defined range.\nBet on whether the market will finish above or below your defined level and get paid accordingly.',
    contentId: 'betChart',
  },
  {
    id: 'earn',
    title: 'Risky Earn\nRiskless Earn',
    description: 'Earn risky yield on your capital at risk.\n Define an asset price target.',
    contentId: 'earnChart',
    radioOptions: [
      {
        option: 'Risky Earn',
        value: 'Risky Earn',
      },
      {
        option: 'Riskless Earn',
        value: 'Riskless Earn',
      },
    ],
    underText: [
      {
        label: 'Capital At Risk',
        value: 'Risky Earn',
      },
      {
        label: 'Collateralized Lending',
        value: 'Riskless Earn',
      },
    ],
  },
  {
    id: 'noGainNoPayin',
    title: 'No Gain, No Payin’',
    description:
      'Buy an option WITHOUT spending premium with maximum downside amount to be lost if asset price ends up at the strike; if you do not get the direction right, you also get your collateral back!',
    contentId: 'noGainNoPayinChart',
  },
  {
    id: 'bonusTwinWin',
    title: 'Bonus | Twin-Win',
    description: 'Pay a premium to be long the underlying while protecting downside up to a barrier below the strike.',
    contentId: 'bonusTwinWinChart',
    radioOptions: [
      {
        option: 'Bonus',
        value: 'Bonus',
      },
      {
        option: 'Twin-Win',
        value: 'Twin Win',
      },
    ],
  },
  {
    id: 'barriers',
    title: 'Barriers',
    description:
      'Up-and-In Call Option: The Sniper\nCheapen right to buy, which springs to life when asset price rises past a barrier; like a sniper waiting for just the right market climb to take its shot.',
    contentId: 'barriersChart',
  },
];

export const DESCRIPTION_OPTIONS = {
  'Twin Win':
    'Pay a premium to be long the underlying while becoming short the underlying up to a barrier below the strike.',
  Bonus: 'Pay a premium to be long the underlying while protecting downside up to a barrier below the strike.',
  'Risky Earn': 'Earn risky yield on your capital at risk.\n Define an asset price target.',
  'Riskless Earn': 'Earn yield on your collateralized loan \n( no margin liquidation risk ).',
  UP_IN:
    'Up-and-In Call Option: The Sniper\nCheapen right to buy, which springs to life when asset price rises past a barrier; like a sniper waiting for just the right market climb to take its shot.',
  UP_OUT:
    'Up-and-Out Call Option: The Highwire Act\nCheapen Right to buy when a modest rise expected but not a leap, walking a fine line between profit and knockout.',
  DOWN_IN:
    'Down-and-In Put Option: Guardian Angel Depth Charge Cheapen downside protection by activating right to sell when market sinks below a certain level and detonating like a finely calibrated depth charge acting as a guardian angel; stepping in when the market falls too much.',
  DOWN_OUT:
    'Down-and-Out Put Option: The Bungee Jumper\nCheapen downside protection, risking Knock-out if the prices plunges past the barrier: ideal for a modest downdraft, not a rout.',
};
