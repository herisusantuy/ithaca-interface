// Types
type NavigationProps = {
	path: string;
	titleKey: string;
	displayText: string;
};

export const NAVIGATION_ITEMS: NavigationProps[] = [
	{
		path: '/',
		titleKey: 'Click to visit trading',
		displayText: 'Trading',
	},
	{
		path: '/analytics',
		titleKey: 'Click to visit analytics',
		displayText: 'Analytics',
	},
	{
		path: '/components',
		titleKey: 'Click to visit components',
		displayText: 'Components',
	},
];
