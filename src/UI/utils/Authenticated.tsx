import React from 'react';
import { useAppStore } from '../lib/zustand/store';
import DisconnectedWallet from '../components/DisconnectedWallet/DisconnectedWallet';

const Authenticated: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? children : <DisconnectedWallet showButton />;
};

export default Authenticated;
