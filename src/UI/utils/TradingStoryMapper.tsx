// Packages
import React from 'react';

// Components
import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import { DigitalOptions, Forwards, Options } from '@/UI/components/TradingMarket';

const storyMap: {
  [key: string]: {
    component: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element;
    height: { normal: { withInstructions: number; withoutInstructions: number }; compact: number };
  };
} = {
  betChart: { component: Bet, height: { compact: 71, normal: { withInstructions: 170, withoutInstructions: 286 } } },
  earnChart: { component: Earn, height: { compact: 88, normal: { withInstructions: 205, withoutInstructions: 300 } } },
  noGainNoPayinChart: {
    component: NoGainNoPayin,
    height: { compact: 75, normal: { withInstructions: 178, withoutInstructions: 312 } },
  },
  bonusTwinWinChart: {
    component: BonusTwinWin,
    height: { compact: 75, normal: { withInstructions: 215, withoutInstructions: 274 } },
  },
  barriersChart: {
    component: Barriers,
    height: { compact: 61.5, normal: { withInstructions: 170, withoutInstructions: 339 } },
  },
  optionsChart: {
    component: Options,
    height: { compact: 93, normal: { withInstructions: 318, withoutInstructions: 379 } },
  },
  digitalOptionsChart: {
    component: DigitalOptions,
    height: { compact: 104, normal: { withInstructions: 294, withoutInstructions: 379 } },
  },
  forwardsChart: {
    component: Forwards,
    height: { compact: 120, normal: { withInstructions: 318, withoutInstructions: 426 } },
  },
};

export const getTradingStoryMapper = (contentId: string, showInstructions: boolean, compact = false, radioChosen?: string) => {
  if (!storyMap[contentId]) return null;
  const { component: Component, height } = storyMap[contentId];
  return (
    <Component
      showInstructions={showInstructions}
      compact={compact}
      radioChosen={radioChosen}
      chartHeight={
        compact ? height.compact : showInstructions ? height.normal.withInstructions : height.normal.withoutInstructions
      }
    />
  );
};
