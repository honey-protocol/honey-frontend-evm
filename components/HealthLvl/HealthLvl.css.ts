import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { breakpoints, typography, vars } from '../../styles/theme.css';

export const health = styleVariants({
	safe: {
		color: vars.colors.green
	},
	warning: {
		color: vars.colors.brownLight
	},
	danger: {
		color: vars.colors.red
	}
});

export const healthText = style([typography.caption]);

export const valueCell = style([typography.numbersRegular, {}]);
export const d = style({ background: 'red' });

globalStyle(`${healthText}, ${valueCell}`, {
	fontSize: 12,
	lineHeight: '14px',
	'@media': {
		[`screen and (min-width: ${breakpoints.tablet}px)`]: {
			fontSize: 16
		}
	}
});
