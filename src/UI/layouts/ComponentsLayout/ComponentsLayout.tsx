// Packages
import { useEffect } from 'react';
import Prism from 'prismjs';

// Styles
import styles from './ComponentsLayout.module.scss';

// Types
type ComponentItem = {
	name: string;
	component: JSX.Element;
	code: string;
	scssCode: string | null;
};

type ComponentLayoutProps = {
	sidebarContent: JSX.Element[];
	selectedComponent: ComponentItem | null;
};

const ComponentLayout = ({ sidebarContent, selectedComponent }: ComponentLayoutProps) => {
	useEffect(() => {
		Prism.highlightAll();
	}, [selectedComponent]);

	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>{sidebarContent}</div>
			<div className={styles.main}>
				{selectedComponent && (
					<>
						<div className={styles.component}>{selectedComponent.component}</div>
						<pre>
							<code className='language-javascript'>{selectedComponent.code}</code>
						</pre>
						{selectedComponent.scssCode && (
							<pre>
								<code className='language-css'>{selectedComponent.scssCode}</code>
							</pre>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ComponentLayout;
