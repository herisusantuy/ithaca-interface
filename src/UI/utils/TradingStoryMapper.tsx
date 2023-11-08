import { Barriers, Bet, BonusTwinWin, Earn, NoGainNoPayin } from '@/UI/components/TradingStories';
import React from 'react';

const storyMap: { [key: string]: JSX.Element } = {
  betChart: <Bet />,
  earnChart: <Earn />,
  noGainNoPayinChart: <NoGainNoPayin />,
  bonusTwinWinChart: <BonusTwinWin />,
  barriersChart: <Barriers />,
};

export const getTradingStoryMapper = (contentId: string, compact?: boolean) => {
  if (storyMap[contentId]) {
    return React.cloneElement(storyMap[contentId], { compact });
  }
  return null;
};
