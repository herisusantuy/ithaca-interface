import React from 'react';
import { useAppStore } from '../lib/zustand/store';

const ReadyState: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isLoading } = useAppStore();
  return !isLoading ? children : null;
};

export default ReadyState;
