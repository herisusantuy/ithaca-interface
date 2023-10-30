// Packages
import dynamic from 'next/dynamic';

// Components
import Button from '@/UI/components/Button/Button';
import Hamburger from '@/UI/components/Hamburger/Hamburger';
import Loader from '@/UI/components/Loader/Loader';
import Navigation from '@/UI/components/Navigation/Navigation';

const Modal = dynamic(() => import('@/UI/components/Modal/Modal'), {
  ssr: false,
});

const COMPONENT_GROUPS = [
  {
    groupName: 'Controls',
    components: [
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
        name: 'Hamburger',
        component: <Hamburger onClick={() => {}} isActive={false} className='display-inline-flex' />,
        status: 'In Progress',
      },
    ],
  },
  {
    groupName: 'Loaders',
    components: [
      {
        name: 'Loader',
        component: <Loader />,
        status: 'In Progress',
      },
    ],
  },
  {
    groupName: 'Modals',
    components: [
      {
        name: 'Modal',
        component: (
          <Modal title='Modal' isOpen={false} isLoading={false} onCloseModal={() => {}} onSubmitOrder={() => {}}>
            Test
          </Modal>
        ),
        status: 'In Progress',
      },
    ],
  },
  {
    groupName: 'Navigation',
    components: [
      {
        name: 'Navigation',
        component: <Navigation />,
        status: 'In Progress',
      },
    ],
  },
];

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
