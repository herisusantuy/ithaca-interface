// Packages
import { ReactNode } from 'react';

// Styles
import styles from './Container.module.scss';

// Types
type ContainerProps = {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	margin?: string;
	children: ReactNode;
};

const Container = ({ margin, size = 'xl', children }: ContainerProps) => {
	return <div className={`${styles.container} ${styles[size]} ${margin ? margin : ''}`}>{children}</div>;
};

export default Container;
