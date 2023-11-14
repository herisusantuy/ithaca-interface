// Packages
import { ReactNode } from 'react';

// Components
import Avatar from '@/UI/components/Icons/Avatar';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import styles from './Card.module.scss';

// Types
type CardProps = {
  title: string;
  address: string;
  label: string;
  value: number;
  icon?: ReactNode;
  currency?: string;
};

const Card = ({ title, address, label, value, icon, currency }: CardProps) => {
  return (
    <div className={styles.container}>
      <p>{title}</p>
      <div className={styles.address}>
        <Avatar />
        <p>{address}</p>
      </div>
      <div className={styles.data}>
        <p>{label}</p>
        <Flex>
          <span>{value}</span>
          {icon && icon}
          {currency && currency}
        </Flex>
      </div>
    </div>
  );
};

export default Card;
