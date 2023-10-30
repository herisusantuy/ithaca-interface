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
      },
      {
        name: 'Hamburger',
        component: <Hamburger onClick={() => {}} isActive={false} className='display-inline-flex' />,
      },
    ],
  },
  {
    groupName: 'Loaders',
    components: [
      {
        name: 'Loader',
        component: <Loader />,
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
      },
    ],
  },
  {
    groupName: 'Navigation',
    components: [
      {
        name: 'Navigation',
        component: <Navigation />,
      },
    ],
  },
];

export const COMPONENTS_LIST = (componentCodes: { [key: string]: { tsx: string; scss: string | null } }) => {
  return COMPONENT_GROUPS.map(group => ({
    groupName: group.groupName,
    components: group.components.map(comp => ({
      ...comp,
      code: componentCodes[comp.name].tsx,
      scssCode: componentCodes[comp.name].scss,
      tsxFileName: `${comp.name}.tsx`,
      scssFileName: componentCodes[comp.name].scss ? `${comp.name}.module.scss` : null,
    })),
  }));
};
