// Packages
import dynamic from 'next/dynamic';

// Components
import Asset from '@/UI/components/Asset/Asset';
import Button from '@/UI/components/Button/Button';
import Close from '@/UI/components/Icons/Close';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import Hamburger from '@/UI/components/Hamburger/Hamburger';
import LabelValue from '@/UI/components/LabelValue/LabelValue';
import Loader from '@/UI/components/Loader/Loader';
import Logo from '@/UI/components/Logo/Logo';
import Meta from '@/UI/components/Meta/Meta';
import Navigation from '@/UI/components/Navigation/Navigation';
import SlidingNav from '@/UI/components/SlidingNav/SlidingNav';
import Tabs from '@/UI/components/Tabs/Tabs';
import Toggle from '@/UI/components/Toggle/Toggle';
import ChevronDown from '@/UI/components/Icons/ChevronDown';
import ChevronUp from '@/UI/components/Icons/ChevronUp';
import LogoEth from '@/UI/components/Icons/LogoEth';

// Layouts
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';
import Header from '@/UI/layouts/Header/Header';
import Main from '@/UI/layouts/Main/Main';

// Constants
import { TABS } from './tabs';

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false,
});

const COMPONENT_GROUPS = [
  {
    groupName: 'UI Elements',
    components: [
      {
        name: 'Asset',
        component: <Asset icon={<LogoEth />} label='ETH' />,
        status: 'Done',
      },
      {
        name: 'Button',
        component: (
          <Button title='Click to perform action' onClick={() => {}}>
            Button
          </Button>
        ),
        status: 'In Progress',
      },
      {
        name: 'LabelValue',
        component: <LabelValue />,
        status: 'In Progress',
      },
      {
        name: 'Loader',
        component: <Loader />,
        status: 'Done',
      },
      {
        name: 'Logo',
        component: <Logo />,
        status: 'Done',
      },
      {
        name: 'Tabs',
        component: <Tabs tabs={TABS} />,
        status: 'Done',
      },
      {
        name: 'Toggle',
        component: <Toggle leftLabel='Lite' rightLabel='Pro' />,
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Layouts',
    components: [
      {
        name: 'Container',
        component: <Container>Container</Container>,
        status: 'Done',
      },
      {
        name: 'Flex',
        component: <Flex>Flex</Flex>,
        status: 'Done',
      },
      {
        name: 'Header',
        component: <Header />,
        status: 'Done',
      },
      {
        name: 'Main',
        component: <Main>Main</Main>,
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Utilities',
    components: [
      {
        name: 'CountdownTimer',
        component: <CountdownTimer />,
        status: 'In Progress',
      },
      {
        name: 'Meta',
        component: <Meta />,
        status: 'Done',
      },
      {
        name: 'Modal',
        component: (
          <Modal title='Modal' isOpen={false} isLoading={false} onCloseModal={() => {}} onSubmitOrder={() => {}}>
            Test
          </Modal>
        ),
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Navigation',
    components: [
      {
        name: 'Hamburger',
        component: <Hamburger onClick={() => {}} isActive={false} className='display-inline-flex' />,
        status: 'Done',
      },
      {
        name: 'Navigation',
        component: <Navigation />,
        status: 'Done',
      },
      {
        name: 'SlidingNav',
        component: <SlidingNav isActive={false} onClick={() => {}} />,
        status: 'In Progress',
      },
    ],
  },
  {
    groupName: 'Icons',
    components: [
      {
        name: 'Close',
        component: <Close />,
        status: 'Done',
      },
      {
        name: 'ChevronDown',
        component: <ChevronDown />,
        status: 'Done',
      },
      {
        name: 'ChevronUp',
        component: <ChevronUp />,
        status: 'Done',
      },
      {
        name: 'LogoEth',
        component: <LogoEth />,
        status: 'Done',
      },
    ],
  },
];

export const GET_COMPONENT_NAMES = (): string[] => {
  let componentNames: string[] = [];
  COMPONENT_GROUPS.forEach(group => {
    group.components.forEach(comp => {
      componentNames.push(comp.name);
    });
  });
  return componentNames;
};

export const COMPONENTS_LIST = (componentCodes: {
  [key: string]: { tsx: string; scss: string | null; lastUpdated: string };
}) => {
  return COMPONENT_GROUPS.map(group => ({
    groupName: group.groupName,
    components: group.components.map(comp => ({
      ...comp,
      code: componentCodes[comp.name].tsx,
      scssCode: componentCodes[comp.name].scss,
      tsxFileName: `${comp.name}.tsx`,
      scssFileName: componentCodes[comp.name].scss ? `${comp.name}.module.scss` : null,
      status: comp.status || 'Not Started',
      lastUpdated: componentCodes[comp.name].lastUpdated,
    })),
  }));
};
