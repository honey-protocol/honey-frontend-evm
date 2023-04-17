import { ColumnType } from 'antd/lib/table';

export type MarketTableRow = {
	key: string;
	name: string;
	icon: string;
	erc20Icon: string;
	rate: number;
	available: number;
	supplied: number;
	formatDecimals: number;
};

export type MarketTablePosition = {
	name: string;
	tokenId: string;
	couponId: string;
	image: string;
	healthLvl: number;
	debt: string;
	allowance: string;
	value: number;
};

export interface HoneyTableColumnType<RecordType> extends ColumnType<RecordType> {
	hidden?: boolean;
}
