// store.ts

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AppDataSlice, createAppDataSlice } from './slices/app-data';
import { createSdkSlice, SdkSlice} from './slices/sdk-slice';

export const useAppStore = create<AppDataSlice>()((...a) => ({
    ...createAppDataSlice(...a)
}));

export const useSDKStore = create<SdkSlice>()(
  devtools(
    persist(createSdkSlice,
      { name: 'sdkStore' }
    )
  )
)