import React from 'react';
import {OptionsChart, DigitalOptionsChart, ForwardChart} from '@/UI/components/Market'

const marketMap: { [key: string]: JSX.Element } = {
  optionsChart: <OptionsChart />,
  digitalOptionsChart: <DigitalOptionsChart />,
  forwardsChart: <ForwardChart />,
};

export const getMarketMap = (contentId: string, compact?: boolean) => {
  if (marketMap[contentId]) {
    return React.cloneElement(marketMap[contentId], { compact });
  }
  return null;
};
