import { TimestampPoint } from '../components/HoneyChart/types';

export type LendTableRow = {
	key: string;
	name: string;
	icon: string;
	erc20Icon: string;
	interest: number;
	available: number;
	value: number;
	stats: Array<TimestampPoint>;
};
