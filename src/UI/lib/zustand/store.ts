// store.ts

import { create } from 'zustand';
import { createReadSdkSlice, ReadSdkSlice } from './slices/read-sdk';

type StoreState = ReadSdkSlice

export const useAppStore = create<StoreState>()((...a) => ({
    ...createReadSdkSlice(...a),
}));
