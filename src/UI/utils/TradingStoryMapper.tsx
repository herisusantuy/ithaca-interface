import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin, TradingStoriesProps } from '@/UI/components/TradingStories';
import React from 'react';

const storyMap: { [key: string]: ({ showInstructions, compact }: TradingStoriesProps) => JSX.Element } = {
  betChart: Bet,
  earnChart: Earn,
  noGainNoPayinChart: NoGainNoPayin,
  bonusTwinWinChart: BonusTwinWin,
  barriersChart: Barriers,
};

export const getTradingStoryMapper = (contentId: string, showInstructions: boolean, compact = false) => {
  const Component = storyMap[contentId];
  if (storyMap[contentId]) {
    return <Component showInstructions={showInstructions} compact={compact} chartHeight={compact ? 60 : 170} />;
  }
  return null;
};
