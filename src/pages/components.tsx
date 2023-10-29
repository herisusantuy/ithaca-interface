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

type ComponentCode = {
	tsx: string;
	scss: string | null;
};

type ComponentCodes = {
	[key: string]: ComponentCode;
};

export const getStaticProps = async () => {
	const components = ['Button', 'Hamburger', 'Loader', 'Modal', 'Navigation'];

	let componentCodes: ComponentCodes = {};

	for (const componentName of components) {
		const tsxPath = `src/UI/components/${componentName}/${componentName}.tsx`;
		const scssPath = `src/UI/components/${componentName}/${componentName}.module.scss`;

		componentCodes[componentName] = {
			tsx: fs.readFileSync(path.join(process.cwd(), tsxPath), 'utf-8'),
			scss: fs.existsSync(path.join(process.cwd(), scssPath)) ? fs.readFileSync(path.join(process.cwd(), scssPath), 'utf-8') : null,
		};
	}

	return {
		props: {
			componentCodes,
		},
	};
};
