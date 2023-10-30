// Packages
import { ReactNode } from 'react';

// Types
type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export const TABS: Tab[] = [
  {
    id: 'position-builder',
    label: 'Position Builder',
    content: <p>Content for Position Builder</p>,
  },
  {
    id: 'dynamic-option-strategies',
    label: 'Dynamic Option Strategies',
    content: <p>Content for Dynamic Option Strategies</p>,
  },
  {
    id: 'riskless-lending',
    label: 'Riskless Lending',
    content: <p>Content for Riskless Lending</p>,
  },
];
