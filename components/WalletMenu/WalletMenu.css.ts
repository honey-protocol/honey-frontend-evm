import { globalStyle, style } from '@vanilla-extract/css';
import { typography, vars } from '../../styles/theme.css';

export const title = style({
	...typography.body,
	margin: '0px !important',
	fontSize: '16px !important'
});

export const metamaskIcon = style({
	width: 20,
	height: 20,
	background: 'url("/images/metamaskIcon.svg") center center no-repeat'
});

export const settingsIcon = style({
	cursor: 'pointer',
	width: 'unset',
	marginRight: 10
});

export const dropdownSelect = style({
	// background: 'red'
	width: 140,

	'@media': {
		'screen and (max-width: 768px)': {
			width: 38
		}
	}
});

globalStyle(`${dropdownSelect} .ant-select-selector`, {
	borderRadius: '10px !important',
	height: '40px !important',
	outline: 'none',
	fontFamily: 'Scandia',
	fontWeight: '500 !important',
	'@media': {
		'screen and (max-width: 768px)': {
			padding: '0 8px !important'
		}
	}
});

globalStyle(`${dropdownSelect} .ant-space-item `, {
	display: 'flex'
});

globalStyle(`${dropdownSelect} .ant-select-selector svg`, {
	width: 20,
	height: 20
});

globalStyle(`${dropdownSelect} .ant-select-selector svg path`, {
	fill: 'var(--colors-text)'
});

export const selectDropdownList = style({
	width: '150px !important'
});

globalStyle(`${selectDropdownList} svg`, {
	width: 20,
	height: 20
});

export const modalTitle = style([
	typography.title,
	{
		display: 'flex',
		justifyContent: 'center'
	}
]);
export const chainLabel = style({
	height: '100%',
	gap: 5
});

export const chainLabelName = style({
	'@media': {
		'screen and (max-width: 768px)': {
			display: 'none'
		}
	}
});

globalStyle(`${selectDropdownList} ${chainLabelName}`, {
	'@media': {
		'screen and (max-width: 768px)': {
			display: 'flex'
		}
	}
});

export const selectSuffixIcon = style({
	'@media': {
		'screen and (max-width: 768px)': {
			display: 'none'
		}
	}
});
