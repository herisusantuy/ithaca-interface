// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Flex.module.scss';

// Utils
import { useLastUrlSegment } from '@/UI/hooks/useLastUrlSegment';

// Types
type FlexProps = {
  direction?: string;
  margin?: string;
  gap?: string;
  padding?: string;
  children: ReactNode;
};

const Flex = ({ direction = 'row', margin = 'm-0', gap = 'gap-0', padding = 'p-0', children }: FlexProps) => {

  const lastSegment = useLastUrlSegment()

  return <div className={`${`flex--${lastSegment}`} ${styles.flex} ${styles[`flex--${direction}`]} ${margin} ${gap} ${padding}`}>{children}</div>
};

export default Flex;
