// Components
import Minus from '@/UI/components/Icons/Minus';
import Plus from '@/UI/components/Icons/Plus';

// Types
type SideType = '+' | '-';

/**
 * Display the corresponding icon based on the side value.
 * @param side - Side value either '+' or '-'
 * @returns - React component representing either Plus or Minus
 */

export const displaySideIcon = (side: SideType): JSX.Element => {
  if (side === '+') return <Plus />;
  return <Minus />;
};
