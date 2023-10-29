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
	componentCodes: Record<string, { tsx: string; scss: string | null }>;
};

const Components = ({ componentCodes }: ComponentProps) => {
	const initialActiveComponent = { groupIndex: 0, componentIndex: 0 };

	const [activeComponent, setActiveComponent] = useState<{ groupIndex: number; componentIndex: number } | null>(initialActiveComponent);
	const updatedComponentsList = COMPONENTS_LIST(componentCodes);

	const sidebarElements = updatedComponentsList.map((group, groupIndex) => (
		<div key={group.groupName}>
			<h3>{group.groupName}</h3>
			{group.components.map((comp, compIndex) => (
				<Button title='Click to view component' key={comp.name} onClick={() => setActiveComponent({ groupIndex, componentIndex: compIndex })} variant='tertiary'>
					{comp.name}
				</Button>
			))}
		</div>
	));

	const selectedComponentItem = activeComponent ? updatedComponentsList[activeComponent.groupIndex].components[activeComponent.componentIndex] : null;

	return (
		<>
			<Meta />
			<Main>
				<ComponentLayout sidebarContent={sidebarElements} selectedComponent={selectedComponentItem} />
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
