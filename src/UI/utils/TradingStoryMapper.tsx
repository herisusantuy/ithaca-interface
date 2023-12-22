// Packages
import React, { ReactElement } from 'react';

// Components
import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import { DigitalOptions, Forwards, Options } from '@/UI/components/TradingMarket';

const storyMap: {
  [key: string]: {
    component: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element;
    height: {
      normal: { withInstructions: number; withoutInstructions: number };
      compact: { mobile: number; tablet: number; desktop: number };
    };
  };
} = {
  betChart: {
    component: Bet,
    height: {
      compact: { mobile: 71, tablet: 71, desktop: 71 },
      normal: { withInstructions: 160, withoutInstructions: 316 },
    },
  },
  earnChart: {
    component: Earn,
    height: {
      compact: { mobile: 88, tablet: 88, desktop: 88 },
      normal: { withInstructions: 194, withoutInstructions: 320 },
    },
  },
  noGainNoPayinChart: {
    component: NoGainNoPayin,
    height: {
      compact: { mobile: 75, tablet: 75, desktop: 75 },
      normal: { withInstructions: 168, withoutInstructions: 350 },
    },
  },
  bonusTwinWinChart: {
    component: BonusTwinWin,
    height: {
      compact: { mobile: 75, tablet: 75, desktop: 75 },
      normal: { withInstructions: 320, withoutInstructions: 408 },
    },
  },
  barriersChart: {
    component: Barriers,
    height: {
      compact: { mobile: 61.5, tablet: 61.5, desktop: 61.5 },
      normal: { withInstructions: 238, withoutInstructions: 420 },
    },
  },
  optionsChart: {
    component: Options,
    height: {
      compact: { mobile: 58, tablet: 64, desktop: 93 },
      normal: { withInstructions: 188, withoutInstructions: 249 },
    },
  },
  digitalOptionsChart: {
    component: DigitalOptions,
    height: {
      compact: { mobile: 58, tablet: 64, desktop: 93 },
      normal: { withInstructions: 184, withoutInstructions: 249 },
    },
  },
  forwardsChart: {
    component: Forwards,
    height: {
      compact: { mobile: 75, tablet: 84, desktop: 120 },
      normal: { withInstructions: 142, withoutInstructions: 250 },
    },
  },
};

export const getTradingStoryMapper = (
  contentId: string,
  showInstructions: boolean,
  compact = false,
  radioChosen?: string,
  onRadioChange?: (option: string | ReactElement) => void,
  isMobile = false, 
  isTablet = false
) => {
  if (!storyMap[contentId]) return null;
  const { component: Component, height } = storyMap[contentId];

  let chartHeight: number;
  if (compact) {
    chartHeight = isMobile
      ? height.compact.mobile
      : isTablet
      ? height.compact.tablet
      : height.compact.desktop;
  } else {
    chartHeight = showInstructions ? height.normal.withInstructions : height.normal.withoutInstructions;
  }

  return (
    <Component
      showInstructions={showInstructions}
      compact={compact}
      radioChosen={radioChosen}
      onRadioChange={onRadioChange}
      chartHeight={chartHeight}
    />
  );
};
