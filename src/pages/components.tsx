// Packages
import dynamic from 'next/dynamic';
import { useState } from 'react';
import fs from 'fs';
import path from 'path';

// Constants
import { COMPONENTS_LIST, GET_COMPONENT_NAMES } from '@/UI/constants/components';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Button from '@/UI/components/Button/Button';

// Layout
import Main from '@/UI/layouts/Main/Main';

const ComponentLayout = dynamic(() => import('@/UI/layouts/ComponentsLayout/ComponentsLayout'), {
  ssr: false,
});

// Types
type ComponentProps = {
  componentCodes: ComponentCodes;
};

const Components = ({ componentCodes }: ComponentProps) => {
  const initialActiveComponent = { groupIndex: 0, componentIndex: 0 };

  const [activeComponent, setActiveComponent] = useState<{ groupIndex: number; componentIndex: number } | null>(
    initialActiveComponent
  );
  const updatedComponentsList = COMPONENTS_LIST(componentCodes);

  const sidebarElements = updatedComponentsList.map((group, groupIndex) => (
    <div key={group.groupName}>
      <h3>{group.groupName}</h3>
      {group.components.map((comp, compIndex) => (
        <Button
          title='Click to view component'
          key={comp.name}
          onClick={() => setActiveComponent({ groupIndex, componentIndex: compIndex })}
          variant='tertiary'
        >
          {comp.name}
        </Button>
      ))}
    </div>
  ));

  const selectedComponentItem = activeComponent
    ? updatedComponentsList[activeComponent.groupIndex].components[activeComponent.componentIndex]
    : null;

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
  lastUpdated: string;
};

type ComponentCodes = {
  [key: string]: ComponentCode;
};

export const getStaticProps = async () => {
  const components = GET_COMPONENT_NAMES();

  let componentCodes: ComponentCodes = {};

  const iconsDir = 'src/UI/components/Icons';
  const layoutsDir = 'src/UI/layouts';

  const getFilePaths = (dir: string, componentName: string) => {
    if (dir === iconsDir) {
      return {
        tsx: `${dir}/${componentName}.tsx`,
        scss: `${dir}/${componentName}.module.scss`,
      };
    }
    return {
      tsx: `${dir}/${componentName}/${componentName}.tsx`,
      scss: `${dir}/${componentName}/${componentName}.module.scss`,
    };
  };

  const iconFiles = fs.readdirSync(path.join(process.cwd(), iconsDir));
  const iconNames = iconFiles.map(file => path.basename(file, '.tsx'));

  for (const componentName of components) {
    let paths;

    if (iconNames.includes(componentName)) {
      paths = getFilePaths(iconsDir, componentName);
    } else if (fs.existsSync(path.join(process.cwd(), layoutsDir, componentName))) {
      paths = getFilePaths(layoutsDir, componentName);
    } else {
      paths = getFilePaths('src/UI/components', componentName);
    }

    const tsxStats = fs.statSync(path.join(process.cwd(), paths.tsx));
    const lastUpdated = tsxStats.mtime.toISOString();

    componentCodes[componentName] = {
      tsx: fs.readFileSync(path.join(process.cwd(), paths.tsx), 'utf-8'),
      scss: fs.existsSync(path.join(process.cwd(), paths.scss))
        ? fs.readFileSync(path.join(process.cwd(), paths.scss), 'utf-8')
        : null,
      lastUpdated,
    };
  }

  return {
    props: {
      componentCodes,
    },
  };
};
