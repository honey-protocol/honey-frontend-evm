import { TimestampPoint } from '../components/HoneyChart/types';

export type LendTableRow = {
	key: string;
	name: string;
	icon: string;
	erc20Icon: string;
	interest: number;
	available: number;
	supplied: number;
	stats: Array<TimestampPoint>;
};
