// Packages
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import fs from 'fs';
import path from 'path';

// Constants
import { COMPONENTS_LIST, GET_COMPONENT_NAMES } from '@/UI/constants/components';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Button from '@/UI/components/Button/Button';
import ChevronUp from '@/UI/components/Icons/ChevronUp';
import ChevronDown from '@/UI/components/Icons/ChevronDown';

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
  const [activeGroups, setActiveGroups] = useState<number[]>([0]);

  const updatedComponentsList = COMPONENTS_LIST(componentCodes);

  // Framer animations
  const variants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  // Togle active group button
  const isActiveGroup = (groupIndex: number) => {
    return activeGroups.includes(groupIndex);
  };

  // Render chevron icon
  const renderIcon = (gIndex: number) => {
    return isActiveGroup(gIndex) ? <ChevronUp /> : <ChevronDown />;
  };

  // Toggle groups
  const toggleGroup = (groupIndex: number) => {
    setActiveGroups(prevGroups =>
      prevGroups.includes(groupIndex) ? prevGroups.filter(index => index !== groupIndex) : [...prevGroups, groupIndex]
    );
  };

  // Active component
  const isActiveComponent = (gIndex: number, cIndex: number) => {
    if (activeComponent) {
      return gIndex === activeComponent.groupIndex && cIndex === activeComponent.componentIndex ? 'isLinkActive' : '';
    }
    return '';
  };

  const sidebarElements = updatedComponentsList.map((group, groupIndex) => (
    <Fragment key={groupIndex}>
      <Button
        title='Click to expand component group'
        variant='dropdown'
        onClick={() => toggleGroup(groupIndex)}
        size='md'
        className={isActiveGroup(groupIndex) ? 'isDropdownActive' : ''}
      >
        {group.groupName} {renderIcon(groupIndex)}
      </Button>
      <AnimatePresence initial={false}>
        {activeGroups.includes(groupIndex) && (
          <motion.div
            key='content'
            initial='closed'
            animate='open'
            exit='closed'
            variants={variants}
            transition={{ duration: 0.3 }}
            className='flex-column'
          >
            {group.components.map((comp, compIndex) => (
              <Button
                title='Click to view component'
                key={comp.name}
                onClick={() => setActiveComponent({ groupIndex, componentIndex: compIndex })}
                variant='link'
                size='md'
                className={isActiveComponent(groupIndex, compIndex)}
              >
                {comp.name}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
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
