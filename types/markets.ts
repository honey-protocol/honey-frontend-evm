import { ColumnType } from 'antd/lib/table';

export type MarketTableRow = {
	key: string;
	name: string;
	icon: string;
	erc20Icon: string;
	rate: number;
	debt: number;
	allowance: number;
	available: number;
	value: number;
};

export type MarketTablePosition = {
	name: string;
	tokenId: string;
	couponId: string;
	image: string;
	healthLvl?: number;
	debt?: number;
	available?: number;
	value?: number;
  positions?: {
    name: string;
	  couponId: string;
	  id: string;
	  image: string;
  }
};

export interface HoneyTableColumnType<RecordType> extends ColumnType<RecordType> {
	hidden?: boolean;
}
