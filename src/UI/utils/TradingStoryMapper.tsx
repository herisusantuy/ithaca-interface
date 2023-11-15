import React from 'react';
import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import { DigitalOptions, Forwards, Options } from '../components/TradingMarket';

const storyMap: {
  [key: string]: {
    component: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element;
    height: { normal: number; compact: number };
  };
} = {
  betChart: { component: Bet, height: { compact: 60, normal: 170 } },
  earnChart: { component: Earn, height: { compact: 60, normal: 170 } },
  noGainNoPayinChart: { component: NoGainNoPayin, height: { compact: 60, normal: 170 } },
  bonusTwinWinChart: { component: BonusTwinWin, height: { compact: 60, normal: 170 } },
  barriersChart: { component: Barriers, height: { compact: 60, normal: 170 } },
  optionsChart: { component: Options, height: { compact: 100, normal: 375 } },
  digitalOptionsChart: { component: DigitalOptions, height: { compact: 120, normal: 375 } },
  forwardsChart: { component: Forwards, height: { compact: 150, normal: 375 } },
};

export const getTradingStoryMapper = (contentId: string, showInstructions: boolean, compact = false) => {
  if (!storyMap[contentId]) return null;
  const { component: Component, height } = storyMap[contentId];
  return (
    <Component
      showInstructions={showInstructions}
      compact={compact}
      chartHeight={compact ? height.compact : height.normal}
    />
  );
};
