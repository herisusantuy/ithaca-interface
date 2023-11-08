// store.ts

import { create } from 'zustand';
import { createIthacaSDKSlice, IthacaSDKSlice } from './slices/ithacaSDKSlice';

type StoreState = IthacaSDKSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createIthacaSDKSlice(...a),
}));
