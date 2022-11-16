/**
 * // useWindowDimension.ts
 * * This hook returns the viewport/window height and width
 */

import { useEffect, useState } from 'react';

type WindowDimensions = {
	width: number;
	height: number;
};

const useWindowSize = (): WindowDimensions => {
	const [WindowSize, setWindowSize] = useState<WindowDimensions>({
		width: 0,
		height: 0
	});
	useEffect(() => {
		function handleResize(): void {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		}

		handleResize();
		window.addEventListener('resize', handleResize);
		return (): void => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	return WindowSize;
};

export default useWindowSize;
