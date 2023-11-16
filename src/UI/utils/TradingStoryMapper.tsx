import React from 'react';
import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import { DigitalOptions, Forwards, Options } from '../components/TradingMarket';

const storyMap: {
  [key: string]: {
    component: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element;
    height: { normal: { withInstructions: number; withoutInstructions: number }; compact: number };
  };
} = {
  betChart: { component: Bet, height: { compact: 78, normal: { withInstructions: 275, withoutInstructions: 389 } } },
  earnChart: { component: Earn, height: { compact: 92, normal: { withInstructions: 283, withoutInstructions: 402 } } },
  noGainNoPayinChart: {
    component: NoGainNoPayin,
    height: { compact: 80, normal: { withInstructions: 270, withoutInstructions: 417 } },
  },
  bonusTwinWinChart: {
    component: BonusTwinWin,
    height: { compact: 80, normal: { withInstructions: 290, withoutInstructions: 362 } },
  },
  barriersChart: {
    component: Barriers,
    height: { compact: 64, normal: { withInstructions: 302, withoutInstructions: 444 } },
  },
  optionsChart: {
    component: Options,
    height: { compact: 120, normal: { withInstructions: 300, withoutInstructions: 300 } },
  },
  digitalOptionsChart: {
    component: DigitalOptions,
    height: { compact: 140, normal: { withInstructions: 300, withoutInstructions: 300 } },
  },
  forwardsChart: {
    component: Forwards,
    height: { compact: 150, normal: { withInstructions: 300, withoutInstructions: 300 } },
  },
};

export const getTradingStoryMapper = (contentId: string, showInstructions: boolean, compact = false) => {
  if (!storyMap[contentId]) return null;
  const { component: Component, height } = storyMap[contentId];
  return (
    <Component
      showInstructions={showInstructions}
      compact={compact}
      chartHeight={
        compact ? height.compact : showInstructions ? height.normal.withInstructions : height.normal.withoutInstructions
      }
    />
  );
};
