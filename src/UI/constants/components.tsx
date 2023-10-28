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

const COMPONENTS_BASE = [
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
	{
		name: 'Loader',
		component: <Loader />,
	},
	{
		name: 'Modal',
		component: (
			<Modal title='Modal' isOpen={false} isLoading={false} onCloseModal={() => {}} onSubmitOrder={() => {}}>
				Test
			</Modal>
		),
	},
	{
		name: 'Navigation',
		component: <Navigation />,
	},
];

export const COMPONENTS_LIST = (componentCodes: { [key: string]: { tsx: string; scss: string | null } }) => {
	return COMPONENTS_BASE.map(comp => ({
		...comp,
		code: componentCodes[comp.name]?.tsx,
		scssCode: componentCodes[comp.name]?.scss,
	}));
};
