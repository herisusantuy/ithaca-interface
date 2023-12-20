// Packages
import React, { ReactElement } from 'react';

// Components
import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import { DigitalOptions, Forwards, Options } from '@/UI/components/TradingMarket';

const storyMap: {
  [key: string]: {
    component: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element;
    height: { normal: { withInstructions: number; withoutInstructions: number }; compact: number };
  };
} = {
  betChart: { component: Bet, height: { compact: 71, normal: { withInstructions: 160, withoutInstructions: 316 } } },
  earnChart: { component: Earn, height: { compact: 88, normal: { withInstructions: 194, withoutInstructions: 320 } } },
  noGainNoPayinChart: {
    component: NoGainNoPayin,
    height: { compact: 75, normal: { withInstructions: 168, withoutInstructions: 350 } },
  },
  bonusTwinWinChart: {
    component: BonusTwinWin,
    height: { compact: 75, normal: { withInstructions: 320, withoutInstructions: 408 } },
  },
  barriersChart: {
    component: Barriers,
    height: { compact: 61.5, normal: { withInstructions: 238, withoutInstructions: 420 } },
  },
  optionsChart: {
    component: Options,
    height: { compact: 93, normal: { withInstructions: 178, withoutInstructions: 239 } },
  },
  digitalOptionsChart: {
    component: DigitalOptions,
    height: { compact: 104, normal: { withInstructions: 214, withoutInstructions: 279 } },
  },
  forwardsChart: {
    component: Forwards,
    height: { compact: 120, normal: { withInstructions: 198, withoutInstructions: 306 } },
  },
};

export const getTradingStoryMapper = (contentId: string, showInstructions: boolean, compact = false, radioChosen?: string, onRadioChange?: (option: string | ReactElement) => void) => {
  if (!storyMap[contentId]) return null;
  const { component: Component, height } = storyMap[contentId];
  return (
    <Component
      showInstructions={showInstructions}
      compact={compact}
      radioChosen={radioChosen}
      onRadioChange={onRadioChange}
      chartHeight={
        compact ? height.compact : showInstructions ? height.normal.withInstructions : height.normal.withoutInstructions
      }
    />
  );
};
