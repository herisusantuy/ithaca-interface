// Packages
import { useEffect } from 'react';

// Types
type onCloseCallback = () => void;

export const useEscKey = (callback: onCloseCallback) => {
	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			callback();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleEscKey);
		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [callback]);
};
