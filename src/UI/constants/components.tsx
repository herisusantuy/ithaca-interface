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
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';
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
import TableOrder from '@/UI/components/TableOrder/TableOrder';
import Dot from '@/UI/components/Dot/Dot';
import Typography from '@/UI/components/Typography/Typography';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import Slider from '@/UI/components/Slider/Slider';
import Dropdown from '../components/Icons/Dropdown';
import Wallet from '@/UI/components/Wallet/Wallet';
import Bell from '@/UI/components/Icons/Bell';
import Filter from '@/UI/components/Icons/Filter';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Color from '@/UI/components/Color/Color';
import Error from '@/UI/components/Icons/Error';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import ModalWithButton from '@/UI/components/Modal/ModalWithButton';
import Sort from '@/UI/components/Icons/Sort';
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';
import TableFundLock from '@/UI/components/TableFundLock/TableFundLock';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';
import CheckBox from '@/UI/components/CheckBox/CheckBox';
import Pagination from '@/UI/components/Pagination/Pagination';
import OrderSummary from '@/UI/components/OrderSummary/OrderSummary';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import Balance from '@/UI/components/Balance/Balance';

// Layouts
import Container from '@/UI/layouts/Container/Container';
import Flex from '@/UI/layouts/Flex/Flex';
import Header from '@/UI/layouts/Header/Header';
import Main from '@/UI/layouts/Main/Main';
import Panel from '@/UI/layouts/Panel/Panel';

// Constants
import { MODAL_TABS, TABS } from './tabs';
import { TRADING_MARKET_TABS } from './tabCard';
import { SOLID_COLORS, TRANSPARENT_COLORS } from './color';
import { DROPDOWN_OPTIONS } from './dropdown';
import { CHART_FAKE_DATA } from './charts';
import { TABLE_FUND_LOCK_DATA } from './tableFundLock';

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
        name: 'Balance',
        component: <Balance fundLock={0} balance={0} margin='mtb-20' />,
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
        name: 'CheckBox',
        component: <CheckBox label='Checkbox' onChange={() => {}} clearCheckMark={false} />,
        status: 'Done',
      },
      {
        name: 'CollateralAmount',
        component: <CollateralAmount wethAmount={10} usdcAmount={20} />,
        status: 'Done',
      },
      {
        name: 'CurrencyDisplay',
        component: <CurrencyDisplay amount={10} symbol={<LogoUsdc />} currency='USDC' />,
        status: 'Done',
      },
      {
        name: 'DisconnectedWallet',
        component: (
          <div style={{ position: 'relative', width: '100%', height: '250px' }}>
            <DisconnectedWallet />
          </div>
        ),
        status: 'Done',
      },
      {
        name: 'Dot',
        component: (
          <Flex direction='row-space-between'>
            <Dot type='leg1' />
            <Dot type='leg2' />
            <Dot type='leg3' />
            <Dot type='leg4' />
            <Dot type='leg5' />
            <Dot type='leg6' />
            <Dot type='leg7' />
            <Dot type='leg8' />
            <Dot type='leg9' />
            <Dot type='leg10' />
            <Dot type='leg11' />
            <Dot type='leg12' />
            <Dot type='leg13' />
            <Dot type='leg14' />
            <Dot type='leg15' />
          </Flex>
        ),
        status: 'Done',
      },
      {
        name: 'DropdownMenu',
        component: (
          <Flex direction='row-space-between'>
            <DropdownMenu label='Dropdown' options={DROPDOWN_OPTIONS} onChange={() => {}} />
            <DropdownMenu
              label='Dropdown Icon Start'
              options={DROPDOWN_OPTIONS}
              onChange={() => {}}
              iconStart={<LogoUsdc />}
            />
            <DropdownMenu
              label='Dropdown Icon End'
              options={DROPDOWN_OPTIONS}
              onChange={() => {}}
              iconEnd={<LogoUsdc />}
            />
          </Flex>
        ),
        status: 'Done',
      },
      {
        name: 'Input',
        component: (
          <>
            <Flex direction='row-space-between'>
              <Input id='in' label='Input number' type='number' />
              <Input id='ini' label='Input number with icon' type='number' icon={<LogoEth />} />
              <Input id='it' label='Input text' type='text' />
              <Input id='ite' label='Has error' type='text' hasError={true} errorMessage='Error' />
            </Flex>
          </>
        ),
        status: 'Done',
      },
      {
        name: 'LabelValue',
        component: (
          <Flex gap='gap-12'>
            <LabelValue label='Expiry Date' value='10Nov23' hasDropdown={true} />
            <LabelValue label='Next Auction' value={<CountdownTimer />} />
            <LabelValue label='Last Auction Price' value='1,807.28' subValue='10Oct23 13:23' />
          </Flex>
        ),
        status: 'Waiting on Figma',
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
        name: 'OrderSummary',
        component: (
          <OrderSummary limit='-' collatarelETH='-' collatarelUSDC='-' premium='-' fee={1.5} submitAuction={() => {}} />
        ),
        status: 'Done',
      },
      {
        name: 'Pagination',
        component: <Pagination totalItems={50} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />,
        status: 'Done',
      },
      {
        name: 'PriceLabel',
        component: <PriceLabel label='-' icon={<LogoEth />} />,
        status: 'Done',
      },
      {
        name: 'RadioButton',
        component: (
          <Panel>
            <Flex direction='row-center' gap='gap-12'>
              <RadioButton
                options={[
                  { option: 'Call', value: 'Call' },
                  { option: 'Put', value: 'Put' },
                ]}
                name='callOrPut'
                onChange={value => console.log(value)}
              />
              <RadioButton
                options={[
                  { option: <Plus key='plus' />, value: 'Plus' },
                  { option: <Minus key='minus' />, value: 'Minus' },
                ]}
                name='plusOrMinus'
                orientation='vertical'
                onChange={value => console.log(value)}
              />
              <RadioButton
                options={[
                  { option: 'Option', value: 'Option' },
                  { option: 'Digital Options', value: 'Digital Options' },
                  { option: 'Dated Forward', value: 'Dated Forward' },
                ]}
                name='multi'
                onChange={value => console.log(value)}
              />
            </Flex>
          </Panel>
        ),
        status: 'Done',
      },
      {
        name: 'Slider',
        component: (
          <>
            <Flex direction='row-center' margin='mb-32'>
              <Slider
                title='Range'
                value={{ min: 1500, max: 1800 }}
                min={1300}
                max={2000}
                onChange={() => {}}
                label={8}
                range={true}
                step={100}
              />
            </Flex>
            <Flex direction='row-center' margin='mb-32'>
              <Slider
                title='Continuous'
                value={{ min: 1500, max: 1900 }}
                min={1600}
                max={2300}
                onChange={() => {}}
                showLabel={true}
                label={8}
                range={false}
                step={100}
              />
            </Flex>
            <Flex direction='row-center'>
              <Slider title='default' min={1600} max={2300} label={8} step={100} />
            </Flex>
          </>
        ),
        status: 'In Progress',
      },
      {
        name: 'Tabs',
        component: <Tabs tabs={TABS} />,
        status: 'Done',
      },
      {
        name: 'TabCard',
        component: <TabCard tabs={TRADING_MARKET_TABS} />,
        status: 'Waiting on Figma',
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
        name: 'TableDescription',
        component: (
          <TableDescription
            possibleReleaseX={10}
            possibleReleaseY={20}
            postOptimisationX={8}
            postOptimisationY={18}
            totalCollateral={30}
          />
        ),
        status: 'Done',
      },
      {
        name: 'TableFundLock',
        component: <TableFundLock data={TABLE_FUND_LOCK_DATA} isDisconnected={false} />,
        status: 'Done',
      },
      {
        name: 'TableStrategy',
        component: (
          <>
            <h3 className='mb-14'>Strategy</h3>
            <TableStrategy strategies={[]} removeRow={() => {}} />
          </>
        ),
        status: 'Done',
      },
      {
        name: 'TableOrder',
        component: (
          <Panel margin='p-30'>
            <TableOrder isDisconnected={false} />
          </Panel>
        ),
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Charts',
    components: [
      {
        name: 'ChartPayoff',
        component: (
          <Panel margin='p-30'>
            <ChartPayoff chartData={CHART_FAKE_DATA} height={300} />
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
        component: <Header className='position-relative' />,
        status: 'Waiting on Figma',
      },
      {
        name: 'Main',
        component: <Main>Main</Main>,
        status: 'Done',
      },
      {
        name: 'Panel',
        component: <Panel margin='p-30'>Panel</Panel>,
        status: 'Done',
      },
    ],
  },
  {
    groupName: 'Utilities',
    components: [
      {
        name: 'Wallet',
        component: <Wallet />,
        status: 'Waiting on Figma',
      },
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
          <ModalWithButton title='Manage Funds' isLoading={false} onSubmitOrder={() => {}} btnText='Manage Funds'>
            <Tabs tabs={MODAL_TABS} />
          </ModalWithButton>
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
        status: 'Waiting on Figma',
      },
      {
        name: 'Navigation',
        component: <Navigation />,
        status: 'Waiting on Figma',
      },
      {
        name: 'SlidingNav',
        component: <SlidingNav isActive={false} onClick={() => {}} />,
        status: 'Waiting on Figma',
      },
    ],
  },
  {
    groupName: 'Icons',
    components: [
      {
        name: 'Bell',
        component: <Bell />,
        status: 'Done',
      },
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
        name: 'Dropdown',
        component: <Dropdown />,
        status: 'Done',
      },
      {
        name: 'Error',
        component: <Error />,
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
      {
        name: 'Filter',
        component: <Filter />,
        status: 'Done',
      },
      {
        name: 'Sort',
        component: <Sort />,
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
      {
        name: 'Color',
        component: (
          <>
            <h3 className='mb-14'>Solid Colors</h3>
            <Flex direction='row-space-between' margin='mb-32'>
              {SOLID_COLORS.map((color, index) => (
                <Color key={index} name={color.name} hex={color.hex} />
              ))}
            </Flex>
            <h3 className='mb-14'>Transparent Colors</h3>
            <Flex direction='row-space-between'>
              {TRANSPARENT_COLORS.map((color, index) => (
                <Color key={index} name={color.name} hex={color.hex} opacity={color.opacity} />
              ))}
            </Flex>
          </>
        ),
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
