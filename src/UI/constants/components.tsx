// Packages
import dynamic from 'next/dynamic';

// Components
import Asset from '@/UI/components/Asset/Asset';
import Button from '@/UI/components/Button/Button';
import Close from '@/UI/components/Icons/Close';
import CountdownTimer from '@/UI/components/CountdownTimer/CountdownTimer';
import ChartPayoff from '@/UI/components/ChartPayoff/ChartPayoff';
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
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Plus from '@/UI/components/Icons/Plus';
import Minus from '@/UI/components/Icons/Minus';
import Bookmark from '@/UI/components/Icons/Bookmark';
import TabCard from '@/UI/components/TabCard/TabCard';
import Input from '@/UI/components/Input/Input';
import TableStrategy from '@/UI/components/TableStrategy/TableStrategy';
import Dot from '@/UI/components/Dot/Dot';
import Typography from '@/UI/components/Typography/Typography';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import Dropdown from '@/UI/components/Icons/Dropdown';

// Layouts
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';
import Header from '@/UI/layouts/Header/Header';
import Main from '@/UI/layouts/Main/Main';
import Panel from '@/UI/layouts/Panel/Panel';

// Constants
import { TABS } from './tabs';
import { TRADING_MARKET_TABS } from './tabCard';
import { DUMMY_STRATEGY_DATA } from './tables';

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
          <>
            {/** Primary */}
            <h3 className='mb-16'>Primary</h3>
            <Flex direction='row-space-around' margin='mb-32'>
              <Button title='Click to perform action' onClick={() => {}} size='sm'>
                Primary Small
              </Button>
              <Button title='Click to perform action' onClick={() => {}} size='sm' disabled>
                Primary Small Disabled
              </Button>
              <Button title='Click to perform action' onClick={() => {}}>
                Primary Large
              </Button>
              <Button title='Click to perform action' disabled onClick={() => {}}>
                Primary Large Disabled
              </Button>
            </Flex>

            {/** Primary icon */}
            <Flex direction='row-space-around' margin='mb-32'>
              <Button title='Click to perform action' onClick={() => {}} size='sm'>
                Primary Small
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' onClick={() => {}} size='sm' disabled>
                Primary Small Disabled
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' onClick={() => {}}>
                Primary Large
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' disabled onClick={() => {}}>
                Primary Large Disabled
                <ChevronDown />
              </Button>
            </Flex>

            {/** Secondary */}
            <h3 className='mb-16'>Secondary</h3>
            <Flex direction='row-space-around' margin='mb-32'>
              <Button title='Click to perform action' variant='secondary' size='sm' onClick={() => {}}>
                Secondary Small
              </Button>
              <Button title='Click to perform action' variant='secondary' size='sm' disabled onClick={() => {}}>
                Secondary Small Disabled
              </Button>
              <Button title='Click to perform action' variant='secondary' size='lg' onClick={() => {}}>
                Secondary Large
              </Button>
              <Button title='Click to perform action' variant='secondary' size='lg' disabled onClick={() => {}}>
                Secondary Large Disabled
              </Button>
            </Flex>

            {/** Secondary icon */}
            <Flex direction='row-space-around' margin='mb-32'>
              <Button title='Click to perform action' variant='secondary' size='sm' onClick={() => {}}>
                <Plus />
                Secondary Small
              </Button>
              <Button title='Click to perform action' variant='secondary' size='sm' disabled onClick={() => {}}>
                <Plus />
                Secondary Small Disabled
              </Button>
              <Button title='Click to perform action' variant='secondary' size='lg' onClick={() => {}}>
                <Plus />
                Secondary Large
              </Button>
              <Button title='Click to perform action' variant='secondary' size='lg' disabled onClick={() => {}}>
                <Plus />
                Secondary Large Disabled
              </Button>
            </Flex>

            {/** Outline */}
            <h3 className='mb-16'>Outline</h3>
            <Flex direction='row-space-around' margin='mb-32'>
              <Button title='Click to perform action' variant='outline' size='sm' onClick={() => {}}>
                Outline Small
              </Button>
              <Button title='Click to perform action' variant='outline' size='sm' disabled onClick={() => {}}>
                Outline Small Disabled
              </Button>
              <Button title='Click to perform action' variant='outline' size='lg' onClick={() => {}}>
                Outline Large
              </Button>
              <Button title='Click to perform action' variant='outline' size='lg' disabled onClick={() => {}}>
                Outline Large Disabled
              </Button>
            </Flex>

            {/** Outline icon */}
            <Flex direction='row-space-around'>
              <Button title='Click to perform action' variant='outline' onClick={() => {}} size='sm'>
                Outline Small
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' variant='outline' onClick={() => {}} size='sm' disabled>
                Outline Small Disabled
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' variant='outline' onClick={() => {}}>
                Outline Large
                <ChevronDown />
              </Button>
              <Button title='Click to perform action' variant='outline' disabled onClick={() => {}}>
                Outline Large Disabled
                <ChevronDown />
              </Button>
            </Flex>
          </>
        ),
        status: 'Done',
      },
      {
        name: 'Dot',
        component: <Dot type='Call' />,
        status: 'Done',
      },
      {
        name: 'Input',
        component: (
          <>
            <Flex direction='row-space-around'>
              <Input id='in' label='Input number' type='number' />
              <Input id='ini' label='Input number with icon' type='number' icon={<LogoEth />} />
              <Input id='it' label='Input text' type='text' />
              <Input id='iti' label='Input text with icon' type='text' icon={<Dropdown />} />
            </Flex>
          </>
        ),
        status: 'Done',
      },
      {
        name: 'LabelValue',
        component: (
          <Flex gap='gap-12'>
            <LabelValue label='Expiry Date' value='8Oct23' hasDropdown={true} />
            <LabelValue label='Next Auction' value={<CountdownTimer />} />
            <LabelValue label='Last Auction Price' value='1,807.28' subValue='10Oct23 13:23' />
          </Flex>
        ),
        status: 'Done',
      },
      {
        name: 'Loader',
        component: <Loader />,
        status: 'Waiting on Figma',
      },
      {
        name: 'Logo',
        component: <Logo />,
        status: 'Done',
      },
      {
        name: 'RadioButton',
        component: (
          <Flex gap='gap-12'>
            <RadioButton
              options={['Call', 'Put']}
              name='callOrPut'
              defaultOption='Call'
              onChange={value => console.log(value)}
            />
            <RadioButton
              options={[<Plus key='plus' />, <Minus key='minus' />]}
              valueProps={['Plus', 'Minus']}
              name='plusOrMinus'
              defaultOption='Plus'
              orientation='vertical'
              onChange={value => console.log(value)}
            />
          </Flex>
        ),
        status: 'Waiting on Figma',
      },
      {
        name: 'Tabs',
        component: <Tabs tabs={TABS} />,
        status: 'Waiting on Figma',
      },
      {
        name: 'TabCard',
        component: <TabCard tabs={TRADING_MARKET_TABS} />,
        status: 'In Progress',
      },
      {
        name: 'Toggle',
        component: <Toggle leftLabel='Lite' rightLabel='Pro' />,
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Tables',
    components: [
      {
        name: 'TableStrategy',
        component: (
          <Panel>
            <h3 className='mb-14'>Strategy</h3>
            <TableStrategy data={DUMMY_STRATEGY_DATA} />
          </Panel>
        ),
        status: 'Waiting on Figma',
      },
    ],
  },
  {
    groupName: 'Charts',
    components: [
      {
        name: 'ChartPayoff',
        component: (
          <Panel>
            <ChartPayoff />
          </Panel>
        ),
        status: 'In Progress',
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
      {
        name: 'Panel',
        component: <Panel>Panel</Panel>,
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
        status: 'Done',
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
        status: 'Waiting on Figma',
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
        name: 'Bookmark',
        component: <Bookmark />,
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
        name: 'Close',
        component: <Close />,
        status: 'Done',
      },
      {
        name: 'LogoUsdc',
        component: <LogoUsdc />,
        status: 'Done',
      },
      {
        name: 'LogoEth',
        component: <LogoEth />,
        status: 'Done',
      },
      {
        name: 'Minus',
        component: <Minus />,
        status: 'Done',
      },
      {
        name: 'Plus',
        component: <Plus />,
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Variables',
    components: [
      {
        name: 'Typography',
        component: <Typography />,
        status: 'Done',
      },
    ],
  },
];

export const GET_COMPONENT_NAMES = (): string[] => {
  const componentNames: string[] = [];
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
