// Packages
import { useState } from 'react';
import fs from 'fs';
import path from 'path';

// Constants
import { COMPONENTS_LIST } from '@/UI/constants/components';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Button from '@/UI/components/Button/Button';

// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import ComponentLayout from '@/UI/layouts/ComponentsLayout/ComponentsLayout';

// Types
type ComponentProps = {
	componentCodes: {
		[key: string]: {
			tsx: string;
			scss: string | null;
		};
	};
};

const Components = ({ componentCodes }: ComponentProps) => {
	const [activeComponent, setActiveComponent] = useState<number>(0);

	const updatedComponentsList = COMPONENTS_LIST(componentCodes);

	// Sidebar items
	const sidebarElements = updatedComponentsList.map((comp, index) => (
		<Button title='Click to view component' key={index} onClick={() => setActiveComponent(index)} variant='tertiary'>
			{comp.name}
		</Button>
	));

	const selectedComponentItem = activeComponent !== null ? updatedComponentsList[activeComponent] : null;

	return (
		<>
			<Meta />
			<Main>
				<Container>
					<ComponentLayout sidebarContent={sidebarElements} selectedComponent={selectedComponentItem} />
				</Container>
			</Main>
		</>
	);
};

export default Components;

export const getStaticProps = async () => {
	const componentPaths = {
		Button: {
			tsx: 'src/UI/components/Button/Button.tsx',
			scss: 'src/UI/components/Button/Button.module.scss',
		},
		Hamburger: {
			tsx: 'src/UI/components/Hamburger/Hamburger.tsx',
			scss: 'src/UI/components/Hamburger/Hamburger.module.scss',
		},
		Loader: {
			tsx: 'src/UI/components/Loader/Loader.tsx',
			scss: 'src/UI/components/Loader/Loader.module.scss',
		},
		Modal: {
			tsx: 'src/UI/components/Modal/Modal.tsx',
			scss: 'src/UI/components/Modal/Modal.module.scss',
		},
		Navigation: {
			tsx: 'src/UI/components/Navigation/Navigation.tsx',
			scss: 'src/UI/components/Navigation/Navigation.module.scss',
		},
	};

	let componentCodes: {
		[key: string]: {
			tsx: string;
			scss: string | null;
		};
	} = {};

	for (const [componentName, { tsx, scss }] of Object.entries(componentPaths)) {
		componentCodes[componentName] = {
			tsx: fs.readFileSync(path.join(process.cwd(), tsx), 'utf-8'),
			scss: fs.existsSync(path.join(process.cwd(), scss)) ? fs.readFileSync(path.join(process.cwd(), scss), 'utf-8') : null,
		};
	}

	return {
		props: {
			componentCodes,
		},
	};
};
